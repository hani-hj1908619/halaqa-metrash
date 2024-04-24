import { Button, CircularProgress, Container, Stack } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import useGlobalStore from "/stores/global-store";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import useStudentStore from "stores/students-store";
import { signOut } from "next-auth/react"
import { useRouter } from 'next/router'

export default function Layout({ children, title, handleSignOut }) {
    const router = useRouter()

    const Admintabs = ["/halaqa", "/halaqa/tasks", "/halaqa/students", "/halaqa/messages"]
    const setUserType = useGlobalStore(state => state.setUserType)
    const setUserId = useGlobalStore(state => state.setUserId)

    // const setStudents = useStudentStore(state => state.setStudents)

    const handleLogOut = () => {
        setUserType("")
        setUserId(-1)
        signOut()
    }

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <ErrorBoundary fallbackRender={({ error }) => <div>Error: {error.message}</div>}>
                <header>
                    <Container>
                        <Stack mt={4} direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" component="nav" gap={5}>
                                <Link href="/halaqa/announcements">
                                    <Button
                                        sx={{
                                            color: router.pathname.includes("/announcements") ? "" : "black",
                                            display: "block", px: 0
                                        }}
                                    >
                                        Announcements
                                    </Button>
                                </Link>

                                <Link href="/halaqa/tasks">
                                    <Button
                                        sx={{
                                            color: router.pathname.includes("/tasks") ? "" : "black",
                                            display: "block", px: 0
                                        }}
                                    >
                                        Tasks
                                    </Button>
                                </Link>
                                <Link href="/halaqa/students">
                                    {" "}
                                    <Button
                                        sx={{
                                            color: router.pathname.includes("/students") ? "" : "black",
                                            display: "block", px: 0
                                        }}
                                    >
                                        Students
                                    </Button>
                                </Link>
                                <Link href="/halaqa/messages">
                                    <Button
                                        sx={{
                                            color: router.pathname.includes("/messages") ? "" : "black",
                                            display: "block", px: 0
                                        }}
                                    >
                                        Messages
                                    </Button>
                                </Link>
                            </Stack>
                            <Link href="/"><Button onClick={handleLogOut}>Logout</Button></Link>
                        </Stack>
                    </Container>
                </header>
                <Suspense fallback={<CircularProgress />}>
                    <main>
                        <Container sx={{ my: 3 }}>
                            {children}
                        </Container>
                    </main>
                </Suspense>
            </ErrorBoundary>
        </>
    )
}
