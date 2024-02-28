import React, { useContext, useEffect, useState } from "react";
import { Form, Navigate, useActionData } from "react-router-dom";

import { Card, CardContent, TextField, Button, Paper, Typography, Box} from "@mui/material";


import { UserContext } from "../context/UserContext.jsx";
import { useAuth } from "../context/ProtectedRoutes.jsx";

const SERVER = import.meta.env.SERVER;

export async function loginAction({ request }) {
    console.log("loginAction called");

    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');

    if (email.includes("@")) {
        const timestamp = new Date().toISOString();
        try {
                // Send post request to server
                const response = await fetch(SERVER+'/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 'name': name, 'email': email, 'timestamp': timestamp }) 
                });
                return { name: name, email: email, error: null };

       } catch (error) {
           console.error("Error:", error);
           return { name: null, email: null, error: "Error: " + error};
       }    

    } else {
        alert("Please enter a valid email address");
        return { name: null, email: null, error: "Invalid email" };
    }
};

export default function Login() {
    const actionData = useActionData();
    const { updateUser, initGameSettings } = useContext(UserContext);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    console.log("useAuth: ", useAuth());

    useEffect(() => {

        if (actionData?.name && actionData?.email) {
            updateUser(actionData.name, actionData.email);

            // Initalize chatbot role and other configs once user is logged in
            initGameSettings();
            
            // Redirect to game page
            setShouldRedirect(true);
        }
      }, [actionData]);

    if (shouldRedirect) {
        return <Navigate to="/game" replace/>;
    }

    return (

        <Paper elevation={6} sx={{ padding: 3, maxWidth: 400, margin: "auto" }} className="login">
            <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>Login</Typography>
            <Typography variant="h6" gutterBottom>Enter your email and name</Typography>
            <Typography variant="subtitle2" gutterBottom>Please make sure they are the same as your response in <a href="https://forms.gle/5JNW1bdsGJmHFRgx6">our Google Form</a> </Typography> 
            
            <Box component="form" noValidate autoComplete="off" onSubmit={loginAction} sx={{ mt: 2 }}>
                {actionData?.error && <p>{error}</p>}
                <TextField
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Email"
                    required
                />
                <br/>
                <TextField
                    name="name"
                    label="Name"
                    type="text"
                    placeholder="Name"
                    required
                    sx={{ mt: 2 }}
                />
                <br/>

                <Button type="submit" variant="contained" sx={{ mt: 4 }}>Confirm</Button> 
            </Box>
        </Paper>

    );
}