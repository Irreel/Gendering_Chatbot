import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Typography, Box } from '@mui/material';

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
      q6: data.get('q6'),
    };

  const jsonData = JSON.stringify(formData);

  // Send jsonData to the server 
  const response = await fetch('/api/post-test', { //TODO
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
        q6: '',
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
      "How effective or ineffective do you feel about chatbots’ suggestions and responses?",
      "How biased or unbiased do you feel about chatbot’s suggestions and responses?",
      "How capable or incapable do you feel about the chatbot's skill in providing useful suggestions?",
      "How rational or irrational do you feel about the chatbot's given suggestions?",
      "How professional or unprofessional do you feel about the chatbot’s desert survival knowledge?",
      "To what degree did chatbot help you during the decision-making process?",
    ];

    return (
      <Box sx={{ margin: '20px', maxWidth: '1200px', padding:'20px' }}> {/* Adjust the maxWidth as needed */}
        <Typography variant="h3" component="h3" gutterBottom>
          Post-test Survey
        </Typography>
        {questions.map((question, index) => (
          <Card key={index} sx={{ margin: '10px 0' , padding:'20px 30px'}}>
            <CardContent>
              <FormControl component="fieldset" sx={{ width: '100%' }}> {/* Ensure FormControl takes the full width */}
                <FormLabel component="legend" sx={{ wordWrap: 'break-word' }}>{question}</FormLabel>
                <RadioGroup
                  aria-label={`question-${index + 1}`}
                  name={`q${index + 1}`}
                  value={this.state.responses[`q${index + 1}`]}
                  onChange={(event) => this.handleResponseChange(`q${index + 1}`, event.target.value)}
                >
                  {['Totally Disagree', 'Disagree', 'Neutral', 'Agree', 'Totally Agree'].map((label, value) => (
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
