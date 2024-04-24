import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Snackbar, Typography } from '@mui/material';
import StudentForm from 'components/forms/StudentForm';
import Layout from "components/layout";
import { getSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";

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

    let { parentId, childId } = context.query
    parentId = parseInt(parentId)
    childId = parseInt(childId)

    const students = await fetch(`http://localhost:3000/api/parents?id=${parentId}&childId=${childId}&type=parent`)
    const res = await students.json()
    const data = await fetch(`http://localhost:3000/api/staff`)
    const teachers = await data.json()
    return {
        props: {
            data: res,
            teachers: teachers,
            parentId: parentId
        },
    };
}

function Update({ data, teachers, parentId }) {
    const router = useRouter();

    const [form, setForm] = useState({
        _id: data.students[0]._id,
        firstName: data.students[0].firstName,
        lastName: data.students[0].lastName,
        dob: data.students[0].dob.substring(0, 10),
        gender: data.students[0].gender,
        schoolGrade: data.students[0].schoolGrade,
        teacherId: data.students[0].teacherId,
        active: data.students[0].active
    })

    const [open, setOpen] = useState(false);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const action = (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    );

    const handleChange = (event) => {
        if (event.target.name == "controlled-select-group") {
            setForm({
                ...form,
                teacherId: event.target.value,
            });
        }
        else if (event.target.name == "gender") {
            setForm({
                ...form,
                gender: event.target.value,
            });
        } else {
            setForm({
                ...form,
                [event.target.id]: event.target.value,
            });
        }

    };

    const handleSubmit = evt => {
        evt.preventDefault();

        fetch(`http://localhost:3000/api/parents/update/${parentId}?childId=${form._id}`, {
            method: "PUT",
            body: JSON.stringify(form),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(router.back())
            .catch(error => console.error("Error:", error));
        setOpen(true);
    };

    const inputStyle = { my: 2, width: "30%" }

    return (
        <Layout>
            <Typography variant="h4">Update Student</Typography>
            <StudentForm handleSubmit={handleSubmit} handleChange={handleChange} inputStyle={inputStyle} form={form} teachers={teachers}></StudentForm>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Updated Successfully"
                action={action}
            />
        </Layout>
    )
}

export default Update