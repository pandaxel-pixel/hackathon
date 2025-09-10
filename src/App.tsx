import React from 'react';
import { useState } from 'react';
import AppModeSelector from './components/AppModeSelector';
import CollectorApp from './components/CollectorApp';
import PosterApp from './components/PosterApp';

function App() {
  const [appMode, setAppMode] = useState<'collector' | 'poster' | null>(null);

  if (!appMode) {
    return <AppModeSelector onSelectMode={setAppMode} />;
  }

  if (appMode === 'collector') {
    return <CollectorApp />;
  }

  return <PosterApp />;
}

export default App;