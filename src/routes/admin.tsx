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
  Users,
  Link as LinkIcon,
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { readJsonResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Tab = "photos" | "videos" | "songs" | "timeline" | "fun" | "users";

function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("photos");
  const queryClient = useQueryClient();

  // Queries
  const { data: photos = [], isLoading: loadingPhotos } = useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/media?type=image");
        const payload = await readJsonResponse(res);
        if (!payload.ok) return [];
        return Array.isArray(payload.data) ? payload.data : [];
      } catch (err) {
        console.error("Error fetching photos:", err);
        return [];
      }
    },
  });

  const { data: videos = [], isLoading: loadingVideos } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/media?type=video");
        const payload = await readJsonResponse(res);
        if (!payload.ok) return [];
        return Array.isArray(payload.data) ? payload.data : [];
      } catch (err) {
        console.error("Error fetching videos:", err);
        return [];
      }
    },
  });

  const { data: songs = [], isLoading: loadingSongs } = useQuery({
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

  const { data: timeline = [], isLoading: loadingTimeline } = useQuery({
    queryKey: ["timeline"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/timeline");
        const payload = await readJsonResponse(res);
        if (!payload.ok) return [];
        return Array.isArray(payload.data) ? payload.data : [];
      } catch (err) {
        console.error("Error fetching timeline:", err);
        return [];
      }
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
            { id: "fun", label: "Fun Zone Images", icon: Sparkles },
            { id: "users", label: "Users", icon: Users },
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
        {activeTab === "fun" && (
          <FunZoneManager queryClient={queryClient} />
        )}
        {activeTab === "users" && (
          <UsersManager queryClient={queryClient} />
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
                <div className="size-16 shrink-0 rounded-xl overflow-hidden border border-border bg-black/20">
                  <img
                    src={`/api/media/${p.fileId}`}
                    alt={p.title}
                    className="size-full object-cover object-center"
                  />
                </div>
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
  const safeSongs = Array.isArray(songs) ? songs : [];
  // Local Upload State
  const [file, setFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadArtist, setUploadArtist] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadDuration, setUploadDuration] = useState("3:30");
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split("T")[0]);
  const [uploading, setUploading] = useState(false);

  // Spotify State
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [spotifyTitle, setSpotifyTitle] = useState("");
  const [spotifyArtist, setSpotifyArtist] = useState("");
  const [spotifyDate, setSpotifyDate] = useState(new Date().toISOString().split("T")[0]);
  const [addingSpotify, setAddingSpotify] = useState(false);

  // Google Drive State
  const [driveUrl, setDriveUrl] = useState("");
  const [driveTitle, setDriveTitle] = useState("");
  const [driveArtist, setDriveArtist] = useState("");
  const [driveDate, setDriveDate] = useState(new Date().toISOString().split("T")[0]);
  const [addingDrive, setAddingDrive] = useState(false);

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

  // Handle local upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an audio file");
      return;
    }
    if (!uploadTitle.trim() || !uploadArtist.trim()) {
      toast.error("Title and Artist are required");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (coverFile) {
      formData.append("coverFile", coverFile);
    }
    formData.append("title", uploadTitle);
    formData.append("artist", uploadArtist);
    formData.append("description", uploadDescription);
    formData.append("duration", uploadDuration);
    formData.append("memoryDate", uploadDate);

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
      setUploadTitle("");
      setUploadArtist("");
      setUploadDescription("");
      setUploadDuration("3:30");
      setUploadDate(new Date().toISOString().split("T")[0]);
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

  // Fetch Spotify metadata via oEmbed when URL changes
  const handleSpotifyUrlChange = async (urlVal: string) => {
    setSpotifyUrl(urlVal);
    if (urlVal.includes("spotify.com/track/") || urlVal.startsWith("spotify:track:")) {
      try {
        const cleanUrl = urlVal.trim();
        const oembedRes = await fetch(
          `https://open.spotify.com/oembed?url=${encodeURIComponent(cleanUrl)}`,
        );
        if (oembedRes.ok) {
          const data = await oembedRes.json();
          if (data.title && !spotifyTitle) {
            setSpotifyTitle(data.title);
          }
          if (data.author_name && !spotifyArtist) {
            setSpotifyArtist(data.author_name);
          }
        }
      } catch (_) {
        // Silently fail if oEmbed isn't reachable
      }
    }
  };

  // Handle Add Spotify Song
  const handleAddSpotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotifyUrl.trim()) {
      toast.error("Please paste a Spotify URL");
      return;
    }
    if (!spotifyTitle.trim() || !spotifyArtist.trim()) {
      toast.error("Song Title and Artist are required");
      return;
    }

    setAddingSpotify(true);
    try {
      const res = await fetch("/api/media/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "song",
          sourceType: "spotify",
          url: spotifyUrl,
          title: spotifyTitle,
          artist: spotifyArtist,
          memoryDate: spotifyDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add Spotify song");
      }

      toast.success("Spotify song added successfully!");
      setSpotifyUrl("");
      setSpotifyTitle("");
      setSpotifyArtist("");
      setSpotifyDate(new Date().toISOString().split("T")[0]);

      queryClient.invalidateQueries({ queryKey: ["songs"] });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setAddingSpotify(false);
    }
  };

  // Handle Add Google Drive Song
  const handleAddDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveUrl.trim()) {
      toast.error("Please paste a Google Drive URL");
      return;
    }
    if (!driveTitle.trim() || !driveArtist.trim()) {
      toast.error("Song Title and Artist are required");
      return;
    }

    setAddingDrive(true);
    try {
      const res = await fetch("/api/media/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "song",
          sourceType: "google-drive",
          url: driveUrl,
          title: driveTitle,
          artist: driveArtist,
          memoryDate: driveDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add Google Drive song");
      }

      toast.success("Google Drive song added successfully!");
      setDriveUrl("");
      setDriveTitle("");
      setDriveArtist("");
      setDriveDate(new Date().toISOString().split("T")[0]);

      queryClient.invalidateQueries({ queryKey: ["songs"] });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setAddingDrive(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
      {/* Upload & Add Forms */}
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <Plus className="size-5 text-primary" /> ADD SONG
          </h3>
          <p className="text-xs text-muted-foreground mb-6">
            Upload from computer or add external Spotify / Google Drive tracks.
          </p>
        </div>

        {/* 1. Upload from Computer */}
        <div className="border border-border/60 bg-surface/20 rounded-2xl p-5 space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
            <Music className="size-4 text-primary" /> Upload from Computer
          </h4>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Choose Song File (MP3, WAV, OGG, WEBM)
              </label>
              <input
                id="song-file"
                type="file"
                accept="audio/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80 bg-surface/50 border border-border rounded-xl p-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Album Art / Cover (JPEG, PNG, optional)
              </label>
              <input
                id="cover-file"
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80 bg-surface/50 border border-border rounded-xl p-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Song Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Perfect"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Artist
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ed Sheeran"
                  value={uploadArtist}
                  onChange={(e) => setUploadArtist(e.target.value)}
                  className="w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Memory Date
                </label>
                <input
                  type="date"
                  value={uploadDate}
                  onChange={(e) => setUploadDate(e.target.value)}
                  className="w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Duration (e.g. 4:23)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4:23"
                  value={uploadDuration}
                  onChange={(e) => setUploadDuration(e.target.value)}
                  className="w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Note / Description
              </label>
              <textarea
                placeholder="This song always reminds me of..."
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                rows={2}
                className="w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full btn-love rounded-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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

        {/* 2. Add Spotify Song */}
        <div className="border border-border/60 bg-surface/20 rounded-2xl p-5 space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
            <ExternalLink className="size-4 text-emerald-500" /> Add Spotify Song
          </h4>
          <form onSubmit={handleAddSpotify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Paste Spotify URL
              </label>
              <input
                type="text"
                placeholder="https://open.spotify.com/track/xxxxxxxxxxxxxxxx"
                value={spotifyUrl}
                onChange={(e) => handleSpotifyUrlChange(e.target.value)}
                className="w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Song Title
                </label>
                <input
                  type="text"
                  placeholder="Song Title"
                  value={spotifyTitle}
                  onChange={(e) => setSpotifyTitle(e.target.value)}
                  className="w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Artist
                </label>
                <input
                  type="text"
                  placeholder="Artist"
                  value={spotifyArtist}
                  onChange={(e) => setSpotifyArtist(e.target.value)}
                  className="w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Memory Date
              </label>
              <input
                type="date"
                value={spotifyDate}
                onChange={(e) => setSpotifyDate(e.target.value)}
                className="w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={addingSpotify}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {addingSpotify ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Adding...
                </>
              ) : (
                "Add Spotify Song"
              )}
            </button>
          </form>
        </div>

        {/* 3. Add Google Drive Song */}
        <div className="border border-border/60 bg-surface/20 rounded-2xl p-5 space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
            <LinkIcon className="size-4 text-blue-400" /> Add Google Drive Song
          </h4>
          <form onSubmit={handleAddDrive} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Paste Google Drive Shared URL
              </label>
              <input
                type="text"
                placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                className="w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Song Title
                </label>
                <input
                  type="text"
                  placeholder="Song Title"
                  value={driveTitle}
                  onChange={(e) => setDriveTitle(e.target.value)}
                  className="w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Artist
                </label>
                <input
                  type="text"
                  placeholder="Artist"
                  value={driveArtist}
                  onChange={(e) => setDriveArtist(e.target.value)}
                  className="w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Memory Date
              </label>
              <input
                type="date"
                value={driveDate}
                onChange={(e) => setDriveDate(e.target.value)}
                className="w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={addingDrive}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {addingDrive ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Adding...
                </>
              ) : (
                "Add Google Drive Song"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Record Grid */}
      <div className="border-l border-border/30 pl-0 lg:pl-8">
        <h3 className="text-lg font-semibold mb-6 flex justify-between items-center">
          <span>Uploaded & Added Songs</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full">
            {safeSongs.length} records
          </span>
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm gap-2">
            <Loader2 className="size-5 animate-spin" /> Loading songs...
          </div>
        ) : safeSongs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            No songs found in MongoDB. Use the forms to add songs.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {safeSongs.map((s) => {
              const sourceLabel =
                s.source === "spotify"
                  ? "Spotify"
                  : s.source === "google-drive"
                    ? "Google Drive"
                    : s.source === "upload"
                      ? "Computer Upload"
                      : "External Link";

              const sourceBadgeColor =
                s.source === "spotify"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : s.source === "google-drive"
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    : "bg-secondary text-foreground/80 border-border/40";

              return (
                <div
                  key={s._id}
                  className="bg-surface/30 border border-border rounded-2xl p-4 flex gap-4 items-start relative group"
                >
                  {s.coverFileId ? (
                    <div className="size-16 shrink-0 rounded-xl overflow-hidden border border-border bg-black/20">
                      <img
                        src={`/api/media/${s.coverFileId}`}
                        alt={s.title}
                        className="size-full object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div className="size-16 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0">
                      <Music4 className="size-6 text-primary" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm truncate">{s.title}</h4>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">by {s.artist}</p>
                    {s.memoryDate && (
                      <p className="text-[10px] text-muted-foreground/80 font-medium mt-1">
                        📅 {s.memoryDate}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-medium border",
                          sourceBadgeColor,
                        )}
                      >
                        {sourceLabel}
                      </span>
                    </div>
                  </div>

                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-surface/90 rounded-full p-1 border border-border shadow-md">
                    <a
                      href={s.source === "upload" ? `/api/media/${s.fileId}` : s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 hover:text-primary transition-colors"
                      title="Open Source"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this song?")) {
                          deleteMutation.mutate(s._id);
                        }
                      }}
                      className="p-1 text-destructive hover:text-destructive/80 transition-colors cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
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

/* ==========================================
   USERS MANAGER COMPONENT
   ========================================== */
function UsersManager({ queryClient }: { queryClient: any }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      const payload = await readJsonResponse(res);
      if (!payload.ok) throw new Error(payload.error || "Failed to fetch users");
      return payload.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (userData: any) => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const payload = await readJsonResponse(res);
      if (!payload.ok) throw new Error(payload.error || "Create user failed");
      return payload.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully!");
      setUsername("");
      setPassword("");
    },
    onError: (err: any) => {
      toast.error(`Error creating user: ${err.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const payload = await readJsonResponse(res);
      if (!payload.ok) throw new Error(payload.error || "Delete user failed");
      return payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(`Error deleting user: ${err.message}`);
    },
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    setCreating(true);
    try {
      await createMutation.mutateAsync({ username, password });
    } catch (err) {
      // Handled by mutation onError
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
      {/* Create User Form */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <Plus className="size-5 text-primary" /> Create User Account
        </h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Username</label>
            <input
              type="text"
              placeholder="e.g. lovebird"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter account password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full btn-love rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {creating ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Creating...
              </>
            ) : (
              "Create User"
            )}
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="border-l border-border/30 pl-0 lg:pl-8">
        <h3 className="text-lg font-semibold mb-6 flex justify-between items-center">
          <span>User Accounts</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full">
            {users.length} accounts
          </span>
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm gap-2">
            <Loader2 className="size-5 animate-spin" /> Loading user accounts...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            No database user accounts found. Use the form to create one.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {users.map((u: any) => (
              <div
                key={u._id}
                className="bg-surface/30 border border-border rounded-2xl p-4 flex justify-between items-center relative group"
              >
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm truncate flex items-center gap-1.5">
                    <Users className="size-4 text-primary" />
                    {u.username}
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Role: <span className="text-foreground capitalize font-medium">{u.role}</span>
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    Created: {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete user "${u.username}"?`)) {
                        deleteMutation.mutate(u._id);
                      }
                    }}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                    title="Delete Account"
                  >
                    <Trash2 className="size-4" />
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
   FUN ZONE MANAGER COMPONENT
   ========================================== */
interface FunZoneStageItem {
  _id?: string;
  stage: number;
  title: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  fileId: string;
  url: string;
  updatedAt?: string;
}

const STAGES_CONFIG = [
  {
    stage: 1,
    title: "Stage 1 — Normal",
    description: "Initial character appearance (default / no damage).",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
    badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  {
    stage: 2,
    title: "Stage 2 — Small Injury",
    description: "Slight scratch or minor impact reaction.",
    color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30",
    badge: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  {
    stage: 3,
    title: "Stage 3 — Bruise",
    description: "Cheek bruise or visible scratch mark.",
    color: "from-orange-500/20 to-amber-500/10 border-orange-500/30",
    badge: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  },
  {
    stage: 4,
    title: "Stage 4 — Bandage",
    description: "Bandage on forehead/cheek or noticeable wound.",
    color: "from-rose-500/20 to-red-500/10 border-rose-500/30",
    badge: "text-rose-400 bg-rose-500/10 border-rose-500/30",
  },
  {
    stage: 5,
    title: "Stage 5 — Maximum Injury",
    description: "Exaggerated cartoon knockout, dizzy stars, heavy bandages.",
    color: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
    badge: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  },
];

function FunZoneManager({ queryClient }: { queryClient: any }) {
  const [uploadingStage, setUploadingStage] = useState<number | null>(null);
  const [deletingStage, setDeletingStage] = useState<number | null>(null);

  const { data: stages = [], isLoading } = useQuery<FunZoneStageItem[]>({
    queryKey: ["fun-stages"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/fun/stages");
        if (!res.ok) return [];
        return await res.json();
      } catch (err) {
        console.error("Error fetching fun zone stages:", err);
        return [];
      }
    },
  });

  const handleStageFileUpload = async (stageNum: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, WebP, GIF).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size must be under 10MB.");
      return;
    }

    setUploadingStage(stageNum);
    const formData = new FormData();
    formData.append("stage", String(stageNum));
    formData.append("file", file);

    try {
      const res = await fetch("/api/fun/stages", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload stage image");
      }

      toast.success(`Stage ${stageNum} image updated successfully!`);
      queryClient.invalidateQueries({ queryKey: ["fun-stages"] });
    } catch (err: any) {
      console.error(err);
      toast.error(`Upload error: ${err.message}`);
    } finally {
      setUploadingStage(null);
      // Reset input value so same file can be re-selected if needed
      e.target.value = "";
    }
  };

  const handleDeleteStage = async (stageNum: number, title: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the image for "${title}"?\n\nThis will permanently remove it from MongoDB storage.`
      )
    ) {
      return;
    }

    setDeletingStage(stageNum);
    try {
      const res = await fetch(`/api/fun/stages?stage=${stageNum}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete stage image");
      }

      toast.success(`Stage ${stageNum} image deleted from storage & database!`);
      queryClient.invalidateQueries({ queryKey: ["fun-stages"] });
    } catch (err: any) {
      console.error(err);
      toast.error(`Delete error: ${err.message}`);
    } finally {
      setDeletingStage(null);
    }
  };

  const getStageData = (stageNum: number): FunZoneStageItem | undefined => {
    return stages.find((s) => s.stage === stageNum);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2.5">
            <Sparkles className="size-6 text-primary animate-spin" />
            <span>💥 Fun Zone Images</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Upload the finished character images for each of the 5 damage stages. You can re-upload,
            replace, or permanently delete images stored in MongoDB GridFS.
          </p>
        </div>

        <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-semibold self-start sm:self-auto">
          <span className="text-muted-foreground">Configured:</span>
          <span className="text-primary font-bold">{stages.length} / 5 Stages</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm">Loading Fun Zone stage configurations...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {STAGES_CONFIG.map((config) => {
            const stageData = getStageData(config.stage);
            const isCurrentUploading = uploadingStage === config.stage;
            const isCurrentDeleting = deletingStage === config.stage;
            const inputId = `fun-stage-upload-${config.stage}`;

            return (
              <div
                key={config.stage}
                className={cn(
                  "relative flex flex-col justify-between rounded-3xl p-5 border bg-gradient-to-b transition-all duration-300 shadow-lg backdrop-blur-xl",
                  config.color,
                  stageData
                    ? "border-white/20 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
                    : "border-dashed border-white/10"
                )}
              >
                {/* Stage Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                      STAGE {config.stage}
                    </span>
                    {stageData ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="size-3" /> Set
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/80 text-muted-foreground">
                        Not Set
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-foreground leading-tight">
                    {config.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 min-h-[32px] line-clamp-2">
                    {config.description}
                  </p>
                </div>

                {/* Stage Preview / Upload Zone */}
                <div className="my-4 flex flex-col items-center justify-center">
                  {stageData ? (
                    <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden glass border border-white/20 shadow-inner group">
                      <img
                        src={stageData.url}
                        alt={config.title}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Quick delete button overlay */}
                      <button
                        onClick={() => handleDeleteStage(config.stage, config.title)}
                        disabled={isCurrentDeleting || isCurrentUploading}
                        title="Delete image from DB"
                        className="absolute top-2.5 right-2.5 size-7 rounded-full bg-destructive/85 text-white flex items-center justify-center shadow-lg hover:bg-destructive transition-all opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-110 disabled:opacity-50"
                      >
                        {isCurrentDeleting ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                      </button>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 pointer-events-none">
                        <p className="text-[11px] font-medium text-white truncate">
                          {stageData.filename}
                        </p>
                        <p className="text-[10px] text-white/70">
                          {(stageData.fileSize / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/5] rounded-2xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center text-center p-4 bg-black/20">
                      <ImageIcon className="size-10 text-muted-foreground/40 mb-2" />
                      <span className="text-xs font-medium text-muted-foreground">
                        No image uploaded
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 mt-0.5">
                        JPG, PNG, WebP up to 10MB
                      </span>
                    </div>
                  )}
                </div>

                {/* Upload / Replace & Delete Action Buttons */}
                <div>
                  <input
                    type="file"
                    id={inputId}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    disabled={isCurrentUploading || isCurrentDeleting}
                    onChange={(e) => handleStageFileUpload(config.stage, e)}
                  />

                  {stageData ? (
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={inputId}
                        className={cn(
                          "flex-1 glass hover:bg-white/15 text-foreground py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-white/15 hover:scale-[1.02] active:scale-[0.98]",
                          (isCurrentUploading || isCurrentDeleting) && "opacity-60 cursor-not-allowed pointer-events-none"
                        )}
                      >
                        {isCurrentUploading ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin text-primary" />
                            <span>Replacing...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="size-3.5 text-primary" />
                            <span>Replace</span>
                          </>
                        )}
                      </label>

                      <button
                        onClick={() => handleDeleteStage(config.stage, config.title)}
                        disabled={isCurrentDeleting || isCurrentUploading}
                        title={`Delete ${config.title} from MongoDB storage`}
                        className={cn(
                          "glass hover:bg-destructive/20 text-destructive border border-destructive/30 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]",
                          (isCurrentDeleting || isCurrentUploading) && "opacity-60 cursor-not-allowed"
                        )}
                      >
                        {isCurrentDeleting ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor={inputId}
                      className={cn(
                        "w-full btn-love py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]",
                        isCurrentUploading && "opacity-60 cursor-not-allowed"
                      )}
                    >
                      {isCurrentUploading ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin text-white" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="size-3.5" />
                          <span>Upload Image</span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


