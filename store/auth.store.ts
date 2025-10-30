import { User } from "@/types/auth.types";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  fetchAuthenticatedUser: () => Promise<void>;
  logout: () => void;
  updateProfile: (updates: any) => Promise<void>;
};

const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  setLoading: (value) => set({ isLoading: value }),
  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });

    try {
      // const user = await getCurrentUser();
      const user = null;
      if (user) set({ isAuthenticated: true, user: user as User });
      else set({ isAuthenticated: false, user: null });
    } catch (e) {
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
  updateProfile: async (updates: any) => {
    const { user } = get();
    if (!user) throw new Error("No user found");

    try {
      set({ isLoading: true });
      // const updatedUser = await updateUser(user.$id, updates);
      const updatedUser = null;
      set({ user: updatedUser as unknown as User | null });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
