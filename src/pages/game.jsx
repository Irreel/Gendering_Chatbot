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
  const roleplayMsg = "You are acting as a human and his name is Alen. Now you are providing some suggestions on desert survival game.";

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
