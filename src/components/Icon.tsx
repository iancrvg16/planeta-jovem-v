export type IconName =
  | 'arrow'
  | 'external'
  | 'planet'
  | 'orbit'
  | 'rocket'
  | 'bolt'
  | 'flag'
  | 'compass'
  | 'spark'
  | 'book'
  | 'file'
  | 'image'
  | 'video'
  | 'search'
  | 'close'
  | 'menu'
  | 'chevron'
  | 'back'
  | 'up'
  | 'link'
  | 'check'
  | 'signal'
  | 'clock'
  | 'sun'
  | 'wave'
  | 'mountain'
  | 'play'
  | 'heart'
  | 'download'
  | 'zoom'
const paths: Record<IconName, React.ReactNode> = {
  sun: (
    <path d="m12 2 2 6 5-3-3 5 6 2-6 2 3 5-5-3-2 6-2-6-5 3 3-5-6-2 6-2-3-5 5 3z" />
  ),
  wave: (
    <>
      <path d="M2 16c3-4 5 4 9 0s6 4 11 0M2 21c3-4 5 4 9 0s6 4 11 0M3 11c3-8 12-9 15-3-4-2-5 2-2 4" />
      <path d="m18 2 .6 1.5L20 4l-1.4.5L18 6l-.6-1.5L16 4l1.4-.5z" />
    </>
  ),
  mountain: (
    <>
      <path d="m2 20 7-14 8 14H2Zm10-10 3-6 7 16h-5M6 12l3 2 3-2" />
    </>
  ),
  play: <path d="m9 5 11 7-11 7z" />,
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  download: <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />,
  zoom: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="m15 15 6 6M7 10h6m-3-3v6" />
    </>
  ),
  arrow: (
    <>
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </>
  ),
  external: (
    <>
      <path d="M8 5H5v14h14v-3M12 4h8v8M20 4 10 14" />
    </>
  ),
  planet: (
    <>
      <circle cx="12" cy="12" r="7" />
      <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(-30 12 12)" />
    </>
  ),
  orbit: (
    <>
      <circle cx="12" cy="12" r="3" />
      <ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-35 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(55 12 12)" />
    </>
  ),
  rocket: (
    <>
      <path d="M9 15 6 12c2-6 7-9 14-9 0 7-3 12-9 14l-2-2ZM6 12l-3 1 1-6 6-1M11 17l-1 4 6-1 1-6M7 17l-3 3" />
      <circle cx="15" cy="8" r="2" />
    </>
  ),
  bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7z" />,
  flag: (
    <>
      <path d="M5 22V3c5-4 9 4 15 0v12c-6 4-10-4-15 0" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m16 8-2 6-6 2 2-6z" />
    </>
  ),
  spark: (
    <>
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 2v4m-2-2h4" />
    </>
  ),
  book: (
    <>
      <path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-4-2-7-1-10 1Zm0 0v15" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8m-8 4h6" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8" cy="8" r="1.5" />
      <path d="m3 17 6-5 4 3 4-7 4 9" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m10 8 6 4-6 4z" />
    </>
  ),
  search: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="m15 15 6 6" />
    </>
  ),
  close: <path d="m6 6 12 12M6 18 18 6" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  back: <path d="M20 12H4m6-6-6 6 6 6" />,
  up: <path d="M12 20V4m-6 6 6-6 6 6" />,
  link: (
    <>
      <path d="m10 14 4-4m-6 1-3 3a4 4 0 0 0 5 5l3-3m-2-8 3-3a4 4 0 0 1 5 5l-3 3" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  signal: (
    <>
      <path d="M4 18v-3m5 3v-6m5 6V9m5 9V5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" />
    </>
  ),
}
export function Icon({
  name,
  size = 20,
  className = '',
}: {
  name: IconName
  size?: number
  className?: string
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
