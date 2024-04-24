import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {

    providers: [
        // OAuth authentication providers...
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialsProvider({
            name: 'Credentials',
            async authorize(credentials, req) {
                const parentRes = await fetch(`http://localhost:3000/api/parents/${credentials.username}`)
                //console.log("parentRes",parentRes)

                const parent = await parentRes.json()
                //console.log("parent", parent)

                const staffRes = await fetch(`http://localhost:3000//api/staff/${credentials.username}`)
                //console.log("staffRes", staffRes)

                const staff = await staffRes.json()
                //console.log("staff", staff)

                if (parentRes.status === 400) {
                    console.log("parent not true")
                    if (staff) {
                        if (staff.password !== credentials.password) {
                            throw new Error("Incorrect Password or email")
                        }
                        if (staff.password === credentials.password) {
                            // set gloabl userid and type 
                            //setUserId(staff._id)
                            //setUserType((staff.isCoordinator ? "coordinator" : "teacher"))
                            const user = staff
                            console.log("staff user should be here", user)
                            return user
                        }
                    }
                }
                if (staffRes.status === 400) {
                    console.log("staff not true")
                    if (parent) {
                        if (parent.password !== credentials.password) {
                            throw new Error("Incorrect Password or email")
                        }
                        if (parent.password === credentials.password) {
                            // set gloabl userid and type
                            //setUserId(parent._id)
                            //setUserType("parent")
                            const user = parent
                            console.log("parent user should be here", user)
                            return user
                        }
                    }
                }

            },
            callbacks: {
                async jwt({ token, user }) {
                    // Persist the OAuth access_token and or the user id to the token right after signin
                    console.log("user in jwt asyc", user)
                    if (user._id) {
                        token._id = user._id
                    }
                    return token
                },
                async session(props) {
                    const { session, token, user } = props;
                    // Send properties to the client, like an access_token and user id from a provider.
                    // if (user && session.user) {
                    //     session.user.id = user._id;
                    // }
                    session.user.id = token._id

                    return session
                }
            }
        })
    ]
}

export default NextAuth(authOptions);

// export default NextAuth({
// }
// )