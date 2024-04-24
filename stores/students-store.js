import create from "zustand";
import {persist} from "zustand/middleware";

const useStudentStore = create(persist((set) => ({
    students: [],
    student: {},
    setStudents: (students) => set({ students }),
    setStudent: (student) => set({student: student})
})));

export default useStudentStore;