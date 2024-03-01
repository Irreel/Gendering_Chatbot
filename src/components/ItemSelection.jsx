import React, { useState, useContext} from 'react';
import { GameBehaviorContext } from '../context/GameBehaviorContext.jsx';

import { Box, Grid, Paper, Radio, RadioGroup, FormControlLabel, Typography, Button, Card } from '@mui/material';

const questions = [
    {
      idx: 0,
      name: 'pair1',
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
      idx: 1,
      name: 'pair2',
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
      idx: 2,
      name: 'pair3',
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
      idx: 3,
      name: 'pair4',
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
      idx: 4,
      name: 'pair5',
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
  
  

function ItemSelection({ onConfirm, onPairConfirm, isTyping }) {
  const { confirmAllow, setCurrentSelection, nextStage } = useContext(GameBehaviorContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionChange = (selectedValue) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [currentQuestionIndex]: selectedValue,
    }));
  };

  const handleConfirmClick = async (event) => {

    // Whether this will trigger conversation
    const selectedValue = selectedOptions[currentQuestionIndex];
    const currentOptions = questions[currentQuestionIndex].options;
    const unselectedOption = currentOptions.find(option => option.value !== selectedValue);
    const triggered = await onPairConfirm(currentQuestionIndex, selectedValue, unselectedOption.value);
    
    // If not triggered, move to the next question
    if (!triggered.result) {
      if (currentQuestionIndex < questions.length - 1) {
        // Move to the next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentSelection('unSelected');
        nextStage();
      } else {
        // Last question was answered, call the onConfirm prop with all selected options
        onConfirm(selectedOptions);
      }
    }

  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card variant="outlined" sx={{ m: 2, padding: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Desert Survival Game
      </Typography>
      <Typography variant="body1" align="left" gutterBottom>
        Suppose you are in a desert survival game and need to choose the most essential items for survival. Here are the given items in pairs, choose one from the pair below:
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ m: 3, fontWeight: 'bold'}}>
        {currentQuestion.title}
      </Typography>
      <RadioGroup
        name={currentQuestion.name}
        value={selectedOptions[currentQuestionIndex] || ''}
        onChange={(e) => handleOptionChange(e.target.value)}
      >
        {currentQuestion.options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', ml: 1, mb: 1}}>
                <Typography variant="subtitle1" sx={{width: '100px', fontWeight: 'bold'}} align="left">
                  {option.value}
                </Typography>
                <Typography variant="body1" align="left" sx={{ flex: 1 }}>
                  {option.description}
                </Typography>
              </Box>
            }
            sx={{ alignItems: 'center', m: 1 }}
          />
        ))}
      </RadioGroup>
      {confirmAllow ? (
        <Button variant="contained" onClick={handleConfirmClick} sx={{ mt: 2 }} disabled={isTyping}>
          Confirm
        </Button>
      ) : (
        <Button variant="contained" disabled sx={{ mt: 2 }}>
          Please Reply in the Chatbox
        </Button>
      )}
    </Card>
  );
}


export default ItemSelection;
