/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Heart,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Trash2,
  X,
  Edit3,
  Save,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatTime, parseDuration, useMusic } from "./MusicProvider";
import { cn } from "@/lib/utils";

export function MusicPlayer() {
  const {
    songs,
    index,
    current,
    playing,
    progress,
    duration,
    shuffle,
    repeat,
    favorites,
    play,
    toggle,
    next,
    prev,
    seek,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
  } = useMusic();

  const queryClient = useQueryClient();

  // Inline Date Editor state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDateValue, setEditDateValue] = useState("");

  const handleDeleteSong = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const res = await fetch(`/api/media/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
        toast.success("Song deleted");
        queryClient.invalidateQueries({ queryKey: ["songs"] });
      } catch (err: any) {
        toast.error(`Delete failed: ${err.message}`);
      }
    }
  };

  const handleEditDate = (s: any) => {
    setEditingId(s._id);
    setEditDateValue(s.rawDate);
  };

  const handleSaveDate = async (id: string) => {
    try {
      const res = await fetch(`/api/media/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memoryDate: editDateValue }),
      });
      if (!res.ok) throw new Error("Failed to save date");
      toast.success("Song date updated");
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const isAudioUrl = (url: string) => {
    const cleanUrl = url.toLowerCase().split(/[?#]/)[0];
    return /\.(mp3|wav|ogg|m4a|webm|aac)$/.test(cleanUrl) || cleanUrl.startsWith("http");
  };

  return (
    <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1.05fr]">
      {/* Player Section */}
      <div className="glass rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="size-40 shrink-0 overflow-hidden rounded-2xl bg-black/20 shadow-[var(--shadow-glow)]">
            <img
              src={current.cover}
              alt={`${current.title} cover`}
              loading="lazy"
              className={cn(
                "size-full object-cover object-center transition-transform duration-700",
                playing && "scale-[1.02]",
              )}
            />
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h3 className="truncate text-xl font-semibold">{current.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{current.artist}</p>
            {current.date && (
              <p className="mt-1 text-xs text-muted-foreground/80 font-medium">📅 {current.date}</p>
            )}
            {current.note && <p className="mt-2 text-xs text-primary">{current.note}</p>}
            
            {/* Starts At info (for custom timestamped songs) */}
            {current.startTime && current.startTime !== "0:00" && (
              <p className="mt-1 text-xs text-primary/90 font-medium">
                🎵 Starts at {current.startTime}
                {current.endTime && ` • Ends at ${current.endTime}`}
              </p>
            )}

            {/* Source Badge */}
            {current.source && (
              <div className="mt-2">
                <span
                  className={cn(
                    "text-[10px] px-2.5 py-0.5 rounded-full font-medium border inline-block",
                    current.source === "spotify"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : current.source === "google-drive"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : "bg-secondary text-foreground/80 border-border/40",
                  )}
                >
                  {current.source === "spotify"
                    ? "Spotify"
                    : current.source === "google-drive"
                      ? "Google Drive"
                      : "Computer Upload"}
                </span>
              </div>
            )}

            <button
              onClick={() => toggleFavorite(current.title)}
              aria-label="Favorite song"
              className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary cursor-pointer"
            >
              <Heart
                className={cn("size-4", favorites[current.title] && "text-primary")}
                fill={favorites[current.title] ? "currentColor" : "none"}
              />
              Favorite
            </button>
          </div>
        </div>

        {/* Dynamic Player according to source */}
        {(() => {
          const isSpotify =
            current.source === "spotify" ||
            (current.url && current.url.includes("spotify.com"));
          const spotifyMatch = isSpotify
            ? (current.url || current.audio || "").match(
                /(?:open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/|spotify:track:)([a-zA-Z0-9]{22})/i,
              )
            : null;
          const spotifyTrackId = spotifyMatch ? spotifyMatch[1] : null;

          if (isSpotify) {
            const startSec =
              typeof current.startSeconds === "number" && current.startSeconds > 0
                ? current.startSeconds
                : current.startTime
                  ? parseDuration(current.startTime)
                  : 0;

            const timeParam = startSec > 0 ? `&time=${startSec}&t=${startSec}&start=${startSec}` : "";
            const embedSrc = spotifyTrackId
              ? `https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator&theme=0${timeParam}`
              : "";

            const spotifyOpenUrl = current.url
              ? (startSec > 0
                  ? `${current.url}${current.url.includes("?") ? "&" : "?"}t=${startSec}`
                  : current.url)
              : "#";

            return (
              <div className="mt-6 space-y-3">
                {spotifyTrackId && (
                  <div className="rounded-2xl overflow-hidden border border-emerald-500/30 bg-black/40 shadow-lg">
                    <iframe
                      key={`${spotifyTrackId}-${startSec}`}
                      src={embedSrc}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      title={current.title}
                      className="w-full rounded-2xl"
                    />
                  </div>
                )}

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5 text-muted-foreground">
                    <p className="font-medium text-emerald-400 flex items-center gap-1.5">
                      <span>♫ {current.title}</span>
                    </p>
                    <p className="text-[11px]">
                      Starts at: <span className="text-foreground font-semibold">{current.startTime || "0:00"}</span>
                      {current.endTime && (
                        <> • Ends at: <span className="text-foreground font-semibold">{current.endTime}</span></>
                      )}
                    </p>
                  </div>

                  {current.url && (
                    <a
                      href={spotifyOpenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-sm cursor-pointer shrink-0"
                    >
                      Open in Spotify <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          }

          const isDrive =
            current.source === "google-drive" ||
            (current.url && current.url.includes("drive.google.com"));
          const driveMatch = isDrive
            ? (current.url || current.audio || "").match(/(?:\/file\/d\/|[?&]id=)([a-zA-Z0-9_-]{20,})/i)
            : null;
          const driveFileId = driveMatch ? driveMatch[1] : null;

          return (
            <>
              <div className="mt-8">
                <input
                  type="range"
                  min={0}
                  max={Math.max(1, Math.floor(duration))}
                  value={Math.floor(progress)}
                  onChange={(e) => seek(Number(e.target.value))}
                  aria-label="Seek"
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[oklch(0.66_0.24_350)]"
                  style={{
                    backgroundImage: "var(--gradient-love)",
                    backgroundSize: `${duration ? (progress / duration) * 100 : 0}% 100%`,
                    backgroundRepeat: "no-repeat",
                  }}
                />
                <div className="mt-2 flex justify-between text-xs tabular-nums text-muted-foreground">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3 sm:gap-5">
                <IconButton onClick={toggleShuffle} active={shuffle} label="Shuffle">
                  <Shuffle className="size-4" />
                </IconButton>
                <IconButton onClick={prev} label="Previous song">
                  <SkipBack className="size-5" />
                </IconButton>
                <button
                  onClick={toggle}
                  aria-label={playing ? "Pause" : "Play"}
                  className={cn(
                    "btn-love grid size-14 place-items-center rounded-full cursor-pointer",
                    playing && "animate-glow-pulse",
                  )}
                >
                  {playing ? (
                    <Pause className="size-5" fill="currentColor" />
                  ) : (
                    <Play className="size-5" fill="currentColor" />
                  )}
                </button>
                <IconButton onClick={next} label="Next song">
                  <SkipForward className="size-5" />
                </IconButton>
                <IconButton onClick={toggleRepeat} active={repeat} label="Repeat">
                  <Repeat className="size-4" />
                </IconButton>
              </div>

              {isDrive && driveFileId && (
                <div className="mt-6 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center">
                  <p className="text-xs text-blue-300 mb-2 font-medium">
                    Google Drive Audio Stream
                  </p>
                  <iframe
                    src={`https://drive.google.com/file/d/${driveFileId}/preview`}
                    width="100%"
                    height="60"
                    className="rounded-xl border border-border/40"
                    title={current.title}
                  />
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* Playlist Section */}
      <div className="glass grid content-start gap-1 rounded-3xl p-3 sm:p-4">
        {/* Playlist Header */}
        <div className="flex justify-between items-center gap-2 mb-3 border-b border-border/20 pb-3">
          <span className="text-sm font-semibold text-muted-foreground pl-2">Playlist</span>
        </div>

        <ul className="grid gap-1">
          {songs.map((s, i) => (
            <li key={s.title + i}>
              <button
                onClick={() => play(i)}
                className={cn(
                  "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-secondary/70",
                  i === index && "bg-secondary",
                )}
              >
                <div className="size-11 shrink-0 overflow-hidden rounded-xl bg-black/20">
                  <img
                    src={s.cover}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover object-center"
                  />
                </div>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block truncate text-sm font-medium",
                      i === index && "text-primary",
                    )}
                  >
                    {s.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground flex items-center gap-2">
                    <span>{s.artist}</span>
                    {s.startTime && s.startTime !== "0:00" && (
                      <span className="text-[9px] text-primary/90 font-medium">
                        starts {s.startTime}
                      </span>
                    )}
                    {s.source && (
                      <span
                        className={cn(
                          "text-[9px] px-1.5 py-0.2 rounded font-medium border",
                          s.source === "spotify"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : s.source === "google-drive"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : "bg-secondary/80 text-muted-foreground border-border/40",
                        )}
                      >
                        {s.source === "spotify"
                          ? "Spotify"
                          : s.source === "google-drive"
                            ? "Drive"
                            : "Upload"}
                      </span>
                    )}
                  </span>
                </span>
                <span className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <Heart
                    className={cn(
                      "size-4 cursor-pointer",
                      favorites[s.title] ? "text-primary" : "text-muted-foreground",
                    )}
                    fill={favorites[s.title] ? "currentColor" : "none"}
                    onClick={() => toggleFavorite(s.title)}
                  />

                  {/* Inline Date display or Editor */}
                  {editingId === s._id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="date"
                        value={editDateValue}
                        onChange={(e) => setEditDateValue(e.target.value)}
                        className="bg-background text-foreground text-[10px] border border-border rounded px-1 py-0.5 focus:outline-none w-24"
                      />
                      <button
                        onClick={() => handleSaveDate(s._id!)}
                        className="p-1 rounded bg-primary/20 hover:bg-primary/40 text-primary cursor-pointer"
                        title="Save Date"
                      >
                        <Save className="size-3" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 rounded bg-secondary hover:bg-secondary/80 text-foreground cursor-pointer"
                        title="Cancel"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {s.date || ""}
                      </span>
                      {s._id && (
                        <button
                          onClick={() => handleEditDate(s)}
                          className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          title="Edit Date"
                        >
                          <Edit3 className="size-3" />
                        </button>
                      )}
                    </div>
                  )}

                  <span className="text-xs tabular-nums text-muted-foreground">{s.duration}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer",
        active && "text-primary",
      )}
    >
      {children}
    </button>
  );
}
