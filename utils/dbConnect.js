/* This is a database connection function*/
import mongoose from 'mongoose'

const connection = {} /* creating connection object*/

async function dbConnect() {
    /* check if we have connection to our databse*/
    if (connection.isConnected) {
        return connection
    }

    /* connecting to our database */
    const db = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    connection.isConnected = db.connections[0].readyState

    return db
}

export default dbConnect