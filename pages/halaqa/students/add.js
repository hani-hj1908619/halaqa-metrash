import { FormControl, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material';
import StudentForm from 'components/forms/StudentForm';
import Layout from "components/layout";
import moment from 'moment';
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';

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
    const parents = await fetch(`http://localhost:3000/api/parents?parentonly=true`)
    const res = await parents.json()

    const data = await fetch(`http://localhost:3000/api/staff`)
    const teachers = await data.json()

    return {
        props: {
            data: res,
            teachers: teachers
        },
    };

}

const AddStudent = ({ data, teachers }) => {
    const router = useRouter();

    const [parentForm, setParentForm] = useState({
        _id: "",
        firstName: "",
        lastName: "",
        mobile: "",
        email: "",
        username: "",
        password: "",
    })

    const [studentForm, setStudentForm] = useState({
        _id: "",
        firstName: "",
        lastName: "",
        dob: moment().format("YYYY-MM-DD").toString(),
        gender: "",
        schoolGrade: "",
        teacherId: "",
        active: true
    })

    const [exist, setExist] = useState(false)
    const handleChange = (e) => {
        setExist(e.target.checked)
    }

    const handleParentChange = (e) => {
        if (e.target.name == "controlled-select-group") {
            setParentForm({
                ...parentForm,
                _id: e.target.value,
            });
        } else {
            setParentForm({
                ...parentForm,
                [e.target.id]: e.target.value,
            });
        }
    }

    const handleStudentChange = (e) => {
        if (e.target.name == "controlled-select-group") {
            setStudentForm({
                ...studentForm,
                teacherId: e.target.value,
            });
        } else if (e.target.name == "gender") {
            setStudentForm({
                ...studentForm,
                gender: e.target.value,
            });
        } else {
            setStudentForm({
                ...studentForm,
                [e.target.id]: e.target.value,
            });
        }
    }

    useEffect(() => {
        setParentForm({
            _id: "",
            firstName: "",
            lastName: "",
            mobile: "",
            email: "",
            username: "",
            password: "",
        })
        setStudentForm({
            _id: "",
            firstName: "",
            lastName: "",
            dob: moment().format("YYYY-MM-DD").toString(),
            gender: "",
            schoolGrade: "",
            teacherId: "",
            active: true
        })
    }, [exist])

    const inputStyle = { my: 2, width: "30%" }

    const handleSubmit = evt => {
        evt.preventDefault();
        let methodType
        if (exist) methodType = "PUT"
        else methodType = "POST"

        fetch(`http://localhost:3000/api/parents/`, {
            method: `${methodType}`,
            body: JSON.stringify({ parentForm, studentForm, exist }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(router.back())
            .catch(error => console.error("Error:", error));
    };

    return (
        <Layout>
            <Typography variant='h4'>Add Student</Typography>
            <Stack direction="row" alignItems="center">
                <Typography>Parent Exists</Typography>
                <Switch onChange={handleChange} />
            </Stack>
            {
                exist &&
                <Stack>
                    <Stack direction="row" alignItems="center" width="100%" >
                        <FormControl sx={{ color: "black", my: 4, width: "30%" }} >
                            <InputLabel id='parent-label'>Parent Name</InputLabel>
                            <Select
                                labelId='parent-label'
                                id="_id"
                                name="controlled-select-group"
                                value={parentForm._id}
                                onChange={handleParentChange}
                                required
                            >
                                {data.map((parent) => (
                                    <MenuItem
                                        key={parent._id}
                                        value={parent._id}
                                    >
                                        {parent.firstName} {parent.lastName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                    <Typography sx={{ fontSize: 16 }}> Child Information</Typography>
                    <StudentForm handleSubmit={handleSubmit} handleChange={handleStudentChange} inputStyle={inputStyle} form={studentForm} teachers={teachers} add={true} ></StudentForm>
                </Stack>
            }
            {
                !exist &&

                <Stack  >
                    <Stack>
                        <TextField type="number" id="_id" label="Parent QID" variant="filled" sx={inputStyle} onChange={handleParentChange} value={parentForm._id} required />
                        <Stack direction="row" spacing={5} sx={{ my: 2 }} alignItems="center" >
                            <TextField id="firstName" label="First Name" variant="filled" sx={inputStyle} onChange={handleParentChange} value={parentForm.firstName} required />
                            <TextField id="lastName" label="Last Name" variant="filled" sx={inputStyle} onChange={handleParentChange} value={parentForm.lastName} required />
                        </Stack>
                        <Stack direction="row" spacing={5} sx={{ my: 2 }} alignItems="center" >
                            <TextField type="email" id="email" label="Email" variant="filled" sx={inputStyle} onChange={handleParentChange} value={parentForm.email} required />
                            <TextField id="password" label="Password" variant="filled" sx={inputStyle} onChange={handleParentChange} value={parentForm.password} required />
                        </Stack>
                        <Stack direction="row" spacing={5} sx={{ my: 2 }} alignItems="center" >
                            <TextField id="username" label="Username" variant="filled" sx={inputStyle} onChange={handleParentChange} value={parentForm.username} required />
                            <TextField type="tel" id="mobile" label="Mobile" variant="filled" sx={inputStyle} onChange={handleParentChange} value={parentForm.mobile} required />
                        </Stack>
                    </Stack>
                    <Typography sx={{ fontSize: 16 }}> Child Information</Typography>

                    <StudentForm handleSubmit={handleSubmit} handleChange={handleStudentChange} inputStyle={inputStyle} form={studentForm} teachers={teachers} add={true}></StudentForm>
                </Stack>
            }

        </Layout>
    )
}

export default AddStudent