import create from "zustand";

const useStudentCardStore = create((set, get) => ({
    statusChanged: false,
    setStatusChanged: () => {
        let newStatus = get().statusChanged
        newStatus = !newStatus
        set({ statusChanged: newStatus })
    },
}));

export default useStudentCardStore;