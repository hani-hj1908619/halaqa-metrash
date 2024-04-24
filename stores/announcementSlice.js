const apiData = "http://localhost:3000/api/announcements"


export const announcementSlice = (set) => ({
    announcements: [],
    action: {type: "add", id: -1},

    updateAction: (data) => {
        set({action: data})
    },
    
    storeAnnoucements: (data) => {
        set({ announcements: data })
    },

    addAnnoucements: (data) => {
        set({ announcements: data })
    },

    updateAnnoucements: (data) => {
        set({ announcements: data })
    },

    deleteAnnoucements: (data) => {
        set({ announcements: data })
    },


    /**
     * could be used to fetch manually if needed - to excuete this code. 
     * Make sure to call it in OnClick{fetch} 
     * OR
     * call it in fetch(<functionName> here its fetch) to automatically exceute based on a condition.
     */
    fetch: async () => { 
        const res = await fetch(apiData)
        set({ announcements: await res.json() })
    },

})