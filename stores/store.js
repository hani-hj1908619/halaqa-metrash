import create from 'zustand'
import {persist} from "zustand/middleware"
import { announcementSlice } from './announcementSlice'


export const useStore = create(persist((set) => ({
    ...announcementSlice(set)
})))