import React, { useEffect, useState } from 'react';
import { Auth, API } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-react";
import EditMessage from "./EditMessage";
import Message from "./MessageItem";

const ChatWindow = ({chat}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const {user, signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await API.get("api", `/messages/${chat.id}`, {
          headers: {
            Authorization: `Bearer ${(await Auth.currentSession())
              .getAccessToken()
              .getJwtToken()}`,
          },
        });

        setMessages(response.messages ?? []);
        console.log(response.messages);
      } catch (error) {
        console.log("Error fetching messages: ", error);
        // Optionally, display an error message to the user
      }
    };
    fetchMessages();
  }, [chat]);

  const handleSend = async () => {
    try {
  
      // Send the message to the server
      const result = await API.post("api", `/message/${chat.id}`, {
        body: { content: input, userId: user.attributes.sub, userName: user.username },
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getAccessToken()
            .getJwtToken()}`,
        },
      });

      setMessages([result.message, ...messages]);

      // Clear the input field
      setInput("");
    } catch (error) {
      console.log("Error sending message: ", error);
      // Optionally, display an error message to the user
    }
  };
  
  const handleMessageUpdate = async (id, content) => {
    try {
      // Update the message on the server
      await API.put("api", `/message/${id}`, {
        body: { content: content, userId: user.attributes.sub },
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getAccessToken()
            .getJwtToken()}`,
        },
      });
  
      // Update the messages state with the updated message
      const updatedMessages = messages.map((message) => {
        if (message.id === id) {
          return { ...message, content };
        } else {
          return message;
        }
      });
      setMessages(updatedMessages);
    } catch (error) {
      console.log("Error updating message: ", error);
      setInput(content);
      alert("Error updating message: " + error.message);
    }
  };
  
  const handleMessageDelete = async (id) => {
    try {
      // Delete the message on the server
      const response = await API.del("api", `/message/${id}`, {
        body: { userId: user.attributes.sub },
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getAccessToken()
            .getJwtToken()}`,
        },
      });

      if (response) {
        console.log("Message deleted: ", id)
        // Remove the deleted message from the messages state
        const updatedMessages = messages.filter((message) => message.id !== id);
        setMessages(updatedMessages);
      } else {
        throw new Error("Server error: unable to delete message");
      }
    } catch (error) {
      alert("You can only delete your own messages.");
      console.log("Error deleting message: ", error);
      // Optionally, display an error message to the user
    }
  };
  
  const toggleEditing = (event) => {
    event.stopPropagation();
    setIsEditing((prev) => !prev);
  };


  return (
    <div className="chat-window">
      <div className="message">
        {messages.map((message) => (
          <Message key={message.id} message={message} onUpdate={handleMessageUpdate} onDelete={handleMessageDelete} />
        ))}
      </div>
      <div className="message-edit">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className=""
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className=""
        >
          Send
        </button>
      </div>
    </div>
  );
}
export default ChatWindow;