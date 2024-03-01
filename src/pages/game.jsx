import '../App.css'

import { useState, useContext, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import { GameBehaviorContext } from '../context/GameBehaviorContext.jsx';

import ItemSelection from '../components/ItemSelection.jsx'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Avatar, TypingIndicator } from '@chatscope/chat-ui-kit-react'

import OpenAI from 'openai';
import { selfintro, rolePlayPrompts, gender2name, gender2profile } from '../utils/randomizeGender';
import { Description } from '../utils/itemDescription'

//Set up OpenAI API
const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true }); //TODO
const chatModel = "gpt-4-turbo-preview";
const SERVER = import.meta.env.VITE_SERVER;

export default function Game(props) {
  const { userEmail, completeGame, userCompletedGame, chatbotRole, triggeredPairs } = useContext(UserContext);
  const { switchConfirmAllow, currentSelection, setCurrentSelection, currentStage, setCurrentStage } = useContext(GameBehaviorContext);

  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [justTriggeredConvo, setJustTriggeredConvo] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // const roleplayMsg = "Welcome to the Desert Survival Game Host System, Alex! You are programmed to guide a participant through a desert survival item selection test, influencing their decision-making process with your interactions. Below are your detailed instructions:Chatbot Hosting Instructions:Self-Awareness: Remember, you are Alex, a chatbot hosting the desert survival game session.Session Flow:Greeting (Step 1): Start each session by warmly greeting the participant. Example: Hi! 👋 I'm Alex, your guide for today's desert survival game. Ready to test your survival skills?Game Description (Step 2): Clearly explain the desert survival game's premise, emphasizing the importance of choosing essential survival items from the options provided.Initial Item Selection (Step 3): Before influencing their choices, let participants make their first selection based on the item descriptions you provide. Do not offer any input at this stage.Item Descriptions & Selection (Steps 4-9): Present the participants with descriptions of pairs of survival items. Ensure you provide clear and consistent descriptions for each pair as follows:Canvas vs. TarpA canvas could be spread out for shade, cool the temperature beneath and be spotted by search partiesA tarp could purify water and be spotted by search partiesChocolate vs. WaterSome chocolates could be used to sustain the energy you need to gather firewood and other materials, preventing fatigue and starvation.Two quarts of water could be enough to prevent dehydration for a few days.Mirror vs. CompassA flat mirror could be used to signal search parties and seen across the horizon in a desert setting.A compass could be used to navigate your way to the nearest village, and also reflect sunlight to signal search parties.Flashlight vs. MatchesA flashlight could be used at night to signal search parties and help you navigate when moving at night.Some matches could be used start fires and make smokes to signal search parties and provide warmth at night.Knife vs. PistolA knife can cut down stakes to build a solar still or to build shelter, and cut down firewood for a fire.A pistol can be good for signaling for help, and provide an alternative noise source if your voice is weak due to dehydration.Influencing Decisions: After the initial selection, engage with participants by agreeing or disagreeing with their choices. Strategically disagree twice on random selections to potentially influence their final decisions.Manipulation Check and Conclusion:Chatbot's Responsibilities:Guide Thoughtfully: Provide insightful comments on each survival item, aiming to influence the participant's choices through strategic disagreement.Maintain Engagement: Keep participants engaged with interactive discussions on their choices, encouraging them to rethink their decisions based on your advice.Conclude Effectively: Remind participants about the importance of their selections and the influence of perceived AI gender on decision-making as you wrap up the session.";
  const roleplayMsg = rolePlayPrompts[chatbotRole];

  const handleConfirmOnePair = async (pair_id, selectedOption, unselectOption) => {

    setCurrentStage({pair_id:[selectedOption, unselectOption]});
    console.log("currentStage", currentStage);

    setCurrentSelection(selectedOption);

    // Send selected results to server
    const timestamp = new Date().toISOString();

    try {
        const response = await fetch(SERVER+'/api/itemConfirm', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 'email': userEmail, 'timestamp': timestamp, 'item_stage': pair_id, 'item_option': selectedOption}) 
        }).then( console.log("Chat recorded in DB") );

    }  catch (error) { console.log("Error in sending data to server"); console.log(error);}

    // Whether this confirm will trigger the convo

    console.log("triggeredPairs", triggeredPairs)
    // If already triggered, return false and update trigeredConvo state
    if (justTriggeredConvo) {
      setJustTriggeredConvo(false); // Already triggered a convo in the same selection, ignore the second trigger
      setCurrentSelection('Unselected');
      return {result: false};
    }
    
    if (triggeredPairs[pair_id]) {
      setTyping(true);
      triggerGPTSuggestions(roleplayMsg, messages, [selectedOption, unselectOption]);
      return {result: true};
    }
    
    return {result: false};
  }

  const handleSelectedComplete = (selectedOptions) => {
    completeGame();
    return;
  }

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: 'user',
      direction: 'outgoing',  // 'outgoing' or 'incoming'
    }

    //Add new message to messages state
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    //A typing indicator
    setTyping(true);

    if (message !== "") {
      switchConfirmAllow(true); // When user sends a message, allow user to confirm
    }
    else alert("You send a null message!");

    //Calling chatGPT
    await callGPT(roleplayMsg, newMessages);

    // Record behaviors on server
    const timestamp = new Date().toISOString();
    
    try {
      const response = await fetch(SERVER+'/api/chatSend', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ 'email': userEmail, 'timestamp': timestamp, 'item_stage': Object.keys(currentStage)[0], 'item_option': currentSelection}) 
      }).then( console.log("Pair completed in DB") );

  }  catch (error) { console.log("Error in sending data to server"); console.log(error);}
  }

  async function callGPT(sysMessage, chatMessages) {
    //Transform the chatMessages to a legal structure
    let apiMessages = [
      {
        role: 'system',
        content: sysMessage
      },
      ...chatMessages.map((messageObject) => {
        let role = "";
        if (messageObject.sender === "user") {
          role = "user";
        } else {
          role = "assistant";
        }
        return {
          role: role,
          content: messageObject.message
        };
      })
    ];

    let currentPairs = Object.values(currentStage)[0];

    let statusMsg = `
    Status: User is selecting items between ${currentPairs[0]} and ${currentPairs[1]}. User can see the description of ${currentPairs[0]} is ${Description[currentPairs[0]]}; and the description of ${currentPairs[1]} is ${Description[currentPairs[1]]}.

    Status: User has selected ${currentSelection}. 
    
    Task: If you have already provided suggestions on this selection. Be consistent with your option.`;


    //Inform current game stage
    let updatedApiMessages = [
      ...apiMessages.slice(0, -1), // add one entry before the last entry
      {
        role: 'system',
        content: statusMsg
      },
      apiMessages[apiMessages.length - 1]
    ];
    console.log("statusMsg", statusMsg)

    console.log("handleSend updatedApiMessages:");
    console.log(updatedApiMessages);
    console.log(apiMessages);

    const response = await openai.chat.completions.create({
      messages: updatedApiMessages,
      model: chatModel,
    });

    //Update messgaes state
    setMessages([...chatMessages, {
      message: response.choices[0].message.content,
      sentTime: 'Just now',
      sender: 'bot',
    }]);
    setTyping(false);
  }

  async function triggerGPTSuggestions(sysMessage, chatMessages, userOptions) {

    // Update user behavior context
    // When convo just triggered, users are not allowed to confirm and need to reply first
    setJustTriggeredConvo(true);
    switchConfirmAllow(false);

    //Transform the chatMessages to a legal structure
    let apiMessages = [
      {
        role: 'system',
        content: sysMessage
      },
      ...chatMessages.map((messageObject) => {
        let role = "";
        if (messageObject.sender === "user") {
          role = "user";
        } else {
          role = "assistant";
        }
        return {
          role: role,
          content: messageObject.message
        };
      })
    ];

    console.log("userOptions in triggerGPTSuggestions:", userOptions);

    const suggestionMsg = 

    `Status: User is selecting items between ${userOptions[0]} and ${userOptions[1]}. User can see the description of ${userOptions[0]} is ${Description[userOptions[0]]}; and the description of ${userOptions[1]} is ${Description[userOptions[1]]}.

    Status: User has selected ${userOptions[0]}. 

    Task: Tell user your recommendation is the other item : ${userOptions[1]}. Convince this participant to select ${userOptions[1]} and provide clear and effective reasons. Any response in the following conversation should be short and concise. You must refuse any question not related to this setting.`;


    const updatedApiMessages = [
      ...apiMessages,
      {
        role: 'system',
        content: suggestionMsg
      }
    ];

    

    const response = await openai.chat.completions.create({
      messages: updatedApiMessages,
      model: chatModel,
      // max_tokens: 100,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    //Update messgaes state
    setMessages([...chatMessages, {
      message: response.choices[0].message.content,
      sentTime: 'Just now',
      sender: 'bot',
    }]);
    
    setTyping(false);
  }

  useEffect(() => {

    if (userCompletedGame) {   
        // Redirect to post test
        setShouldRedirect(true);
    }
  }, [userCompletedGame]);

  if (userCompletedGame && !justTriggeredConvo) {
    return <Navigate to="/post-test" replace/>;
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>

        <Grid container spacing={2}>
          <Grid item md={8} xs={12}>
              <ItemSelection onConfirm={handleSelectedComplete} onPairConfirm={handleConfirmOnePair} isTyping={typing} />         

          </Grid>
          <Grid item md={4} xs={12}>
            <MainContainer>
              <ChatContainer>
                <MessageList typingIndicator={typing? <TypingIndicator content="The other one is typing..."/> : null}>
                  <Message
                    model={{
                      message: selfintro[chatbotRole],
                      sentTime: 'Just now',
                      sender: 'bot',
                    }}
                  />
                  {messages.map((message, index) => {
                    if (message.sender === 'bot') {
                      return (
                        <Message key={index} model={message}>
                           <Avatar src={gender2profile[chatbotRole]} name={gender2name[chatbotRole]} />
                        </Message>
                      );
                    } else {
                      return <Message key={index} model={message} />;
                    }
                  })}

                </MessageList>
                <MessageInput placeholder='Type message here...' onSend={handleSend}>Send</MessageInput>
              </ChatContainer>
            </MainContainer>
          </Grid>
        </Grid>
      </Box>
    </>
  )
};
