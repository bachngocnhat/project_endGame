import React, { Component } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Image } from "react-native";
import {
  Container, Header, Title, Content, Footer, FooterTab,
  Button, Left, Right, Body, Icon, Text, Picker, Form, Root, Toast
} from 'native-base';
import { firebaseApp } from '../FirebaseConfig'
import images from '../theme/image'

export default class InsertTheLoai extends Component {

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database();
    this.state = {
      theLoai:'',
      demError:1
    };
  }

  insertTheLoai(){
    this.setState({
      demError: this.state.demError + 1
    })
    if (this.state.theLoai !== '') {
      this.itemRef.ref('listTheLoai').push({ theLoai: this.state.theLoai})
      this.setState({
        theLoai: '',
        demError:1
      })
      Toast.show({
        text: "Insert thành công!",
        buttonText: "Okay",
        duration: 5000,
        type: "success"
      })
    }
  }

  onPush() {
    
  }

  render() {
    return (
      <Root>
        <Container>
          <Content style={styles.content}>
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
              <Button full style={styles.button} onPress={() => this.insertTheLoai()}>
                <Text style={{ color: 'white', fontSize: 16 }}>Insert</Text>
              </Button>
          </Content>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  content: {
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
    fontSize: 13
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
