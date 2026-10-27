import { useEffect, useState } from 'react'
export type Mode = 'light' | 'dark'
const storageKey = 'udms-color-mode-v1'
function readMode(): Mode {
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'light' || saved === 'dark') return saved
  } catch { /* Use the system preference when storage is unavailable. */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
export function useThemePreview() {
  const [mode, setMode] = useState<Mode>(readMode)
  useEffect(() => {
    try { localStorage.setItem(storageKey, mode) } catch { /* Mode switching still works. */ }
  }, [mode])
  return { palette: 'cobalt', mode, setMode }
}
