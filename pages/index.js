import {
  Box, Button, Card, CardActions,
  CardContent, Checkbox, Container, FormControlLabel, FormGroup, Stack, TextField, Typography
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "styles/Home.module.css";
import { signIn, signOut } from "next-auth/react"
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Home() {
  const [loginDetails, setLoginDetails] = useState({ username: "", password: "" })
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/staff/`).then(() => {
      console.log("Initialized staff here")
    })
    fetch("/api").then(() => {
      console.log("Init surah, students, announcement here")
    })
  }, [])

  const handleChange = (event, type) => {
    switch (type) {
      case "username":
        setLoginDetails({ ...loginDetails, username: event.target.value });
        break;
      case "password":
        setLoginDetails({ ...loginDetails, password: event.target.value });
        break;
    }
  };

  const handleGoogleSign = async () => {
    signIn('google', { callbackUrl: "http://localhost:3000/halaqa/announcements" })
  }

  const handleGithubSign = async () => {
    signIn('github', { callbackUrl: "http://localhost:3000/halaqa/announcements" })
  }

  const handleSignIn = async () => {
    const status = await signIn('credentials', {
      redirect: false,
      username: loginDetails.username,
      password: loginDetails.password,
      callbackUrl: "/halaqa/announcements"
    })
    console.log(status)
    if (status.ok) {
      router.push(status.url)
    }
  }

  const loginCard = (
    <>
      <CardContent>
        <Box
          justifyContent="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography variant="h5" component="div">
            Welcome to Halaqa Metrash
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Please Sign in.
          </Typography>
        </Box>
        <Box sx={{ width: "100%", mt: "5%" }}>
          <FormGroup>
            <Stack spacing={2} sx={{ alignItems: "center" }}>
              <TextField
                id="email"
                label="Email"
                value={loginDetails.username}
                onChange={(e) => handleChange(e, "username")}
                variant="outlined"
                sx={{ width: "80%" }}
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                value={loginDetails.password}
                onChange={(e) => handleChange(e, "password")}
                variant="outlined"
                sx={{ width: "80%" }}
              />
            </Stack>

          </FormGroup>
        </Box>
      </CardContent>
      <CardActions sx={{ mr: "10.5%", justifyContent: "flex-end" }}>
        <Stack direction="row" gap={9}>
          <Stack direction="row" gap={2}>
            <Button variant="contained" startIcon={<GoogleIcon />} onClick={handleGoogleSign}>Google Sign In</Button>
            <Button variant="contained" startIcon={<GitHubIcon />} onClick={handleGithubSign}>Github Sign In</Button>
          </Stack>
          <Button
            onClick={(e) => handleSignIn()}
            variant="contained"
          >
            Login
          </Button>
        </Stack>
      </CardActions>
    </>
  );

  return (
    <main className={styles.main}>
      <Container maxWidth="md">
        <Card variant="outlined" sx={{ p: "5%" }}>
          {loginCard}
        </Card>
      </Container>
    </main>
  );
}
