import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider, IconButton,
    InputLabel,
    MenuItem, Modal,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { Container } from "@mui/system";
import MessageForm from "components/forms/MessageForm";
import Layout from "components/layout";
import moment from "moment/moment";
import { getSession } from "next-auth/react";
import Image from "next/image";
import * as React from "react";
import { useEffect, useReducer, useRef, useState } from "react";
import useGlobalStore from "stores/global-store";
import useStudentStore from "stores/students-store";

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

export default function Messages({ data }) {
    const [messages, setMessages] = useState([])
    const students = useStudentStore(state => state.students)
    const setStudents = useStudentStore(state => state.setStudents)
    const student = useStudentStore(state => state.student)
    const setStudent = useStudentStore(state => state.setStudent)

    const [date, setDate] = useState({
        startDate: moment().set('date', (new Date().getDate() - 30)).format("YYYY-MM-DD").toString(),
        endDate: moment().format("YYYY-MM-DD").toString()
    })

    const [enableForm, setEnableForm] = useState(false)
    const [messageForm, setMessageForm] = useState({
        _id: -1,
        date: moment().format("YYYY-MM-DD").toString(),
        image: '',
        message: '',
        studentId: -1
    })

    const userId = useGlobalStore(state => state.userId)
    const userType = useGlobalStore(state => state.userType)

    const [userAction, setUserAction] = useState({ type: '', _id: -1 })
    const [error, setError] = useState({ messageError: false, imageError: false, dateError: false })
    const [openImg, setOpenImg] = useState(false)
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        (async () => {
            let url
            if (userType) {
                if (userType == "parent") url = `http://localhost:3000/api/parents?id=${userId}&type=${userType}`
                else if (userType == "coordinator") url = `http://localhost:3000/api/parents?id=${userId}&type=${userType}`
                else if (userType == "teacher") url = `http://localhost:3000/api/parents?id=${userId}&type=${userType}`
            }
            try {
                const res = await fetch(url);
                const json = await res.json();

                if (userType === 'coordinator') {
                    fetch(`http://localhost:3000/api/messages/${json[0].students[0]._id}?startDate=${date.startDate}&endDate=${date.endDate}`)
                        .then((res) => res.json())
                        .then((data) => {
                            setMessages(data)
                        })
                } else
                    fetch(`http://localhost:3000/api/messages/${json[0]._id}?startDate=${date.startDate}&endDate=${date.endDate}`)
                        .then((res) => res.json())
                        .then((data) => {
                            setMessages(data)
                        })

                setStudents(json)
                userType === 'coordinator' ? setStudent(json[0].students[0]) : setStudent(json[0])

            } catch (error) {
                console.log(error)
            }
        })();

    }, [])



    useEffect(() => {
        if (userAction.type === 'add') {
            fetch("http://localhost:3000/api/messages")
                .then((res) => res.json())
                .then((data) => {
                    if (data?.length !== 0)
                        setMessageForm({
                            date: moment().format("YYYY-MM-DD").toString(),
                            image: '',
                            message: '',
                            studentId: student._id,
                            _id: data[data.length - 1]._id + 1
                        })
                    else
                        setMessageForm({
                            date: moment().format("YYYY-MM-DD").toString(),
                            image: '',
                            message: '',
                            studentId: student._id,
                            _id: 1
                        })
                }
                )
        } else if (userAction.type === 'edit')
            fetch(`http://localhost:3000/api/messages/message/${parseInt(userAction._id)}`)
                .then((res) => res.json())
                .then((data) => {
                    setMessageForm(data)
                }
                )
    }, [userAction])


    function handleEdit(messageId) {
        setUserAction({ type: 'edit', _id: parseInt(messageId) })
        setEnableForm(true)
    }

    async function handleDelete(messageId) {
        const response = await fetch(`http://localhost:3000/api/messages/message/${messageId}`, {
            method: 'DELETE', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(messageForm),
        })
        if (response.status < 300) {
            refreshPage();
        }
    }

    function refreshPage(updatedStudent) {
        if (updatedStudent)
            fetch(`http://localhost:3000/api/messages/${updatedStudent._id}?startDate=${date.startDate}&endDate=${date.endDate}`)
                .then((res) => res.json())
                .then((data) => {
                    setMessages(data)
                })
        else
            fetch(`http://localhost:3000/api/messages/${student._id}?startDate=${date.startDate}&endDate=${date.endDate}`)
                .then((res) => res.json())
                .then((data) => {
                    setMessages(data)
                })
    }

    function handleStudentChange(student) {
        if (student)
            setStudent(student)
        if (!((new Date(date.startDate)) > (new Date(date.endDate)))) {
            refreshPage(student)
        }
    }

    useEffect(() => {
        if (messageForm.message.length === 0)
            setError({ ...error, messageError: true })
        if (((messageForm?.image?.length / 1024) > 512))
            setError({ ...error, imageError: true })
        if (((new Date(date.startDate)) > (new Date(date.endDate))))
            setError({ ...error, dateError: true })
        else
            setError({ ...error, dateError: false })


    }, [messageForm, date.startDate, date.endDate])

    function validateForm() {

        if (error.imageError || error.messageError || messageForm.image.length === 0 || messageForm.image.length / 1024 > 512)
            return true
    }

    function handleFormChange(e) {
        switch (e.target.name) {
            case "message":
                setMessageForm({ ...messageForm, message: e.target.value })
                if (messageForm.length !== 0)
                    setError({ ...error, messageError: false })
                else
                    setError({ ...error, messageError: true })
                break;
            case "image":
                setError({ ...error, imageError: false })
                if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.readAsDataURL(e.target.files[0]);
                    reader.onload = function (event) {
                        let imageFile = reader.result;
                        setMessageForm({ ...messageForm, image: imageFile })
                    }
                }
                break;
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault()

        if (validateForm())
            return

        setEnableForm(false)
        let methodType = userAction.type === 'add' ? 'POST' : 'PUT'

        const response = await fetch("http://localhost:3000/api/messages/", {
            method: methodType, headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(messageForm),
        })
        if (response.status < 300) {
            refreshPage();
        }
    }

    if (!students.length) {
        return (
            <Layout title={'Messages'}>
                <Typography>No students</Typography>
            </Layout>
        )
    }

    return (
        <Layout title={'Messages'}>
            <Container spacing={2}>
                <Stack direction={"row"} alignItems={"flex-end"} spacing={3}>
                    <Box>
                        <InputLabel id="demo-simple-select-helper-label" sx={{ mt: "2%" }}>Student</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            label="Student"
                            sx={{ width: "12rem" }}
                            value={student}
                            onChange={(e) => {
                                handleStudentChange(e.target.value)
                            }}
                        >
                            {students &&
                                userType == "coordinator" ?
                                (students.map((student) => (
                                    (student.students.map((studentOption) => (<MenuItem
                                        key={studentOption._id}
                                        value={studentOption}
                                    >
                                        {studentOption.firstName} {studentOption.lastName}
                                    </MenuItem>))
                                    )))) : userType == 'parent' ?
                                    (students.map((studentOption) => (<MenuItem
                                        key={studentOption._id}
                                        value={studentOption}
                                    >
                                        {studentOption.firstName} {studentOption.lastName}
                                    </MenuItem>))) :

                                    (students.map((studentOption) => (
                                        (<MenuItem
                                            key={studentOption._id}
                                            value={studentOption}
                                        >
                                            {studentOption.firstName} {studentOption.lastName}
                                        </MenuItem>))
                                    ))
                            }
                        </Select>
                    </Box>

                    <Box>
                        <TextField id="startDate" label="Start Date" type="date" variant="filled"
                            sx={{ marginRight: "2em" }} error={error.dateError}
                            helperText={error.dateError ? 'Start date cannot be greater than end date' : ''}
                            value={(date.startDate)} onChange={(e) => {
                                date.startDate = e.target.value
                                forceUpdate() //causes re-renders which updates the value of startDate
                                handleStudentChange()
                            }} />

                        <TextField id="endDate" label="End Date" type="date" variant="filled"
                            value={(date.endDate)} error={error.dateError} onChange={(e) => {
                                date.endDate = e.target.value
                                forceUpdate() //causes re-renders which updates the value of endDate
                                handleStudentChange()
                            }} />
                    </Box>
                </Stack>
                <br />
                <Stack direction="row" justifyContent={'space-between'} alignContent='center'>
                    <Typography variant="h4">
                        All Messages
                    </Typography>
                    {(userType === "coordinator" || userType === 'teacher') &&
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setEnableForm(true)
                                setMessageForm({
                                    ...messageForm,
                                    studentId: student._id,
                                    image: ''
                                })
                                setUserAction({ type: 'add', _id: -1 })
                            }}
                        >
                            Add
                        </Button>}

                    {<Modal
                        open={enableForm}
                        onClose={(e) => {
                            setEnableForm(false)
                        }}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box>
                            <MessageForm setEnableForm={setEnableForm} handleSubmit={handleFormSubmit} handleChange={handleFormChange}
                                form={messageForm} actionType={userAction.type} error={error} />
                        </Box>
                    </Modal>}
                </Stack>
                <br />
                {messages && messages?.length !== 0 ?
                    (messages && messages.map((message) => (
                        <Box key={message._id}>
                            <Card>
                                {(userType === "coordinator" || userType === 'teacher') &&
                                    <Stack direction="row" spacing={1} justifyContent='flex-end'>
                                        <IconButton
                                            aria-label="Edit announcement"
                                            onClick={() => handleEdit(message._id)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            aria-label="Delete announcement"
                                            onClick={() => handleDelete(message._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>}

                                <CardContent>
                                    <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                                        <Typography key={message.id} variant="h5">
                                            {student.firstName} {student.lastName}
                                        </Typography>
                                        <Typography variant="h5">
                                            {(new Date(message.date)).toISOString().substring(0, 10)}
                                        </Typography>
                                    </Stack>

                                    <Stack spacing={2}>
                                        <Divider />
                                        <Typography typography='body1'>
                                            {message.message}
                                        </Typography>
                                        {<Modal
                                            open={openImg}
                                            onClose={(e) => {
                                                setOpenImg(false)
                                            }}
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
                                                    src={message.image}
                                                    alt='Message image'
                                                    width={400}
                                                    height={500}
                                                />
                                            </Box>
                                        </Modal>}
                                        <Button
                                            sx={{ justifyContent: 'flex-start' }}
                                            onClick={() => setOpenImg(true)}
                                        >
                                            <Image
                                                unoptimized
                                                className={'.image'}
                                                src={message.image}
                                                alt='Message image'
                                                width={150}
                                                height={150}
                                            />
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                            <br />
                        </Box>)
                    )) : (<> <br />
                        <Box mt={2} width='100%' margin="auto">
                            <Typography variant="h4">
                                No new messages for
                                <Typography variant={"h5"}>
                                    StudentId {student._id} {student.firstName} {student.lastName}</Typography>
                            </Typography>
                        </Box> </>)}
            </Container>
        </Layout>
    );
}