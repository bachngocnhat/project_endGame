import React, { Component } from 'react';
import {  } from 'native-base';
import { StyleSheet, View,Text } from "react-native";
import LottieView from 'lottie-react-native';
import { Actions } from 'react-native-router-flux'

export default class Loading extends Component {

  componentDidMount() {
    setTimeout(()=>Actions.home(),3000)
  }

  render() {
    return (
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
        <LottieView style={{ width: 200, height: 200}} source={require('../assets/imgDong/loading.json')} autoPlay loop />
      </View>
    );
  }
}