import {
    Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography
} from '@mui/material';
import Image from 'next/image';
import useGlobalStore from "../../stores/global-store";
import useStudentStore from "../../stores/students-store";


const MessageForm = ({ setEnableForm, handleSubmit, handleChange, inputStyle, form, actionType, error }) => {
    const userType = useGlobalStore(state => state.userType)
    const student = useStudentStore(state => state.student)
    const students = useStudentStore(state => state.students)

    return (<Box sx={{ bgcolor: 'background.paper', margin: "auto", marginTop: 'auto', padding: '5rem' }} maxWidth={'md'}>
        <form onSubmit={handleSubmit}>
            <Stack direction="column" spacing={5} sx={{ my: 2, margin: 'auto' }} alignItems="stretch">
                <Typography variant={"h3"}>{actionType === 'add' ? 'Add Message ' : 'Edit Message'}</Typography>
                <FormControl sx={{ alignItems: "stretch" }}>

                    <FormControl>
                        <Stack alignItems={"stretch"}>
                            <InputLabel id="demo-simple-select-helper-label" sx={{ mt: "2%" }}>Student</InputLabel>
                            <Select
                                disabled
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                value={student._id}
                                label="Student"
                            >
                                <MenuItem value={student._id}>{student.firstName} {student.lastName}</MenuItem>
                            </Select>
                        </Stack>
                    </FormControl>

                    <Stack direction="column" spacing={5} sx={{ mt: "2%" }} alignItems="stretch"
                        justifyContent={'space-between'}>

                        <Stack direction="row" spacing={5} sx={{ my: 2 }} alignItems="center">
                            <TextField id="dob" label="Message Date" type="text" variant="filled" disabled
                                helperText=" "
                                sx={inputStyle}
                                value={form?.date ? form.date.substring(0, 10) : form?.date} />


                            <TextField label="Image" name="image" id="image" type="file" variant="filled" error={actionType.type === 'edit' && (form.image) ? false : error.imageError}
                                onChange={handleChange} helperText={actionType.type === 'edit' && (!error.imageError) ? '' : 'Image size must be less than 500 KB'}
                                InputLabelProps={{ shrink: true }} />

                        </Stack>

                        {form.image &&
                            <Image
                                unoptimized
                                alt='Message image'
                                className={'.image'}
                                src={form.image}
                                width={150} height={150}
                            />
                        }

                        <TextField id="message" name="message" label="Message Content" variant="filled" error={error.messageError}
                            onChange={handleChange} value={form.message} multiline rows={4} required helperText={error.messageError ? 'Message content is empty!.' : ''} />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ width: "30%" }}
                        >
                            Save
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            sx={{ width: "30%" }}
                            onClick={(e) => setEnableForm(false)}
                        >
                            Cancel
                        </Button>
                    </Stack>

                </FormControl>
            </Stack>
        </form>
    </Box>)
}
export default MessageForm