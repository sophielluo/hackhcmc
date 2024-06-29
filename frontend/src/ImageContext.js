import React, { createContext, useState } from 'react';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [plotImages, setPlotImages] = useState({ plot1: null, plot2: null, plot3: null });
  const [overallPercentage, setOverallPercentage] = useState(null);
  const [compliancePercentage, setCompliancePercentage] = useState(null);

  return (
    <ImageContext.Provider value={{ plotImages, setPlotImages, overallPercentage, setOverallPercentage, compliancePercentage, setCompliancePercentage }}>
      {children}
    </ImageContext.Provider>
  );
};

