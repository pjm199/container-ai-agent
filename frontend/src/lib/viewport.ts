import { useEffect, useState } from "react"

function matchesWidth(query: string) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return true
  }
  return window.matchMedia(query).matches
}

export function useMinWidth(width: number) {
  const query = `(min-width: ${width}px)`
  const [matches, setMatches] = useState(() => matchesWidth(query))

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return
    }
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update)
      return () => media.removeEventListener("change", update)
    }
    media.addListener(update)
    return () => media.removeListener(update)
  }, [query])

  return matches
}
