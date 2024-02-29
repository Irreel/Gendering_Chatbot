import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Paper, Radio, RadioGroup, FormControlLabel, Typography, Button, Card } from '@mui/material';
import reactLogo from '../assets/react.svg';

const questions = [
    {
      id: 'pair1',
      title: 'Canvas vs. Tarp',
      options: [
        {
          value: 'Canvas',
          description: 'A canvas could be spread out for shade, cool the temperature beneath and be spotted by search parties.',
        },
        {
          value: 'Tarp',
          description: 'A tarp could purify water and be spotted by search parties.',
        },
      ],
    },
    {
      id: 'pair2',
      title: 'Chocolate vs. Water',
      options: [
        {
          value: 'Chocolate',
          description: 'Some chocolates could be used to sustain the energy you need to gather firewood and other materials, preventing fatigue and starvation.',
        },
        {
          value: 'Water',
          description: 'Two quarts of water could be enough to prevent dehydration for a few days.',
        },
      ],
    },
    {
      id: 'pair3',
      title: 'Mirror vs. Compass',
      options: [
        {
          value: 'Mirror',
          description: 'A flat mirror could be used to signal search parties and seen across the horizon in a desert setting.',
        },
        {
          value: 'Compass',
          description: 'A compass could be used to navigate your way to the nearest village, and also reflect sunlight to signal search parties.',
        },
      ],
    },
    {
      id: 'pair4',
      title: 'Flashlight vs. Matches',
      options: [
        {
          value: 'Flashlight',
          description: 'A flashlight could be used at night to signal search parties and help you navigate when moving at night.',
        },
        {
          value: 'Matches',
          description: 'Some matches could be used to start fires and make smokes to signal search parties and provide warmth at night.',
        },
      ],
    },
    {
      id: 'pair5',
      title: 'Knife vs. Pistol',
      options: [
        {
          value: 'Knife',
          description: 'A knife can cut down stakes to build a solar still or to build shelter, and cut down firewood for a fire.',
        },
        {
          value: 'Pistol',
          description: 'A pistol can be good for signaling for help, and provide an alternative noise source if your voice is weak due to dehydration.',
        },
      ],
    },
  ];
  

  function ItemSelection({ onPairConfirm, handleSelectedComplete }) {
    const navigate = useNavigate(); // Step 2: Use useNavigate to get the navigate function
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
  
    const handleOptionChange = (event, value) => {
      const currentQuestionId = questions[currentQuestionIndex].id;
      setSelectedOptions(prevOptions => ({
        ...prevOptions,
        [currentQuestionId]: value,
      }));
    };
  
    const handleConfirmClick = () => {
      const currentQuestionId = questions[currentQuestionIndex].id;
      onPairConfirm(currentQuestionId, selectedOptions[currentQuestionId]);
  
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        handleSelectedComplete(selectedOptions);
        navigate('/post-test'); // Step 3: Navigate to /post-test after the last question
      }
    };
  
    const currentQuestion = questions[currentQuestionIndex];
  
    return (
      <Card variant="outlined" sx={{ m: 2, p: 3 }}>
        <Typography variant="h5" gutterBottom>Desert Survival Game</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Suppose you are in a desert survival game and need to choose the most essential items for survival. Here are the given items in pairs, choose one from each pair below:
        </Typography>
        {currentQuestion ? (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              {currentQuestion.title}
            </Typography>
            <RadioGroup
              name={currentQuestion.id}
              value={selectedOptions[currentQuestion.id] || ''}
              onChange={handleOptionChange}
            >
              {currentQuestion.options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={`${option.value}: ${option.description}`}
                />
              ))}
            </RadioGroup>
            <Button variant="contained" onClick={handleConfirmClick} sx={{ mt: 2 }}>
              Confirm
            </Button>
          </>
        ) : (
          <Typography variant="body2">Loading questions...</Typography>
        )}
      </Card>
    );
  }
  
  export default ItemSelection;