import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityState {
  fontSize: 'normal' | 'large' | 'x-large';
  highContrast: boolean;
}

interface AccessibilityContextType {
  state: AccessibilityState;
  setFontSize: (size: AccessibilityState['fontSize']) => void;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const AccessibilityProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, setState] = useState<AccessibilityState>({
    fontSize: 'normal',
    highContrast: false
  });

  const setFontSize = (size: AccessibilityState['fontSize']) => {
    setState(prev => ({...prev, fontSize: size}));
    localStorage.setItem('accessibilityFontSize', size);
  };

  const toggleHighContrast = () => {
    setState(prev => {
      const newValue = !prev.highContrast;
      localStorage.setItem('accessibilityHighContrast', String(newValue));
      return {...prev, highContrast: newValue};
    });
  };

  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibilityFontSize');
    const savedHighContrast = localStorage.getItem('accessibilityHighContrast') === 'true';
    
    setState({
      fontSize: (savedFontSize as AccessibilityState['fontSize']) || 'normal',
      highContrast: savedHighContrast
    });
  }, []);

  return (
    <AccessibilityContext.Provider value={{ state, setFontSize, toggleHighContrast }}>
      <div className={`${state.fontSize === 'large' ? 'text-lg' : ''} ${state.fontSize === 'x-large' ? 'text-xl' : ''} ${state.highContrast ? 'bg-black text-yellow-300' : ''}`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
