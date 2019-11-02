import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, ImageBackground, Alert } from "react-native";
import {
  Container, Header, Title, Content, Footer, FooterTab,
  Button, Left, Right, Body, Icon, Text, Form, Root, Toast
} from 'native-base';
import { firebaseApp } from '../FirebaseConfig'
import images from '../theme/image'
import { Actions } from 'react-native-router-flux';

export default class DangKy extends Component {

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database();
    this.state = {
      email: '',
      pass: ''
    };
  }

  SignUp(){
    firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.pass)
      .then(() => {
        Alert.alert(
          'Thông báo',
          'Đăng kí thành công',
          [
            { text: 'OK', onPress: () => Actions.pop() },
          ],
        )
        this.setState({email:'',pass:''})
      })
      .catch((err)=>{
          Alert.alert(
            'Thông báo',
            'Đăng kí thất bại',
            [
              {
                text: 'OK',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ],
            { cancelable: false },
          );
        this.setState({ email: '', pass: '' })
        }
      )
  };

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
              <Title style={styles.textHeader}>Đăng ký</Title>
            </Body>
            <Right />
          </Header>
          <Content style={styles.content}>
            <ImageBackground source={{ uri: images.Background }} style={{ width: '100%', height: '100%' }}>
              <View style={styles.viewContent}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(email) => this.setState({ email })}
                  value={this.state.email}
                  multiline
                  placeholder="Email"
                />
                <TextInput
                  style={styles.textInput}
                  onChangeText={(pass) => this.setState({ pass })}
                  value={this.state.pass}
                  multiline
                  placeholder="PassWord"
                />
                <TouchableOpacity style={styles.touchLog} onPress={()=>this.SignUp()}>
                  <Text style={styles.textLog}>Đăng ký</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </Content>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 10,
    height: 400
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
  },
  viewContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 700,
  },
  touchLog: {
    height: 30,
    width: '80%',
    backgroundColor: 'red',
    marginTop: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLog: {
    fontSize: 14,
    color: 'white'
  }
});
