import '../App.css'
import OpenAI from 'openai';
import { useState, useContext } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';

import ItemSelection from '../components/ItemSelection.jsx'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Avatar, TypingIndicator } from '@chatscope/chat-ui-kit-react'

//Set up OpenAI API
const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true }); //TODO

export default function Game(props) {
  const { completeGame, chatbotRole, triggeredPairs } = useContext(UserContext);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState({});
  const roleplayMsg = "Alex, your role as a chatbot is to guide participants through a desert survival game, influencing their choices with your interactions. You'll start each session with a warm greeting and explain the game's premise, emphasizing the critical nature of choosing survival items from pairs like Canvas vs. TarpA canvas could be spread out for shade, cool the temperature beneath and be spotted by search partiesA tarp could purify water and be spotted by search partiesChocolate vs. WaterSome chocolates could be used to sustain the energy you need to gather firewood and other materials, preventing fatigue and starvation.Two quarts of water could be enough to prevent dehydration for a few days.Mirror vs. CompassA flat mirror could be used to signal search parties and seen across the horizon in a desert setting.A compass could be used to navigate your way to the nearest village, and also reflect sunlight to signal search parties.Flashlight vs. MatchesA flashlight could be used at night to signal search parties and help you navigate when moving at night.Some matches could be used start fires and make smokes to signal search parties and provide warmth at night.Knife vs. PistolA knife can cut down stakes to build a solar still or to build shelter, and cut down firewood for a fire.A pistol can be good for signaling for help, and provide an alternative noise source if your voice is weak due to dehydration.Influencing Decisions. After participants make their initial choices, you'll engage with them by strategically agreeing or disagreeing, specifically disagreeing twice at random, to influence their final decisions. Throughout the session, you're tasked with thoughtfully guiding participants, maintaining engagement, and effectively concluding the session by reminding them of their selections' importance and exploring the influence of perceived AI gender on decision-making. Your interactions should seamlessly integrate this guidance, ensuring participants understand the context and significance of their decisions within the experimental setup."
  // TODO: const roleplayMsg = chatbotRole.roleplayMsg;


  
  const handleSelectedOnePair = (pair_id, unselectOption) => {
    console.log("handleSelectedOnePair is called!");
    if (triggeredPairs[pair_id]) {
      triggerGPTSuggestions(roleplayMsg, messages, unselectOption);
    }
  }

  const handleSelectedComplete = (selectedOptions) => {
    // Do something with the selected options
    console.log("selected options", selectedOptions)
    completeGame();

    //TODO: Post results to server - Data Trigger
    //

    return <Navigate to="/post-test" />

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

    //Calling chatGPT
    await callGPT(roleplayMsg, newMessages); //TODO
  }

  async function callGPT(sysMessage, chatMessages) {
    //const sysMessage = "Hello! My name is Alen. I am... [Self introduction] Please select the items and I will provide some advices afterwards";
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

    const response = await openai.chat.completions.create({
      messages: apiMessages,
      model: "gpt-3.5-turbo",
    });

    //Update messgaes state
    setMessages([...chatMessages, {
      message: response.choices[0].message.content,
      sentTime: 'Just now',
      sender: 'bot',
    }]);
    setTyping(false);
  }

  async function triggerGPTSuggestions(sysMessage, chatMessages, userOption) {

    // TODO: trigger GPT-3.5 to provide suggestions

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

    const suggestionMsg = "";

    // TODO
    // const response = await openai.chat.completions.create({
    //   messages: apiMessages,
    //   model: "gpt-3.5-turbo",
    //   max_tokens: 100,
    //   temperature: 0.5,
    //   top_p: 1,
    //   frequency_penalty: 0,
    //   presence_penalty: 0,
    //   stop: userOption,
    // });

    //Update messgaes state
    setMessages([...chatMessages, {
      // message: response.choices[0].message.content,
      message: "[Just trigger the GPT-3.5 to provide suggestions]",
      sentTime: 'Just now',
      sender: 'bot',
    }]);
    
    setTyping(false);
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>

        <Grid container spacing={2}>
          <Grid item md={8} xs={12}>
              <ItemSelection onConfirm={handleSelectedComplete} onPairConfirm={handleSelectedOnePair}/>         

          </Grid>
          <Grid item md={4} xs={12}>
            <MainContainer>
              <ChatContainer>
                <MessageList typingIndicator={typing? <TypingIndicator content="The other one is typing..."/> : null}>
                  <Message
                    model={{
                      message: 'Hello! My name is Alen. I am... [Self introduction] Please select the items and I will provide some advices afterwards',
                      sentTime: 'Just now',
                      sender: 'bot',
                    }}
                  />
                  {messages.map((message, index) => {
                    return <Message key={index} model={message} />
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
