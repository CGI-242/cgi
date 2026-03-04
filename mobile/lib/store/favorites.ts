import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesState {
  articleIds: string[];
  isFavorite: (articleId: string) => boolean;
  toggleFavorite: (articleId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      articleIds: [],
      isFavorite: (articleId: string) => get().articleIds.includes(articleId),
      toggleFavorite: (articleId: string) => {
        const current = get().articleIds;
        if (current.includes(articleId)) {
          set({ articleIds: current.filter((id) => id !== articleId) });
        } else {
          set({ articleIds: [...current, articleId] });
        }
      },
    }),
    {
      name: "cgi242-favorites",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
