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

  return (
    <ExperimentContext.Provider value={{ activeExperiment, startExperiment, resetExperiment, paused, pause, unpause, selectedDot, setSelectedDot, id, setId, enterId}}>
      {children}
    </ExperimentContext.Provider>
  );
};
