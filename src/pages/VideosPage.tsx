import { useEffect, useState } from "react";
import { getUsageVideos } from "@/services/firestore";
import { UsageVideo } from "@/types";
import { PlayCircle } from "lucide-react";

export default function VideosPage() {
  const [videos, setVideos] = useState<UsageVideo[]>([]);

  useEffect(() => {
    getUsageVideos().then(setVideos);
  }, []);

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:v=|\/)([\w-]{11})/);
    return match ? match[1] : null;
  };

  return (
    <div className="px-5 pt-8 pb-4 animate-fade-in">
      <h1 className="text-xl font-bold text-foreground mb-6">사용법</h1>

      <div className="space-y-4">
        {videos.map((video) => {
          const ytId = getYouTubeId(video.videoUrl);
          const thumb = ytId
            ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
            : video.thumbnailUrl;

          return (
            <a
              key={video.id}
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-border overflow-hidden bg-card hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-video bg-muted">
                <img
                  src={thumb}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
                  <PlayCircle className="w-12 h-12 text-primary-foreground drop-shadow-lg" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-foreground text-sm">{video.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{video.description}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
