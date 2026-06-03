import { create } from 'zustand'

const useAppStore = create((set) => ({
  // Intent funnel
  selectedIntent: null,
  setSelectedIntent: (intent) => set({ selectedIntent: intent }),

  // Portfolio filter
  activeFilter: 'All',
  setActiveFilter: (filter) => set({ activeFilter: filter }),

  // AI chat
  chatOpen: false,
  setChatOpen: (open) => set({ chatOpen: open }),
}))

export default useAppStore