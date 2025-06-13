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

  const typeText = (text, setter, speed = 50) => {
    setter('');
    let i = 0;
    const interval = setInterval(() => {
      setter(prev => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
  };

  const handleInterrogate = () => {
    clickSound.play();
    const q = questions[Math.floor(Math.random() * questions.length)];
    setJoke('');
    setLoading(true);
    typeText(q, setQuestion);

    setTimeout(() => {
      const punch = punchlines[Math.floor(Math.random() * punchlines.length)];
      roastSound.play();
      typeText(punch, setJoke, 40);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    const keydownHandler = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd') {
        alert('🪛 You’ve been debugged!');
      }
    };
    window.addEventListener('keydown', keydownHandler);
    return () => window.removeEventListener('keydown', keydownHandler);
  }, []);

  return (
    <div className="terminal">
      <div className="face">🤖🔎</div>
      <h1 className="glitch">Code Confession</h1>
      <button onClick={handleInterrogate}>☕ Confess Your Dev Sins</button>

      {question && <p className="typing">{question}</p>}
      {loading && <p className="loading">Compiling your confession...</p>}
      {joke && <p className="typing punchline">🔥 {joke}</p>}
    </div>
  );
}

export default App;
