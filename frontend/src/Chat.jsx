import { Auth, API } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from 'react'
import ChatItem from "./ChatItem";
import ChatButton from './ChatButton';
import './css/Chat.css';



const ChatList = ({ onSelect, selectedChat }) => {
// export default function Home() {
    const api_url = import.meta.env.VITE_APP_API_URL;
    const [chatName, setChatName] = useState('');
    const [chatNameList, setChatNameList] = useState([]);
    const [messageList, setMessageList] = useState([]);
    const [messsageUrl, setMessageUrl] = useState();
    const [chatId, setChatId] = useState('');
    const [newChatName, setNewChatName] = useState('');
    const { user, signOut } = useAuthenticator((context) => [context.user]);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("api", "/chats");
  
        setChatNameList(response.chats);
      } catch (error) {
        console.error(error);
        // Handle the error in whatever way is appropriate for your application
      }
    };
  
    fetchData();
  }, []);
  

  const createChat = async (name) => {
    try {
      const response = await API.post("api", "/chat", {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getAccessToken()
            .getJwtToken()}`,
        },
        body: { name: name, user_id: user.attributes.sub, user_name: user.username },
      });
  
      // Update the chatNameList state with the new chat
      setChatNameList([response.chat, ...chatNameList]);
    } catch (error) {
      console.log("Error creating chat: ", error);
      // Optionally, display an error message to the user
    }
  };
    
  const deleteChat = async (chatNameId) => {
    try {
      const response = await API.del("api", `/chat/${chatNameId}`, {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getAccessToken()
            .getJwtToken()}`,
        },
        body: {user_id: user.attributes.sub},
      });
  
      setChatNameList(chatNameList.filter((chatName) => chatName.id !== chatNameId));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle 404 error
        alert("Chat not found");
      } else if (error.response && error.response.status === 403) {
        // Handle 403 error
        alert("You are only allowed to delete your own chat");
      } else {
        console.log("Error deleting chat: ", error);
        // Optionally, display an error message to the user
      }
    }
  };
  

  const updateChat = async (id, newName) => {
    console.log(id, newName)
    try {
      const response = await API.put("api", `/chat/${id}`, {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getAccessToken()
            .getJwtToken()}`,
        },
        body: { name: newName, user_id: user.attributes.sub },
      });
      setChatNameList((prevChatNameList) => {
        const updatedChatNameList = prevChatNameList.map((chatName) =>
          chatName.id === id ? { ...chatName, name: newName } : chatName
        );
        return updatedChatNameList;
      });
    } catch (error) {
      console.log("Error updating chat: ", error);
      alert("You are only allowed to update your own chat");
      // Optionally, display an error message to the user
    }
  };
  
  const privateRequest = async () => {
    try {
      const response = await API.get("api", "/private", {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getAccessToken()
            .getJwtToken()}`,
        },
      });
      alert(JSON.stringify(response));
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="chat-names">
      <ChatButton onCreate={createChat} />
      {chatNameList.map((chat) => (
      <ChatItem selected={chat.id == selectedChat?.id} key={chat.id} chat={chat} onSelect = {onSelect} onDelete = {deleteChat} onUpdate={updateChat} />
      ))}

    </div>
  );
}
export default ChatList;