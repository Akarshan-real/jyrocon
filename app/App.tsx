import React from 'react';
import { StatusBar, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ControllerScreen } from './src/screens/ControllerScreen';
import { SearchingBLE } from './src/screens/SearchingBLE';
import { CarProvider, useCar } from './src/context/CarContext';

const BG_IMAGE = require('./public/img/other/bg.jpg');

const MainNavigator: React.FC = () => {
  const { connectionStatus } = useCar();

  return (
    <ImageBackground
      source={BG_IMAGE}
      style={styles.background}
      resizeMode="cover"
    >
      {connectionStatus === 'connected' ? (
        <ControllerScreen />
      ) : (
        <SearchingBLE />
      )}
    </ImageBackground>
  );
};

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <CarProvider>
        <MainNavigator />
      </CarProvider>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});


export default App;
