import React, { useEffect, useState } from 'react'
import { Button, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, TextField, } from '@mui/material';
import { FormControl } from '@mui/material';

const StudentForm = ({ handleSubmit, handleChange, inputStyle, form, teachers, add = false }) => {

  return (
    <form onSubmit={handleSubmit} >
      <FormControl sx={{ width: "100%" }}>
        {add && (<TextField type="number" id="_id" label="Child QID" variant="filled" sx={inputStyle} onChange={handleChange} value={form._id} required />)}
        <Stack direction="row" spacing={5} sx={{ my: 2 }} alignItems="center" >
          <TextField id="firstName" label="First Name" variant="filled" sx={inputStyle} onChange={handleChange} value={form.firstName} required />
          <TextField id="lastName" label="Last Name" variant="filled" sx={inputStyle} onChange={handleChange} value={form.lastName} required />
        </Stack>

        <TextField id="dob" label="Date of Birth" type="date" variant="filled" sx={inputStyle} onChange={handleChange} value={form.dob} required />
        <RadioGroup
          name="gender"
          value={form.gender}
          onChange={handleChange}
          row
          sx={{ my: 1, width: "20%", borderRadius: 5 }}
          required
        >
          <FormControlLabel value="F" control={<Radio />} label="Female" />
          <FormControlLabel value="M" control={<Radio />} label="Male" />
        </RadioGroup>

        <TextField sx={inputStyle} type="number" id="schoolGrade" label="School Grade" variant="filled" onChange={handleChange} value={form.schoolGrade} required />
        <FormControl>
          <InputLabel id='teacher-label' sx={{ marginTop: 2 }} >Teacher Name</InputLabel>
          <Select
            labelId='teacher-label'
            id="teacherId"
            name="controlled-select-group"
            onChange={handleChange}
            value={form.teacherId}
            sx={{ color: "black", marginTop: 3, marginBottom: 5, width: "30%" }}
            required
          >
            {teachers.map((teacher) => (
              <MenuItem
                key={teacher._id}
                value={teacher._id}
              >
                {teacher.firstName} {teacher.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ width: "30%" }}
        >
          Save
        </Button>

      </FormControl>
    </form>
  )
}

export default StudentForm