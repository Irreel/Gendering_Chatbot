import React, { Component } from 'react';
import { Link, Form } from "react-router-dom";

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
      email: '',
      name: '',
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

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

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
      <div>
        <h3>Post-test Survey</h3>
        <Form className="survey">
          <input
            placeholder="Email"
            type="text"
            name="email"
            onChange={this.handleInputChange}
          />
          <br />
          <input
            placeholder="Name"
            type="text"
            name="name"
            onChange={this.handleInputChange}
          />
          <br />
          {questions.map((question, index) => (
            <div key={index}>
              <p>{question}</p>
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value}>
                  <input
                    type="radio"
                    name={`q${index + 1}`}
                    value={value}
                    onChange={() => this.handleResponseChange(`q${index + 1}`, value)}
                  />
                  {value}. {['Totally Disagree', 'Disagree', 'Neutral', 'Agree', 'Totally Agree'][value - 1]}
                </label>
              ))}
              <br />
            </div>
          ))}
          <Link to={`/end`}>
            <button type="submit">Submit</button>
          </Link>

        </Form>
      </div>
    );
  }
}

export default Post;
