import { create } from "zustand";
import { persist } from "zustand/middleware";

const useMentorStore = create(
  persist(
    (set) => ({
      mentorData: null,
      setMentorData: (data) => set({ mentorData: data }),
    }),
    {
      name: "mentor-storage", // Name for localStorage key
      getStorage: () => localStorage, // Store data in localStorage
    }
  )
);
 
export default useMentorStore;
