// src/hooks/usePrefetchImages.ts
import { useEffect, useMemo } from 'react'
import { toWebpUrl } from '../utils/images'

type PrefetchOptions = {
  delayMs?: number
  max?: number
}

export const usePrefetchImages = (
  urls: (string | undefined | null)[],
  options?: PrefetchOptions,
) => {
  const { delayMs = 0, max = Infinity } = options ?? {}

  const targets = useMemo(() => {
    // falsy 제거 + 중복 제거 + max 개수 제한
    const cleaned = Array.from(
      new Set(
        urls
          .filter((u): u is string => !!u && u.trim().length > 0)
          .map((u) => u.trim()),
      ),
    )
    return cleaned.slice(0, max)
  }, [urls, max])

  useEffect(() => {
    if (targets.length === 0) return

    let cancelled = false

    const timer = setTimeout(() => {
      if (cancelled) return

      targets.forEach((originalUrl) => {
        // 1) WebP 우선 prefetch
        const webpUrl = toWebpUrl(originalUrl)
        if (webpUrl && webpUrl !== originalUrl) {
          const imgWebp = new Image()
          imgWebp.src = webpUrl
          imgWebp.onerror = () => {
            if (cancelled) return
            // 2) WebP 실패 시 원본도 prefetch
            const imgFallback = new Image()
            imgFallback.src = originalUrl
          }
        } else {
          // 변환 대상이 아니면 원본만 prefetch
          const img = new Image()
          img.src = originalUrl
        }
      })
    }, delayMs)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [targets, delayMs])
}
