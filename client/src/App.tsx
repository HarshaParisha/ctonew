import { useEffect } from 'react';
import Globe from './components/Globe';
import MoodButtons from './components/MoodButtons';
import WorldMoodIndex from './components/WorldMoodIndex';
import UserStats from './components/UserStats';
import MessageFeed from './components/MessageFeed';
import { socketService } from './services/socket';
import { useStore } from './store';
import './App.css';

function App() {
  const { setGlobalStats, setConnected } = useStore();

  useEffect(() => {
    socketService.connect(setGlobalStats, setConnected);

    return () => {
      socketService.disconnect();
    };
  }, [setGlobalStats, setConnected]);

  return (
    <div className="app">
      <Globe />
      <WorldMoodIndex />
      <UserStats />
      <MessageFeed />
      <MoodButtons />
    </div>
  );
}

export default App;
