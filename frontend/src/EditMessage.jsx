import React, { useState } from 'react';

const EditMessage = ({ message, onSelect, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(chat?.name || '');

  const handleUpdate = () => {
    onUpdate(message.id, name);
    setIsEditing(false);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(message.id);
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
    <div className="p-2 my-1" onClick={handleSelect}>
      {isEditing ? (
        <div className="flex">
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
        <div>
          <h3 className="font-semibold">{message.content}</h3>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={toggleEditing}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default EditMessage;
