import React, { Component } from 'react';
import { StyleSheet, View, ListView, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import {
  Container, Header, Title, Content
  , Button, Left, Right, Body,
  Icon, Text, Form, Picker, SwipeRow, List, ListItem,
  Toast, Root
} from 'native-base';
import { firebaseApp } from '../FirebaseConfig'
import { Actions } from 'react-native-router-flux'


export default class DeleteTheLoai extends Component {

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database();
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    };
  }

  componentWillMount() {
    this.setState({ demError: this.state.demError + 1 })
    this.itemRef.ref('listTheLoai')
      .on('value', (snap) => {
        items = [],
          snap.forEach((data) => {
            items.push({
              key: data.key,
              data: data.val(),
            })
          })
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(items),
        })
      })
  }

  touchItem(data) {
    Actions.contents({ data })
  }

  deleteTheLoai(data){
    const theLoai = data.data.theLoai
    Alert.alert(
      'Xoá ' + theLoai,
      'Xoá tất cả bài viết liên quan đến ' + theLoai ,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => {
          console.log(data)
          this.itemRef.ref('listTheLoai')
            .child(data.key)
            .remove()
          this.itemRef.ref('theLoai')
            .child(data.data.theLoai)
            .remove()
          Toast.show({
            text: "Xóa thành công!",
            buttonText: "Okay",
            duration: 5000,
            type: "success"
          })
        }},
      ],
      { cancelable: false },
    );
  }

  renderRow(data) {
    return (
      <SwipeRow
        rightOpenValue={-75}
        body={
              <Text style={{ fontSize: 14 }}>{data.data.theLoai}</Text>
        }
        right={
          <Button danger onPress={() => this.deleteTheLoai(data)}>
            <Icon active name="trash" />
          </Button>
        }
      />
    )
  }


  render() {
    return (
      <Root>
        <Container>

          <Content style={styles.content}>
            <ScrollView>
              <Text style={{ fontSize: 16, color:'#a71e36'}}>Danh sách thể loại</Text>
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                style={{ marginTop: 20 }}
              />
            </ScrollView>
          </Content>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  chuyenMuc: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue'
  },
  textListTL: {
    fontSize: 14
  },
  noiBat: {
    fontSize: 14,
    fontWeight: '300',
  },
  viewIcon: {
    padding: 10
  },
  viewBao: {

  },
  viewBaoTop: {
    flexDirection: 'row',
    marginTop: 10
  },
  viewBaoBottom: {
    flexDirection: 'row',
    marginTop: 10
  },
  viewItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textItem: {
    fontSize: 12,
    fontWeight: '300',
    marginTop: 5
  },
  iconItem: {
    backgroundColor: '#a71e36',
    width: 35,
    height: 35,
    borderRadius: 17
  },
  lienHe: {
    paddingRight: 70,
    paddingLeft: 10,
    marginTop: 5
  },
  itemLienHe: {
    flexDirection: 'row',
    marginTop: 10
  },
  leftLH: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  rightLH: {
    flex: 5,
  },
  copy: {
    paddingLeft: 20,
    marginTop: 30,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#eeeeee'
  },
  textCopy: {
    fontSize: 12,
    fontWeight: '300',
    marginTop: 2
  },
  headerDW: {
    backgroundColor: '#a71e36',
    height: 180
  },
  login: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white'
  },
  textLogIn: {
    fontSize: 12,
    color: 'white'
  },
  touchLog: {
    marginTop: 10,
    paddingLeft: 20,
    paddingTop: 5,
    paddingRight: 20,
    paddingBottom: 5,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 1,
  },
  touchTim: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a71e36',
    borderRadius: 10,
    marginTop: 10,

  },
  textTim: {
    color: 'white',
    fontSize: 12
  },



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
  },
  icon: {
    color: 'white'
  }
});
