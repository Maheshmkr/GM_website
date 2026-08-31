/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  X,
  Loader2,
  Camera,
  Trash2,
  Link as LinkIcon,
  Edit3,
  Save,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { photoCategories, type Photo } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { readJsonResponse, uploadMediaInChunks } from "@/lib/api";
import { cn } from "@/lib/utils";

export function PhotoGallery() {
  const [filter, setFilter] = useState<(typeof photoCategories)[number]>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Uploader state
  const [showUploader, setShowUploader] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Favorites");
  const [favorite, setFavorite] = useState(false);
  const [memoryDate, setMemoryDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "failed">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // URL Modal state
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [urlTitle, setUrlTitle] = useState("");
  const [urlCategory, setUrlCategory] = useState("Favorites");
  const [urlDate, setUrlDate] = useState(new Date().toISOString().split("T")[0]);
  const [urlStatus, setUrlStatus] = useState<
    "idle" | "previewing" | "saving" | "success" | "failed"
  >("idle");

  // Inline Date Editor state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDateValue, setEditDateValue] = useState("");

  const queryClient = useQueryClient();

  const { data: serverPhotos = [], isLoading } = useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      const res = await fetch("/api/media?type=image");
      const payload = await readJsonResponse(res);
      if (!payload.ok) throw new Error(payload.error || "Failed to fetch photos");
      return payload.data ?? [];
    },
  });

  const mappedPhotos = useMemo<any[]>(() => {
    return serverPhotos.map((p: any) => {
      const displayDate = p.memoryDate || p.createdAt || new Date().toISOString();
      return {
        _id: p._id,
        image: p.source === "url" ? p.url : `/api/media/file/${p.fileId}`,
        category: p.category || "Special",
        caption: p.title || p.description || "",
        date: displayDate
          ? new Date(displayDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "",
        rawDate: displayDate.split("T")[0],
        favorite: p.favorite || false,
      };
    });
  }, [serverPhotos]);

  useEffect(() => {
    if (mappedPhotos.length > 0) {
      setFavorites((prev) => {
        const nextFavs = { ...prev };
        mappedPhotos.forEach((p) => {
          if (p.favorite && nextFavs[p.caption] === undefined) {
            nextFavs[p.caption] = true;
          }
        });
        return nextFavs;
      });
    }
  }, [mappedPhotos]);

  const list = useMemo<any[]>(() => {
    if (filter === "All") return mappedPhotos;
    if (filter === "Favorites") return mappedPhotos.filter((p) => favorites[p.caption]);
    return mappedPhotos.filter((p) => p.category === filter);
  }, [filter, mappedPhotos, favorites]);

  const active = openIndex === null ? null : list[openIndex];

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

    try {
      await uploadMediaInChunks({
        file,
        type: "image",
        title,
        description: "",
        category,
        favorite,
        memoryDate,
      });

      setStatus("success");
      toast.success("Image uploaded successfully!");
      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setTitle("");
      setCategory("Favorites");
      setFavorite(false);
      setMemoryDate(new Date().toISOString().split("T")[0]);
      setShowUploader(false);

      queryClient.invalidateQueries({ queryKey: ["photos"] });
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
          url: inputUrl,
          type: "image",
          category: urlCategory,
          memoryDate: urlDate,
        }),
      });

      const payload = await readJsonResponse(res);
      if (!payload.ok) throw new Error(payload.error || "Failed to add URL image");

      setUrlStatus("success");
      toast.success("Image URL added successfully!");

      // Reset form
      setInputUrl("");
      setUrlTitle("");
      setUrlCategory("Favorites");
      setUrlDate(new Date().toISOString().split("T")[0]);
      setShowUrlModal(false);

      queryClient.invalidateQueries({ queryKey: ["photos"] });
    } catch (err: any) {
      console.error(err);
      setUrlStatus("failed");
      setErrorMsg(err.message);
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (p: any) => {
    if (confirm("Are you sure you want to delete this memory?")) {
      try {
        const res = await fetch(`/api/media/${p._id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
        toast.success("Memory deleted");
        queryClient.invalidateQueries({ queryKey: ["photos"] });
      } catch (err: any) {
        toast.error(`Delete failed: ${err.message}`);
      }
    }
  };

  const handleEditDate = (p: any) => {
    setEditingId(p._id);
    setEditDateValue(p.rawDate);
  };

  const handleSaveDate = async (id: string) => {
    try {
      const res = await fetch(`/api/media/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memoryDate: editDateValue }),
      });
      if (!res.ok) throw new Error("Failed to save date");
      toast.success("Memory date updated");
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const isImgUrl = (url: string) => {
    const cleanUrl = url.toLowerCase().split(/[?#]/)[0];
    return /\.(jpeg|jpg|gif|png|webp)$/.test(cleanUrl) || cleanUrl.startsWith("http");
  };

  return (
    <>
      <div className="mt-10 flex flex-wrap justify-center gap-2 items-center">
        {photoCategories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition-all",
              filter === c
                ? "btn-love font-semibold"
                : "glass text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}

      </div>

      {/* Grid figure display */}
      <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {list.map((p, i) => (
          <Reveal key={p._id + i} delay={(i % 6) * 70}>
            <figure className="group relative break-inside-avoid overflow-hidden rounded-3xl border border-border">
              <button
                onClick={() => setOpenIndex(i)}
                className="block w-full text-left"
                aria-label={`Open ${p.caption}`}
              >
                <img
                  src={p.image}
                  alt={p.caption}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

                <figcaption className="absolute inset-x-0 bottom-0 p-5 pr-14">
                  <p className="text-sm font-semibold truncate">{p.caption}</p>

                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground">{p.date}</p>
                  </div>
                </figcaption>
              </button>

              <button
                onClick={() => setFavorites((f) => ({ ...f, [p.caption]: !f[p.caption] }))}
                aria-label="Favorite photo"
                className="glass absolute right-4 top-4 grid size-9 place-items-center rounded-full pointer-events-auto"
              >
                <Heart
                  className={cn("size-4", favorites[p.caption] && "text-primary")}
                  fill={favorites[p.caption] ? "currentColor" : "none"}
                />
              </button>
            </figure>
          </Reveal>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center mt-14 text-sm text-muted-foreground gap-2">
          <Loader2 className="size-4 animate-spin text-primary" /> Loading memories...
        </div>
      ) : list.length === 0 ? (
        <p className="mt-14 text-center text-sm text-muted-foreground">
          Nothing here yet — but more memories are coming.
        </p>
      ) : null}

      {active && openIndex !== null && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-background/90 p-4 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="animate-letter-open relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={active.image}
              alt={active.caption}
              className="max-h-[72vh] w-full rounded-3xl object-contain mx-auto"
            />
            <div className="mt-4 text-center">
              <p className="text-base font-semibold">{active.caption}</p>
              <p className="text-sm text-muted-foreground">{active.date}</p>
            </div>
            <button
              onClick={() => setOpenIndex(null)}
              aria-label="Close"
              className="glass absolute -top-2 right-0 grid size-10 place-items-center rounded-full sm:-right-2 cursor-pointer"
            >
              <X className="size-4" />
            </button>
            <button
              onClick={() => setOpenIndex((i) => ((i ?? 0) - 1 + list.length) % list.length)}
              aria-label="Previous photo"
              className="glass absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full cursor-pointer"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => setOpenIndex((i) => ((i ?? 0) + 1) % list.length)}
              aria-label="Next photo"
              className="glass absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full cursor-pointer"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
