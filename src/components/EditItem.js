import React, { Component } from 'react';
import { StyleSheet, View, ListView, ScrollView, Image, TouchableOpacity } from "react-native";
import {
  Container, Header, Title, Content, Footer,
  FooterTab, Button, Left, Right, Body,
  Icon, Text, Form, Picker, SwipeRow
} from 'native-base';
import { firebaseApp } from '../FirebaseConfig'
import { Actions } from 'react-native-router-flux'
import LottieView from 'lottie-react-native';
import imageDong from '../theme/imgDong'


export default class EditItem extends Component {

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database();
    items = []
    this.state = {
      stateTheLoai: undefined,
      listTheLoai: [],
      demError: 1,
      hienView: true,
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    };
  }

  onValueChange(value: string) {
    this.setState({
      stateTheLoai: value,
    });
  }

  closeControlPanel = () => {
    this._drawer.close()
  };
  openControlPanel = () => {
    this._drawer.open()
  };
  onTimKiem() {
    this.setState({
      demError: this.state.demError + 1,
      hienView: true
    })
    if (this.state.stateTheLoai !== undefined) {
      this.itemRef.ref('theLoai')
        .child(this.state.stateTheLoai)
        .on('value', (snap) => {
          items = [],
            snap.forEach((data) => {
              if (data) { this.setState({ hienView: false }) }
              items.push({
                key: data.key,
                data: data.val(),
                theLoai: this.state.stateTheLoai
              })
            })
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(items),
            demError: 1,
          })
        })
    }
  }

  touchItem(data) {
    Actions.contents({ data })
  }

  renderRow(data) {
    console.log(data)
    return (
      <SwipeRow
        rightOpenValue={-75}
        body={
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
        }
        right={
          <Button success onPress={() => Actions.editItemXL({ data })} style={{ flexDirection: 'column' }}>
            <Icon active name="create" />
            <Text style={{ fontSize: 10 }}>Edit Item</Text>
          </Button>
        }
      />
    )
  }

  async componentDidMount() {
    await this.itemRef.ref('listTheLoai')
      .on('value', (snap) => {
        let listTheLoai = []
        snap.forEach((data) => {
          listTheLoai.push({
            key: data.key,
            theLoai: data.val().theLoai
          })
        })
        this.setState({ listTheLoai })
      })

  }

  renderPicker() {
    return (
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
              <Title style={{ color: "#fff" }}>Thể loại</Title>
            </Body>
            <Right />
          </Header>}
        textStyle={{ color: "#a71e36", }}
        placeholder="Chọn thể loại"
        itemTextStyle={{ color: '#a71e36' }}
        style={{ width: undefined, height: 30 }}
        selectedValue={this.state.stateTheLoai}
        onValueChange={this.onValueChange.bind(this)}
      >
        <Picker.Item label='Tin nóng' value='Tin nóng' />
        {this.state.listTheLoai.map((el, index) => {
          return <Picker.Item key={index} label={el.theLoai} value={el.theLoai} />
        })}
      </Picker>
    )
  }

  render() {
    return (
      <Container>
        <Content style={styles.content}>
          <ScrollView>
            <View style={styles.theLoai}>
              <Form style={{ borderRadius: 10, borderColor: '#a71e36', borderWidth: 1 }}>
                {this.renderPicker()}
              </Form>
              {
                this.state.demError > 1 && this.state.stateTheLoai == undefined
                  ? <Text style={{ fontSize: 12, color: 'red', marginTop: 10 }}>Bạn phải chọn thể loại!</Text>
                  : null
              }
            </View>
            <TouchableOpacity onPress={() => this.onTimKiem()} style={styles.touchTim}>
              <Text style={styles.textTim}>Tìm kiếm</Text>
            </TouchableOpacity>

            {
              this.state.hienView == true
                ?
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 150 }}>
                  <LottieView style={{ width: 200, height: 200 }} source={imageDong.loadErr} autoPlay loop />
                </View>
                :
                <ListView
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow.bind(this)}
                  style={{ marginTop: 20 }}
                />
            }
            </ScrollView>
        </Content>
      </Container>
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
