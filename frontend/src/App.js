import logo from './logo.svg';
import './App.css';
import Calibrate from './pages/calibrate'
import Game from './pages/game';
import IDPage from './pages/idpage'
import { ExperimentProvider, useExperiment } from './context/experimentContext'
import {BrowserRouter as Router, Route, Routes, useHistory} from 'react-router-dom'

function App() {
  return (
    <ExperimentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<IDPage/>} />
          <Route path="/calibrate" element={<Calibrate/>} />
          <Route path="/game" element={<Game/>} />
        </Routes>
      </Router>
    </ExperimentProvider>
  );
}


export default App;
