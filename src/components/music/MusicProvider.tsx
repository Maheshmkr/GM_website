/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { songs as staticSongs, type Song } from "@/data/site";
import { readJsonResponse } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type MusicState = {
  songs: Song[];
  index: number;
  current: Song;
  playing: boolean;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeat: boolean;
  favorites: Record<string, boolean>;
  hasStarted: boolean;
  play: (index?: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFavorite: (title: string) => void;
};

const MusicContext = createContext<MusicState | null>(null);

export function parseDuration(value?: string | number | null): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return value;
  const clean = value.trim();
  const parts = clean.split(":").map(Number);
  if (parts.length === 3) {
    return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  }
  if (parts.length === 2) {
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  }
  return Number(clean) || 0;
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    Perfect: true,
  });

  const { data: serverSongs = [] } = useQuery({
    queryKey: ["songs"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/media?type=song");
        const payload = await readJsonResponse(res);
        if (!payload.ok) return [];
        return Array.isArray(payload.data) ? payload.data : [];
      } catch (err) {
        console.error("Error fetching songs:", err);
        return [];
      }
    },
  });

  const playlist = useMemo<Song[]>(() => {
    if (serverSongs.length > 0) {
      return serverSongs.map((s: any) => {
        const displayDate = s.memoryDate || s.createdAt || new Date().toISOString();
        let audioUrl = s.url || "";
        if (s.source === "upload" && s.fileId) {
          audioUrl = `/api/media/file/${s.fileId}`;
        } else if (s.source === "google-drive" && s.url) {
          const match = s.url.match(/(?:\/file\/d\/|[?&]id=)([a-zA-Z0-9_-]{20,})/i);
          if (match) {
            audioUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
          }
        }

        return {
          _id: s._id,
          title: s.title,
          artist: s.artist,
          audio: audioUrl,
          cover: s.coverFileId ? `/api/media/file/${s.coverFileId}` : staticSongs[0]!.cover,
          duration: s.duration || "3:00",
          note: s.description || "",
          source: s.source || (s.fileId ? "upload" : "url"),
          url: s.url,
          startTime: s.startTime,
          startSeconds: typeof s.startSeconds === "number" ? s.startSeconds : (s.startTime ? parseDuration(s.startTime) : 0),
          endTime: s.endTime,
          endSeconds: typeof s.endSeconds === "number" ? s.endSeconds : (s.endTime ? parseDuration(s.endTime) : undefined),
          rawDate: displayDate.split("T")[0],
          date: displayDate
            ? new Date(displayDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "",
        };
      });
    }
    return staticSongs;
  }, [serverSongs]);

  const current = useMemo(() => {
    return (
      playlist[index] ||
      playlist[0] || {
        title: "No Song",
        artist: "Unknown",
        audio: "",
        cover: "",
        duration: "0:00",
      }
    );
  }, [playlist, index]);

  const fallbackDuration = parseDuration(current.duration);
  const [duration, setDuration] = useState(fallbackDuration);

  useEffect(() => {
    setDuration(parseDuration(current.duration));
    const startSec =
      typeof current.startSeconds === "number" && current.startSeconds > 0
        ? current.startSeconds
        : current.startTime
          ? parseDuration(current.startTime)
          : 0;
    setProgress(startSec);
  }, [current]);

  const next = useCallback(() => {
    setIndex((i) => {
      const nextIdx = shuffle ? Math.floor(Math.random() * playlist.length) : (i + 1) % playlist.length;
      const targetSong = playlist[nextIdx];
      const startSec =
        targetSong?.startSeconds !== undefined && targetSong?.startSeconds > 0
          ? targetSong.startSeconds
          : targetSong?.startTime
            ? parseDuration(targetSong.startTime)
            : 0;
      setProgress(startSec);
      return nextIdx;
    });
  }, [shuffle, playlist]);

  const prev = useCallback(() => {
    setIndex((i) => {
      const prevIdx = (i - 1 + playlist.length) % playlist.length;
      const targetSong = playlist[prevIdx];
      const startSec =
        targetSong?.startSeconds !== undefined && targetSong?.startSeconds > 0
          ? targetSong.startSeconds
          : targetSong?.startTime
            ? parseDuration(targetSong.startTime)
            : 0;
      setProgress(startSec);
      return prevIdx;
    });
  }, [playlist]);

  /* Ticker: drives the progress bar. Uses the real audio element when the
     file exists, otherwise keeps time so the player still feels alive. */
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const el = audioRef.current;
      const startSec =
        typeof current.startSeconds === "number" && current.startSeconds > 0
          ? current.startSeconds
          : current.startTime
            ? parseDuration(current.startTime)
            : 0;
      const endSec =
        typeof current.endSeconds === "number" && current.endSeconds > 0
          ? current.endSeconds
          : current.endTime
            ? parseDuration(current.endTime)
            : undefined;

      if (el && !el.error && el.readyState > 0 && el.duration) {
        setProgress(el.currentTime);
        setDuration(el.duration);
        if (endSec && el.currentTime >= endSec) {
          if (repeat) {
            el.currentTime = startSec;
            setProgress(startSec);
          } else {
            next();
          }
        }
        return;
      }
      setProgress((p) => {
        const targetLimit = endSec || duration;
        if (p + 0.5 >= targetLimit) {
          if (repeat) return startSec;
          next();
          return 0;
        }
        return p + 0.5;
      });
    }, 500);
    return () => window.clearInterval(id);
  }, [playing, duration, repeat, next, current]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const startSec =
      typeof current.startSeconds === "number" && current.startSeconds > 0
        ? current.startSeconds
        : current.startTime
          ? parseDuration(current.startTime)
          : 0;
    if (playing) {
      if (startSec > 0 && el.currentTime < startSec) {
        try {
          el.currentTime = startSec;
        } catch (_) {}
      }
      void el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  }, [playing, index, current]);

  const play = useCallback(
    (i?: number) => {
      if (typeof i === "number") {
        setIndex(i);
        const targetSong = playlist[i];
        const startSec =
          targetSong?.startSeconds !== undefined && targetSong?.startSeconds > 0
            ? targetSong.startSeconds
            : targetSong?.startTime
              ? parseDuration(targetSong.startTime)
              : 0;
        setProgress(startSec);
        const el = audioRef.current;
        if (el && !el.error) {
          try {
            el.currentTime = startSec;
          } catch (_) {}
        }
      }
      setHasStarted(true);
      setPlaying(true);
    },
    [playlist],
  );

  const value = useMemo<MusicState>(
    () => ({
      songs: playlist,
      index,
      current,
      playing,
      progress,
      duration,
      shuffle,
      repeat,
      favorites,
      hasStarted,
      play,
      toggle: () => {
        setHasStarted(true);
        setPlaying((p) => {
          const nextPlaying = !p;
          if (nextPlaying) {
            const el = audioRef.current;
            const startSec =
              typeof current.startSeconds === "number" && current.startSeconds > 0
                ? current.startSeconds
                : current.startTime
                  ? parseDuration(current.startTime)
                  : 0;
            if (el && el.ended) {
              try {
                el.currentTime = startSec;
                setProgress(startSec);
              } catch (_) {}
            }
          }
          return nextPlaying;
        });
      },
      next,
      prev,
      seek: (seconds: number) => {
        setProgress(seconds);
        const el = audioRef.current;
        if (el && !el.error && el.readyState > 0) el.currentTime = seconds;
      },
      toggleShuffle: () => setShuffle((s) => !s),
      toggleRepeat: () => setRepeat((r) => !r),
      toggleFavorite: (title: string) => setFavorites((f) => ({ ...f, [title]: !f[title] })),
    }),
    [
      playlist,
      index,
      current,
      playing,
      progress,
      duration,
      shuffle,
      repeat,
      favorites,
      hasStarted,
      play,
      next,
      prev,
    ],
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      {/* No autoplay: only starts on an explicit user action. */}
      <audio
        ref={audioRef}
        src={current.audio && current.audio !== "/songs/perfect.mp3" ? current.audio : (playing && current.audio ? current.audio : undefined)}
        preload="none"
        onError={() => {
          // Gracefully suppress audio element 404 for placeholder/missing mock files
        }}
        onLoadedMetadata={() => {
          const el = audioRef.current;
          if (!el) return;
          const startSec =
            typeof current.startSeconds === "number" && current.startSeconds > 0
              ? current.startSeconds
              : current.startTime
                ? parseDuration(current.startTime)
                : 0;
          if (startSec > 0 && el.currentTime < startSec) {
            try {
              el.currentTime = startSec;
            } catch (_) {}
          }
        }}
        onTimeUpdate={() => {
          const el = audioRef.current;
          if (el && !el.error) {
            setProgress(el.currentTime);
            const endSec =
              typeof current.endSeconds === "number" && current.endSeconds > 0
                ? current.endSeconds
                : current.endTime
                  ? parseDuration(current.endTime)
                  : undefined;
            if (endSec && el.currentTime >= endSec) {
              if (repeat) {
                const startSec =
                  typeof current.startSeconds === "number" && current.startSeconds > 0
                    ? current.startSeconds
                    : current.startTime
                      ? parseDuration(current.startTime)
                      : 0;
                try {
                  el.currentTime = startSec;
                } catch (_) {}
                setProgress(startSec);
              } else {
                next();
              }
            }
          }
        }}
        onEnded={() => {
          if (repeat) {
            const startSec =
              typeof current.startSeconds === "number" && current.startSeconds > 0
                ? current.startSeconds
                : current.startTime
                  ? parseDuration(current.startTime)
                  : 0;
            if (audioRef.current) {
              try {
                audioRef.current.currentTime = startSec;
              } catch (_) {}
            }
            setProgress(startSec);
            play(index);
          } else {
            next();
          }
        }}
      />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
  return ctx;
}

export function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
