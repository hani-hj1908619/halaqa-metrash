import create from "zustand";

const useTaskStore = create((set) => ({
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),

    tasks: [],
    setTasks: (tasks) => set({ tasks }),


}));

export default useTaskStore;