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

export default class Contents extends Component {

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database();
    this.state = {
      email: '',
      pass: ''
    };
  }

  dangNhap() {
    firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.pass)
      .then(res => {
        console.log(res.user.email);
        Alert.alert(
          'Thông báo',
          'Đăng nhập thành công',
          [
            { text: 'OK', onPress: () => Actions.insertTab() },
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
              onPress: () => { this.setState({ email: '', pass: '' }) }
            },
          ],
          { cancelable: false },
        )
      })
  }

  render() {
    return (
      <Root>
        <Container>
          <Header style={styles.header}>
            <Left>
              <Button transparent onPress={() => Actions.pop()}>
                <Icon name='arrow-back' style={{ color: 'white' }} />
              </Button>
            </Left>
            <Body>
              <Title style={styles.textHeader}>Login</Title>
            </Body>
            <Right />
          </Header>
          <Content style={styles.content}>
            <KeyboardAvoidingView>
            <View style={styles.viewContent}>
              <LottieView style={{ width: '100%', height: 300 }} source={imageDong.login} autoPlay loop />
              <TextInput
                style={styles.textInput}
                onChangeText={(email) => this.setState({ email })}
                value={this.state.email}
                placeholder="Email"
              />
              <TextInput
                style={styles.textInput}
                onChangeText={(pass) => this.setState({ pass })}
                value={this.state.pass}
                placeholder="PassWord"
                secureTextEntry
                keyboardType="default"
              />
              <TouchableOpacity style={styles.touchLog} onPress={() => this.dangNhap()}>
                <Text style={styles.textLog}>Login</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.touchLog} onPress={() => Actions.dangKy()}>
                  <Text style={styles.textLog}>Đăng ký</Text>
                </TouchableOpacity> */}
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
