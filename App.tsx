import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import { View, Text, StyleSheet } from 'react-native';

// Loading component while persistence is loading
const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c5530',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default App;
