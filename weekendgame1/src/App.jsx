import { useState, useEffect } from 'react';
import './App.css';
import { questions, punchlines } from './jokes';

const clickSound = new Audio('/sounds/click.mp3');
const roastSound = new Audio('/sounds/roast.mp3');

function App() {
  const [question, setQuestion] = useState('');
  const [joke, setJoke] = useState('');
  const [typing, setTyping] = useState('');
  const [loading, setLoading] = useState(false);
  const [newJoke, setNewJoke] = useState('');

  // Speech API
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = speechSynthesis.getVoices().find(v => v.lang === 'en-US');
    utterance.pitch = 1.2;
    utterance.rate = 1.05;
    speechSynthesis.speak(utterance);
  };

  const getAllUserJokes = () => {
    return JSON.parse(localStorage.getItem('userJokes')) || [];
  };

  const addJoke = (joke) => {
    if (!joke) return;
    const jokes = getAllUserJokes();
    jokes.push(joke);
    localStorage.setItem('userJokes', JSON.stringify(jokes));
    setNewJoke('');
    alert("🔥 Joke submitted! It might get selected randomly next time.");
  };

  const typeText = (text, setter, callback = () => {}, speed = 40) => {
    setter('');
    let i = 0;
    const interval = setInterval(() => {
      setter(prev => prev + text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        callback();
      }
    }, speed);
  };

  const handleInterrogate = async () => {
    clickSound.play();
    setJoke('');
    const randomQ = questions[Math.floor(Math.random() * questions.length)];
    const allJokes = [...punchlines, ...getAllUserJokes()];
    const randomLocalJoke = allJokes[Math.floor(Math.random() * allJokes.length)];

    setLoading(true);
    typeText(randomQ, setQuestion);

    setTimeout(async () => {
      let finalJoke = randomLocalJoke;

      // OPTIONAL: fetch a joke from the API instead
      try {
        const res = await fetch("https://v2.jokeapi.dev/joke/Programming?type=single");
        const data = await res.json();
        if (data && data.joke) finalJoke = data.joke;
      } catch (err) {
        console.warn("Fallback to local jokes due to API error.");
      }

      roastSound.play();
      typeText(finalJoke, setJoke, () => speak(finalJoke));
      setLoading(false);
    }, 2000);
  };

  // Easter egg
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd') {
        alert("🪛 You've been debugged!");
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="terminal">
      <div className="face">🤖🔎</div>
      <h1 className="glitch">Code Confession</h1>

      <button onClick={handleInterrogate}>☕ Confess Your Dev Sins</button>

      {question && <p className="typing">👀 {question}</p>}
      {loading && <p className="loading">🌀 Compiling your confession...</p>}
      {joke && <p className="typing punchline">🔥 {joke}</p>}

      {joke && (
        <div className="reactions">
          {['😂','😭','👀','🔥','🤯'].map((emoji, i) => (
            <span key={i} className="emoji" onClick={() => alert(`You reacted with ${emoji}`)}>
              {emoji}
            </span>
          ))}
        </div>
      )}

      {/* Terminal-style fake input */}
      <div className="fake-terminal">
        <span className="prompt">dev@confess:~$</span>
        <input type="text" placeholder="Type your regrets..." />
      </div>

      {/* Multiplayer: Add Your Own Joke */}
      <div className="submit-joke">
        <input
          type="text"
          placeholder="Add your own roast..."
          value={newJoke}
          onChange={(e) => setNewJoke(e.target.value)}
        />
        <button onClick={() => addJoke(newJoke)}>➕ Submit</button>
      </div>
    </div>
  );
}

export default App;
