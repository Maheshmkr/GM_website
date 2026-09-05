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

function parseDuration(value: string) {
  const [m, s] = value.split(":").map(Number);
  return (m || 0) * 60 + (s || 0);
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
          startSeconds: s.startSeconds,
          endTime: s.endTime,
          endSeconds: s.endSeconds,
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
    setProgress(0);
  }, [current]);

  const next = useCallback(() => {
    setIndex((i) =>
      shuffle ? Math.floor(Math.random() * playlist.length) : (i + 1) % playlist.length,
    );
    setProgress(0);
  }, [shuffle, playlist]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + playlist.length) % playlist.length);
    setProgress(0);
  }, [playlist]);

  /* Ticker: drives the progress bar. Uses the real audio element when the
     file exists, otherwise keeps time so the player still feels alive. */
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const el = audioRef.current;
      if (el && !el.error && el.readyState > 0 && el.duration) {
        setProgress(el.currentTime);
        setDuration(el.duration);
        return;
      }
      setProgress((p) => {
        if (p + 0.5 >= duration) {
          if (repeat) return 0;
          next();
          return 0;
        }
        return p + 0.5;
      });
    }, 500);
    return () => window.clearInterval(id);
  }, [playing, duration, repeat, next]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) void el.play().catch(() => undefined);
    else el.pause();
  }, [playing, index]);

  const play = useCallback((i?: number) => {
    if (typeof i === "number") {
      setIndex(i);
      setProgress(0);
    }
    setHasStarted(true);
    setPlaying(true);
  }, []);

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
        setPlaying((p) => !p);
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
        src={current.audio}
        preload="none"
        onEnded={() => (repeat ? play(index) : next())}
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
