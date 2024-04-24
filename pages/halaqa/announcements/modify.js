import { Box, Button, Container, InputLabel, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
import { useStore } from "stores/store";
import moment from "moment";
import { getSession } from "next-auth/react";
import Image from "next/image";

export async function getServerSideProps(context) {
    const req = context.req
    const session = await getSession({ req })
    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: {}
    };
}

export default function ModifyAnnouncement() {
    const [announcement, setAnnouncement] = useState({
        _id: -1,
        title: "",
        msg: "",
        date: moment().format("YYYY-MM-DD").toString(),
        image: ""
    })
    const action = useStore((state) => state.action)
    const [error, setError] = useState({ msgError: false, imgError: false, titleError: false })
    const router = useRouter();
    console.log(action);

    useEffect(() => {
        if (action.type === "add") {
            fetch("http://localhost:3000/api/announcements")
                .then((res) => res.json())
                .then((data) => {
                    if (data?.length !== 0)
                        setAnnouncement({ ...announcement, _id: data[data.length - 1]._id + 1 })
                    else setAnnouncement({ ...announcement, _id: 1 })
                    console.log(announcement._id);
                })
        } else if (action.type === "edit") {
            console.log("inside");
            fetch(`http://localhost:3000/api/announcements/${action.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setAnnouncement(data)
                    console.log(data);
                })

        }
    }, [])

    function validateForm() {
        if (!announcement.msg)
            setError({ ...error, msgError: true })
        if ((announcement?.image?.length / 1024) > 512)
            setError({ ...error, imgError: true })
        if (!announcement.title)
            setError({ ...error, titleError: true })

        if (!announcement.msg || !announcement.title || announcement.image.length === 0 || announcement.image.length / 1024 > 512)
            return true

    }

    function handleSubmit(e, body, router) {
        if (validateForm())
            return
        let methodType
        action.type === "add" ? methodType = "POST" : methodType = "PUT"

        try {
            console.log(body)
            fetch("http://localhost:3000/api/announcements", {
                method: methodType, headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify(body),
            })
            router.back()

        } catch (e) {
            console.log(e);
        }
    }

    function handleOnChange(e, type) {
        console.log(announcement);
        //console.log(announcementsObject);
        switch (type) {
            case "title":
                if (e.target.value.length !== 0)
                    setError({ ...error, titleError: false })
                setAnnouncement({ ...announcement, title: e.target.value })
                break;
            case "msg":
                if (e.target.value.length !== 0)
                    setError({ ...error, msgError: false })
                setAnnouncement({ ...announcement, msg: e.target.value })
                break;
            // case "date":
            //     setAnnouncement({...announcement, date: e.target.value})
            //     break;
            case "image":
                if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.readAsDataURL(e.target.files[0]);
                    reader.onload = function (event) {
                        let imageFile = reader.result;
                        // payImage.style.display = "block"
                        setAnnouncement({ ...announcement, image: imageFile })
                    }
                    if (e.target.files[0].length / 1024 < 512)
                        setError({ ...error, imgError: false })
                }

                break;
        }
    }

    //margin: "auto"
    return (<>
        <Container sx={{ margin: "auto", padding: "2%", display: "flex", flexDirection: "column" }}>
            <Typography variant={"h3"}
            >{action.type === 'add' ? 'Add Announcement' : 'Edit Announcement'}</Typography>
            <Stack spacing={2} direction="row" sx={{ padding: "1%" }}>
                <Box>
                    <InputLabel>Title</InputLabel>
                    <TextField
                        required
                        id="Title"
                        label="Title"
                        error={error.titleError}
                        helperText={error.titleError ? 'Title is required' : ''}
                        defaultValue="Hello World"
                        type="text"
                        color="warning"
                        value={announcement.title}
                        onChange={(e) => {
                            handleOnChange(e, "title")
                        }}
                    />
                </Box>
                <Box>
                    <InputLabel>Date</InputLabel>
                    <TextField
                        required
                        id="Date"
                        type="text"
                        color="warning"
                        disabled
                        value={announcement.date}
                        onChange={(e) => {
                            handleOnChange(e, "date")
                        }}
                    />
                </Box>
            </Stack>
            <Stack spacing={2} direction="column" sx={{ padding: "1%", width: '70%' }}>
                <InputLabel>Message</InputLabel>
                <TextField
                    required
                    id="Message"
                    defaultValue="Hello World"
                    error={error.msgError}
                    helperText={error.msgError ? 'message is required' : ''}
                    type="text"
                    label="Message Content"
                    multiline
                    color="warning"
                    fullWidth="lg"
                    rows={4}
                    maxRows={5}
                    value={announcement.msg}
                    onChange={(e) => {
                        handleOnChange(e, "msg")
                    }}
                />
                <InputLabel>Image</InputLabel>
                <TextField
                    required
                    id="Image"
                    error={error.imgError}
                    helperText={error.imgError ? 'Image size cannot be greater than 512 KB' : ''}
                    type="file"
                    color="warning"
                    value={""} //announcement.image
                    onChange={(e) => {
                        handleOnChange(e, "image")
                    }}
                />
                {announcement.image &&
                    <Image
                        unoptimized
                        alt="Announcement image"
                        className={'.image'}
                        src={announcement.image}
                        width={150} height={150}
                    />
                }
            </Stack>
            <Stack spacing={2} direction="row" sx={{ padding: "1%" }}>
                <Button variant="contained" onClick={() => {
                    router.back()
                }}>Cancel</Button>
                <Button variant="contained" onClick={(e) => handleSubmit(e, announcement, router)}>Submit</Button>

            </Stack>
        </Container>
    </>)
}
