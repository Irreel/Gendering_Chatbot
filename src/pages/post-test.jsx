import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Typography, Box } from '@mui/material';

const SERVER = import.meta.env.VITE_SERVER;

export async function postTestAction({ request }) {
  console.log("postTestAction called");

  const data = await request.formData();
  const formData = {
      email: data.get('email'),
      name: data.get('name'),
      q1: data.get('q1'),
      q2: data.get('q2'),
      q3: data.get('q3'),
      q4: data.get('q4'),
      q5: data.get('q5'),
    };

  const jsonData = JSON.stringify(formData);

  // Send jsonData to the server 
  const response = await fetch(SERVER+'/api/post-test', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: jsonData,
  });
}

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responses: {
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        q5: '',
      },
    };
  }

  handleResponseChange = (question, value) => {
    this.setState(prevState => ({
      responses: {
        ...prevState.responses,
        [question]: value,
      },
    }));
  };


  render() {
    const questions = [
      "To what degree did you feel that chatbots were capable in answering questions and providing suggestions?",
      "To what degree did you feel that chatbot's explanation of each given suggestion was accurate?",
      "To what degree did you feel that chatbots were professional in desert survival knowledge?",
      "To what degree did you feel that chatbots’ suggestions and responses were effective in guiding your decision-making?",
      "To what degree did you feel that chatbots provided clear reasons in their reponses and suggestions?",
    ];

    return (
      <Box sx={{ margin: '20px', maxWidth: '1200px', padding:'20px' }}> {/* Adjust the maxWidth as needed */}
        <Typography variant="h3" component="h3" gutterBottom>
          Post-test Survey
        </Typography>
        {questions.map((question, index) => (
          <Card key={index} sx={{ margin: '10px 0' , padding:'20px 30px'}}>
            <CardContent>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormLabel component="legend" sx={{ wordWrap: 'break-word' }}>{question}</FormLabel>
                <RadioGroup
                  aria-label={`question-${index + 1}`}
                  name={`q${index + 1}`}
                  value={this.state.responses[`q${index + 1}`]}
                  onChange={(event) => this.handleResponseChange(`q${index + 1}`, event.target.value)}
                >
                  {['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'].map((label, value) => (
                    <FormControlLabel key={value} value={String(value + 1)} control={<Radio />} label={label} />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        ))}
        <Link to={`/end`} style={{ textDecoration: 'none', marginTop: '20px', display: 'block' }}>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Link>
      </Box>
    );
  }
}

export default Post;
