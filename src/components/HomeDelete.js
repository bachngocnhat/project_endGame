import React, { Component } from 'react';
import {
  StyleSheet, View, TextInput, ScrollView,
  TouchableOpacity, Image, ActivityIndicator, Platform, Alert, ListView, FlatList
} from "react-native";
import { Container, Header, Left, Body, Right, Button, Icon, Segment, Content, Text } from 'native-base';
import DeleteItem from './DeleteItem'
import DeleteTheLoai from './DeleteTheLoai'


export default class HomeDelete extends Component {

  constructor(props) {
    super(props);
    this.state = {
      atBV: false,
      atTL: true,
      background: '#a71e36'
    };
  }

  BV() {
    this.setState({ atBV: true, atTL: false })
  }
  TL() {
    this.setState({ atBV: false, atTL: true })
  }



  render() {
    return (
      <Container>
        <Header hasSegment style={styles.header}>
          <Left>
          </Left>
          <Body >
            <Segment style={styles.header}>
              <Button first onPress={() => this.TL()} style={[styles.styleTL, this.state.atTL ? { backgroundColor: '#a71e36' } : { backgroundColor: 'white' }]}>
                <Text style={[this.state.atTL ? { color: 'white' } : { color: '#a71e36' }]}>Delete thể loại</Text>
              </Button>
              <Button last onPress={() => this.BV()} style={[styles.styleTL, this.state.atBV ? { backgroundColor: '#a71e36' } : { backgroundColor: 'white' }]}>
                <Text style={[this.state.atBV ? { color: 'white' } : { color: '#a71e36' }]}>Delete bài viết</Text>
              </Button>
            </Segment>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="search" style={{ color: 'white' }} />
            </Button>
          </Right>
        </Header>
        <Content padder>
          {
            this.state.atBV == true
              ? <DeleteItem></DeleteItem>
              : <DeleteTheLoai></DeleteTheLoai>
          }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 5,
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
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: 5,
  },
  styleTL: {
    backgroundColor: 'white',
    borderColor: 'white'
  }
});
