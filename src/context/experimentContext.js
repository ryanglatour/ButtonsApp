import React, { createContext, useState, useContext } from 'react';

const ExperimentContext = createContext();

export const useExperiment = () => {
  return useContext(ExperimentContext);
};

export const ExperimentProvider = ({ children }) => {
  const [activeExperiment, setActiveExperiment] = useState(false);
  const [paused, setPaused] = useState(false)

  const startExperiment = () => setActiveExperiment(true);
  const resetExperiment = () => setActiveExperiment(false);
  
  const pause = () => setPaused(true)
  const unpause = () => setPaused(false)

  return (
    <ExperimentContext.Provider value={{ activeExperiment, startExperiment, resetExperiment, paused, pause, unpause}}>
      {children}
    </ExperimentContext.Provider>
  );
};
