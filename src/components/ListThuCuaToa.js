import React, { Component } from 'react';
import { StyleSheet, View, ListView, ScrollView, Image, TouchableOpacity, FlatList, Alert } from "react-native";
import {
  Container, Header, Title, Content, Footer,
  FooterTab, Button, Left, Right, Body,
  Icon, Text, List, ListItem, Form, Picker, SwipeRow, Toast, Root
} from 'native-base';
import { firebaseApp } from '../FirebaseConfig'
import { Actions } from 'react-native-router-flux'
import Drawer from 'react-native-drawer'
import images from '../theme/image'
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import imageDong from '../theme/imgDong'


export default class ListThuCuaToa extends Component {

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database();
    items = []
    this.state = {
      stateMuc: undefined,
      chosenDatesA: moment(),
      isDateTimePickerVisible: false,
      demError: 1,
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      hienView: true
    };
  }
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  _handleDatePicked = (date) => {
    this.setState({ chosenDatesA: moment(date) })
    this._hideDateTimePicker();
  };

  onValueChange(value: string) {
    this.setState({
      stateMuc: value,
    });
  }

  onTimKiem() {
    this.setState({
      demError: this.state.demError + 1,
      hienView: true
    })
    if (this.state.stateMuc !== undefined) {
      try {
        this.itemRef.ref('thuGuiToa')
          .child(this.state.stateMuc)
          .child(this.state.chosenDatesA.format("MMM Do YY"))
          .on('value', (snap) => {
            items = []
            snap.forEach((data) => {
              if (data) { this.setState({ hienView: false }) }
              items.push({
                key: data.key,
                data: data.val(),
              })
            })
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(items),
            })
          })
      } catch (e) {
        console.log('err:', e)
      }
    }
  }
  ondelete(item) {
    Alert.alert(
      'Thông báo',
      'Bạn muốn xóa?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK', onPress: () => {
            this.itemRef.ref('thuGuiToa')
              .child(this.state.stateMuc)
              .child(this.state.chosenDatesA.format("MMM Do YY"))
              .child(item.key)
              .remove()

            Toast.show({
              text: "Xóa thành công!",
              buttonText: "Okay",
              duration: 5000,
              type: "success"
            })
          }
        },
      ],
      { cancelable: false },
    );
  }

  touchItem(data) {
    Actions.contentMail({ data })
  }

  renderRow(data) {

    return (
      <SwipeRow
        leftOpenValue={75}
        rightOpenValue={-75}
        left={
          <Button danger onPress={() => this.ondelete(data)} style={{ flexDirection: 'column' }}>
            <Icon active name="trash" />
            <Text style={{ fontSize: 10, color: 'white' }}>Xóa</Text>
          </Button>
        }
        body={
          <View style={{ flexDirection: 'row', }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
              <Image
                source={images.AVATAR}
                style={styles.iconItem}
                resizeMode="contain"
              />
            </View>
            <View style={styles.titleLienHe}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomColor: 'white', borderBottomWidth: 1, borderRadius: 5, paddingLeft: 20, paddingRight: 20 }}>
                <Text style={styles.lienHe}>Người gửi:</Text>
                <Text style={styles.lienHe}>  {data.data.lienHe}</Text>
              </View>
              <Text style={[styles.lienHe, { color: 'white', marginTop: 5, fontSize: 14, }]}>{data.data.noiDung}</Text>
            </View>
          </View>
        }
        right={
          <Button success onPress={() => this.touchItem(data)} style={{ flexDirection: 'column' }}>
            <Icon active name="book" />
            <Text style={{ fontSize: 10, color: 'white' }}>Chi tiết</Text>
          </Button>
        }
      />
    )
  }


  render() {
    return (
      <Root>
        <Container>
          <Header style={styles.header}>
            <Left>
              <Button transparent>
                <Icon name='menu' onPress={this.openControlPanel} style={styles.icon} />
              </Button>
            </Left>
            <Body>
              <Title style={styles.textHeader}>List mail</Title>
            </Body>
            <Right />
          </Header>
          <Content style={styles.content}>
            <ScrollView>
              <View style={styles.theLoai}>
                <Form>
                  <Picker
                    mode="dropdown"
                    renderHeader={backAction =>
                      <Header style={{ backgroundColor: "#a71e36" }}>
                        <Left>
                          <Button transparent onPress={backAction}>
                            <Icon name="arrow-back" style={{ color: "#fff" }} />
                          </Button>
                        </Left>
                        <Body style={{ flex: 3 }}>
                          <Title style={{ color: "#fff" }}>Thư mục</Title>
                        </Body>
                        <Right />
                      </Header>}
                    iosIcon={<Icon name="arrow-down" style={{ color: '#a71e36' }} />}
                    textStyle={{ color: "#a71e36", }}
                    placeholder="Chọn mục"
                    itemTextStyle={{ color: '#a71e36' }}
                    style={{ width: undefined }}
                    selectedValue={this.state.stateMuc}
                    onValueChange={this.onValueChange.bind(this)}
                  >
                    <Picker.Item label="Ban biên tập" value="Ban biên tập" />
                    <Picker.Item label="Video" value="Video" />
                    <Picker.Item label="Thời sự" value="Thời sự" />
                  </Picker>
                </Form>
              </View>
              {
                this.state.demError > 1 && this.state.stateMuc == undefined
                  ? <Text style={{ color: 'red', fontSize: 12, marginTop: 5, marginLeft: 5, }}>Bạn phải chọn mục!</Text>
                  : null
              }
              <TouchableOpacity style={[styles.theLoai, { padding: 10, flexDirection: 'row', marginTop: 10, height: 47, alignItems: 'center' }]} onPress={this._showDateTimePicker}>
                <TouchableOpacity style={{flexDirection:'row'}}>
                  <View>
                    <Text style={{ color: '#a71e36', fontSize: 16 }}>Chọn ngày</Text>
                  </View>
                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this._handleDatePicked}
                  onCancel={this._hideDateTimePicker}
                />
                <Text style={styles.textDatePicker} >
                  {this.state.chosenDatesA.format('DD/MM/YYYY')}
                </Text>
                </TouchableOpacity>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.onTimKiem()} style={styles.touchTim}>
                <Text style={styles.textTim}>Tìm kiếm</Text>
              </TouchableOpacity>
              {
                this.state.hienView == true
                  ? 
                  <View style={{justifyContent:'center',alignItems:'center', marginTop:150}}>
                    <LottieView style={{ width: 200, height: 200 }} source={imageDong.loadErr} autoPlay loop />
                  </View>
                  : <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                  />
              }
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
    width: 35,
    height: 35,
    borderRadius: 17,
    borderColor: '#a71e36',
    borderWidth: 1,
  },
  lienHe: {
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
  theLoai: {
    borderColor: '#a71e36',
    borderWidth: 1,
    borderRadius: 10,
  },
  textDatePicker: {
    marginLeft: 20,
    color: '#a71e36',

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
  },
  titleLienHe: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a71e36',
    flex: 4,
    padding: 5,
    borderRadius: 10
  },
  lienHe: {
    color: 'white',
    fontSize: 14,
  },
  touch: {
    borderWidth: 1,
    borderColor: '#a71e36',
    borderRadius: 5,
  }
});
