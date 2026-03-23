interface YoutubeEmbedProps {
  videoId: string;
  title?: string;
}

export function YoutubeEmbed({ videoId, title }: YoutubeEmbedProps) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`}
        width="100%"
        height="480"
        title={title ?? 'YouTube video'}
        loading="lazy"
        className="border-0"
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

