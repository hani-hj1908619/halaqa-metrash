import create from "zustand";
import { persist } from "zustand/middleware";

const useGlobalStore = create(persist((set) => ({
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),

    userType: "",
    setUserType: (userType) => set({ userType }),

    userId: -1,
    setUserId: (userId) => set({ userId })

})));

export default useGlobalStore;