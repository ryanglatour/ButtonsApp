import logo from './logo.svg';
import './App.css';
import Game from './pages/game';
import { ExperimentProvider, useExperiment } from './context/experimentContext'

function App() {
  return (
    <ExperimentProvider>
      <div className="App">

        <Game/>
        
      </div>
    </ExperimentProvider>
  );
}


export default App;
