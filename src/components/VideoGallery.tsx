/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import { Heart, Play, X, Loader2, Film, Trash2, Link as LinkIcon, Edit3, Save } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type Video } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export function VideoGallery({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<any | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Uploader State
  const [showUploader, setShowUploader] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("0:30");
  const [favorite, setFavorite] = useState(false);
  const [memoryDate, setMemoryDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "failed">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // URL Modal state
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [urlTitle, setUrlTitle] = useState("");
  const [urlDescription, setUrlDescription] = useState("");
  const [urlDuration, setUrlDuration] = useState("0:30");
  const [urlDate, setUrlDate] = useState(new Date().toISOString().split("T")[0]);
  const [urlStatus, setUrlStatus] = useState<"idle" | "saving" | "success" | "failed">("idle");

  // Inline Date Editor state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDateValue, setEditDateValue] = useState("");

  const queryClient = useQueryClient();

  const { data: serverVideos = [], isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await fetch("/api/media?type=video");
      if (!res.ok) throw new Error("Failed to fetch videos");
      return res.json();
    },
  });

  const mappedVideos = useMemo<any[]>(() => {
    return serverVideos.map((v: any) => {
      const displayDate = v.memoryDate || v.createdAt || new Date().toISOString();
      return {
        _id: v._id,
        title: v.title,
        description: v.description || "",
        duration: v.duration || "0:30",
        thumbnail: v.source === "url" ? "" : `/api/media/file/${v.fileId}`,
        src: v.source === "url" ? v.url : `/api/media/file/${v.fileId}`,
        favorite: v.favorite || false,
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
  }, [serverVideos]);

  useEffect(() => {
    if (mappedVideos.length > 0) {
      setFavorites((prev) => {
        const nextFavs = { ...prev };
        mappedVideos.forEach((v) => {
          if (v.favorite && nextFavs[v.title] === undefined) {
            nextFavs[v.title] = true;
          }
        });
        return nextFavs;
      });
    }
  }, [mappedVideos]);

  const list = useMemo(() => {
    return limit ? mappedVideos.slice(0, limit) : mappedVideos;
  }, [mappedVideos, limit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      setFile(selected);
      setTitle(selected.name.substring(0, selected.name.lastIndexOf(".")) || selected.name);
      setPreviewUrl(URL.createObjectURL(selected));
      setStatus("idle");
      setErrorMsg("");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", duration);
    formData.append("type", "video");
    formData.append("favorite", String(favorite));
    formData.append("memoryDate", memoryDate);

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setStatus("success");
      toast.success("Video uploaded successfully!");
      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setTitle("");
      setDescription("");
      setDuration("0:30");
      setFavorite(false);
      setMemoryDate(new Date().toISOString().split("T")[0]);
      setShowUploader(false);

      queryClient.invalidateQueries({ queryKey: ["videos"] });
    } catch (err: any) {
      console.error(err);
      setStatus("failed");
      setErrorMsg(err.message);
      toast.error(`Upload failed: ${err.message}`);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || !urlTitle.trim()) {
      toast.error("URL and Title are required");
      return;
    }

    setUrlStatus("saving");

    try {
      const res = await fetch("/api/media/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: urlTitle,
          description: urlDescription,
          duration: urlDuration,
          url: inputUrl,
          type: "video",
          memoryDate: urlDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add URL video");

      setUrlStatus("success");
      toast.success("Video URL added successfully!");

      // Reset URL form
      setInputUrl("");
      setUrlTitle("");
      setUrlDescription("");
      setUrlDuration("0:30");
      setUrlDate(new Date().toISOString().split("T")[0]);
      setShowUrlModal(false);

      queryClient.invalidateQueries({ queryKey: ["videos"] });
    } catch (err: any) {
      console.error(err);
      setUrlStatus("failed");
      setErrorMsg(err.message);
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (v: any) => {
    if (confirm("Are you sure you want to delete this video?")) {
      try {
        const res = await fetch(`/api/media/${v._id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
        toast.success("Video deleted");
        queryClient.invalidateQueries({ queryKey: ["videos"] });
      } catch (err: any) {
        toast.error(`Delete failed: ${err.message}`);
      }
    }
  };

  const handleEditDate = (v: any) => {
    setEditingId(v._id);
    setEditDateValue(v.rawDate);
  };

  const handleSaveDate = async (id: string) => {
    try {
      const res = await fetch(`/api/media/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memoryDate: editDateValue }),
      });
      if (!res.ok) throw new Error("Failed to save date");
      toast.success("Video date updated");
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const isVidUrl = (url: string) => {
    const cleanUrl = url.toLowerCase().split(/[?#]/)[0];
    return /\.(mp4|webm|mov|qt)$/.test(cleanUrl) || cleanUrl.startsWith("http");
  };

  return (
    <>
      {!limit && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => {
              setShowUploader(!showUploader);
              if (showUrlModal) setShowUrlModal(false);
            }}
            className="rounded-full px-6 py-2.5 text-sm font-semibold btn-love flex items-center gap-2 cursor-pointer"
          >
            <Film className="size-4" />
            {showUploader ? "Close Uploader" : "Add Video"}
          </button>
          <button
            onClick={() => {
              setShowUrlModal(!showUrlModal);
              if (showUploader) setShowUploader(false);
            }}
            className="rounded-full px-6 py-2.5 text-sm font-semibold btn-love flex items-center gap-2 cursor-pointer"
          >
            <LinkIcon className="size-4" />
            Add URL
          </button>
        </div>
      )}

      {/* Upload Section */}
      {showUploader && (
        <div className="glass rounded-3xl p-6 mt-6 max-w-xl mx-auto animate-letter-open">
          <form onSubmit={handleUpload} className="space-y-4">
            <h3 className="text-md font-semibold text-primary">Upload New Video</h3>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Choose Video File (MP4, WEBM, MOV)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground bg-surface/50 border border-border rounded-xl p-2"
              />
            </div>

            {previewUrl && (
              <div className="space-y-4">
                <span className="block text-xs font-semibold text-muted-foreground">
                  Selected: {file?.name}
                </span>
                <video
                  src={previewUrl}
                  controls
                  className="max-h-48 rounded-2xl aspect-video mx-auto border border-border bg-black"
                />

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter video title..."
                    className="w-full text-sm bg-surface/35 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter short description..."
                    rows={2}
                    className="w-full text-sm bg-surface/35 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Duration (e.g. 1:12)
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 0:45"
                      className="w-full text-sm bg-surface/35 border border-border rounded-xl p-2.5 text-foreground focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Memory Date
                    </label>
                    <input
                      type="date"
                      value={memoryDate}
                      onChange={(e) => setMemoryDate(e.target.value)}
                      required
                      className="w-full text-sm bg-surface/35 border border-border rounded-xl p-2 text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 border border-border bg-surface/20 rounded-xl px-3 py-2.5">
                  <input
                    type="checkbox"
                    id="video-fav-chk"
                    checked={favorite}
                    onChange={(e) => setFavorite(e.target.checked)}
                    className="rounded accent-primary size-4"
                  />
                  <label
                    htmlFor="video-fav-chk"
                    className="text-xs font-semibold text-muted-foreground select-none cursor-pointer"
                  >
                    Mark Favorite
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreviewUrl(null);
                      setTitle("");
                      setDescription("");
                    }}
                    className="rounded-full px-4 py-2 text-xs font-semibold bg-secondary text-foreground hover:bg-secondary/80 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === "uploading"}
                    className="rounded-full px-5 py-2 text-xs font-semibold btn-love disabled:opacity-50 cursor-pointer"
                  >
                    {status === "uploading" ? "Uploading..." : "Upload Video"}
                  </button>
                </div>
              </div>
            )}

            {status === "success" && (
              <p className="text-xs text-green-500 text-center font-medium">Success ✓</p>
            )}
            {status === "failed" && (
              <p className="text-xs text-red-500 text-center font-medium">✕ {errorMsg}</p>
            )}
          </form>
        </div>
      )}

      {/* URL Video Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-md">
          <div className="glass rounded-3xl p-6 w-full max-w-md animate-letter-open space-y-4 relative">
            <button
              onClick={() => setShowUrlModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <LinkIcon className="size-5" /> Add Video URL
            </h3>

            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Video URL</label>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              {inputUrl.trim() && isVidUrl(inputUrl) && (
                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-muted-foreground text-center">Preview:</span>
                  <video
                    src={inputUrl}
                    controls
                    className="max-h-36 rounded-xl aspect-video mx-auto border border-border bg-black/40"
                    onError={() => toast.error("Could not load video stream. Confirm URL matches a direct video file.")}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Title</label>
                <input
                  type="text"
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  placeholder="Enter Title..."
                  className="w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Description (optional)</label>
                <input
                  type="text"
                  value={urlDescription}
                  onChange={(e) => setUrlDescription(e.target.value)}
                  placeholder="Enter description..."
                  className="w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Duration (e.g. 0:30)</label>
                  <input
                    type="text"
                    value={urlDuration}
                    onChange={(e) => setUrlDuration(e.target.value)}
                    className="w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Date</label>
                  <input
                    type="date"
                    value={urlDate}
                    onChange={(e) => setUrlDate(e.target.value)}
                    required
                    className="w-full text-sm bg-surface/30 border border-border rounded-xl p-2.5 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUrlModal(false);
                    setInputUrl("");
                    setUrlTitle("");
                    setUrlStatus("idle");
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
              <p className="text-xs text-red-500 text-center font-medium">✕ Please enter a valid URL.</p>
            )}
          </div>
        </div>
      )}

      {/* Grid video items list */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {list.map((v, i) => (
          <Reveal key={v._id + i} delay={i * 80}>
            <article className="glass glass-hover overflow-hidden rounded-3xl flex flex-col justify-between h-full">
              <button
                onClick={() => setOpen(v)}
                className="group relative block aspect-video w-full"
                aria-label={`Play ${v.title}`}
              >
                <video
                  src={v.src}
                  className="size-full object-cover pointer-events-none"
                  preload="metadata"
                />
                <span className="absolute inset-0 bg-background/35 transition-colors group-hover:bg-background/20" />
                <span className="btn-love absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full">
                  <Play className="size-5" fill="currentColor" />
                </span>
                <span className="glass absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-medium">
                  {v.duration}
                </span>
              </button>
              
              <div className="flex flex-col gap-1 p-4 flex-1 justify-between">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">{v.title}</h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{v.description}</p>
                </div>
                
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/10">
                  {/* Inline Date display or Editor */}
                  {editingId === v._id ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="date"
                        value={editDateValue}
                        onChange={(e) => setEditDateValue(e.target.value)}
                        className="bg-background text-foreground text-[10px] border border-border rounded px-1 py-0.5 focus:outline-none w-24"
                      />
                      <button
                        onClick={() => handleSaveDate(v._id)}
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
                    <div className="flex items-center gap-1.5">
                      <p className="text-[11px] text-muted-foreground font-medium">{v.date}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDate(v);
                        }}
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer pointer-events-auto opacity-0 group-hover:opacity-100"
                        title="Edit Date"
                      >
                        <Edit3 className="size-3" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFavorites((f) => ({ ...f, [v.title]: !f[v.title] }))}
                      aria-label="Favorite video"
                      className="shrink-0"
                    >
                      <Heart
                        className={cn("size-4", favorites[v.title] && "text-primary")}
                        fill={favorites[v.title] ? "currentColor" : "none"}
                      />
                    </button>
                    {!limit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(v);
                        }}
                        aria-label="Delete video"
                        className="shrink-0 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center mt-10 text-sm text-muted-foreground gap-2">
          <Loader2 className="size-4 animate-spin text-primary" /> Loading videos...
        </div>
      ) : list.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Nothing here yet — but more videos are coming.
        </p>
      ) : null}

      {open && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-background/90 p-4 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
        >
          <div
            className="animate-letter-open glass relative w-full max-w-3xl rounded-3xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={open.src}
              controls
              autoPlay
              playsInline
              className="aspect-video w-full rounded-2xl bg-black"
            />
            <div className="p-3">
              <h3 className="text-base font-semibold">{open.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{open.description}</p>
            </div>
            <button
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="glass absolute -top-3 right-2 grid size-10 place-items-center rounded-full cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
