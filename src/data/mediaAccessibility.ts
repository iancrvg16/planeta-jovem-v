export type VideoAccessibility =
  | { status: 'pending' }
  | {
      status: 'reviewed'
      evidenceId: string
      captions: { src: string; language: string; label: string }[]
      transcript?: { text: string; language: string; label: string }
    }

// Only reviewed captions/transcripts belong here. Pending entries record gaps.
// Draft text remains outside the public build.
// A review decision needs a non-personal reference, never a private document.
export const mediaAccessibility: Record<string, VideoAccessibility> = {
  'astalania-video-de-astalania-1d1220c6': { status: 'pending' },
}
