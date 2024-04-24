import {
    Button, Card, FormControl,
    InputLabel, MenuItem, Select,
    Stack, TextField, Typography
} from '@mui/material';
import { useState } from "react";
import { formatDate } from 'utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function CompleteForm({ task, setShowState, setCurrentTask }) {
    const [mastery, setMastery] = useState("Excellent");
    const [comment, setComment] = useState("");
    const [completedDate, setCompletedDate] = useState(formatDate(new Date()));

    function handleCancel() {
        setCurrentTask(null)
        setShowState(false)
    }

    // Mutation
    const queryClient = useQueryClient();
    const completeTaskMutation = useMutation(async (task) => {
        await fetch(`http://localhost:3000/api/tasks`,
            {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
    })

    function handleSubmit() {
        task.masteryLevel = mastery
        task.completedDate = completedDate
        if (comment) task.comment = comment

        completeTaskMutation.mutate(task, {
            onSuccess: () => {
                queryClient.invalidateQueries(["tasks"])
                setShowState(false)
                setCurrentTask(null)
            }
        })
    }

    return (
        <>
            <Typography variant="h4" mb={2}>Complete Task</Typography>

            <Card sx={{ p: 2 }}>
                <Stack spacing={3}>
                    <Typography>Task: {task._id}</Typography>

                    <FormControl>
                        <InputLabel id="mastery-select-label">Mastery Level</InputLabel>
                        <Select
                            required
                            labelId="mastery-select-label"
                            id="mastery-select"
                            value={mastery}
                            label="Mastery"
                            onChange={e => setMastery(e.target.value)}
                        >
                            <MenuItem value={"Excellent"}>Excellent</MenuItem>
                            <MenuItem value={"Ok"}>Ok</MenuItem>
                            <MenuItem value={"Poor"}>Poor</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        id="comment-textfield"
                        label="Comment"
                        value={comment}
                        onChange={e => setComment(e.target.value)} />

                    <TextField
                        id="completed-date-datepicker"
                        label="Completion Date"
                        type="date"
                        value={completedDate}
                        onChange={e => setCompletedDate(e.target.value)}
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
