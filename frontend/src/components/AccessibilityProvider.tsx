import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityState {
  fontSize: 'normal' | 'large' | 'x-large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
}

interface AccessibilityContextType {
  state: AccessibilityState;
  setFontSize: (size: AccessibilityState['fontSize']) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleScreenReader: () => void;
  toggleKeyboardNavigation: () => void;
  toggleFocusVisible: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const AccessibilityProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, setState] = useState<AccessibilityState>({
    fontSize: 'normal',
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: false,
    focusVisible: false
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

  const toggleReducedMotion = () => {
    setState(prev => {
      const newValue = !prev.reducedMotion;
      localStorage.setItem('accessibilityReducedMotion', String(newValue));
      return {...prev, reducedMotion: newValue};
    });
  };

  const toggleScreenReader = () => {
    setState(prev => {
      const newValue = !prev.screenReader;
      localStorage.setItem('accessibilityScreenReader', String(newValue));
      return {...prev, screenReader: newValue};
    });
  };

  const toggleKeyboardNavigation = () => {
    setState(prev => {
      const newValue = !prev.keyboardNavigation;
      localStorage.setItem('accessibilityKeyboardNavigation', String(newValue));
      return {...prev, keyboardNavigation: newValue};
    });
  };

  const toggleFocusVisible = () => {
    setState(prev => {
      const newValue = !prev.focusVisible;
      localStorage.setItem('accessibilityFocusVisible', String(newValue));
      return {...prev, focusVisible: newValue};
    });
  };

  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibilityFontSize');
    const savedHighContrast = localStorage.getItem('accessibilityHighContrast') === 'true';
    const savedReducedMotion = localStorage.getItem('accessibilityReducedMotion') === 'true';
    const savedScreenReader = localStorage.getItem('accessibilityScreenReader') === 'true';
    const savedKeyboardNavigation = localStorage.getItem('accessibilityKeyboardNavigation') === 'true';
    const savedFocusVisible = localStorage.getItem('accessibilityFocusVisible') === 'true';
    
    setState({
      fontSize: (savedFontSize as AccessibilityState['fontSize']) || 'normal',
      highContrast: savedHighContrast,
      reducedMotion: savedReducedMotion,
      screenReader: savedScreenReader,
      keyboardNavigation: savedKeyboardNavigation,
      focusVisible: savedFocusVisible
    });
  }, []);

  // Apply accessibility styles
  const accessibilityClasses = `
    ${state.fontSize === 'large' ? 'text-lg' : ''} 
    ${state.fontSize === 'x-large' ? 'text-xl' : ''} 
    ${state.highContrast ? 'bg-black text-yellow-300' : ''}
    ${state.reducedMotion ? 'motion-reduce' : ''}
    ${state.keyboardNavigation ? 'keyboard-navigation' : ''}
    ${state.focusVisible ? 'focus-visible' : ''}
  `.trim();

  return (
    <AccessibilityContext.Provider value={{ 
      state, 
      setFontSize, 
      toggleHighContrast, 
      toggleReducedMotion, 
      toggleScreenReader, 
      toggleKeyboardNavigation, 
      toggleFocusVisible 
    }}>
      <div className={accessibilityClasses}>
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
