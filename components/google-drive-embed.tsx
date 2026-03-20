interface GoogleDriveEmbedProps {
  fileId: string;
  title?: string;
}

export function GoogleDriveEmbed({ fileId, title }: GoogleDriveEmbedProps) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <iframe
        src={`https://drive.google.com/file/d/${fileId}/preview`}
        width="100%"
        height="480"
        allow="autoplay"
        title={title ?? 'Video tutorial'}
        loading="lazy"
        className="border-0"
      />
    </div>
  );
}
