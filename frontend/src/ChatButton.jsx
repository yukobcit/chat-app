import React, { useState } from 'react';
import './css/ChatButton.css';

const NewChatButton = ({ onCreate }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');

  const handleCreate = () => {
    if (name.trim() !== '') {
      onCreate(name);
      setName('');
      setIsCreating(false);
    }
  };

  return (
    <>
      {isCreating ? (
        <div className="chat-buttons">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-grow p-2 border rounded"
            placeholder="Chat name..."
          />
          <button
            onClick={handleCreate}
            className=""
          >
            Chat-Create
          </button>
          <button
            onClick={() => setIsCreating(false)}
            className=""
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full px-4 py-2 mt-4 text-white bg-green-500 font-semibold rounded"
        >
          Chat-New Chat
        </button>
      )}
    </>
  );
};

export default NewChatButton;

