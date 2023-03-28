import React, { useState, useEffect } from 'react';
import './css/ChatItem.css';
import { useAuthenticator } from "@aws-amplify/ui-react";

const ChatItem = ({ chat, selected, onSelect, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(chat?.name || '');
  const [messageList, setMessageList] = useState([]);
  const { user } = useAuthenticator();


  const isChatOwner = chat.user_id === user?.attributes?.sub;
  

  const handleUpdate = () => {
    onUpdate(chat.id, name);
    setIsEditing(false);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(chat.id);
  };

  const handleSelect = () => {
    if (!isEditing) {
      onSelect(chat);

    }
  };

  const toggleEditing = (event) => {
    event.stopPropagation();
    setIsEditing((prev) => !prev);
  };


  return (
<div onClick={handleSelect}>
  {isEditing ? (
    <div className="edit-mode chat-item">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-grow p-1 border rounded"
      />
      <button onClick={handleUpdate}>Save</button>
      <button onClick={toggleEditing}>Cancel</button>
    </div>
  ) : (


    <div className="view-mode chat-item">
      <h3 className="font-semibold">{chat.name}</h3>
      {isChatOwner && (
        <>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={toggleEditing}>Edit</button>
        </>
      )}
    </div>




  )}
</div>
  );
};

export default ChatItem;
