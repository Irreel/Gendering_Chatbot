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
  const { chatbotRole, triggeredPairs } = useContext(UserContext);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  const roleplayMsg = "You are acting as a human and his name is Alen. Now you are providing some suggestions on desert survival game.";
  // TODO: const roleplayMsg = chatbotRole.roleplayMsg;

  
  const handleSelectedOnePair = (pair_id, option, unselectOption) => {
    console.log("handleSelectedOnePair is called!");
    if (triggeredPair[pair_id]) {
      triggerGPTSuggestions(roleplayMsg, messages, unselectOption);
    }
  }

  const handleSelectedComplete = (selectedOptions) => {
    // Do something with the selected options
    console.log(selectedOptions)
    user.completeGame();

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
      message: response.choices[0].message.content,
      message: "[Just trigger the GPT-3.5 to provide suggestions]",
      sentTime: 'Just now',
      sender: 'bot',
    }]);
    
    setTyping(false);
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 8 }}>
          <Grid item xs={5}>
              <ItemSelection onConfirm={handleSelectedComplete} onPairConfirm={handleSelectedOnePair}/>         
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
};
