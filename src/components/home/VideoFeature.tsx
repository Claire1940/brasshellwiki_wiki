"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

/**
 * 视频区块：IntersectionObserver 监测视频区域进入视口后自动加载
 * autoplay=1&mute=1&loop=1 的 iframe；进入视口前显示缩略图 + 播放按钮，
 * 点击播放按钮作为自动播放的后备手段。始终保留 Watch on YouTube 入口。
 */
export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inViewport, setInViewport] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // 环境不支持时直接进入视口态，保证视频可用
      setInViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInViewport(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shouldEmbed = inViewport || clicked;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const thumbSrc = thumbFailed
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`;

  return (
    <div className="space-y-4" ref={containerRef}>
      <div
        className="relative w-full overflow-hidden rounded-lg border border-border bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {shouldEmbed ? (
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={thumbSrc}
              alt={title}
              onError={() => setThumbFailed(true)}
              className="absolute top-0 left-0 h-full w-full object-cover"
              loading="lazy"
            />
            <button
              type="button"
              onClick={() => setClicked(true)}
              aria-label={`Play video: ${title}`}
              className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/10"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] shadow-lg shadow-black/40 transition-transform hover:scale-105 md:h-20 md:w-20">
                <Play className="ml-1 h-8 w-8 text-white md:h-10 md:w-10" />
              </span>
            </button>
          </>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
