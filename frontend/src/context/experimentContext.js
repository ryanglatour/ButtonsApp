import React, { createContext, useState, useContext } from 'react';

const ExperimentContext = createContext();

export const useExperiment = () => {
  return useContext(ExperimentContext);
};

export const ExperimentProvider = ({ children }) => {
  const [activeExperiment, setActiveExperiment] = useState(false);
  const [paused, setPaused] = useState(false)
  const [selectedDot, setSelectedDot] = useState(null)
  const [id, setId] = useState(null)

  const startExperiment = () => setActiveExperiment(true);
  const resetExperiment = () => setActiveExperiment(false);
  
  const pause = () => setPaused(true)
  const unpause = () => setPaused(false)

  const enterId = (id) => setId(id)

  const [trials, setTrials] = useState(0)
  const [time, setTime] = useState(0)
  const [correct, setCorrect] = useState(0)

  const trialSet = (trials) => setTrials(trials)
  const timeSet = (time) => setTime(time)
  const correctSet = (correct) => setCorrect(correct)

  return (
    <ExperimentContext.Provider value={{
      activeExperiment, startExperiment, resetExperiment,
      paused, pause, unpause,
      selectedDot, setSelectedDot,
      id, setId, enterId,
      trials, trialSet, time, timeSet, correct, correctSet
    }}>
      {children}
    </ExperimentContext.Provider>
  );
};
