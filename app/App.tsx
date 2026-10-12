import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ControllerScreen } from './src/screens/ControllerScreen';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <ControllerScreen />
    </SafeAreaProvider>
  );
}

export default App;
