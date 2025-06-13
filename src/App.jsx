import React, { useState } from 'react';
import './App.css'; // Assuming you have a CSS file for styles

const App = () => {
  const [question, setQuestion] = useState('');
  const [joke, setJoke] = useState('');
  const [userJoke, setUserJoke] = useState('');
  const [roast, setRoast] = useState('');
  const [typing, setTyping] = useState(false);
  const emojis = ['😂', '😭', '👀', '🔥', '🤯'];

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const typeText = (text, setter, callback) => {
    setTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      setter((prev) => prev + text.charAt(i));
      i++;
      if (i === text.length) {
        clearInterval(interval);
        setTyping(false);
        callback && callback();
      }
    }, 30);
  };

  const handleConfess = async () => {
    setQuestion('');
    setJoke('');
    try {
      const res = await fetch('https://v2.jokeapi.dev/joke/Programming?type=single');
      const data = await res.json();
      const fetchedJoke = data.joke || "😵‍💫 The joke got lost in the cloud...";
      typeText("👀 Confessing via API...", setQuestion, () => {
        typeText(fetchedJoke, setJoke, () => speak(fetchedJoke));
      });
    } catch (err) {
      typeText("👀 API Failed...", setQuestion, () => {
        typeText("😢 Couldn't load dev sins. Try again later.", setJoke);
      });
    }
  };

  const handleSubmit = () => {
    const jokeToSpeak = userJoke || "🙊 No sin submitted.";
    setQuestion("💬 Multiplayer sin:");
    setJoke(jokeToSpeak);
    speak(jokeToSpeak);
    setUserJoke('');
    setRoast('');
  };

  return (
    <div className="app">
      <h1>🤖🔍<br />Code Confession</h1>
      <button onClick={handleConfess}>☕ Confess Your Dev Sins</button>

      <div className="console">
        <p>{question}</p>
        <p>{joke}</p>
      </div>

      <div className="emoji-reactions">
        {emojis.map((emoji, index) => (
          <span key={index} className="emoji">{emoji}</span>
        ))}
      </div>

      <div className="terminal">
        <span className="prompt">dev@confess:~$</span>
        <input
          type="text"
          value={userJoke}
          placeholder="Type your regrets..."
          onChange={(e) => setUserJoke(e.target.value)}
        />
      </div>

      <input
        className="roast"
        type="text"
        placeholder="Add your own roast..."
        value={roast}
        onChange={(e) => setRoast(e.target.value)}
      />

      <button className="submit" onClick={handleSubmit}>
        ➕ Submit
      </button>
    </div>
  );
};

export default App;
