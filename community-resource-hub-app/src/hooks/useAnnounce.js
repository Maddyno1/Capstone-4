import { createContext, useContext } from 'react'

export const AnnouncerContext = createContext({ announce: () => {} })

export function useAnnounce() {
  return useContext(AnnouncerContext)
}