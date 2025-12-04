// Convert common raster extensions to a WebP URL while preserving query strings.
export const toWebpUrl = (src: string): string => {
  if (!src || /^data:/i.test(src)) return src

  const [path, query] = src.split('?', 2)
  if (!/\.(png|jpe?g)$/i.test(path)) return src

  const webpPath = path.replace(/\.(png|jpe?g)$/i, '.webp')
  return query ? `${webpPath}?${query}` : webpPath
}
