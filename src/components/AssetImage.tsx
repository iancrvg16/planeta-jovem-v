import { useState, type ImgHTMLAttributes } from 'react'
import { Icon } from './Icon'

export function AssetImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [failedSrc, setFailedSrc] = useState<string>()
  if (failedSrc === props.src)
    return (
      <div
        className="image-unavailable"
        role="img"
        aria-label={props.alt || 'Imagem indisponível'}
      >
        <Icon name="image" size={30} />
        <span>Imagem temporariamente indisponível</span>
      </div>
    )
  return <img {...props} onError={() => setFailedSrc(props.src)} />
}
