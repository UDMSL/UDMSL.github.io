import { useEffect, useMemo, useState, type ImgHTMLAttributes } from 'react'

type WebpImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /**
   * Optional final fallback (e.g., placeholder). The original source is always tried before this.
   */
  fallbackSrc?: string
}

// Convert common raster extensions to a WebP URL while preserving query strings.
const toWebpUrl = (src: string): string => {
  if (!src || /^data:/i.test(src)) return src

  const [path, query] = src.split('?', 2)
  if (!/\.(png|jpe?g)$/i.test(path)) return src

  const webpPath = path.replace(/\.(png|jpe?g)$/i, '.webp')
  return query ? `${webpPath}?${query}` : webpPath
}

/**
 * Renders an image that prefers WebP and gracefully falls back to the original
 * source (and an optional extra fallback) on error.
 */
const WebpImage = ({ src = '', fallbackSrc, onError, ...rest }: WebpImageProps) => {
  const sourceQueue = useMemo(() => {
    const queue: string[] = []
    const original = src.trim()
    const preferred = toWebpUrl(original)

    if (preferred) queue.push(preferred)
    if (original && !queue.includes(original)) queue.push(original)
    if (fallbackSrc && !queue.includes(fallbackSrc)) queue.push(fallbackSrc)

    return queue
  }, [src, fallbackSrc])

  const [sourceIndex, setSourceIndex] = useState(0)

  useEffect(() => {
    setSourceIndex(0)
  }, [sourceQueue])

  const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
    const nextIndex = sourceIndex + 1
    if (nextIndex < sourceQueue.length) {
      setSourceIndex(nextIndex)
      return
    }

    // Allow caller-specific error handling once all fallbacks are exhausted.
    onError?.(event)
  }

  const currentSrc = sourceQueue[sourceIndex] ?? ''

  return <img src={currentSrc} onError={handleError} {...rest} />
}

export default WebpImage
