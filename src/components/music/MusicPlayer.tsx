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
  Plus,
  Link as LinkIcon,
  X,
  Loader2,
  Music4,
  Edit3,
  Save,
} from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatTime, useMusic } from "./MusicProvider";
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

  // Uploader Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songDescription, setSongDescription] = useState("");
  const [songDuration, setSongDuration] = useState("3:30");
  const [songDate, setSongDate] = useState(new Date().toISOString().split("T")[0]);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "failed">(
    "idle",
  );

  // URL Modal States
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [urlTitle, setUrlTitle] = useState("");
  const [urlArtist, setUrlArtist] = useState("");
  const [urlDate, setUrlDate] = useState(new Date().toISOString().split("T")[0]);
  const [urlStatus, setUrlStatus] = useState<"idle" | "saving" | "success" | "failed">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Inline Date Editor state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDateValue, setEditDateValue] = useState("");

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      setAudioFile(selected);
      setSongTitle(selected.name.substring(0, selected.name.lastIndexOf(".")) || selected.name);
      setUploadStatus("idle");
      setErrorMsg("");
      setShowUploadModal(true);
    }
  };

  const handleUploadSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) return;
    if (!songTitle.trim() || !songArtist.trim()) {
      toast.error("Song Title and Artist are required");
      return;
    }

    setUploadStatus("uploading");
    const formData = new FormData();
    formData.append("file", audioFile);
    if (coverFile) {
      formData.append("coverFile", coverFile);
    }
    formData.append("title", songTitle);
    formData.append("artist", songArtist);
    formData.append("description", songDescription);
    formData.append("duration", songDuration);
    formData.append("type", "song");
    formData.append("memoryDate", songDate);

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploadStatus("success");
      toast.success("Song uploaded successfully!");

      // Reset uploader form
      setAudioFile(null);
      setCoverFile(null);
      setSongTitle("");
      setSongArtist("");
      setSongDescription("");
      setSongDuration("3:30");
      setSongDate(new Date().toISOString().split("T")[0]);
      setShowUploadModal(false);

      const fileInput = document.getElementById("audio-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      queryClient.invalidateQueries({ queryKey: ["songs"] });
    } catch (err: any) {
      console.error(err);
      setUploadStatus("failed");
      setErrorMsg(err.message);
      toast.error(`Upload failed: ${err.message}`);
    }
  };

  const handleAddUrlSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlTitle.trim() || !urlArtist.trim() || !inputUrl.trim()) {
      toast.error("All fields are required");
      return;
    }

    setUrlStatus("saving");

    try {
      const res = await fetch("/api/media/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: urlTitle,
          artist: urlArtist,
          url: inputUrl,
          type: "song",
          memoryDate: urlDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add URL song");

      setUrlStatus("success");
      toast.success("URL song added successfully!");

      // Reset URL form
      setInputUrl("");
      setUrlTitle("");
      setUrlArtist("");
      setUrlDate(new Date().toISOString().split("T")[0]);
      setShowUrlModal(false);

      queryClient.invalidateQueries({ queryKey: ["songs"] });
    } catch (err: any) {
      console.error(err);
      setUrlStatus("failed");
      setErrorMsg(err.message);
      toast.error(`Error: ${err.message}`);
    }
  };

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
          <img
            src={current.cover}
            alt={`${current.title} cover`}
            loading="lazy"
            className={cn(
              "size-40 shrink-0 rounded-2xl object-cover shadow-[var(--shadow-glow)] transition-transform duration-700",
              playing && "scale-[1.02]",
            )}
          />
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h3 className="truncate text-xl font-semibold">{current.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{current.artist}</p>
            {current.note && <p className="mt-3 text-xs text-primary">{current.note}</p>}
            <button
              onClick={() => toggleFavorite(current.title)}
              aria-label="Favorite song"
              className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary cursor-pointer"
            >
              <Heart
                className={cn("size-4", favorites[current.title] && "text-primary")}
                fill={favorites[current.title] ? "currentColor" : "none"}
              />
              Favorite
            </button>
          </div>
        </div>

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
      </div>

      {/* Playlist Section */}
      <div className="glass grid content-start gap-1 rounded-3xl p-3 sm:p-4">
        {/* Buttons at the top of playlist */}
        <div className="flex justify-between items-center gap-2 mb-3 border-b border-border/20 pb-3">
          <span className="text-sm font-semibold text-muted-foreground pl-2">Playlist</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const input = document.getElementById("audio-file-input") as HTMLInputElement;
                if (input) input.click();
              }}
              className="text-xs font-semibold bg-secondary/80 hover:bg-secondary rounded-full px-3.5 py-1.5 cursor-pointer flex items-center gap-1 border border-border/30"
            >
              <Plus className="size-3 text-primary" /> Add Song
            </button>
            <button
              onClick={() => setShowUrlModal(true)}
              className="text-xs font-semibold bg-secondary/80 hover:bg-secondary rounded-full px-3.5 py-1.5 cursor-pointer flex items-center gap-1 border border-border/30"
            >
              <LinkIcon className="size-3 text-primary" /> Add URL
            </button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          id="audio-file-input"
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleAudioChange}
        />

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
                <img
                  src={s.cover}
                  alt=""
                  loading="lazy"
                  className="size-11 rounded-xl object-cover"
                />
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block truncate text-sm font-medium",
                      i === index && "text-primary",
                    )}
                  >
                    {s.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{s.artist}</span>
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
                  {s._id && (
                    <button
                      onClick={() => handleDeleteSong(s._id!, s.title)}
                      aria-label="Delete song"
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Upload Song Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-md">
          <div className="glass rounded-3xl p-6 w-full max-w-md animate-letter-open space-y-4 relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
            <h3 className="text-lg font-semibold text-primary">🎵 Upload Song File</h3>
            <span className="block text-xs font-semibold text-muted-foreground">
              Selected File: {audioFile?.name}
            </span>

            <form onSubmit={handleUploadSong} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Song Title
                </label>
                <input
                  type="text"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="e.g. Perfect"
                  className="w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Artist Name
                </label>
                <input
                  type="text"
                  value={songArtist}
                  onChange={(e) => setSongArtist(e.target.value)}
                  placeholder="e.g. Ed Sheeran"
                  className="w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Note (optional)
                </label>
                <input
                  type="text"
                  value={songDescription}
                  onChange={(e) => setSongDescription(e.target.value)}
                  placeholder="e.g. Always reminds me of you"
                  className="w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Duration (e.g. 4:23)
                  </label>
                  <input
                    type="text"
                    value={songDuration}
                    onChange={(e) => setSongDuration(e.target.value)}
                    className="w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Memory Date
                  </label>
                  <input
                    type="date"
                    value={songDate}
                    onChange={(e) => setSongDate(e.target.value)}
                    required
                    className="w-full text-sm bg-surface/30 border border-border rounded-xl p-2.5 text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Album Cover (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-[10px] file:bg-secondary file:text-foreground hover:file:bg-secondary/80 bg-surface/20 border border-border rounded-xl p-1.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-full px-4 py-2 text-xs font-semibold bg-secondary text-foreground hover:bg-secondary/80 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadStatus === "uploading"}
                  className="rounded-full px-5 py-2 text-xs font-semibold btn-love disabled:opacity-50 cursor-pointer"
                >
                  {uploadStatus === "uploading" ? "Uploading..." : "Upload Song"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Song URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-md">
          <div className="glass rounded-3xl p-6 w-full max-w-md animate-letter-open space-y-4 relative">
            <button
              onClick={() => {
                setShowUrlModal(false);
                setInputUrl("");
                setUrlTitle("");
                setUrlArtist("");
                setUrlStatus("idle");
                setErrorMsg("");
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <LinkIcon className="size-5" /> Add Song URL
            </h3>

            <form onSubmit={handleAddUrlSong} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Song URL
                </label>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.com/song.mp3"
                  className="w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              {inputUrl.trim() && isAudioUrl(inputUrl) && (
                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-muted-foreground text-center">
                    Preview:
                  </span>
                  <audio
                    src={inputUrl}
                    controls
                    className="w-full mx-auto"
                    onError={() =>
                      toast.error("Could not load audio preview. Verify the link is correct.")
                    }
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Song Name
                </label>
                <input
                  type="text"
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  placeholder="Song Name"
                  className="w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Artist
                </label>
                <input
                  type="text"
                  value={urlArtist}
                  onChange={(e) => setUrlArtist(e.target.value)}
                  placeholder="Artist Name"
                  className="w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={urlDate}
                  onChange={(e) => setUrlDate(e.target.value)}
                  required
                  className="w-full text-sm bg-surface/30 border border-border rounded-xl p-2.5 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUrlModal(false);
                    setInputUrl("");
                    setUrlTitle("");
                    setUrlArtist("");
                    setUrlStatus("idle");
                    setErrorMsg("");
                  }}
                  className="rounded-full px-4 py-2 text-xs font-semibold bg-secondary text-foreground hover:bg-secondary/80 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={urlStatus === "saving"}
                  className="rounded-full px-5 py-2 text-xs font-semibold btn-love disabled:opacity-50 cursor-pointer"
                >
                  {urlStatus === "saving" ? "Saving..." : "Add to Page"}
                </button>
              </div>
            </form>

            {urlStatus === "failed" && (
              <p className="text-xs text-red-500 text-center font-medium">
                ✕ Please enter a valid URL.
              </p>
            )}
          </div>
        </div>
      )}
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
