import React, { Component } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Image } from "react-native";
import {
  Container, Header, Title, Content, Footer, FooterTab,
  Button, Left, Right, Body, Icon, Text, Picker, Form, Root, Toast
} from 'native-base';
import { firebaseApp } from '../FirebaseConfig'
import images from '../theme/image'
import { Actions } from 'react-native-router-flux';

export default class EditTheLoaiXL extends Component {

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database();
    this.state = {
      theLoai: this.props.data.data.theLoai,
      demError: 1
    };
  }

  editTheLoai() {
    this.setState({
      demError: this.state.demError + 1
    })
    if (this.state.theLoai !== '') {
      this.itemRef.ref('listTheLoai')
      .child(this.props.data.key)
      .update({ theLoai: this.state.theLoai })
      this.setState({
        theLoai: '',
        demError: 1
      })
      Toast.show({
        text: "Edit thành công!",
        buttonText: "Okay",
        duration: 5000,
        type: "success"
      })
      Actions.pop()
    }
  }

  render() {
    console.log(this.props.data)
    return (
      <Root>
        <Container>
          <Header style={styles.header}>
            <Left>
              <Button transparent>
                <Icon name="arrow-back" style={{color:'white'}} onPress={()=>Actions.pop()}/>
              </Button>
            </Left>
            <Body>
              <Title style={styles.textHeader}>Edit the loai</Title>
            </Body>
            <Right />
          </Header>
          <Content style={styles.content}>
            <ScrollView>
              <Text style={styles.text}>Thể loại</Text>
              <View style={styles.theLoai}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(theLoai) => this.setState({ theLoai })}
                  value={this.state.theLoai}
                  multiline
                />
              </View>
              {
                this.state.demError > 1 && this.state.theLoai == ''
                  ? <Text style={styles.textError}>Bạn phải nhập tên thể loại!</Text>
                  : null
              }
              <Button full style={styles.button} onPress={() => this.editTheLoai()}>
                <Text style={{ color: 'white', fontSize: 16 }}>Edit</Text>
              </Button>
            </ScrollView>
          </Content>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    padding:5
  },
  header: {
    backgroundColor: '#a71e36',
  },
  textHeader: {
    color: 'white'
  },
  button: {
    backgroundColor: '#a71e36',
    height: 30,
    borderRadius: 20
  },
  footer: {
    height: 30,
    backgroundColor: 'white',
    padding: 5,
    borderTopWidth: 0,
  },
  text: {
    fontSize: 14,
    color:'#a71e36'
  },
  theLoai: {
    width: '100%',
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 0.5,
    marginBottom: 10,
    marginTop: 5,
  },
  textInput: {
    width: '100%',
    height: '100%',
    paddingLeft: 5
  },
  textError: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});
