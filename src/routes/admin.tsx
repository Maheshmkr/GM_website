/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Camera,
  Film,
  Music,
  Calendar,
  Trash2,
  Edit2,
  Plus,
  Heart,
  MapPin,
  Clock,
  Music4,
  ExternalLink,
  Loader2,
  X,
  Play,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Tab = "photos" | "videos" | "songs" | "timeline";

function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("photos");
  const queryClient = useQueryClient();

  // Queries
  const { data: photos = [], isLoading: loadingPhotos } = useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      const res = await fetch("/api/media?type=image");
      if (!res.ok) throw new Error("Failed to fetch photos");
      return res.json();
    },
  });

  const { data: videos = [], isLoading: loadingVideos } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await fetch("/api/media?type=video");
      if (!res.ok) throw new Error("Failed to fetch videos");
      return res.json();
    },
  });

  const { data: songs = [], isLoading: loadingSongs } = useQuery({
    queryKey: ["songs"],
    queryFn: async () => {
      const res = await fetch("/api/media?type=song");
      if (!res.ok) throw new Error("Failed to fetch songs");
      return res.json();
    },
  });

  const { data: timeline = [], isLoading: loadingTimeline } = useQuery({
    queryKey: ["timeline"],
    queryFn: async () => {
      const res = await fetch("/api/timeline");
      if (!res.ok) throw new Error("Failed to fetch timeline");
      return res.json();
    },
  });

  return (
    <section className="section-shell py-10 lg:py-16 min-h-screen">
      <SectionHeading
        title="Admin Management Dashboard"
        subtitle="Manage the memories, songs, videos, and journey timeline stored in MongoDB."
      />

      {/* Tabs */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {(
          [
            { id: "photos", label: "Photos", icon: Camera },
            { id: "videos", label: "Videos", icon: Film },
            { id: "songs", label: "Songs", icon: Music },
            { id: "timeline", label: "Timeline", icon: Calendar },
          ] as const
        ).map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-all",
                activeTab === t.id
                  ? "btn-love font-semibold"
                  : "glass text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-12 glass rounded-3xl p-6 lg:p-8">
        {activeTab === "photos" && (
          <PhotosManager photos={photos} isLoading={loadingPhotos} queryClient={queryClient} />
        )}
        {activeTab === "videos" && (
          <VideosManager videos={videos} isLoading={loadingVideos} queryClient={queryClient} />
        )}
        {activeTab === "songs" && (
          <SongsManager songs={songs} isLoading={loadingSongs} queryClient={queryClient} />
        )}
        {activeTab === "timeline" && (
          <TimelineManager
            timeline={timeline}
            isLoading={loadingTimeline}
            queryClient={queryClient}
          />
        )}
      </div>
    </section>
  );
}

/* ==========================================
   PHOTOS MANAGER COMPONENT
   ========================================== */
function PhotosManager({
  photos,
  isLoading,
  queryClient,
}: {
  photos: any[];
  isLoading: boolean;
  queryClient: any;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Favorites");
  const [favorite, setFavorite] = useState(false);
  const [uploading, setUploading] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      toast.success("Photo deleted successfully");
    },
    onError: (err: any) => {
      toast.error(`Delete failed: ${err.message}`);
    },
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image file");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("favorite", String(favorite));

    try {
      const res = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      toast.success("Photo uploaded successfully!");
      // Reset form
      setFile(null);
      setTitle("");
      setDescription("");
      setCategory("Favorites");
      setFavorite(false);
      // Reset HTML input element
      const fileInput = document.getElementById("photo-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      queryClient.invalidateQueries({ queryKey: ["photos"] });
    } catch (err: any) {
      console.error(err);
      toast.error(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
      {/* Upload Form */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <Plus className="size-5 text-primary" /> Add Photo
        </h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Select File (JPEG, PNG, WEBP, GIF)
            </label>
            <input
              id="photo-file"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80 bg-surface/50 border border-border rounded-xl p-2.5"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Title</label>
            <input
              type="text"
              placeholder="e.g. Sunset Date"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Description / Caption
            </label>
            <textarea
              placeholder="A beautiful evening by the sea..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Favorites">Favorites</option>
                <option value="Trips">Trips</option>
                <option value="Dates">Dates</option>
                <option value="Candid">Candid</option>
                <option value="Special">Special</option>
              </select>
            </div>
            <div className="flex items-center justify-center gap-2 border border-border bg-surface/30 rounded-xl px-3 mt-5">
              <input
                type="checkbox"
                id="photo-fav"
                checked={favorite}
                onChange={(e) => setFavorite(e.target.checked)}
                className="rounded accent-primary size-4"
              />
              <label
                htmlFor="photo-fav"
                className="text-xs font-semibold text-muted-foreground select-none cursor-pointer flex items-center gap-1"
              >
                <Heart className="size-3 text-primary" fill={favorite ? "currentColor" : "none"} />{" "}
                Favorite
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full btn-love rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload Photo"
            )}
          </button>
        </form>
      </div>

      {/* Record Grid */}
      <div className="border-l border-border/30 pl-0 lg:pl-8">
        <h3 className="text-lg font-semibold mb-6 flex justify-between items-center">
          <span>Uploaded Photos</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full">
            {photos.length} records
          </span>
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm gap-2">
            <Loader2 className="size-5 animate-spin" /> Loading photos...
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            No photos found in MongoDB. Use the form to upload.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {photos.map((p) => (
              <div
                key={p._id}
                className="bg-surface/30 border border-border rounded-2xl p-4 flex gap-4 items-start relative group"
              >
                <img
                  src={`/api/media/${p.fileId}`}
                  alt={p.title}
                  className="size-16 rounded-xl object-cover border border-border"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm truncate flex items-center gap-1">
                    {p.title}
                    {p.favorite && <Heart className="size-3 text-primary" fill="currentColor" />}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {p.description || "No description"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-foreground/80 font-medium">
                      {p.category}
                    </span>
                    <span className="text-[10px] bg-secondary/40 px-2 py-0.5 rounded-full text-muted-foreground">
                      {(p.fileSize / 1024).toFixed(0)} KB
                    </span>
                  </div>
                </div>

                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-surface/90 rounded-full p-1 border border-border shadow-md">
                  <a
                    href={`/api/media/${p.fileId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 hover:text-primary transition-colors"
                    title="View Media"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this photo?")) {
                        deleteMutation.mutate(p._id);
                      }
                    }}
                    className="p-1 text-destructive hover:text-destructive/80 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   VIDEOS MANAGER COMPONENT
   ========================================== */
function VideosManager({
  videos,
  isLoading,
  queryClient,
}: {
  videos: any[];
  isLoading: boolean;
  queryClient: any;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("0:30");
  const [favorite, setFavorite] = useState(false);
  const [uploading, setUploading] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Video deleted successfully");
    },
    onError: (err: any) => {
      toast.error(`Delete failed: ${err.message}`);
    },
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a video file");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", duration);
    formData.append("favorite", String(favorite));

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      toast.success("Video uploaded successfully!");
      setFile(null);
      setTitle("");
      setDescription("");
      setDuration("0:30");
      setFavorite(false);
      const fileInput = document.getElementById("video-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      queryClient.invalidateQueries({ queryKey: ["videos"] });
    } catch (err: any) {
      console.error(err);
      toast.error(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
      {/* Upload Form */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <Plus className="size-5 text-primary" /> Add Video
        </h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Select Video File (MP4, WEBM, MOV)
            </label>
            <input
              id="video-file"
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80 bg-surface/50 border border-border rounded-xl p-2.5"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Title</label>
            <input
              type="text"
              placeholder="e.g. Laughing in the Rain"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Description
            </label>
            <textarea
              placeholder="Captured this cute little moment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Duration (e.g. 0:45)
              </label>
              <input
                type="text"
                placeholder="e.g. 0:45"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center justify-center gap-2 border border-border bg-surface/30 rounded-xl px-3 mt-5">
              <input
                type="checkbox"
                id="video-fav"
                checked={favorite}
                onChange={(e) => setFavorite(e.target.checked)}
                className="rounded accent-primary size-4"
              />
              <label
                htmlFor="video-fav"
                className="text-xs font-semibold text-muted-foreground select-none cursor-pointer flex items-center gap-1"
              >
                <Heart className="size-3 text-primary" fill={favorite ? "currentColor" : "none"} />{" "}
                Favorite
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full btn-love rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload Video"
            )}
          </button>
        </form>
      </div>

      {/* Record Grid */}
      <div className="border-l border-border/30 pl-0 lg:pl-8">
        <h3 className="text-lg font-semibold mb-6 flex justify-between items-center">
          <span>Uploaded Videos</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full">
            {videos.length} records
          </span>
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm gap-2">
            <Loader2 className="size-5 animate-spin" /> Loading videos...
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            No videos found in MongoDB. Use the form to upload.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {videos.map((v) => (
              <div
                key={v._id}
                className="bg-surface/30 border border-border rounded-2xl p-4 flex gap-4 items-start relative group"
              >
                <div className="size-16 rounded-xl bg-black/60 border border-border flex items-center justify-center shrink-0">
                  <Film className="size-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm truncate flex items-center gap-1">
                    {v.title}
                    {v.favorite && <Heart className="size-3 text-primary" fill="currentColor" />}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {v.description || "No description"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-foreground/80 font-medium flex items-center gap-1">
                      <Clock className="size-2.5" /> {v.duration}
                    </span>
                    <span className="text-[10px] bg-secondary/40 px-2 py-0.5 rounded-full text-muted-foreground">
                      {(v.fileSize / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                </div>

                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-surface/90 rounded-full p-1 border border-border shadow-md">
                  <a
                    href={`/api/media/${v.fileId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 hover:text-primary transition-colors"
                    title="Play Media"
                  >
                    <Play className="size-3.5" />
                  </a>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this video?")) {
                        deleteMutation.mutate(v._id);
                      }
                    }}
                    className="p-1 text-destructive hover:text-destructive/80 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   SONGS MANAGER COMPONENT
   ========================================== */
function SongsManager({
  songs,
  isLoading,
  queryClient,
}: {
  songs: any[];
  isLoading: boolean;
  queryClient: any;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("3:30");
  const [uploading, setUploading] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      toast.success("Song deleted successfully");
    },
    onError: (err: any) => {
      toast.error(`Delete failed: ${err.message}`);
    },
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an audio file");
      return;
    }
    if (!title.trim() || !artist.trim()) {
      toast.error("Title and Artist are required");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (coverFile) {
      formData.append("coverFile", coverFile);
    }
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("description", description);
    formData.append("duration", duration);

    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      toast.success("Song uploaded successfully!");
      setFile(null);
      setCoverFile(null);
      setTitle("");
      setArtist("");
      setDescription("");
      setDuration("3:30");
      const fileInput = document.getElementById("song-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      const coverInput = document.getElementById("cover-file") as HTMLInputElement;
      if (coverInput) coverInput.value = "";

      queryClient.invalidateQueries({ queryKey: ["songs"] });
    } catch (err: any) {
      console.error(err);
      toast.error(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
      {/* Upload Form */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <Plus className="size-5 text-primary" /> Add Song
        </h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Select Audio File (MP3, WAV, OGG, WEBM)
            </label>
            <input
              id="song-file"
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80 bg-surface/50 border border-border rounded-xl p-2.5"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Select Album Art / Cover (JPEG, PNG, optional)
            </label>
            <input
              id="cover-file"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80 bg-surface/50 border border-border rounded-xl p-2.5"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Song Title
              </label>
              <input
                type="text"
                placeholder="e.g. Perfect"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Artist
              </label>
              <input
                type="text"
                placeholder="e.g. Ed Sheeran"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Note / Personal Message
            </label>
            <textarea
              placeholder="This song always reminds me of that trip..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Duration (e.g. 4:23)
            </label>
            <input
              type="text"
              placeholder="e.g. 4:23"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full btn-love rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload Song"
            )}
          </button>
        </form>
      </div>

      {/* Record Grid */}
      <div className="border-l border-border/30 pl-0 lg:pl-8">
        <h3 className="text-lg font-semibold mb-6 flex justify-between items-center">
          <span>Uploaded Songs</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full">
            {songs.length} records
          </span>
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm gap-2">
            <Loader2 className="size-5 animate-spin" /> Loading songs...
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            No songs found in MongoDB. Use the form to upload.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {songs.map((s) => (
              <div
                key={s._id}
                className="bg-surface/30 border border-border rounded-2xl p-4 flex gap-4 items-start relative group"
              >
                {s.coverFileId ? (
                  <img
                    src={`/api/media/${s.coverFileId}`}
                    alt={s.title}
                    className="size-16 rounded-xl object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="size-16 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0">
                    <Music4 className="size-6 text-primary" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm truncate">{s.title}</h4>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">by {s.artist}</p>
                  <p className="text-[10px] text-muted-foreground/60 italic truncate mt-1">
                    "{s.description || "No description"}"
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-foreground/80 font-medium">
                      {s.duration}
                    </span>
                    <span className="text-[10px] bg-secondary/40 px-2 py-0.5 rounded-full text-muted-foreground">
                      {(s.fileSize / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                </div>

                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-surface/90 rounded-full p-1 border border-border shadow-md">
                  <a
                    href={`/api/media/${s.fileId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 hover:text-primary transition-colors"
                    title="Listen/Download"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this song?")) {
                        deleteMutation.mutate(s._id);
                      }
                    }}
                    className="p-1 text-destructive hover:text-destructive/80 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   TIMELINE MANAGER COMPONENT
   ========================================== */
function TimelineManager({
  timeline,
  isLoading,
  queryClient,
}: {
  timeline: any[];
  isLoading: boolean;
  queryClient: any;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [icon, setIcon] = useState<"heart" | "coffee" | "sparkles" | "plane" | "star">("heart");
  const [highlight, setHighlight] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Editing state
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editVideoFile, setEditVideoFile] = useState<File | null>(null);
  const [deleteOldImage, setDeleteOldImage] = useState(false);
  const [deleteOldVideo, setDeleteOldVideo] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/timeline/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
      toast.success("Timeline item deleted successfully");
    },
    onError: (err: any) => {
      toast.error(`Delete failed: ${err.message}`);
    },
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) {
      toast.error("Title and Date are required");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("location", location);
    formData.append("icon", icon);
    formData.append("highlight", String(highlight));
    if (imageFile) formData.append("imageFile", imageFile);
    if (videoFile) formData.append("videoFile", videoFile);

    try {
      const res = await fetch("/api/timeline", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Creation failed");
      }

      toast.success("Timeline milestone added!");
      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setIcon("heart");
      setHighlight(false);
      setImageFile(null);
      setVideoFile(null);

      const imgInput = document.getElementById("timeline-img") as HTMLInputElement;
      if (imgInput) imgInput.value = "";
      const vidInput = document.getElementById("timeline-vid") as HTMLInputElement;
      if (vidInput) vidInput.value = "";

      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("title", editingItem.title);
    formData.append("description", editingItem.description);
    formData.append("date", editingItem.date);
    formData.append("location", editingItem.location || "");
    formData.append("icon", editingItem.icon);
    formData.append("highlight", String(editingItem.highlight));

    if (editImageFile) formData.append("imageFile", editImageFile);
    if (editVideoFile) formData.append("videoFile", editVideoFile);
    if (deleteOldImage) formData.append("deleteImage", "true");
    if (deleteOldVideo) formData.append("deleteVideo", "true");

    try {
      const res = await fetch(`/api/timeline/${editingItem._id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }

      toast.success("Timeline milestone updated!");
      setEditingItem(null);
      setEditImageFile(null);
      setEditVideoFile(null);
      setDeleteOldImage(false);
      setDeleteOldVideo(false);

      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    } catch (err: any) {
      console.error(err);
      toast.error(`Update error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
      {/* Upload/Edit Form */}
      <div>
        {editingItem ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Edit2 className="size-5 text-primary" /> Edit Milestone
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 glass px-2 py-1 rounded-md"
              >
                <X className="size-3" /> Cancel
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Date Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 14 Feb 2023 or Forever"
                  value={editingItem.date}
                  onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                  className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Description
                </label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={2}
                  className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Central Park"
                  value={editingItem.location || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Media management */}
              <div className="bg-surface/20 border border-border/50 rounded-xl p-3.5 space-y-3.5">
                <span className="block text-xs font-bold text-muted-foreground">
                  Media Attachments
                </span>

                {editingItem.imageFileId && !deleteOldImage ? (
                  <div className="flex items-center justify-between border-b border-border/20 pb-2">
                    <span className="text-xs text-muted-foreground truncate max-w-[70%]">
                      Attached Image: `/api/media/${editingItem.imageFileId}`
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteOldImage(true)}
                      className="text-xs text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground/75 mb-1">
                      Replace Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setEditImageFile(e.target.files?.[0] || null);
                        setDeleteOldImage(true);
                      }}
                      className="w-full text-xs text-muted-foreground"
                    />
                  </div>
                )}

                {editingItem.videoFileId && !deleteOldVideo ? (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground truncate max-w-[70%]">
                      Attached Video: `/api/media/${editingItem.videoFileId}`
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteOldVideo(true)}
                      className="text-xs text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground/75 mb-1">
                      Replace Video
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        setEditVideoFile(e.target.files?.[0] || null);
                        setDeleteOldVideo(true);
                      }}
                      className="w-full text-xs text-muted-foreground"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Icon
                  </label>
                  <select
                    value={editingItem.icon}
                    onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                    className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground focus:outline-none"
                  >
                    <option value="heart">Heart</option>
                    <option value="coffee">Coffee</option>
                    <option value="sparkles">Sparkles</option>
                    <option value="plane">Plane</option>
                    <option value="star">Star</option>
                  </select>
                </div>
                <div className="flex items-center justify-center gap-2 border border-border bg-surface/30 rounded-xl px-3 mt-5">
                  <input
                    type="checkbox"
                    id="edit-timeline-highlight"
                    checked={editingItem.highlight}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, highlight: e.target.checked })
                    }
                    className="rounded accent-primary size-4"
                  />
                  <label
                    htmlFor="edit-timeline-highlight"
                    className="text-xs font-semibold text-muted-foreground select-none cursor-pointer"
                  >
                    Highlight Glow
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full btn-love rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="size-4 animate-spin" /> : "Save Changes"}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Plus className="size-5 text-primary" /> Add Timeline Item
            </h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. First Time We Met"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Date (e.g. 12 May 2024 or Forever)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12 Jan 2023"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Description
                </label>
                <textarea
                  placeholder="A short note about this milestone..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Location (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paris, France"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Upload Photo (optional)
                  </label>
                  <input
                    id="timeline-img"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-muted-foreground bg-surface/30 p-2 rounded-lg border border-border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Upload Video (optional)
                  </label>
                  <input
                    id="timeline-vid"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-muted-foreground bg-surface/30 p-2 rounded-lg border border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Icon Type
                  </label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value as any)}
                    className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground focus:outline-none"
                  >
                    <option value="heart">Heart ❤️</option>
                    <option value="coffee">Coffee ☕</option>
                    <option value="sparkles">Sparkles ✨</option>
                    <option value="plane">Plane ✈️</option>
                    <option value="star">Star ⭐</option>
                  </select>
                </div>
                <div className="flex items-center justify-center gap-2 border border-border bg-surface/30 rounded-xl px-3 mt-5">
                  <input
                    type="checkbox"
                    id="timeline-highlight"
                    checked={highlight}
                    onChange={(e) => setHighlight(e.target.checked)}
                    className="rounded accent-primary size-4"
                  />
                  <label
                    htmlFor="timeline-highlight"
                    className="text-xs font-semibold text-muted-foreground select-none cursor-pointer"
                  >
                    Highlight Glow
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full btn-love rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="size-4 animate-spin" /> : "Add Milestone"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Record Grid */}
      <div className="border-l border-border/30 pl-0 lg:pl-8">
        <h3 className="text-lg font-semibold mb-6 flex justify-between items-center">
          <span>Timeline Milestones</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full">
            {timeline.length} records
          </span>
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm gap-2">
            <Loader2 className="size-5 animate-spin" /> Loading timeline...
          </div>
        ) : timeline.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            No milestones found in MongoDB. Use the form to add.
          </div>
        ) : (
          <div className="space-y-4">
            {timeline.map((item) => (
              <div
                key={item._id}
                className="bg-surface/30 border border-border rounded-2xl p-4 flex gap-4 items-start relative group"
              >
                <div className="size-12 rounded-full border border-border flex items-center justify-center bg-secondary shrink-0 text-primary font-bold">
                  {item.icon === "heart" && "❤️"}
                  {item.icon === "coffee" && "☕"}
                  {item.icon === "sparkles" && "✨"}
                  {item.icon === "plane" && "✈️"}
                  {item.icon === "star" && "⭐"}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm truncate flex items-center gap-1.5">
                    {item.title}
                    {item.highlight && (
                      <span className="size-2 bg-primary rounded-full animate-ping" />
                    )}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.description || "No description"}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] bg-secondary px-2.5 py-0.5 rounded-full text-foreground/80 font-medium">
                      📅 {item.date}
                    </span>
                    {item.location && (
                      <span className="text-[10px] bg-secondary/50 px-2.5 py-0.5 rounded-full text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-2.5" /> {item.location}
                      </span>
                    )}
                    {item.imageFileId && (
                      <span className="text-[10px] bg-primary/20 text-primary px-2.5 py-0.5 rounded-full font-medium">
                        🖼️ Image
                      </span>
                    )}
                    {item.videoFileId && (
                      <span className="text-[10px] bg-primary/20 text-primary px-2.5 py-0.5 rounded-full font-medium">
                        🎥 Video
                      </span>
                    )}
                  </div>
                </div>

                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-surface/90 rounded-full p-1 border border-border shadow-md">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setDeleteOldImage(false);
                      setDeleteOldVideo(false);
                    }}
                    className="p-1 hover:text-primary transition-colors"
                    title="Edit Record"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this milestone?")) {
                        deleteMutation.mutate(item._id);
                      }
                    }}
                    className="p-1 text-destructive hover:text-destructive/80 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
