import React, { useContext, useState, useEffect } from 'react';
import { Link, Form, useActionData, Navigate } from "react-router-dom";
import { Card, CardContent, FormControl, RadioGroup, FormControlLabel, Radio, Button, Typography, Box, TextField } from '@mui/material';
import { UserContext } from "../context/UserContext.jsx";

const SERVER = import.meta.env.VITE_SERVER;

export async function postTestAction({ request }) {
  console.log("postTestAction called");
  const data = await request.formData();

  const formData = {
      email: data.get('email'),
      q1: data.get('q1'),
      q2: data.get('q2'),
      q3: data.get('q3'),
      q4: data.get('q4'),
      q5: data.get('q5'),
    };

  const jsonData = JSON.stringify(formData);

  try{
    //  Send jsonData to the server 
    const response = await fetch(SERVER+'/api/post-test', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonData,
    }).then(console.log("post-test data sent to server"));
  }
  catch (error) {
    console.error('Error');
    return {redirect: true};
  }

  return {redirect: true};
}



export default function Post() {
  const actionData = useActionData();
  const { userEmail, userCompletedPostTest, completePostTest } = useContext(UserContext);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const [responses, setResponses] = React.useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
  });

  const questions = [
    "To what degree did you feel that chatbots were capable in answering questions and providing suggestions?",
    "To what degree did you feel that chatbot's explanation of each given suggestion was accurate?",
    "To what degree did you feel that chatbots were professional in desert survival knowledge?",
    "To what degree did you feel that chatbots’ suggestions and responses were effective in guiding your decision-making?",
    "To what degree did you feel that chatbots provided clear reasons in their reponses and suggestions?",
  ];

  const handleResponseChange = (question, value) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [question]: value,
    }));
  };

  const handleComplete = () => {
    completePostTest();
  }

  useEffect(() => {

    if (userCompletedPostTest) {
        // Redirect to game page
        setShouldRedirect(true);
    }
  }, []);

  if (actionData?.redirect || shouldRedirect) {
    completePostTest();
    return <Navigate to="/end" replace/>;
  }

  return (
    <Box sx={{ margin: '20px', maxWidth: '1200px', padding:'20px' }}>
      <Typography variant="h3" component="h3" gutterBottom>
        Post-test Survey
      </Typography>
      <Typography variant="p" component="h3" gutterBottom>
        Before finished the study, here are 5 quick questions for you.
      </Typography>  
      <Form className="auth-container" method="post" action={postTestAction}>
        <br/>  
        <FormControl component="fieldset" sx={{ width: '100%' }}>    
        {questions.map((question, index) => (
          <Card key={index} sx={{ margin: '20px 60px' , padding:'20px 30px'}}>
        <CardContent>
            <Typography variant="h6" component="legend" sx={{ wordWrap: 'break-word' }}>{question}</Typography>
            <br />
            <RadioGroup
            row
            required
            aria-label={`question-${index + 1}`}
            name={`q${index + 1}`}
            value={responses[`q${index + 1}`]}
            onChange={(event) => handleResponseChange(`q${index + 1}`, event.target.value)}
            sx={{ justifyContent: 'center' }} // Add this line to center-align the options
            >
              {['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'].map((label, value) => (
                <FormControlLabel key={value} value={String(value)} control={<Radio />} label={label} />
              ))}
            </RadioGroup>
        </CardContent>
          </Card>
        ))}
        <Card key="other" sx={{ margin: '20px 60px' , padding:'20px 30px'}}>
          <CardContent>
            <Typography variant="h6" component="legend" sx={{ wordWrap: 'break-word' }}>Do you have any other thoughts or questions about this study? (Optional)</Typography>
            <br />
            <TextField
                    name="other"
                    type="text"
                    placeholder=""
                    fullWidth
                />
          </CardContent>
        </Card>
        <br/>
        </FormControl>
        <input name='email' readOnly hidden value={ userEmail || "Error"} />

        <Button variant="contained" color="primary" type="submit" size="large" onClick={handleComplete} disabled={Object.values(responses).some(value => value === '') || actionData?.redirect}>Submit</Button>

      </Form>
    </Box>
  );
}
