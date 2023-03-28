import React, { useState } from 'react';
import ChatList from './Chat';
import ChatWindow from './ChatWindow';
import { useAuthenticator } from "@aws-amplify/ui-react";
const Home = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [selectedChat, setSelectedChat] = useState(null);
  console.log("home",selectedChat);

  return (
    <div className='wrapper'>

    <div className='user-info'>
      <p>{user?.username}</p>
      <p>email: {user?.attributes.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
    <div className='chat'>
      <div className='chat-list'>
        <ChatList onSelect={setSelectedChat} selectedChat={selectedChat} />
      </div>
      <div className='chat-window'> 
      {selectedChat ? (
        <ChatWindow chat={selectedChat} />
        ) : (
          <div>Please select a chat room.</div>
      )}
      </div>
    </div>
  </div>
  );
};

export default Home;
