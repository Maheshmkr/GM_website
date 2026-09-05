/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  Mail,
  ShieldCheck,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { parseDuration } from "@/components/music/MusicProvider";
import { readJsonResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Tab = "photos" | "videos" | "songs" | "timeline" | "letters" | "fun" | "users";

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

  const { data: letters = [], isLoading: loadingLetters } = useQuery({
    queryKey: ["letters"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/letters");
        const payload = await readJsonResponse(res);
        if (!payload.ok) return [];
        return Array.isArray(payload.data) ? payload.data : [];
      } catch (err) {
        console.error("Error fetching letters:", err);
        return [];
      }
    },
  });

  return (
    <section className="section-shell py-10 lg:py-16 min-h-screen">
      <SectionHeading
        title="Admin Management Dashboard"
        subtitle="Manage the memories, songs, videos, letters, and journey timeline stored in MongoDB."
      />

      {/* Tabs */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {(
          [
            { id: "photos", label: "Photos", icon: Camera },
            { id: "videos", label: "Videos", icon: Film },
            { id: "songs", label: "Songs", icon: Music },
            { id: "timeline", label: "Timeline", icon: Calendar },
            { id: "letters", label: "Letters 💌", icon: Mail },
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
        {activeTab === "letters" && (
          <LettersManager
            letters={letters}
            isLoading={loadingLetters}
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

  // Spotify Modal & Form State
  const [isSpotifyModalOpen, setIsSpotifyModalOpen] = useState(false);
  const [editingSpotifyId, setEditingSpotifyId] = useState<string | null>(null);
  const [editingSongSource, setEditingSongSource] = useState<string>("spotify");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [spotifyTitle, setSpotifyTitle] = useState("");
  const [spotifyArtist, setSpotifyArtist] = useState("");
  const [spotifyStartTime, setSpotifyStartTime] = useState("0:00");
  const [spotifyEndTime, setSpotifyEndTime] = useState("");
  const [spotifyDate, setSpotifyDate] = useState(new Date().toISOString().split("T")[0]);
  const [savingSpotify, setSavingSpotify] = useState(false);

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
    formData.append("startTime", "0:00");
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

  // Open Modal for Add Spotify
  const handleOpenAddSpotify = () => {
    setEditingSpotifyId(null);
    setEditingSongSource("spotify");
    setSpotifyUrl("");
    setSpotifyTitle("");
    setSpotifyArtist("");
    setSpotifyStartTime("0:00");
    setSpotifyEndTime("");
    setSpotifyDate(new Date().toISOString().split("T")[0]);
    setIsSpotifyModalOpen(true);
  };

  // Open Modal for Edit (Any Song)
  const handleOpenEditSong = (song: any) => {
    setEditingSpotifyId(song._id);
    setEditingSongSource(song.source || (song.fileId ? "upload" : "spotify"));
    setSpotifyUrl(song.url || "");
    setSpotifyTitle(song.title || "");
    setSpotifyArtist(song.artist || "");
    setSpotifyStartTime(song.startTime || "0:00");
    setSpotifyEndTime(song.endTime || "");
    setSpotifyDate(song.memoryDate || new Date().toISOString().split("T")[0]);
    setIsSpotifyModalOpen(true);
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

  // Save Song (Create Spotify or Edit Any Song)
  const handleSaveSpotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSongSource === "spotify" && !editingSpotifyId && !spotifyUrl.trim()) {
      toast.error("Please paste a Spotify URL");
      return;
    }
    if (!spotifyTitle.trim() || !spotifyArtist.trim()) {
      toast.error("Song Title and Artist are required");
      return;
    }
    if (!spotifyStartTime.trim()) {
      toast.error("Start playing time is required (e.g. 0:00 or 4:28)");
      return;
    }

    setSavingSpotify(true);
    try {
      if (editingSpotifyId) {
        // Edit existing song
        const payload: any = {
          title: spotifyTitle,
          artist: spotifyArtist,
          memoryDate: spotifyDate,
          startTime: spotifyStartTime,
          endTime: spotifyEndTime || undefined,
        };
        if (spotifyUrl.trim()) {
          payload.url = spotifyUrl.trim();
        }

        const res = await fetch(`/api/media/edit/${editingSpotifyId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to update song");
        }

        toast.success("Song updated successfully!");
      } else {
        // Create new Spotify song
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
            startTime: spotifyStartTime,
            endTime: spotifyEndTime || undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to add Spotify song");
        }

        toast.success("Spotify song added successfully!");
      }

      setIsSpotifyModalOpen(false);
      setEditingSpotifyId(null);
      setSpotifyUrl("");
      setSpotifyTitle("");
      setSpotifyArtist("");
      setSpotifyStartTime("0:00");
      setSpotifyEndTime("");
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save Spotify song");
    } finally {
      setSavingSpotify(false);
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

        {/* 1. Spotify Direct Action Button & Card */}
        <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-semibold text-emerald-400 flex items-center gap-2">
              <ExternalLink className="size-5" /> Spotify Music Link
            </h4>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Featured
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
            Link any song from Spotify with custom start and stop timestamps (e.g. 4:28).
          </p>

          <button
            type="button"
            onClick={handleOpenAddSpotify}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer active:scale-98"
          >
            <Music4 className="size-4" /> ♫ Add Spotify Link
          </button>
        </div>

        {/* 2. Upload from Computer */}
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
      <div className="border-t lg:border-t-0 lg:border-l border-border/30 pt-6 lg:pt-0 lg:pl-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Music4 className="size-5 text-primary" /> Saved Music & Tracks
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              All active songs stored in MongoDB database
            </p>
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-secondary/80 border border-border px-3 py-1 rounded-full">
            {safeSongs.length} records
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm gap-2">
            <Loader2 className="size-5 animate-spin text-primary" /> Loading songs...
          </div>
        ) : safeSongs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm bg-surface/20 border border-dashed border-border rounded-2xl p-6">
            No songs found in MongoDB. Use the forms to add songs.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {safeSongs.map((s) => {
              const isSpotify = s.source === "spotify" || (s.url && s.url.includes("spotify.com"));
              const isDrive = s.source === "google-drive" || (s.url && s.url.includes("drive.google.com"));

              const sourceLabel = isSpotify
                ? "Spotify"
                : isDrive
                  ? "Google Drive"
                  : s.source === "upload"
                    ? "Computer Upload"
                    : "External Link";

              const sourceBadgeColor = isSpotify
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : isDrive
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  : "bg-secondary text-foreground/80 border-border/40";

              return (
                <div
                  key={s._id}
                  className={cn(
                    "border rounded-2xl p-4 flex flex-col justify-between relative group transition-all duration-200",
                    isSpotify
                      ? "bg-emerald-500/5 border-emerald-500/25 hover:border-emerald-500/50 shadow-sm"
                      : "bg-surface/30 border-border hover:border-border/80"
                  )}
                >
                  <div className="flex gap-3.5 items-start">
                    {s.coverFileId ? (
                      <div className="size-16 shrink-0 rounded-xl overflow-hidden border border-border bg-black/20">
                        <img
                          src={`/api/media/${s.coverFileId}`}
                          alt={s.title}
                          className="size-full object-cover object-center"
                        />
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "size-14 rounded-xl border flex items-center justify-center shrink-0",
                          isSpotify
                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                            : "bg-secondary border-border text-primary"
                        )}
                      >
                        <Music4 className="size-6" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm truncate text-foreground flex items-center gap-1.5">
                        {isSpotify ? `♫ ${s.title}` : s.title}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">by {s.artist}</p>

                      {isSpotify && (
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          <span className="text-emerald-400 font-medium">Starts at: {s.startTime || "0:00"}</span>
                          {s.endTime && (
                            <span className="text-emerald-400/80 font-medium"> • Ends at: {s.endTime}</span>
                          )}
                        </div>
                      )}

                      {s.memoryDate && (
                        <p className="text-[10px] text-muted-foreground/80 font-medium mt-1">
                          📅 {s.memoryDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between gap-2">
                    <span className={cn("text-[10px] px-2.5 py-0.5 rounded-full font-medium border", sourceBadgeColor)}>
                      {sourceLabel}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isSpotify && s.url ? (
                        (() => {
                          const startSec =
                            typeof s.startSeconds === "number" && s.startSeconds > 0
                              ? s.startSeconds
                              : s.startTime
                                ? parseDuration(s.startTime)
                                : 0;
                          const spotifyLink =
                            startSec > 0
                              ? `${s.url}${s.url.includes("?") ? "&" : "?"}t=${startSec}`
                              : s.url;
                          return (
                            <a
                              href={spotifyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2.5 py-1 transition-colors"
                              title="Open in Spotify"
                            >
                              Open in Spotify <ExternalLink className="size-3" />
                            </a>
                          );
                        })()
                      ) : (
                        <a
                          href={s.source === "upload" ? `/api/media/file/${s.fileId}` : s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full px-2.5 py-1 transition-colors"
                          title="Listen / Preview Audio"
                        >
                          <Play className="size-3" /> Listen
                        </a>
                      )}

                      <button
                        onClick={() => handleOpenEditSong(s)}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors cursor-pointer"
                        title="Edit Song"
                      >
                        <Edit2 className="size-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${s.title}"?`)) {
                            deleteMutation.mutate(s._id);
                          }
                        }}
                        className="p-1.5 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Song Add / Edit Modal */}
      {isSpotifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-surface border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Music4 className="size-5 text-emerald-400" />
                {editingSpotifyId
                  ? editingSongSource === "upload"
                    ? "Edit Uploaded Song"
                    : "Edit Spotify Song"
                  : "Add Spotify Link"}
              </h3>
              <button
                type="button"
                onClick={() => setIsSpotifyModalOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSpotify} className="space-y-4">
              {editingSongSource === "spotify" && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Spotify URL <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Paste Spotify song link (e.g. https://open.spotify.com/track/3lxEwB58zfc7BJcf0RZICP)"
                    value={spotifyUrl}
                    onChange={(e) => handleSpotifyUrlChange(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
                    required={!editingSpotifyId}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    💡 Spotify controls external playback behavior. For exact timestamp playback on this site, you can also upload the audio file directly.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Song Title <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paal Pappali"
                    value={spotifyTitle}
                    onChange={(e) => setSpotifyTitle(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Artist <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Anirudh Ravichander"
                    value={spotifyArtist}
                    onChange={(e) => setSpotifyArtist(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Timestamp Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Start playing at <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4:28 or 0:00"
                    value={spotifyStartTime}
                    onChange={(e) => setSpotifyStartTime(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-surface/90 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                    Example: 4:28 means the song starts at 4 minutes 28 seconds.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Stop playing at <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5:49"
                    value={spotifyEndTime}
                    onChange={(e) => setSpotifyEndTime(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-surface/90 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                    Leave empty to play until the song ends.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Memory Date
                </label>
                <input
                  type="date"
                  value={spotifyDate}
                  onChange={(e) => setSpotifyDate(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setIsSpotifyModalOpen(false)}
                  className="w-full sm:w-1/3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full py-3 text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSpotify}
                  className="w-full sm:w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingSpotify ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Song"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  // --- Normal User Creation State ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

  // --- Admin Profile & Credentials State ---
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmAdminPassword, setConfirmAdminPassword] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [updatingAdmin, setUpdatingAdmin] = useState(false);

  // Query users list
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      const payload = await readJsonResponse(res);
      if (!payload.ok) throw new Error(payload.error || "Failed to fetch users");
      return payload.data ?? [];
    },
  });

  // Query current admin profile
  const { data: adminProfile } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: async () => {
      const res = await fetch("/api/auth/admin");
      const payload = await readJsonResponse(res);
      if (payload.ok && payload.data) {
        return payload.data;
      }
      return { username: "admin" };
    },
  });

  // Sync admin username when admin profile loads
  useEffect(() => {
    if (adminProfile?.username && !adminUsername) {
      setAdminUsername(adminProfile.username);
    }
  }, [adminProfile]);

  // Create Standard User Mutation
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

  // Update Admin Credentials Mutation
  const updateAdminMutation = useMutation({
    mutationFn: async (payload: { username: string; newPassword?: string }) => {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await readJsonResponse(res);
      if (!data.ok) throw new Error(data.error || "Failed to update admin credentials");
      return data;
    },
    onSuccess: (data: any) => {
      toast.success(data?.data?.message || data?.message || "Admin credentials updated successfully!");
      setAdminPassword("");
      setConfirmAdminPassword("");
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["auth-session"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Error updating admin credentials");
    },
  });

  // Delete User Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const payload = await readJsonResponse(res);
      if (!payload.ok) throw new Error(payload.error || "Delete user failed");
      return payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
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
    } catch {
      // Handled by mutation onError
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = (adminUsername || adminProfile?.username || "admin").trim();
    if (!cleanUser) {
      toast.error("Admin username is required");
      return;
    }
    if (adminPassword) {
      if (adminPassword.length < 6) {
        toast.error("New password must be at least 6 characters");
        return;
      }
      if (adminPassword !== confirmAdminPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    setUpdatingAdmin(true);
    try {
      await updateAdminMutation.mutateAsync({
        username: cleanUser,
        newPassword: adminPassword || undefined,
      });
    } catch {
      // Handled by mutation onError
    } finally {
      setUpdatingAdmin(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1.4fr]">
      {/* Forms Column */}
      <div className="space-y-8">
        {/* 1. Admin Security & Credentials Form */}
        <div className="bg-surface/40 border border-primary/20 rounded-3xl p-6 shadow-sm relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold flex items-center gap-2 text-foreground">
              <ShieldCheck className="size-5 text-primary" />
              Admin Credentials & Security
            </h3>
            <span className="text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <KeyRound className="size-3" /> Master Admin
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
            Change your administrator login username and password. This will update the primary admin credentials for logging into the admin dashboard.
          </p>

          <form onSubmit={handleUpdateAdmin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Admin Username
              </label>
              <input
                type="text"
                placeholder="e.g. admin or custom username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                New Admin Password <span className="text-[10px] font-normal text-muted-foreground">(leave blank to keep current)</span>
              </label>
              <div className="relative">
                <input
                  type={showAdminPass ? "text" : "password"}
                  placeholder="Enter new password (min 6 chars)..."
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full text-sm bg-surface/80 border border-border/80 rounded-xl p-3 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showAdminPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {adminPassword ? (
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Confirm New Admin Password
                </label>
                <input
                  type={showAdminPass ? "text" : "password"}
                  placeholder="Re-enter new password..."
                  value={confirmAdminPassword}
                  onChange={(e) => setConfirmAdminPassword(e.target.value)}
                  className="w-full text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            ) : null}

            <button
              type="submit"
              disabled={updatingAdmin}
              className="w-full btn-love rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
            >
              {updatingAdmin ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Saving Admin Changes...
                </>
              ) : (
                <>
                  <Lock className="size-4" /> Save Admin Credentials
                </>
              )}
            </button>
          </form>
        </div>

        {/* 2. Create Standard User Form */}
        <div className="bg-surface/30 border border-border/60 rounded-3xl p-6 backdrop-blur-md">
          <h3 className="text-base font-semibold flex items-center gap-2 mb-2 text-foreground">
            <Plus className="size-5 text-primary" /> Create Standard User Account
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            Create standard viewer accounts with restricted permissions for visitors.
          </p>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Username</label>
              <input
                type="text"
                placeholder="e.g. lovebird"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Enter account password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {creating ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Creating Account...
                </>
              ) : (
                "Create Standard User"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Accounts Directory Column */}
      <div className="border-t lg:border-t-0 lg:border-l border-border/40 pt-6 lg:pt-0 lg:pl-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="size-5 text-primary" /> Registered Accounts
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Overview of all active administrator and user accounts
            </p>
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-secondary/80 border border-border px-3 py-1 rounded-full">
            {users.length} accounts
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm gap-2">
            <Loader2 className="size-5 animate-spin text-primary" /> Loading user accounts...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm bg-surface/20 border border-dashed border-border rounded-2xl p-6">
            No database user accounts found. Use the forms to create accounts.
          </div>
        ) : (
          <div className="grid gap-4">
            {users.map((u: any) => {
              const isAdmin = u.role === "admin";
              return (
                <div
                  key={u._id}
                  className={cn(
                    "border rounded-2xl p-4 flex justify-between items-center relative group transition-all duration-200",
                    isAdmin
                      ? "bg-primary/5 border-primary/30 hover:border-primary/50 shadow-sm"
                      : "bg-surface/30 border-border hover:border-border/80"
                  )}
                >
                  <div className="min-w-0 flex items-center gap-3.5">
                    <div
                      className={cn(
                        "size-10 rounded-xl flex items-center justify-center shrink-0",
                        isAdmin
                          ? "bg-primary/15 text-primary"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {isAdmin ? <Shield className="size-5" /> : <Users className="size-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm truncate text-foreground">
                          {u.username}
                        </h4>
                        <span
                          className={cn(
                            "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border",
                            isAdmin
                              ? "bg-primary/15 text-primary border-primary/30"
                              : "bg-secondary text-muted-foreground border-border"
                          )}
                        >
                          {u.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Created: {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete account "${u.username}"?`)) {
                          deleteMutation.mutate(u._id);
                        }
                      }}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                      title="Delete Account"
                    >
                      <Trash2 className="size-4" />
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

/* ==========================================
   LETTERS MANAGER COMPONENT
   ========================================== */
interface LetterItem {
  _id?: string;
  title: string;
  preview: string;
  body: string;
  date: string;
  category?: string;
  favorite?: boolean;
  createdAt?: string;
}

function LettersManager({
  letters,
  isLoading,
  queryClient,
}: {
  letters: LetterItem[];
  isLoading: boolean;
  queryClient: any;
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingLetter, setEditingLetter] = useState<LetterItem | null>(null);
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Love");
  const [favorite, setFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [readingLetter, setReadingLetter] = useState<LetterItem | null>(null);

  const openAddModal = () => {
    setEditingLetter(null);
    setTitle("");
    setPreview("");
    setBody("");
    setDate(
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
    setCategory("Love");
    setFavorite(false);
    setShowModal(true);
  };

  const openEditModal = (letter: LetterItem) => {
    setEditingLetter(letter);
    setTitle(letter.title);
    setPreview(letter.preview);
    setBody(letter.body);
    setDate(letter.date);
    setCategory(letter.category || "Love");
    setFavorite(!!letter.favorite);
    setShowModal(true);
  };

  const handleSaveLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !preview.trim() || !body.trim()) {
      toast.error("Please fill in the title, preview teaser, and letter body.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingLetter && editingLetter._id) {
        // Update existing letter
        const res = await fetch(`/api/letters/${editingLetter._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            preview: preview.trim(),
            body: body.trim(),
            date: date.trim() || "Forever",
            category: category.trim() || "Love",
            favorite,
          }),
        });
        const payload = await readJsonResponse(res);
        if (!payload.ok) throw new Error(payload.error || "Failed to update letter");
        toast.success("Letter updated with love 💌");
      } else {
        // Create new letter
        const res = await fetch("/api/letters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            preview: preview.trim(),
            body: body.trim(),
            date: date.trim() || "Forever",
            category: category.trim() || "Love",
            favorite,
          }),
        });
        const payload = await readJsonResponse(res);
        if (!payload.ok) throw new Error(payload.error || "Failed to save letter");
        toast.success("New love letter created 💖");
      }

      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["letters"] });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong saving the letter.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLetter = async (letter: LetterItem) => {
    if (!letter._id) {
      toast.info("Static sample letters are preserved in site data.");
      return;
    }

    if (!confirm(`Are you sure you want to delete the letter "${letter.title}"?`)) {
      return;
    }

    setDeletingId(letter._id);
    try {
      const res = await fetch(`/api/letters/${letter._id}`, {
        method: "DELETE",
      });
      const payload = await readJsonResponse(res);
      if (!payload.ok) throw new Error(payload.error || "Failed to delete letter");
      toast.success("Letter deleted from database.");
      queryClient.invalidateQueries({ queryKey: ["letters"] });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete letter.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <Mail className="size-5 text-primary" /> Love Letters & Open-When Notes
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Write heartfelt words, open-when notes, and sweet messages for your special one.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-love px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
        >
          <Plus className="size-4" />
          <span>Write New Letter</span>
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          <span className="text-sm">Loading heartfelt letters...</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && letters.length === 0 && (
        <div className="text-center py-16 glass rounded-3xl border border-white/10 space-y-4">
          <div className="size-14 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto">
            <Mail className="size-7" />
          </div>
          <h3 className="font-semibold text-lg">No Letters Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Write your very first letter to fill this space with your loving memories.
          </p>
          <button
            onClick={openAddModal}
            className="btn-love px-5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="size-4" /> Write First Letter
          </button>
        </div>
      )}

      {/* Grid of Letters */}
      {!isLoading && letters.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {letters.map((letter, idx) => (
            <div
              key={letter._id || `letter-${idx}`}
              className="glass glass-hover rounded-3xl p-6 flex flex-col justify-between border border-border relative group shadow-sm hover:shadow-xl transition-all"
            >
              {/* Top row: Icon, Category badge, Favorite indicator */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="grid size-10 place-items-center rounded-2xl bg-[var(--gradient-love)] text-primary-foreground shadow-md">
                    <Mail className="size-4" />
                  </span>

                  <div className="flex items-center gap-1.5">
                    {letter.favorite && (
                      <span className="size-7 rounded-full bg-primary/15 text-primary grid place-items-center">
                        <Heart className="size-3.5 fill-current" />
                      </span>
                    )}
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-surface/50 border border-border text-muted-foreground">
                      {letter.category || "Love"}
                    </span>
                  </div>
                </div>

                <h3 className="mt-4 text-base font-bold text-foreground leading-snug line-clamp-1">
                  {letter.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {letter.preview}
                </p>
              </div>

              {/* Bottom row: Date & Action buttons */}
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-medium">
                  {letter.date}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setReadingLetter(letter)}
                    className="glass hover:bg-primary/20 text-primary size-8 rounded-full grid place-items-center cursor-pointer transition-all hover:scale-105"
                    title="Read Letter"
                  >
                    <ExternalLink className="size-3.5" />
                  </button>

                  <button
                    onClick={() => openEditModal(letter)}
                    className="glass hover:bg-white/20 size-8 rounded-full grid place-items-center text-foreground cursor-pointer transition-all hover:scale-105"
                    title="Edit Letter"
                  >
                    <Edit2 className="size-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteLetter(letter)}
                    disabled={deletingId === letter._id}
                    className="glass hover:bg-destructive/20 text-destructive size-8 rounded-full grid place-items-center cursor-pointer transition-all hover:scale-105 disabled:opacity-50"
                    title="Delete Letter"
                  >
                    {deletingId === letter._id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Write / Edit Letter */}
      {showModal && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-background/90 p-4 backdrop-blur-xl animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass animate-letter-open relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 sm:p-8 border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="size-8 rounded-xl bg-[var(--gradient-love)] text-primary-foreground grid place-items-center">
                  <Mail className="size-4" />
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {editingLetter ? "Edit Love Letter" : "Write New Love Letter"}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="glass size-8 rounded-full grid place-items-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLetter} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Letter Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Open When You Miss Me"
                  className="w-full px-4 py-2.5 text-sm bg-surface/40 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Preview Teaser *
                </label>
                <input
                  type="text"
                  value={preview}
                  onChange={(e) => setPreview(e.target.value)}
                  placeholder="e.g. Just close your eyes for a second and take a breath..."
                  className="w-full px-4 py-2.5 text-sm bg-surface/40 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Full Letter Body *
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your long, sweet message here. Separate paragraphs with double newlines..."
                  rows={6}
                  className="w-full px-4 py-2.5 text-sm bg-surface/40 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Date Display
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. May 12, 2024"
                    className="w-full px-4 py-2.5 text-sm bg-surface/40 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Love, Open When..."
                    className="w-full px-4 py-2.5 text-sm bg-surface/40 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="letter-favorite"
                  checked={favorite}
                  onChange={(e) => setFavorite(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
                <label
                  htmlFor="letter-favorite"
                  className="text-xs font-medium text-foreground cursor-pointer flex items-center gap-1.5"
                >
                  <Heart className="size-3.5 text-primary fill-primary/30" /> Mark as Highlight / Favorite
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="glass px-4 py-2.5 rounded-2xl text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-love px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Heart className="size-3.5 fill-current" /> Save Letter
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Read Full Letter */}
      {readingLetter && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-background/90 p-4 backdrop-blur-xl animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setReadingLetter(null)}
        >
          <div
            className="glass animate-letter-open relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl p-7 sm:p-9 border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold">
              {readingLetter.category || "Words from my heart"}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-foreground">
              {readingLetter.title}
            </h3>

            <div className="relative mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {readingLetter.body.split("\n\n").map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span>{readingLetter.date}</span>
              <span className="text-primary font-semibold">Always yours ♡</span>
            </div>

            <button
              onClick={() => setReadingLetter(null)}
              className="glass absolute right-4 top-4 size-9 rounded-full grid place-items-center text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


