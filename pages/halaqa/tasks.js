import { Button, Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Layout from "components/layout";
import CompleteForm from "components/tasks/CompleteForm";
import TaskForm from "components/tasks/TaskForm";
import TasksTable from "components/tasks/TasksTable";
import { useState } from "react";
import useGlobalStore from "stores/global-store";
import { fetcher } from 'utils/fetcher';
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

export default function Tasks() {
    const userType = useGlobalStore((state) => state.userType)
    const userId = useGlobalStore((state) => state.userId)

    const query = useQuery(
        ["tasks"],
        () => fetcher(`http://localhost:3000/api/tasks?type=${userType}&id=${userId}`),
        {
            suspense: true,
            retry: false,
        }
    );

    const [currentTask, setCurrentTask] = useState(null)
    const [showManageTask, setShowManageTask] = useState(false)
    const [showCompleteTask, setShowCompleteTask] = useState(false)
    const [showPending, setShowPending] = useState(false)

    const queryClient = useQueryClient();
    const deleteTaskMutation = useMutation(async (_id) => {
        await fetch(`http://localhost:3000/api/tasks`,
            {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id })
            });
    })

    function handleDelete(taskId) {
        deleteTaskMutation.mutate(taskId, { onSuccess: () => queryClient.invalidateQueries(["tasks"]) })
    }

    if (!query.data) {
        return (
            <Layout>
                <Typography variant="h2" component="h2" sx={{ color: "#141414" }}>
                    No New Tasks
                </Typography>
            </Layout>
        )
    }

    return (
        <Layout title={'Tasks'}>
            {!showManageTask && !showCompleteTask &&
                <>
                    <Stack direction={'row'} mb={2} justifyContent="space-between" alignItems="center">
                        <Typography variant="h4">Tasks</Typography>
                        {userType == "teacher" &&
                            <Button variant="contained" onClick={() => setShowManageTask(true)}>Add Task</Button>}
                    </Stack>

                    <FormControlLabel
                        label="Show pending only"
                        control={
                            <Checkbox
                                checked={showPending}
                                value={showPending}
                                onChange={e => setShowPending(e.target.checked)}
                            />}
                    />

                    <TasksTable
                        userType={userType}
                        tasks={query.data}
                        showPending={showPending}
                        setShowComplete={setShowCompleteTask}
                        setShowManage={setShowManageTask}
                        setCurrentTask={setCurrentTask}
                        handleDelete={handleDelete}
                    />
                </>
            }

            {showManageTask &&
                <TaskForm teacherId={userId} task={currentTask} setShowState={setShowManageTask} setCurrentTask={setCurrentTask} />
            }

            {showCompleteTask &&
                <CompleteForm task={currentTask} setShowState={setShowCompleteTask} setCurrentTask={setCurrentTask} />
            }
        </Layout >
    );
}