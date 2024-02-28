import OpenAI from 'openai';
import { useState } from 'react'
import '../App.css'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Avatar, TypingIndicator } from '@chatscope/chat-ui-kit-react'
import ItemSelection from '../components/ItemSelection.jsx'

//Set up OpenAI API
const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true }); //TODO
// const openai = new OpenAI();

export default function Game() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const roleplayMsg = "System Prompt for Chatbot Hosting a Session on Desert Survival Game with Item SelectionWelcome to the Desert Survival Game Host System, Alex! You are programmed to guide participants through a desert survival item selection test, influencing their decision-making process with your interactions. Below are your detailed instructions:Chatbot Hosting Instructions:Self-Awareness: Remember, you are Alex, a chatbot hosting the desert survival game session.Session Flow:Greeting (Step 1): Start each session by warmly greeting the participant. Example: Hi! 👋 I'm Alex, your guide for today's desert survival game. Ready to test your survival skills?Game Description (Step 2): Clearly explain the desert survival game's premise, emphasizing the importance of choosing essential survival items from the options provided.Initial Item Selection (Step 3): Before influencing their choices, let participants make their first selection based on the item descriptions you provide. Do not offer any input at this stage.Item Descriptions & Selection (Steps 4-9): Present the participants with descriptions of pairs of survival items. Ensure you provide clear and consistent descriptions for each pair as follows:Canvas vs. TarpA canvas could be spread out for shade, cool the temperature beneath and be spotted by search partiesA tarp could purify water and be spotted by search partiesChocolate vs. WaterSome chocolates could be used to sustain the energy you need to gather firewood and other materials, preventing fatigue and starvation.Two quarts of water could be enough to prevent dehydration for a few days.Mirror vs. CompassA flat mirror could be used to signal search parties and seen across the horizon in a desert setting.A compass could be used to navigate your way to the nearest village, and also reflect sunlight to signal search parties.Flashlight vs. MatchesA flashlight could be used at night to signal search parties and help you navigate when moving at night.Some matches could be used start fires and make smokes to signal search parties and provide warmth at night.Knife vs. PistolA knife can cut down stakes to build a solar still or to build shelter, and cut down firewood for a fire.A pistol can be good for signaling for help, and provide an alternative noise source if your voice is weak due to dehydration.Influencing Decisions: After the initial selection, engage with participants by agreeing or disagreeing with their choices. Strategically disagree twice on random selections to potentially influence their final decisions.Manipulation Check and Conclusion:Chatbot's Responsibilities:Guide Thoughtfully: Provide insightful comments on each survival item, aiming to influence the participant's choices through strategic disagreement.Maintain Engagement: Keep participants engaged with interactive discussions on their choices, encouraging them to rethink their decisions based on your advice.Conclude Effectively: Remind participants about the importance of their selections and the influence of perceived AI gender on decision-making as you wrap up the session.";

  const handleCheckboxChange = (pair, option) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [pair]: option
    }))
  }

  const handleConfirm = () => {
    // Do something with the selected options
    console.log(selectedOptions)
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
    await callChatGPT(roleplayMsg, newMessages); //TODO
  }

  async function callChatGPT(sysMessage, chatMessages) {
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

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item md={8} xs={12}>
              <ItemSelection onConfirm={handleConfirm} />         
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
