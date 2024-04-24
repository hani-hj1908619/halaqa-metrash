//anouncements page
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    IconButton, Modal,
    Stack, TextField,
    Typography
} from '@mui/material';
import { useRouter } from "next/router";
import * as React from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Layout from "components/layout";
import moment from "moment";
import { getSession, signOut, useSession } from "next-auth/react";
import Image from 'next/image';
import { useEffect, useReducer, useState } from "react";
import useGlobalStore from "stores/global-store";
import { useStore } from "stores/store";

export async function getServerSideProps({ req }) {
    const session = await getSession({ req })
    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
    const res = await fetch(`http://localhost:3000/api/announcements?startDate=${moment().set('date', (new Date().getDate() - 30)).format("YYYY-MM-DD").toString()}&endDate=${moment().format("YYYY-MM-DD").toString()}`);
    const json = await res.json();

    const user_email = session.user.email
    const domain = user_email.substring(user_email.indexOf("@") + 1);
    let _userType = ""
    let _userId = -1
    if (domain === 'gmail.com' || domain === '@outlook.com' || domain === 'qu.edu.qa') {
        _userType = 'guest'
    } else if (domain === 'halaqa.org') {
        const sRes = await fetch(`http://localhost:3000/api/staff/email/${user_email}`);
        const sUser = await sRes.json();
        _userType = (sUser.isCoordinator ? "coordinator" : "teacher")
        _userId = sUser._id
    } else {
        const pRes = await fetch(`http://localhost:3000/api/parents/email/${user_email}`);
        const pUser = await pRes.json();
        _userType = "parent"
        _userId = pUser._id
    }
    return {
        props: {
            data: json,
            session,
            _userType,
            _userId
        },
    };
}

export default function Announcements({ data, session, _userType, _userId }) {
    const announcements = useStore((state) => state.announcements)
    const storeAnnouncements = useStore((state) => state.storeAnnoucements)
    const router = useRouter();
    const updateAction = useStore((state) => state.updateAction)
    const userType = useGlobalStore(state => state.userType)
    const userId = useGlobalStore(state => state.userId)
    const setUserType = useGlobalStore(state => state.setUserType)
    const setUserId = useGlobalStore(state => state.setUserId)
    const [error, setError] = useState({ dateError: false })
    const [date, setDate] = useState({
        startDate: moment().set('date', (new Date().getDate() - 30)).format("YYYY-MM-DD").toString(),
        endDate: moment().format("YYYY-MM-DD").toString()
    })
    const [openImg, setOpenImg] = useState(false)
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        setUserType(_userType)
        setUserId(_userId)
    }, [userType, userId])

    async function handleDelete(announcementId) {
        try {
            const response = await fetch(`http://localhost:3000/api/announcements/${announcementId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.status < 300)
                handleDateFetch()

        } catch (e) {
            console.log(e);
        }
    }

    function handleEdit(announcementId) {
        updateAction({ type: "edit", id: announcementId })
        router.push("/halaqa/announcements/modify")
    }

    useEffect(() => {
        if (((new Date(date.startDate)) > (new Date(date.endDate))) || ((new Date(date.endDate)) < (new Date(date.startDate))))
            setError({ ...error, dateError: true })
        else
            setError({ ...error, dateError: false })
    }, [date.endDate, date.startDate])
    useEffect(() => {
        if (data)
            storeAnnouncements(data)
    }, [])

    function handleSignOut() {
        signOut()
    }


    //<AlertDialog openDialog={open} title={`Delete Announcement# ${1}`} content={"Are you sure you want to delete this announcement. Note this action cannot be reversed."}/>
    function handleDateFetch() {
        if (!((new Date(date.startDate)) > (new Date(date.endDate))) || !((new Date(date.endDate)) < (new Date(date.startDate)))) {
            fetch(`http://localhost:3000/api/announcements?startDate=${date.startDate}
            &endDate=${date.endDate}`)
                .then((res) => res.json())
                .then((data) => {
                    storeAnnouncements(data);
                })
        }
    }

    return (
        <Layout title={'HalaqaMetrash'} handleSignOut={handleSignOut}>
            <Stack direction={'row'} justifyContent="space-between" alignItems="center">
                <Typography variant="h4" component="h4">
                    All Annoucements
                </Typography>
                <Box>
                    <TextField id="startDate" label="Start Date" type="date" variant="filled"
                        sx={{ marginRight: "2em" }} error={error.dateError}
                        helperText={error.dateError ? 'Start date cannot be greater than end date' : ''}
                        value={(date.startDate)} onChange={(e) => {
                            date.startDate = e.target.value
                            forceUpdate() //causes re-renders which updates the value of startDate
                            handleDateFetch()
                        }} />

                    <TextField id="endDate" label="End Date" type="date" variant="filled"
                        value={(date.endDate)} error={error.dateError} onChange={(e) => {
                            date.endDate = e.target.value
                            forceUpdate() //causes re-renders which updates the value of endDate
                            handleDateFetch()
                        }} />
                </Box>
                {userType === "coordinator" &&
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            updateAction({ type: "add", id: -1 });
                            router.push("/halaqa/announcements/modify")
                        }}
                    >
                        Add
                    </Button>
                }
            </Stack>
            <Stack direction="row">
                {
                    session ? <Typography sx={{ fontSize: 12 }}>logged in - {session.user.email}</Typography> : <></>
                }
            </Stack>
            <br />
            {announcements.length === 0 && (<Box mt={2} width='75%' margin="auto">
                <Typography variant="h2" component="h2" sx={{ color: "#141414" }}>
                    No New Announcments
                </Typography>
                {userType === "coordinator" &&
                    <Button variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            updateAction({ type: "add", id: -1 });
                            router.push("/halaqa/announcements/modify")
                        }}
                    >
                        Post New Announcement
                    </Button>
                }
            </Box>)}
            {announcements && announcements?.map((announcement) => (
                <Box key={announcement._id}>
                    <Card>
                        {userType === "coordinator" &&
                            <Stack direction="row" spacing={1} justifyContent='flex-end'>
                                <IconButton
                                    aria-label="Edit announcement"
                                    onClick={() => handleEdit(announcement._id)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    aria-label="Delete announcement"
                                    onClick={() => handleDelete(announcement._id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        }

                        <CardContent sx={{ pt: 0 }}>
                            <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                                <Typography key={announcement.id} variant="h5" component="h5">
                                    {announcement.title}
                                </Typography>
                                <Typography variant="h5" component="h5">
                                    {announcement.date.substring(0, 10)}
                                </Typography>
                            </Stack>
                            <Stack spacing={2}>
                                <Divider />
                                <Typography typography='body1'>
                                    {announcement.msg}
                                </Typography>

                                {announcement.image &&
                                    <Button
                                        sx={{ justifyContent: 'flex-start' }}
                                        onClick={() => setOpenImg(true)}
                                    >
                                        <Image
                                            unoptimized
                                            className={'.image'}
                                            src={announcement.image}
                                            alt='Announcement image'
                                            width={150} height={150}
                                        />
                                    </Button>
                                }
                                {<Modal
                                    open={openImg}
                                    onClose={(e) => setOpenImg(false)}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: 400,
                                        }}
                                    >
                                        <Image
                                            unoptimized
                                            className={'.image'}
                                            src={announcement.image}
                                            alt='Announcement image'
                                            width={400} height={400}
                                        />
                                    </Box>
                                </Modal>}
                            </Stack>
                        </CardContent>
                    </Card>
                    <br />
                </Box>
            ))}
        </Layout>
    );
}