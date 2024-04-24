import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export default function TasksTable({ userType, tasks, showPending, setShowManage, setShowComplete, setCurrentTask, handleDelete }) {
    if (showPending) tasks = tasks.filter(t => !t.completedDate)
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Tasks table" stickyHeader >
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Task</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Surah</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Ayas</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Due</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Completed</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Mastery Level</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Comment</TableCell>
                        {userType == "teacher" && <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow
                            key={task._id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell>{task._id}</TableCell>
                            <TableCell >{task.studentId}</TableCell>
                            <TableCell >{task.type}</TableCell>
                            <TableCell >{task.surahId}</TableCell>
                            <TableCell >{task.fromAya} - {task.toAya}</TableCell>
                            <TableCell >{new Date(task.dueDate).toDateString()}</TableCell>
                            <TableCell >
                                {task.completedDate ? new Date(task.completedDate).toDateString() : "-"}
                            </TableCell>
                            <TableCell >{task.masteryLevel ? task.masteryLevel : "-"}</TableCell>
                            <TableCell >{task.comment ? task.comment : "-"}</TableCell>
                            {userType == "teacher" &&
                                <TableCell >
                                    <Stack direction={'row'}>
                                        <IconButton
                                            aria-label="complete"
                                            disabled={task.completedDate ? true : false}
                                            onClick={() => {
                                                setCurrentTask(task)
                                                setShowComplete(true)
                                            }}
                                        >
                                            <CheckIcon />
                                        </IconButton>

                                        <IconButton
                                            aria-label="edit"
                                            disabled={task.completedDate ? true : false}
                                            onClick={() => {
                                                setCurrentTask(task)
                                                setShowManage(true)
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton
                                            aria-label="delete"
                                            disabled={task.completedDate ? true : false}
                                            onClick={() => handleDelete(task._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}