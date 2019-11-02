import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, ImageBackground, Alert, KeyboardAvoidingView } from "react-native";
import {
  Container, Header, Title, Content, Footer, FooterTab,
  Button, Left, Right, Body, Icon, Text, Form, Root, Toast
} from 'native-base';
import { firebaseApp } from '../FirebaseConfig'
import images from '../theme/image'
import { Actions } from 'react-native-router-flux';
import LottieView from 'lottie-react-native';
import imageDong from '../theme/imgDong'

export default class Logout extends Component {

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database();
    this.state = {
      email: '',
      pass: ''
    };
  }

  logout() {

    Alert.alert(
      'Logout',
      'Bạn có muốn đăng xuất?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'OK', onPress: () => {
          firebaseApp.auth().signOut()
            .then(res => {
              Alert.alert(
                'Thông báo',
                'Đăng xuất thành công!',
                [
                  { text: 'OK', onPress: () => Actions.home() },
                ],
              );
            })
            .catch((error) => {
              Alert.alert(
                'Đăng nhập thất bại',
                'Bạn có muốn đăng nhập lại?',
                [
                  {
                    text: 'OK',
                    style: 'cancel',
                  },
                ],
                { cancelable: false },
              )
            })
        }},
      ],
      { cancelable: false },
    );
  }

  render() {
    return (
      <Root>
        <Container>
          <Header style={styles.header}>
            <Left />
            <Body>
              <Title style={styles.textHeader}>Logout</Title>
            </Body>
            <Right />
          </Header>
          <Content style={styles.content}>
            <KeyboardAvoidingView>
              <View style={styles.viewContent}>
                <LottieView style={{ width: '100%', height: 300 }} source={imageDong.logout} autoPlay loop />
                <TouchableOpacity style={styles.touchLog} onPress={() => this.logout()}>
                  <Text style={styles.textLog}>Logout</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Content>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    height: 450,

  },
  header: {
    backgroundColor: '#a71e36',
  },
  textHeader: {
    color: 'white'
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 0.5,
    height: 30,
    width: '80%',
    marginTop: 5,
    paddingLeft: 5,
    color: 'gray'
  },
  viewContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 700,
  },
  touchLog: {
    height: 30,
    width: '80%',
    backgroundColor: '#a71e36',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLog: {
    fontSize: 14,
    color: 'white'
  },
  textE: {
    color: '#a71e36',
    fontSize: 16,
    marginTop: 10
  }
});
