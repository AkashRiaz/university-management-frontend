import * as React from "react"

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

// External-store subscription to the media query.
// - The browser only notifies us when the breakpoint is actually crossed, not
//   on every resize pixel, so there is no resize-event storm.
// - useSyncExternalStore reads the correct value during the first client render
//   (no extra "undefined -> real value" render that useState + useEffect caused)
//   and is tearing-safe with concurrent rendering.
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

const getSnapshot = () => window.matchMedia(QUERY).matches
const getServerSnapshot = () => false

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
