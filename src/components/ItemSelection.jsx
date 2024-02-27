import React, { useState } from 'react';
import reactLogo from '../assets/react.svg';
// import Card from '@mui/material/Card';

const questions = [
    {
      id: 'pair1',
      title: 'Canvas vs. Tarp',
      options: [
        {
          value: 'canvas',
          description: 'A canvas could be spread out for shade, cool the temperature beneath and be spotted by search parties.',
        },
        {
          value: 'tarp',
          description: 'A tarp could purify water and be spotted by search parties.',
        },
      ],
    },
    {
      id: 'pair2',
      title: 'Chocolate vs. Water',
      options: [
        {
          value: 'chocolate',
          description: 'Some chocolates could be used to sustain the energy you need to gather firewood and other materials, preventing fatigue and starvation.',
        },
        {
          value: 'water',
          description: 'Two quarts of water could be enough to prevent dehydration for a few days.',
        },
      ],
    },
    {
      id: 'pair3',
      title: 'Mirror vs. Compass',
      options: [
        {
          value: 'mirror',
          description: 'A flat mirror could be used to signal search parties and seen across the horizon in a desert setting.',
        },
        {
          value: 'compass',
          description: 'A compass could be used to navigate your way to the nearest village, and also reflect sunlight to signal search parties.',
        },
      ],
    },
    {
      id: 'pair4',
      title: 'Flashlight vs. Matches',
      options: [
        {
          value: 'flashlight',
          description: 'A flashlight could be used at night to signal search parties and help you navigate when moving at night.',
        },
        {
          value: 'matches',
          description: 'Some matches could be used to start fires and make smokes to signal search parties and provide warmth at night.',
        },
      ],
    },
    {
      id: 'pair5',
      title: 'Knife vs. Pistol',
      options: [
        {
          value: 'knife',
          description: 'A knife can cut down stakes to build a solar still or to build shelter, and cut down firewood for a fire.',
        },
        {
          value: 'pistol',
          description: 'A pistol can be good for signaling for help, and provide an alternative noise source if your voice is weak due to dehydration.',
        },
      ],
    },
    {
        id: 'pair5',
        title: 'Done',
        // options: [
        // ],
      },
  ];
  

function ItemSelection({ onConfirm }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionChange = (selectedValue) => {
    const currentQuestionId = questions[currentQuestionIndex].id;
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [currentQuestionId]: selectedValue,
    }));
  };

  const handleConfirmClick = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Move to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question was answered, call the onConfirm prop with all selected options
      onConfirm(selectedOptions);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h1>Desert Survival Game</h1>
      <h3>Suppose you are in a desert survival game and need to choose the most essential items for survival.</h3>
      <div className='CheckboxPairs'>
        <h3>{currentQuestion.title}</h3>
        <div className='CheckboxPair' style={{ display: 'flex', justifyContent: 'left' }}>
          {currentQuestion.options.map((option) => (
            <div key={option.value}>
              <input
                type='radio'
                name={currentQuestion.id}
                id={option.value}
                value={option.value}
                onChange={(e) => handleOptionChange(e.target.value)}
                checked={selectedOptions[currentQuestion.id] === option.value}
              />
              <label htmlFor={option.value}>
                <b>{option.value}</b>
                <img src={reactLogo} alt={option.value} style={{ width: 50, height: 50 }} />
                <p>{option.description}</p>
              </label>
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleConfirmClick}>Confirm</button>
    </div>
  );
}

export default ItemSelection;
