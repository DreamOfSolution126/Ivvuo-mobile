import React from 'react';
import { StyleSheet, View } from 'react-native';
import {Provider} from 'react-redux';

import MainScreen from './src/screens/MainScreen';

import configureStore from './src/configureStore';

let store = configureStore()

export default function App() {
  return (
    
    <Provider store={store}>
      <View style={{flex:1, backgroundColor:"#eee"}}>
        
        <MainScreen></MainScreen>
        
      </View>
    </Provider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
});