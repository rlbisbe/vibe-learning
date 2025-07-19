import { useState } from 'react';
import './Chat.css';

function Chat({ state, messages, onSendMessage, STATES }) {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        Chat - {state}
      </div>

      <div className="chat-messages">
        {messages.map(message => (
          <div
            key={message.id}
            className={`message ${message.sender}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <div className="input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="chat-input"
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;