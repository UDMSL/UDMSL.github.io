export function splitCitation(text: string) {
  const match = text.match(/^"([\s\S]+)"[, ]*(.*)$/)
  return match ? { title: match[1], details: match[2] } : { title: text, details: '' }
}
