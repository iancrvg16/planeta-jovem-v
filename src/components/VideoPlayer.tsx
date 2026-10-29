import { useId } from 'react'
import type { Media } from '../data/contentTypes'
import {
  mediaAccessibility,
  type VideoAccessibility,
} from '../data/mediaAccessibility'

export function VideoPlayer({
  media,
  title,
  accessibility = mediaAccessibility[media.id],
}: {
  media: Media
  title: string
  accessibility?: VideoAccessibility
}) {
  const transcriptId = useId()
  const reviewed =
    accessibility?.status === 'reviewed' && accessibility.evidenceId.trim()
      ? accessibility
      : undefined
  return (
    <div>
      <video
        key={media.id}
        src={media.src}
        poster={media.poster}
        controls
        playsInline
        preload="none"
        width={media.width}
        height={media.height}
        aria-label={title}
        aria-describedby={reviewed?.transcript ? transcriptId : undefined}
        crossOrigin="anonymous"
      >
        {reviewed?.captions.map((track, index) => (
          <track
            key={`${track.language}-${track.src}`}
            kind="captions"
            src={track.src}
            srcLang={track.language}
            label={track.label}
            default={index === 0}
          />
        ))}
      </video>
      {reviewed?.transcript && (
        <details id={transcriptId} lang={reviewed.transcript.language}>
          <summary>{reviewed.transcript.label}</summary>
          <p style={{ whiteSpace: 'pre-line' }}>{reviewed.transcript.text}</p>
        </details>
      )}
    </div>
  )
}
