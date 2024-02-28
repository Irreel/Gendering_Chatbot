import React, { useContext, useEffect, useState } from "react";
import { Form, Navigate, useActionData } from "react-router-dom";
import { Card, TextField, Button, CardContent } from "@mui/material";
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
        <Card className="login">
            <CardContent>
            <h3>Login</h3>
            <h5>Enter your email and name</h5>
            <h5>Please make sure they are the same as your response in <a href="https://forms.gle/5JNW1bdsGJmHFRgx6">our Google Form</a> </h5> 
            
            <Form className="auth-container" method="post" action={loginAction}>
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
                />
                <br/>
                <Button type="submit" variant="contained">Confirm</Button> 
            </Form>
            </CardContent>
        </Card>
    );
}