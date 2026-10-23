// measureLine returns the canvas text width at 100px. Explicit newlines alone
// create rows. Ignoring negative letter-spacing leaves a small safety margin.
export const fitMemoFontSize = (text: string, width: number, height: number, measureLine: (_line: string) => number): number => {
  const lines = text.replace(/\r\n?/g, '\n').split('\n')
  const widest = Math.max(1, ...lines.map((line) => measureLine(line.replace(/\t/g, '        '))))
  return Math.max(1, Math.floor(Math.min(160, width * 100 / widest, height / (lines.length * 1.48))))
}
