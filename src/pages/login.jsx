import React, { useContext } from "react";
import { Form, Navigate, useActionData } from "react-router-dom";
import { Card, TextField, Button } from "@mui/material";
import { UserContext } from "../context/UserContext.jsx";

export async function loginAction({ request }) {
    console.log("loginAction called");

    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');

    console.log(name);
    console.log(email);

    if (email.includes("@")) {
       try {

                // // Send post request to server
                // const response = await fetch('/api/login', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({ name, email })
                // });
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
    const { updateUser } = useContext(UserContext);

    if (actionData?.user && actionData?.email) {
        console.log(actionData.user, actionData.email);
        updateUser(actionData.user, actionData.email);

        console.log("User updated in login.jsx");
        console.log(actionData.user, actionData.email);

        return <Navigate to="/game" />;
    }


    return (
        <Card className="login">
            <h3>Login</h3>
            <h5>Enter your email and name</h5>
            <h5>Please make sure they are the same as your response in <a href="#">our Google Form</a> </h5> 
            
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
        </Card>
    );
}