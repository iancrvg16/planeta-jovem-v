export type VideoAccessibility =
  | { status: 'pending' }
  | {
      status: 'reviewed'
      evidenceId: string
      captions: { src: string; language: string; label: string }[]
      transcript?: { text: string; language: string; label: string }
    }

// Only reviewed material belongs here. Drafts remain outside the public build.
// A review decision needs a non-personal reference, never a private document.
export const mediaAccessibility: Record<string, VideoAccessibility> = {}
