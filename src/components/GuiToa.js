import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  List,
  ListItem,
  Root,
  Toast
} from 'native-base';
import { firebaseApp } from '../FirebaseConfig'
import { Actions } from 'react-native-router-flux'
import images from '../theme/image'
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import LottieView from 'lottie-react-native';
import imageDong from '../theme/imgDong'

const storage = firebaseApp.storage();
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs;

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob
var options = {
  title: 'Select Avatar',
  customButtons: [
    { name: 'fb', title: 'choose photo FB' }
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}

const uploadImage = (uri, mime = 'img/jpg') => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    const sessionId = new Date().getTime()
    let uploadBlob = null
    const imageRef = storage.ref('images').child(`${sessionId}`)

    fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default class GuiToa extends Component {

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database();
    items = []
    this.state = {
      noiDung: '',
      lienHe: '',
      demError: 1,
      banBienTap: 'gray',
      video: 'gray',
      thoiSu: 'gray',
      chonMuc: '',
      imgAnh: '',
      imgVideo: '',
      imgThuVien: '',
      timePush: moment(),
      loadNext:true
    };
  }

  onPush() {
    this.setState({
      demError: this.state.demError + 1
    })
    if (
      this.state.noiDung !== '' &&
      this.state.chonMuc !== '' &&
      this.state.lienHe !== ''
    ) {
      const data = {
        noiDung: this.state.noiDung,
        chonMuc: this.state.chonMuc,
        lienHe: this.state.lienHe,
        imgAnh: this.state.imgAnh,
        imgVideo: this.state.imgVideo,
        imgThuVien: this.state.imgThuVien,
        timePush: this.state.timePush.format('DD/MM/YYYY'),
      }
      this.itemRef.ref('thuGuiToa')
        .child(this.state.chonMuc)
        .child(this.state.timePush.format("MMM Do YY"))
        .push(data)
      this.setState({
        noiDung: '',
        lienHe: '',
        demError: 1,
        banBienTap: 'gray',
        video: 'gray',
        thoiSu: 'gray',
        chonMuc: '',
        imgAnh: '',
        imgVideo: '',
        imgThuVien: '',
      })
      Toast.show({
        text: "Gửi thành công!",
        buttonText: "Okay",
        duration: 5000,
        type: "success"
      })
    }
  }

  onBBT() {
    this.setState({
      banBienTap: '#a71e36',
      video: 'gray',
      thoiSu: 'gray',
      chonMuc: 'Ban biên tập'
    })
  }
  onVideoMuc() {
    this.setState({
      banBienTap: 'gray',
      video: '#a71e36',
      thoiSu: 'gray',
      chonMuc: 'Video'
    })
  }
  onThoiSu() {
    this.setState({
      banBienTap: 'gray',
      video: 'gray',
      thoiSu: '#a71e36',
      chonMuc: 'Thời sự'
    })
  }

  onImgAnh() {
    ImagePicker.launchImageLibrary({}, response => {
      uploadImage(response.uri)
        .then(url => this.setState({ imgAnh: url }))
        .catch(error => console.log(error))
    })
  }
  onVideo() {
    ImagePicker.launchImageLibrary({}, response => {
      uploadImage(response.uri)
        .then(url => this.setState({ imgVideo: url }))
        .catch(error => console.log(error))
    })
  }
  onThuVien() {
    ImagePicker.launchImageLibrary({}, response => {
      uploadImage(response.uri)
        .then(url => this.setState({ imgThuVien: url }))
        .catch(error => console.log(error))
    })
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loadNext:'false'})
    }, 2000);
  }

  render() {
    if(this.state.loadNext==true){
      return (
        <Container>
          <Header style={styles.header}>
            <Left style={{ flex: 1, }}>
              <Button transparent onPress={() => Actions.pop()}>
                <Icon name='arrow-back' style={{ color: 'white' }} />
              </Button>
            </Left>
            <Body style={{ flex: 5, }}>
              <Title style={styles.textHeader}>Gửi tin cho Tòa soạn</Title>
            </Body>
            <Right style={{ flex: 1, }} />
          </Header>
          <Content style={styles.content}>
            <View style={{justifyContent:'center', alignItems: 'center',marginTop: 100,}}>
              <LottieView style={{ width: '100%', height: 300 }} source={imageDong.loadNext} autoPlay loop />
            </View>
          </Content>
        </Container>
      )
    }else{
      return (
        <Root>
          <Container>
            <Header style={styles.header}>
              <Left style={{ flex: 1, }}>
                <Button transparent onPress={() => Actions.pop()}>
                  <Icon name='arrow-back' style={{ color: 'white' }} />
                </Button>
              </Left>
              <Body style={{ flex: 5, }}>
                <Title style={styles.textHeader}>Gửi tin cho Tòa soạn</Title>
              </Body>
              <Right style={{ flex: 1, }} />
            </Header>
            <Content style={styles.content}>
              <KeyboardAvoidingView>
                <ScrollView>
                  <View style={styles.viewThongTin}>
                    <Text style={styles.textThongTin}>Thông tin đính kèm</Text>
                    <View style={styles.viewIcon}>
                      <View style={styles.viewItem}>
                        <TouchableOpacity style={styles.touchItem} onPress={() => this.onImgAnh()}>
                          <View style={styles.crcle}>
                            <Icon name='camera' style={styles.icon} />
                          </View>
                          <Text style={styles.text}>Ảnh</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.viewItem}>
                        <TouchableOpacity style={styles.touchItem} onPress={() => this.onVideo()}>
                          <View style={styles.crcle}>
                            <Icon name='videocam' style={styles.icon} />
                          </View>
                          <Text style={styles.text}>Video</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.viewItem}>
                        <TouchableOpacity style={styles.touchItem} onPress={() => this.onThuVien()}>
                          <View style={styles.crcle}>
                            <Icon name='images' style={styles.icon} />
                          </View>
                          <Text style={styles.text}>Thư viện</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.viewIcon}>
                      <View style={styles.viewItem}>
                        {
                          (() => {
                            switch (this.state.imgAnh) {
                              case null:
                                return null
                              case '':
                                return null
                              default:
                                return (
                                  <View>
                                    <Image
                                      source={{ uri: this.state.imgAnh }}
                                      style={{ width: 100, height: 100, }}
                                      resizeMode='contain'
                                    />
                                  </View>
                                )
                            }
                          })()
                        }
                      </View>
                      <View style={styles.viewItem}>
                        {
                          (() => {
                            switch (this.state.imgVideo) {
                              case null:
                                return null
                              case '':
                                return null
                              default:
                                return (
                                  <View>
                                    <Image
                                      source={{ uri: this.state.imgVideo }}
                                      style={{ width: 100, height: 100, }}
                                      resizeMode='contain'
                                    />
                                  </View>
                                )
                            }
                          })()
                        }
                      </View>
                      <View style={styles.viewItem}>
                        {
                          (() => {
                            switch (this.state.imgThuVien) {
                              case null:
                                return null
                              case '':
                                return null
                              default:
                                return (
                                  <View>
                                    <Image
                                      source={{ uri: this.state.imgThuVien }}
                                      style={{ width: 100, height: 100, }}
                                      resizeMode='contain'
                                    />
                                  </View>
                                )
                            }
                          })()
                        }
                      </View>
                    </View>
                    <View style={{ width: '100%', height: 0.3, backgroundColor: 'gray', marginTop: 10, marginBottom: 10, }} />
                    <Text style={styles.textThongTin}>Nội dung</Text>
                    <TextInput
                      style={{ height: 120, width: '100%', borderColor: 'gray', borderWidth: 0.5, marginTop: 10, paddingLeft: 5, marginBottom: 10 }}
                      onChangeText={(noiDung) => this.setState({ noiDung })}
                      value={this.state.noiDung}
                      multiline
                    />
                    {
                      this.state.demError > 1 && this.state.noiDung == ''
                        ? <Text style={{ color: 'red', fontSize: 12, marginBottom: 10, }}>Bạn phải nhập nội dung!</Text>
                        : null
                    }
                    <Text style={styles.textThongTin}>Chọn mục</Text>
                    <View style={styles.viewIcon}>
                      <View style={styles.viewItem}>
                        <TouchableOpacity style={[styles.touchText, { backgroundColor: this.state.banBienTap }]} onPress={() => this.onBBT()}>
                          <Text style={styles.textMuc}>Ban biên tập</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.viewItem}>
                        <TouchableOpacity style={[styles.touchText, { backgroundColor: this.state.video }]} onPress={() => this.onVideoMuc()}>
                          <Text style={styles.textMuc}>Video</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.viewItem}>
                        <TouchableOpacity style={[styles.touchText, { backgroundColor: this.state.thoiSu }]} onPress={() => this.onThoiSu()}>
                          <Text style={styles.textMuc}>Thời sự</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {
                      this.state.demError > 1 && this.state.chonMuc == ''
                        ? <Text style={{ color: 'red', fontSize: 12, marginTop: 10, }}>Bạn phải chọn mục!</Text>
                        : null
                    }
                    <View style={{ width: '100%', height: 0.3, backgroundColor: 'gray', marginTop: 10, marginBottom: 10, }} />
                    <Text style={styles.textThongTin}>Email/ Số điện thoại</Text>
                    <Text style={styles.textLienHe}>* Để chúng tôi liên hệ khi cần thiết</Text>
                    <TextInput
                      style={{ height: 30, width: '100%', borderColor: 'gray', borderWidth: 0.5, marginTop: 10, paddingLeft: 5 }}
                      onChangeText={(lienHe) => this.setState({ lienHe })}
                      value={this.state.lienHe}
                    />
                    {
                      this.state.demError > 1 && this.state.lienHe == ''
                        ? <Text style={{ color: 'red', fontSize: 12, marginTop: 10, }}>Bạn phải nhập liên hệ!</Text>
                        : null
                    }
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </Content>
            <Footer style={styles.footer}>
              <FooterTab >
                <Button full onPress={() => this.onPush()} style={styles.button}>
                  <Text style={{ color: 'white', fontSize: 16 }}>Gửi</Text>
                </Button>
              </FooterTab>
            </Footer>
          </Container>
        </Root>
      );
    }
   
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
    color: 'white',
    fontWeight:'400'
  },
  viewIcon: {
    flexDirection: 'row',
    marginTop: 10,
  },
  textThongTin: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%'
  },
  crcle: {
    backgroundColor: '#e0dede',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  icon: {
    fontSize: 25,
    color: '#a71e36'
  },
  text: {
    fontSize: 12,
    marginTop: 5,
    color: '#a71e36'
  },
  touchText: {
    backgroundColor: '#a71e36',
    justifyContent: 'center',
    alignItems: 'center',
    width: "90%",
    borderRadius: 20,
  },
  textMuc: {
    padding: 5,
    color: 'white',
    fontSize: 12,
  },
  textLienHe: {
    color: 'gray',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 5,
  },
  footer: {
    height:50,
    backgroundColor: 'white',
    padding: 5,
    borderTopWidth: 0,
  },
  button: {
    backgroundColor: '#a71e36',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image1: {
    width: 50,
    height: 50
  }
});
