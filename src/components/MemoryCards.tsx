/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "@tanstack/react-router";
import { Heart, Image as ImageIcon, Mail, Music, Play, Video } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import {
  letters,
  morePhotosCount,
  photos as staticPhotos,
  songs as staticSongs,
  videos as staticVideos,
} from "@/data/site";
import { useMusic } from "@/components/music/MusicProvider";

export function MemoryCards() {
  const { songs: playlist, play } = useMusic();
  const song = playlist[0] || staticSongs[0]!;

  const { data: serverPhotos = [] } = useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      const res = await fetch("/api/media?type=image");
      if (!res.ok) throw new Error("Failed to fetch photos");
      return res.json();
    },
  });

  const { data: serverVideos = [] } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await fetch("/api/media?type=video");
      if (!res.ok) throw new Error("Failed to fetch videos");
      return res.json();
    },
  });

  const mappedPhotos = useMemo(() => {
    if (serverPhotos.length > 0) {
      return serverPhotos.slice(0, 3).map((p: any) => ({
        image: `/api/media/file/${p.fileId}`,
        caption: p.title,
      }));
    }
    return staticPhotos.slice(0, 3);
  }, [serverPhotos]);

  const mappedVideos = useMemo(() => {
    if (serverVideos.length > 0) {
      return serverVideos.slice(0, 2).map((v: any) => ({
        thumbnail: `/api/media/file/${v.fileId}`,
        title: v.title,
      }));
    }
    return staticVideos.slice(0, 2);
  }, [serverVideos]);

  const totalPhotosCount = serverPhotos.length > 0 ? serverPhotos.length : morePhotosCount;
  const totalVideosCount = serverVideos.length > 0 ? serverVideos.length : staticVideos.length;

  return (
    <section className="section-shell py-16 lg:py-24">
      <SectionHeading
        title="A World Made For You"
        subtitle="Every little memory deserves its own place."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Reveal delay={0}>
          <Link to="/photos" className="glass glass-hover flex h-full flex-col rounded-3xl p-6">
            <CardHead icon={<ImageIcon className="size-5" />} title="Photos">
              Beautiful memories we've created together
            </CardHead>
            <div className="mt-6 flex gap-2">
              {mappedPhotos.map((p) => (
                <img
                  key={p.image + p.caption}
                  src={p.image}
                  alt={p.caption}
                  loading="lazy"
                  className="size-16 flex-1 rounded-xl object-cover"
                />
              ))}
              <span className="grid size-16 flex-1 place-items-center rounded-xl bg-secondary text-xs font-semibold">
                +{totalPhotosCount}
              </span>
            </div>
          </Link>
        </Reveal>

        <Reveal delay={90}>
          <Link to="/videos" className="glass glass-hover flex h-full flex-col rounded-3xl p-6">
            <CardHead icon={<Video className="size-5" />} title="Videos">
              Moments that make my heart skip a beat
            </CardHead>
            <div className="mt-6 flex gap-2">
              {mappedVideos.map((v) => (
                <div key={v.title} className="relative h-16 flex-1 overflow-hidden rounded-xl">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-background/40">
                    <Play className="size-4" fill="currentColor" />
                  </span>
                </div>
              ))}
              <span className="grid h-16 flex-1 place-items-center rounded-xl bg-secondary text-xs font-semibold">
                +{totalVideosCount}
              </span>
            </div>
          </Link>
        </Reveal>

        <Reveal delay={180}>
          <Link to="/songs" className="glass glass-hover flex h-full flex-col rounded-3xl p-6">
            <CardHead icon={<Music className="size-5" />} title="Songs">
              Melodies that remind me of you
            </CardHead>
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-secondary/60 p-3">
              <img
                src={song.cover}
                alt=""
                loading="lazy"
                className="size-11 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{song.title}</p>
                <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  play(0);
                }}
                aria-label={`Play ${song.title}`}
                className="btn-love grid size-9 shrink-0 place-items-center rounded-full"
              >
                <Play className="size-3.5" fill="currentColor" />
              </button>
            </div>
          </Link>
        </Reveal>

        <Reveal delay={270}>
          <Link to="/letters" className="glass glass-hover flex h-full flex-col rounded-3xl p-6">
            <CardHead icon={<Mail className="size-5" />} title="Letters">
              Words I wish I could say every day
            </CardHead>
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-secondary/60 p-4">
              <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">
                {letters[0]!.preview}
              </p>
              <Heart className="size-4 shrink-0 text-primary" />
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function CardHead({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="grid size-11 place-items-center rounded-2xl bg-[var(--gradient-love)] text-primary-foreground shadow-[var(--shadow-glow)]">
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
