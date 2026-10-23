// Only local assets have generated WebP siblings; preserve URL suffixes exactly.
export const toWebpUrl = (src: string): string => {
  if (!src || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(src)) return src
  const suffixIndex = src.search(/[?#]/)
  const path = suffixIndex < 0 ? src : src.slice(0, suffixIndex)
  const suffix = suffixIndex < 0 ? '' : src.slice(suffixIndex)
  return path.replace(/\.(png|jpe?g)$/i, '.webp') + suffix
}
