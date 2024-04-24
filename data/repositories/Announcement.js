import Announcement from "data/entities/announcement";
import fs from "fs-extra";

class AnnouncementRepo {

    constructor() {
        if (!AnnouncementRepo._instance) {
            AnnouncementRepo._instance = this;
        }

        return AnnouncementRepo._instance;
    }

    addAnnouncement(announcement) {
        console.log("adding");
        return Announcement.create(announcement);

    }

    async getAnnouncement() {
        return await Announcement.find({});
    }

    async getAnnouncement(announcementId) {
        return await Announcement.findOne({ _id: announcementId });
    }

    async updateAnnouncement(updatedAnnouncement) {
        return await Announcement.findByIdAndUpdate(updatedAnnouncement.announcementId, updatedAnnouncement);
    }

    async deleteAnnouncement(announcementId) {
        return await Announcement.deleteOne({ _id: announcementId });
    }

    async deleteAllAnnouncements() {
        return await Announcement.deleteMany({});
    }

    async init() {
        const flag = await Announcement.count({});
        console.log(flag)
        if (!flag) {
            const data = await fs.readJson('../announcement.json');
            const inserting = await Announcement.insertMany(data)
            console.log(inserting.acknowledged)
        }
    }
}

export default AnnouncementRepo