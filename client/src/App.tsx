import { useEffect } from 'react';
import Globe from './components/Globe';
import MoodButtons from './components/MoodButtons';
import WorldMoodIndex from './components/WorldMoodIndex';
import UserStats from './components/UserStats';
import MessageFeed from './components/MessageFeed';
import ControlPanel from './components/ControlPanel';
import CountryDetails from './components/CountryDetails';
import HistoryView from './components/HistoryView';
import { socketService } from './services/socket';
import { useStore } from './store';
import './App.css';

function App() {
  const { setGlobalStats, setConnected, addHistory } = useStore();

  useEffect(() => {
    socketService.connect(
      setGlobalStats, 
      setConnected,
      (history) => {
        history.forEach(snapshot => addHistory(snapshot));
      }
    );

    return () => {
      socketService.disconnect();
    };
  }, [setGlobalStats, setConnected, addHistory]);

  return (
    <div className="app">
      <Globe />
      <WorldMoodIndex />
      <ControlPanel />
      <UserStats />
      <MessageFeed />
      <MoodButtons />
      <CountryDetails />
      <HistoryView />
    </div>
  );
}

export default App;
