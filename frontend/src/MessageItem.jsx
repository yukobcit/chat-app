import React, { useState } from 'react';
import './css/MessageItem.css';
import { useAuthenticator } from "@aws-amplify/ui-react";

const MessageItem = ({ message, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(message.content);
  const { user } = useAuthenticator();

  const isMessageOwner = message.user_id === user?.attributes?.sub;
  
  const handleUpdate = () => {
    onUpdate(message.id, content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(message.id);
  };

  return (
    <div className="flex my-2 chat-bubble">
      <div className="p-2 my-1">
        <div className="chat-content">
          <div className="chat-message">
            <div className="message-content">{content}</div>
            {isMessageOwner && (
              <div className="message-options">
                <button className="option-btn edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
                <button className="option-btn delete-btn" onClick={handleDelete}>Delete</button>
              </div>
            )}
          </div>
          {isEditing && (
            <div className="edit-message">
              <input type="text" value={content} onChange={(e) => setContent(e.target.value)} className="edit-input" />
              <button className="edit-btn" onClick={handleUpdate}>Save</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
