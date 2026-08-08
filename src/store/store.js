import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const useMentorStore = create(
  persist(
    (set) => ({
      mentorData: null,
      setMentorData: (data) => set({ mentorData: data }),
    }),
    {
      name: "mentor-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage
      ),
    }
  )
);

export default useMentorStore;
