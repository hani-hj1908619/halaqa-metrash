//students page
import { Button, Grid, Typography, Stack } from "@mui/material";
import { Container } from "@mui/system";
import Layout from "components/layout";
import StudentCard from "components/student/studentCard";
import Link from "next/link";
import * as React from "react";
import { useEffect, useState } from "react";
import useGlobalStore from "stores/global-store";
import AddIcon from "@mui/icons-material/Add";
import useStudentCardStore from "stores/student-card-store";
import { getSession } from "next-auth/react";

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

export default function StudentsPage() {
    const [students, setStudents] = useState([])

    const userId = useGlobalStore(state => state.userId)
    const userType = useGlobalStore(state => state.userType)
    const switchChange = useStudentCardStore(state => state.statusChanged)

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
                setStudents(json)
            } catch (error) {
                console.log(error)
            }

        })();
    }, [userId, userType, switchChange])

    if (students.length === 0 || !userType) {
        return (
            <Layout title={'Students'}>
                <Typography>No students to view</Typography>
            </Layout>)
    }

    return (
        <Layout title={'Students'}>
            <Stack mb={2} direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">Students</Typography>
                {userType == "coordinator" ?
                    (<Link href="/halaqa/students/add">
                        <Button variant="contained" startIcon={<AddIcon />}>
                            Add
                        </Button>
                    </Link>) : <></>}

            </Stack>
            <Container spacing={2}>

            </Container>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {students &&
                    userType == "parent" ?
                    (students.map((s, index) => (
                        <Grid item xs={2} sm={4} md={4} key={index}>
                            <StudentCard student={s}></StudentCard>
                        </Grid>
                    ))) :
                    userType == "coordinator" ?
                        (students.map((s, index) => (
                            s.students.map((student) => (<Grid item xs={2} sm={4} md={4} key={student._id}>
                                <StudentCard student={student} parentId={s._id} ></StudentCard>
                            </Grid>))
                        ))) :
                        (students.map((student, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                                <StudentCard student={student}></StudentCard>
                            </Grid>
                        )))
                }
            </Grid>
        </Layout>
    );
}
