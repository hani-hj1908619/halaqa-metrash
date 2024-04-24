import { Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import useGlobalStore from '../../stores/global-store'
import Switch from '../switch/ant-switch'
import useStudentCardStore from '../../stores/student-card-store'
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link'

const StudentCard = ({ student, parentId }) => {
    const userType = useGlobalStore(state => state.userType)
    const [status, setStatus] = useState(student.active)

    const switchChange = useStudentCardStore(state => state.setStatusChanged)

    const changeState = () => {
        setStatus(!status)
        switchChange()
    }

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" >
                    <Typography variant="h6" component="div">
                        ID: {student._id}
                    </Typography>
                    {
                        userType == "coordinator" &&
                        <Link href={`/halaqa/students/update?parentId=${parentId}&childId=${student._id}`}>
                            <IconButton>
                                <EditIcon></EditIcon>
                            </IconButton>
                        </Link>

                    }
                </Stack>

                <Typography variant="h6" component="div">
                    <strong>Name:</strong> {student.firstName} {student.lastName}
                </Typography>
                <Typography variant="h6" component="div">
                    <strong> Gender:</strong> {student.gender}
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between" >
                    <Typography variant="h6" component="div">
                        <strong> Status:</strong> {(status == true ? "active" : "inactive")}
                    </Typography>
                    {userType == "coordinator" &&
                        <Switch student={student} parentId={parentId} switchStatus={status} changeState={changeState} ></Switch>
                    }
                </Stack>
                {
                    userType != "teacher" ?
                        <Typography variant="h6" component="div">
                            <strong>Teacher Name:</strong> {student.teacherId.firstName} {student.teacherId.lastName}
                        </Typography> :
                        <></>
                }
            </CardContent>
        </Card>
    )
}

export default StudentCard