import React, { Component } from 'react';
import { StyleSheet, View, ListView, ScrollView, Image, TouchableOpacity } from "react-native";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { firebaseApp } from '../FirebaseConfig'
import { Actions } from 'react-native-router-flux';


export default class TinNong extends Component {

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database();
    items = []
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    };
  }


  componentWillMount() {
    this.itemRef.ref('theLoai')
      .child('Tin nóng')
      .on('value', (snap) => {
        items = []
        snap.forEach((data) => {
          items.push({
            key: data.key,
            data: data.val(),
            theLoai: 'Tin nóng'
          })
        })
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(items)
        })
      })
  }

  touchItem(data) {
    Actions.contents({ data })
  }

  renderRow(data) {
    return (
      <TouchableOpacity onPress={() => this.touchItem(data)}>
        <View style={styles.item}>
          <View style={styles.viewImage}>
            <Image
              source={{ uri: data.data.image1 }}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
          <View style={styles.viewContenItem}>
            <View style={styles.titleItem}>
              <Text style={styles.textTitle}>{data.data.title}</Text>
            </View>
            <View style={styles.thongTinItem}>
              <Text style={styles.textThongTin}>{data.data.trichDan}</Text>
              <Text style={styles.textThongTin}> .{data.data.timePush}</Text>
              <Text style={styles.textThongTin}> .{data.data.luotXem}</Text>
              <Icon name='eye' style={styles.eye}></Icon>
            </View>
          </View>
        </View>
        <View style={styles.line}></View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
          <ScrollView>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
            />
          </ScrollView>
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
  item: {
    height: 100,
    width: '100%',
    flexDirection: 'row',
    borderRadius: 5,
  },
  viewImage: {
    flex: 1,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
  },
  viewContenItem: {
    flex: 2,
    paddingLeft: 5,
    paddingRight: 5,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
  },
  titleItem: {
    width: '100%',
    flex: 10,
  },
  thongTinItem: {
    width: '100%',
    flex: 2,
    alignItems: 'center',
    flexDirection: 'row'
  },
  textThongTin: {
    color: 'gray',
    fontSize: 11,
    marginLeft: 5,
  },
  textTitle: {

  },
  eye: {
    fontSize: 15,
    marginLeft: 5,
    color: '#a71e36'
  },
  line: {
    height: 0.3,
    backgroundColor: 'gray',
    marginTop: 10,
    marginBottom: 10,
    width: '100%'
  }
});
