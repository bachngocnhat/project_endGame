import React, { Component } from 'react';
import { StyleSheet, View, ListView, ScrollView, Image, TouchableOpacity, FlatList } from "react-native";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, List, ListItem } from 'native-base';
import { firebaseApp } from '../FirebaseConfig'
import { Actions } from 'react-native-router-flux'
import Drawer from 'react-native-drawer'
import images from '../theme/image'
import LottieView from 'lottie-react-native';
import imageDong from '../theme/imgDong'


export default class Home extends Component {

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database();
    items = []
    this.state = {
      theLoai: 'Tin nóng',
      listTheLoai: [],
      hienView:true,
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    };
  }

  closeControlPanel = () => {
    this._drawer.close()
  };
  openControlPanel = () => {
    this._drawer.open()
  };


  async componentWillMount() {
    this.setState({ hienView: false })
    await this.itemRef.ref('theLoai')
      .child(this.state.theLoai)
      .on('value', (snap) => {
        items = []
        snap.forEach((data) => {
          items.push({
            key: data.key,
            data: data.val(),
            theLoai: this.state.theLoai
          })
        })
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(items)
        })
      })
  }

  async componentWillUpdate(nextProps, nextState) {
    if (this.state.theLoai !== nextState.theLoai) {
      this.itemRef.ref('theLoai')
        .child(nextState.theLoai)
        .on('value', (snap) => {
          items = []
          snap.forEach((data) => {
            if (data) { this.setState({hienView:false})}
            items.push({
              key: data.key,
              data: data.val(),
              theLoai: nextState.theLoai
            })
          })
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(items)
          })
        })
    }
  }

  componentDidMount() {
    this.itemRef.ref('listTheLoai')
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

  touchItem(data) {
    this.itemRef.ref('theLoai')
      .child(data.theLoai)
      .child(data.key)
      .update({
        luotXem: data.data.luotXem + 1
      })

    Actions.contents({ data })
  }

  renderRow(data) {
    return (
      <TouchableOpacity onPress={() => this.touchItem(data)}>
        <View style={styles.item}>
          <View style={styles.viewImage}>
            <Image
              source={{ uri: data.data.image1 }}
              style={{ width: '100%', height: '100%', borderRadius:5 }}
            />
          </View>
          <View style={styles.viewContenItem}>
            <View style={styles.titleItem}>
              <Text style={styles.textTitle}>{data.data.title}</Text>
            </View>
            <View style={styles.thongTinItem}>
              <Text style={styles.textThongTin}>{data.data.trichDan}</Text>
              <Text style={styles.textThongTin}>. {data.data.timePush}</Text>
              <Text style={styles.textThongTin}>. {data.data.luotXem} </Text>
              <Icon name='eye' style={styles.eye}></Icon>
            </View>
          </View>
        </View>
        <View style={styles.line}></View>
      </TouchableOpacity>
    )
  }
  touchTheLoai(theLoai) {
    console.log(theLoai)
    this.setState({
      theLoai,
      hienView: true 
    })
    this.closeControlPanel()
  }

  renderTheLoai() {
    return (
      <List>
        {
          this.state.listTheLoai.map((el, index) => {
            return <ListItem style={{ flexDirection: 'row', }} onPress={() => this.touchTheLoai(el.theLoai)}>
              <Icon name='list-box' style={styles.iconList}></Icon>
              <Text style={styles.textListTL}>{el.theLoai}</Text>
            </ListItem>
          })
        }
      </List>
    )
  }


  render() {
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        tapToClose={true}
        content={
          <Container style={{ width: '90%', height: '100%' }}>
            <Header style={styles.headerDW}>
              <Left style={{ flex: 1 }}>
              </Left>
              <Body style={{ flex: 5 }}>
                <Image
                  source={images.AVATAR}
                  style={styles.login}
                  resizeMode="contain"
                />
                <TouchableOpacity style={styles.touchLog} onPress={()=>Actions.logIn()}>
                  <Text style={styles.textLogIn}>Đăng nhập / Đăng ký</Text>
                </TouchableOpacity>
              </Body>
              <Right style={{ flex: 1 }}>
                <Icon name='arrow-forward' onPress={this.closeControlPanel} style={styles.icon} />
              </Right>
            </Header>
            <Content>
              <ScrollView>
                <View style={{ alignItems: 'flex-end', flexDirection: 'row', marginBottom: 20 }}>
                  <View style={{ flex: 1 }}></View>
                  <View style={{ flex: 5, justifyContent: 'center', alignItems: "center" }}>
                    <Text style={{ color: '#a71e36', fontSize: 18, fontWeight: '500' }}>Chuyên mục</Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
                    <Icon name="menu" style={{ color: '#a71e36', fontSize: 25 }}></Icon>
                  </View>
                </View>
                <List>
                  {this.renderTheLoai()}
                </List>

                <View style={styles.viewIcon}>
                  <Text style={styles.noiBat}>Nguồn báo nổi bật</Text>
                  <View style={styles.viewBao}>
                    <View style={styles.viewBaoTop}>
                      <View style={styles.viewItem}>
                        <Image
                          source={images.ZING}
                          style={styles.iconItem}
                          resizeMode="contain"
                        />
                        <Text style={styles.textItem}>Zing</Text>
                      </View>
                      <View style={styles.viewItem}>
                        <Image
                          source={images.TIENPHONG}
                          style={styles.iconItem}
                          resizeMode="contain"
                        />
                        <Text style={styles.textItem}>Tiền Phong</Text>
                      </View>
                      <View style={styles.viewItem}>
                        <Image
                          source={images.THANHNIEN}
                          style={styles.iconItem}
                          resizeMode="contain"
                        />
                        <Text style={styles.textItem}>Thanh Niên</Text>
                      </View>
                      <View style={styles.viewItem}>
                        <Image
                          source={images.VIETNAMNET}
                          style={styles.iconItem}
                          resizeMode="contain"
                        />
                        <Text style={styles.textItem}>VietnamNet</Text>
                      </View>
                    </View>
                    <View style={styles.viewBaoBottom}>
                      <View style={styles.viewItem}>
                        <Image
                          source={images.E}
                          style={styles.iconItem}
                          resizeMode="contain"
                        />
                        <Text style={styles.textItem}>VnEconomy</Text>
                      </View>
                      <View style={styles.viewItem}>
                        <Image
                          source={images.SG}
                          style={styles.iconItem}
                          resizeMode="contain"
                        />
                        <Text style={styles.textItem}>Saigon Time</Text>
                      </View>
                      <View style={styles.viewItem}>
                        <Image
                          source={images.ICT}
                          style={styles.iconItem}
                          resizeMode="contain"
                        />
                        <Text style={styles.textItem}>ICTNews</Text>
                      </View>
                      <View style={styles.viewItem}>
                        <Image
                          source={images.LAODONG}
                          style={styles.iconItem}
                          resizeMode="contain"
                        />
                        <Text style={styles.textItem}>Lao Động</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.lienHe}>
                  <Text style={styles.noiBat}>Liên hệ</Text>
                  <View style={styles.itemLienHe}>
                    <View style={styles.leftLH}>
                      <Icon name="mail" style={{ fontSize: 25 }}></Icon>
                    </View>
                    <View style={styles.rightLH}>
                      <Text style={{ marginTop: 5, fontSize: 14, fontWeight: '300' }}>Góp ý và đánh giá ứng dụng</Text>
                      <Text style={{ marginTop: 10, fontSize: 12, color: 'gray', fontStyle: 'italic' }}>Mời bạn góp ý giúp chúng tôi hoàn thiện tốt hơn</Text>
                    </View>
                  </View>
                  <View style={styles.itemLienHe}>
                    <View style={styles.leftLH}>
                      <Icon name="call" style={{ fontSize: 25 }}></Icon>
                    </View>
                    <View style={styles.rightLH}>
                      <Text style={{ marginTop: 5, fontSize: 14, fontWeight: '300' }}>Thông tin tòa soạn</Text>
                      <Text style={{ marginTop: 10, fontSize: 12, color: 'gray', fontStyle: 'italic' }}>0965.043.781 (Hà Nội)</Text>
                      <Text style={{ marginTop: 2, fontSize: 12, color: 'gray', fontStyle: 'italic' }}>0965.043.781 (TP.HCM)</Text>
                    </View>
                  </View>
                  <View style={styles.itemLienHe}>
                    <View style={styles.leftLH}>
                      <Icon name="people" style={{ fontSize: 25 }}></Icon>
                    </View>
                    <View style={styles.rightLH}>
                      <Text style={{ marginTop: 5, fontSize: 14, fontWeight: '300' }}>Liên hệ quảng cáo</Text>
                      <Text style={{ marginTop: 10, fontSize: 12, color: 'gray', fontStyle: 'italic' }}>0965.043.781 (Hà Nội)</Text>
                      <Text style={{ marginTop: 2, fontSize: 12, color: 'gray', fontStyle: 'italic' }}>0965.043.781 (TP.HCM)</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.copy}>
                  <Text style={styles.textCopy}>&copy; Copyreight 1998-2019</Text>
                  <Text style={styles.textCopy}>YebYebExpress. All rights reserved.</Text>
                  <Text style={styles.textCopy}>Thuộc Bộ Khoa học và Công Nghệ.</Text>
                  <Text style={styles.textCopy}>Toàn bộ bản quyền thuộc YebYebExpress.</Text>
                  <Text style={styles.textCopy}>Phiên bản 7.7.7</Text>
                </View>
              </ScrollView>
            </Content>
          </Container>
        }
      >
        <Container>
          <Header style={styles.header}>
            <Left style={{ flex: 1 }}>
              <Button transparent>
                <Icon name='menu' onPress={this.openControlPanel} style={styles.icon} />
              </Button>
            </Left>
            <Body style={{ flex: 5 }}>
              <Title style={styles.textHeader}>{this.state.theLoai}</Title>
            </Body>
            <Right style={{ flex: 1 }}>
              <Button transparent>
                <Icon name='mail' onPress={()=>Actions.guiToa()} style={styles.icon} />
              </Button>
            </Right>
          </Header>
          <Content style={styles.content}>
            <ScrollView>
              {
                this.state.hienView == false
                ?
                  <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                  />
                  : 
                  <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 150 }}>
                    <LottieView style={{ width: 200, height: 200 }} source={imageDong.loadErr} autoPlay loop />
                  </View>
              }
            </ScrollView>
          </Content>
        </Container>
      </Drawer>

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
    fontSize: 14,
    fontWeight: '300'
  },
  noiBat: {
    fontSize: 14,
    fontWeight: '300',
  },
  viewIcon: {
    padding: 10,
    marginTop: 20,
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
    marginTop: 20
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
  iconList: {
    fontSize: 25,
    marginRight: 10,
  },



  content: {
    padding: 5,
    backgroundColor:'white'
  },
  header: {
    backgroundColor: '#a71e36',
  },
  textHeader: {
    color: 'white',
    fontWeight:'400'
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
