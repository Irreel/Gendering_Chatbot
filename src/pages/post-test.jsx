import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
        <div className="survey">
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
        </div>
      </div>
    );
  }
}

export default Post;
