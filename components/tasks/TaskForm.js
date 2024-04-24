import {
    Button, Card, FormControl,
    FormControlLabel, FormLabel,
    InputLabel, MenuItem, Radio,
    RadioGroup, Select, Slider,
    Stack, TextField, Typography,
    Alert, Collapse
} from '@mui/material';
import { useState } from "react";
import { formatDate } from 'utils/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from 'utils/fetcher';

export default function TaskForm({ teacherId, task, setShowState, setCurrentTask }) {
    const surahQuery = useQuery(
        ["surahs"],
        () => fetcher(`http://localhost:3000/api/surah`),
        {
            suspense: true,
            retry: false,
        });

    const studentsQuery = useQuery(
        ["students"],
        () => fetcher(`http://localhost:3000/api/parents?type=teacher&id=${teacherId}`),
        {
            suspense: true,
            retry: false,
        });

    const [studentId, setStudentId] = useState(task ? task.studentId : studentsQuery.data.length ? studentsQuery.data[0]._id : -1);
    const [surahId, setSurahId] = useState(task ? task.surahId : surahQuery.data[0]._id);
    const [surah, setSurah] = useState(surahQuery.data.find(s => s._id == surahId));
    const [ayaRange, setAyaRange] = useState(task ? [task.fromAya, task.toAya] : [1, 2]);
    const [type, setType] = useState(task ? task.type : "Memorization");
    const [errorAlertOpen, setErrorAlertOpen] = useState(false);

    let date = new Date()
    if (task) date = new Date(task.dueDate)
    else date.setDate(date.getDate() + 1)
    const [dueDate, setDueDate] = useState(formatDate(date));

    function handleCancel() {
        setCurrentTask(null)
        setShowState(false)
    }

    // Mutations
    const queryClient = useQueryClient();
    const addTaskMutation = useMutation(async (task) => {
        await fetch(`http://localhost:3000/api/tasks`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
    })
    const editTaskMutation = useMutation(async (task) => {
        await fetch(`http://localhost:3000/api/tasks`,
            {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
    })

    function handleSubmit() {
        try {
            if (studentId == -1) {
                setErrorAlertOpen(true)
                return
            }

            if (!task) task = { teacherId }
            task.studentId = studentId
            task.surahId = surahId
            task.fromAya = ayaRange[0]
            task.toAya = ayaRange[1]
            task.type = type
            task.dueDate = dueDate

            task._id ?
                editTaskMutation.mutate(task, {
                    onSuccess: () => {
                        queryClient.invalidateQueries(["tasks"])
                        setShowState(false)
                    }
                })
                :
                addTaskMutation.mutate(task, {
                    onSuccess: () => {
                        queryClient.invalidateQueries(["tasks"])
                        setShowState(false)
                    }
                })

            setCurrentTask(null)
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <Typography variant="h4" mb={2}>{task ? "Edit" : "Add"} Task</Typography>

            <Collapse in={errorAlertOpen}>
                <Alert
                    severity="error"
                    onClick={() => setErrorAlertOpen(false)}
                >
                    Task details invalid.
                </Alert>
            </Collapse>

            <Card sx={{ p: 2 }}>
                <Stack spacing={3}>
                    <FormControl>
                        <InputLabel id="student-select-label">Student</InputLabel>
                        <Select
                            required
                            labelId="student-select-label"
                            id="student-select"
                            value={studentId}
                            label="Student"
                            onChange={e => setStudentId(e.target.value)}
                        >
                            {studentsQuery.data.map(student => (
                                <MenuItem key={student._id} value={student._id}>{student.firstName} {student.lastName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl>
                        <InputLabel id="surah-select-label">Surah</InputLabel>
                        <Select
                            required
                            labelId="surah-select-label"
                            id="surah-select"
                            value={surahId}
                            label="Surah"
                            onChange={e => {
                                setSurahId(e.target.value)
                                setSurah(surahQuery.data.find(s => s._id == e.target.value))
                                setAyaRange([1, 2])
                            }}
                        >
                            {surahQuery.data.map(surah => (
                                <MenuItem key={surah._id} value={surah._id}>{surah.englishName} - {surah.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ px: 1 }}>
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <FormLabel id="aya-range-label">Aya Range</FormLabel>
                            <Slider
                                min={1}
                                max={surah ? surah.ayaCount : 2}
                                value={ayaRange}
                                onChange={e => setAyaRange(e.target.value)}
                                valueLabelDisplay="auto"
                                sx={{ width: '90%' }}
                            />
                        </Stack>
                    </FormControl>

                    <FormControl sx={{ px: 1 }}>
                        <FormLabel id="type-radio-group-label">Task Type</FormLabel>
                        <RadioGroup
                            aria-labelledby="type-radio-group-label"
                            name="type-radio-group"
                            value={type}
                            onChange={e => setType(e.target.value)}
                        >
                            <Stack direction={'row'}>
                                <FormControlLabel value="Memorization" control={<Radio />} label="Memorization" />
                                <FormControlLabel value="Revision" control={<Radio />} label="Revision" />
                            </Stack>
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        required
                        id="due-date-datepicker"
                        label="Due Date"
                        type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                    />

                    <Stack direction={'row'} spacing={2} justifyContent={'flex-end'}>
                        <Button variant="contained" color="error" onClick={handleCancel}>Cancel</Button>
                        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                    </Stack>
                </Stack>
            </Card>
        </>
    );
}
