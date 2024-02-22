import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Avatar, TypingIndicator } from '@chatscope/chat-ui-kit-react'
import ItemSelection from './components/ItemSelection.jsx'

// const apiKey = process.env.OPENAI_API_KEY;

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState({});

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
    await callChatGPT(newMessage);
  }

  async function callChatGPT(chatMessages) {
    //Transform the chatMessages to a legal structure
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "user") {
        role = "user";
      } else {
        role = "assistant";
      }
      return {
        role: role,
        content: messageObject.message
      }
    });

    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KEY.API_KEY}`
      },
      body: JSON.stringify({
        prompt: message,
        max_tokens: 150
      })
    })
    const data = await response.json();
    return data.choices[0].text.trim();
  }


  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 8 }}>
          <Grid item xs={5}>
            {/* <div className='Container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width:"90vw", backgroundColor: "white", color: "black" }}> */}
            {/* <div className='Container' style={{ backgroundColor: "white", color: "black" }}> */}
              <ItemSelection onConfirm={handleConfirm} />         
          </Grid>
          <Grid item xs={7}>
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
}

export default App
