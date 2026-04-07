import { create } from "zustand";

interface AppState {
  loaderDone: boolean;
  setLoaderDone: () => void;
}

/**
 * Global app state — avoids prop drilling and prevents re-renders
 * from cascading through component tree.
 */
export const useAppStore = create<AppState>((set) => ({
  loaderDone: false,
  setLoaderDone: () => set({ loaderDone: true }),
}));
