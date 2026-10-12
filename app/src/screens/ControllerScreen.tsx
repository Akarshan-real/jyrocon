// Placeholder for Controller UI Screen
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ControllerScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jyrocon Controller</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
