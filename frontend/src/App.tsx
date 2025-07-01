import React, { useState, useEffect, FormEvent } from 'react';
import './App.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load initial greeting from bot (example)
  useEffect(() => {
    setMessages([
      { id: 1, text: "Hello! I am KTU-Bot. How can I assist you today?", sender: 'bot' }
    ]);
  }, []);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = {
        id: Date.now() + 1, // Ensure unique ID
        text: data.response || "Sorry, I couldn't get a response.",
        sender: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>KTU-Bot</h1>
        <p>Your AI assistant for KTU information.</p>
      </header>
      <div className="chat-container">
        <div className="message-list">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <p>{msg.text}</p>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message bot typing-indicator">
              <p>KTU-Bot is typing...</p>
            </div>
          )}
        </div>
        <form onSubmit={handleSendMessage} className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
