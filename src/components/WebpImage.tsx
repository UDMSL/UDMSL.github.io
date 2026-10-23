import type React from 'react'
import { useMemo, useState, type ImgHTMLAttributes } from 'react'
import { toWebpUrl } from '../utils/images'

type WebpImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /**
   * Optional final fallback (e.g., placeholder). The original source is always tried before this.
   */
  fallbackSrc?: string
}

/**
 * Renders an image that prefers WebP and gracefully falls back to the original
 * source (and an optional extra fallback) on error.
 */
const WebpImage = ({ src = '', fallbackSrc, onError, loading = 'lazy', decoding = 'async', ...rest }: WebpImageProps) => {
  const sourceQueue = useMemo(() => {
    const queue: string[] = []
    const original = src.trim()
    const preferred = toWebpUrl(original)

    if (preferred) queue.push(preferred)
    if (original && !queue.includes(original)) queue.push(original)
    if (fallbackSrc && !queue.includes(fallbackSrc)) queue.push(fallbackSrc)

    return queue
  }, [src, fallbackSrc])

  const queueKey = sourceQueue.join('|')
  const [sourceState, setSourceState] = useState(() => ({ key: queueKey, index: 0 }))

  const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
    const nextIndex = currentIndex + 1
    if (nextIndex < sourceQueue.length) {
      setSourceState({ key: queueKey, index: nextIndex })
    } else {
      // Event callbacks must run outside state updaters, which React can replay.
      onError?.(event)
    }
  }

  const currentIndex = sourceState.key === queueKey ? sourceState.index : 0
  const currentSrc = sourceQueue[Math.min(currentIndex, sourceQueue.length - 1)] ?? ''

  return <img src={currentSrc || undefined} onError={handleError} loading={loading} decoding={decoding} {...rest} />
}

export default WebpImage
