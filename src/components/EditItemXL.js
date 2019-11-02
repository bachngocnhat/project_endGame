import React, { Component } from 'react';
import {
  StyleSheet, View, TextInput, ScrollView,
  TouchableOpacity, Image, ActivityIndicator, Platform, Alert, ListView, FlatList
} from "react-native";
import {
  Container, Header, Title, Content, Footer, FooterTab,
  Button, Left, Right, Body, Icon, Text, Picker, Form, Root, Toast,
  ListItem, CheckBox
} from 'native-base';
import { firebaseApp } from '../FirebaseConfig'
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { Actions } from 'react-native-router-flux';

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

export default class EditItemXL extends Component {

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database();
    items = []
    this.state = {
      title: this.props.data.data.title,
      trichDan: this.props.data.data.trichDan,
      tomTat: this.props.data.data.tomTat,
      noiDung1: this.props.data.data.noiDung1,
      noiDung2: this.props.data.data.noiDung2,
      noiDung3: this.props.data.data.noiDung3,
      noiDung4: this.props.data.data.noiDung4,
      image1: this.props.data.data.image1,
      image2: this.props.data.data.image2,
      image3: this.props.data.data.image3,
      image4: this.props.data.data.image4,
      ghiChuImage1: this.props.data.data.ghiChuImage1,
      ghiChuImage2: this.props.data.data.ghiChuImage2,
      ghiChuImage3: this.props.data.data.ghiChuImage3,
      ghiChuImage4: this.props.data.data.ghiChuImage4,
      timePush: moment(),
      checkTinNong: false,

      themNoiDung: 2,
      demError: 1,

      dataSource: []
    };
  }

  componentWillMount() {
    this.itemRef.ref('listTheLoai')
      .on('value', (snap) => {
        dataSource = []
        snap.forEach((data) => {
          this.state.dataSource.push({
            key: data.key,
            theLoai: data.val().theLoai
          })
        })
      })
    console.log('dataSource:', this.state.dataSource)
    console.log('data123:', this.props.data)
  }


  touchThemItem() {
    if (this.state.themNoiDung <= 4) {
      this.setState({
        themNoiDung: this.state.themNoiDung + 1
      })
    } else {
      Toast.show({
        text: "Không thể thêm nội dung!",
        buttonText: "Okay",
        duration: 5000,
        type: "danger"
      })
    }
  }

  touchXoaItem() {
    if (this.state.themNoiDung > 2) {
      this.setState({
        themNoiDung: this.state.themNoiDung - 1
      })
    } else {
      Toast.show({
        text: "Không thể xóa nội dung!",
        buttonText: "Okay",
        duration: 5000,
        type: "danger"
      })
    }
  }

  onPush() {
    this.setState({
      demError: this.state.demError + 1
    })
    if (
      this.state.title !== '' &&
      this.state.trichDan !== '' &&
      this.state.tomTat !== '' &&
      this.state.noiDung1 !== ''
    ) {
      const data = {
        title: this.state.title,
        trichDan: this.state.trichDan,
        tomTat: this.state.tomTat,
        noiDung1: this.state.noiDung1,
        noiDung2: this.state.noiDung2,
        noiDung3: this.state.noiDung3,
        noiDung4: this.state.noiDung4,
        image1: this.state.image1,
        image2: this.state.image2,
        image3: this.state.image3,
        image4: this.state.image4,
        ghiChuImage1: this.state.ghiChuImage1,
        ghiChuImage2: this.state.ghiChuImage2,
        ghiChuImage3: this.state.ghiChuImage3,
        ghiChuImage4: this.state.ghiChuImage4,
        timePush: this.state.timePush.format('DD/MM/YYYY'),
        luotXem: 1
      }
      this.itemRef.ref('theLoai')
        .child(this.props.data.theLoai)
        .child(this.props.data.key)
        .update(data)
      this.itemRef.ref('theLoai')
        .child('tinNong')
        .child(this.props.data.key)
        .update(data)
      this.setState({
        title: '',
        trichDan: '',
        tomTat: '',
        noiDung1: '',
        noiDung2: '',
        noiDung3: '',
        noiDung4: '',
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        ghiChuImage1: '',
        ghiChuImage2: '',
        ghiChuImage3: '',
        ghiChuImage4: '',
        demError: 1,
        checkTinNong: false
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

  _pickImage() {
    ImagePicker.launchImageLibrary({}, response => {
      uploadImage(response.uri)
        .then(url => this.setState({ image1: url }))
        .catch(error => console.log(error))
    })
  }
  xoaAnh1() {
    Alert.alert(
      'Thông báo',
      'Bạn muốn xóa ảnh?',
      [

        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => { this.setState({ image1: null }) } },
      ],
      { cancelable: false },
    );
  }
  _pickImage2() {

    ImagePicker.launchImageLibrary({}, response => {
      uploadImage(response.uri)
        .then(url => this.setState({ image2: url }))
        .catch(error => console.log(error))
    })
  }
  xoaAnh2() {
    Alert.alert(
      'Thông báo',
      'Bạn muốn xóa ảnh?',
      [

        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => { this.setState({ image2: null }) } },
      ],
      { cancelable: false },
    );
  }
  _pickImage3() {

    ImagePicker.launchImageLibrary({}, response => {
      uploadImage(response.uri)
        .then(url => this.setState({ image3: url }))
        .catch(error => console.log(error))
    })
  }
  xoaAnh3() {
    Alert.alert(
      'Thông báo',
      'Bạn muốn xóa ảnh?',
      [

        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => { this.setState({ image3: null }) } },
      ],
      { cancelable: false },
    );
  }
  _pickImage4() {

    ImagePicker.launchImageLibrary({}, response => {
      uploadImage(response.uri)
        .then(url => this.setState({ image4: url }))
        .catch(error => console.log(error))
    })
  }
  xoaAnh4() {
    Alert.alert(
      'Thông báo',
      'Bạn muốn xóa ảnh?',
      [

        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => { this.setState({ image4: null }) } },
      ],
      { cancelable: false },
    );
  }

  tinNong() {
    this.setState({ checkTinNong: !this.state.checkTinNong })
  }


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
              <Title style={styles.textHeader}>Edit Item</Title>
            </Body>
            <Right />
          </Header>
          <Content style={styles.content}>
            <ScrollView>
              <Text style={styles.text}>Tiêu đề</Text>
              <View style={styles.title}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(title) => this.setState({ title })}
                  value={this.state.title}
                  multiline
                />
              </View>
              {
                this.state.demError > 1 && this.state.title == ''
                  ? <Text style={styles.textError}>Bạn phải nhập tiêu đề!</Text>
                  : null
              }
              <Text style={styles.text}>Trích dẫn</Text>
              <View style={styles.trichDan}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(trichDan) => this.setState({ trichDan })}
                  value={this.state.trichDan}
                />
              </View>
              {
                this.state.demError > 1 && this.state.trichDan == ''
                  ? <Text style={styles.textError}>Bạn phải nhập trích dẫn!</Text>
                  : null
              }
              <Text style={styles.text}>Tóm tắt</Text>
              <View style={styles.tomTat}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(tomTat) => this.setState({ tomTat })}
                  value={this.state.tomTat}
                  multiline
                />
              </View>
              {
                this.state.demError > 1 && this.state.tomTat == ''
                  ? <Text style={styles.textError}>Bạn phải nhập tóm tắt!</Text>
                  : null
              }
              <Text style={styles.text}>Nội dung</Text>
              <View style={styles.noiDung1}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(noiDung1) => this.setState({ noiDung1 })}
                  value={this.state.noiDung1}
                  multiline
                />
              </View>
              {
                this.state.demError > 1 && this.state.noiDung1 == ''
                  ? <Text style={styles.textError}>Bạn phải nhập nội dung!</Text>
                  : null
              }
              <Text style={styles.text}>Ảnh</Text>
              {
                this.state.image1 !== null
                  ?
                  <View style={styles.image1}>
                    {
                      (() => {
                        switch (this.state.image1) {
                          case null:
                            return null
                          case 1:
                            return <ActivityIndicator />
                          default:
                            return (
                              <View>
                                <Image
                                  source={{ uri: this.state.image1 }}
                                  style={{ width: '100%', height: '100%', }}
                                  resizeMode='contain'
                                />
                              </View>
                            )
                        }
                      })()
                    }
                  </View>
                  : null
              }
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <TouchableOpacity style={styles.chonAnh} onPress={() => this._pickImage()}>
                  <Text style={styles.textChonAnh}>Chọn ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.xoaAnh} onPress={() => this.xoaAnh1()}>
                  <Text style={styles.textChonAnh}>Xóa ảnh</Text>
                </TouchableOpacity>
              </View>
              {
                this.state.demError > 1 && this.state.image1 == ''
                  ? <Text style={styles.textError}>Bạn phải chọn ảnh!</Text>
                  : null
              }
              {
                this.state.image1 !== null
                  ?
                  <View>
                    <Text style={styles.text}>Ghi chú ảnh</Text>
                    <View style={styles.ghiChuImage1}>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={(ghiChuImage1) => this.setState({ ghiChuImage1 })}
                        value={this.state.ghiChuImage1}
                        multiline
                      />
                    </View>
                    {
                      this.state.demError > 1 && this.state.ghiChuImage1 == ''
                        ? <Text style={styles.textError}>Bạn phải nhập ghi chú ảnh!</Text>
                        : null
                    }
                  </View>
                  : null
              }

              {
                this.state.themNoiDung > 2
                  ?
                  <View>
                    <Text style={styles.text}>Nội dung</Text>
                    <View style={styles.noiDung1}>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={(noiDung2) => this.setState({ noiDung2 })}
                        value={this.state.noiDung2}
                        multiline
                      />
                    </View>
                    <Text style={styles.text}>Ảnh</Text>
                    {
                      this.state.image2 !== null
                        ? <View style={styles.image1}>
                          {
                            (() => {
                              switch (this.state.image2) {
                                case null:
                                  return null
                                case '':
                                  return <ActivityIndicator />
                                default:
                                  return (
                                    <View>
                                      <Image
                                        source={{ uri: this.state.image2 }}
                                        style={{ width: '100%', height: '100%', }}
                                        resizeMode='contain'
                                      />
                                    </View>
                                  )
                              }
                            })()
                          }
                        </View>
                        : null
                    }
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                      <TouchableOpacity style={styles.chonAnh} onPress={() => this._pickImage2()}>
                        <Text style={styles.textChonAnh}>Chọn ảnh</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.xoaAnh} onPress={() => this.xoaAnh2()}>
                        <Text style={styles.textChonAnh}>Xóa ảnh</Text>
                      </TouchableOpacity>
                    </View>
                    {
                      this.state.image2 !== null
                        ?
                        <View>
                          <Text style={styles.text}>Ghi chú ảnh</Text>
                          <View style={styles.ghiChuImage1}>
                            <TextInput
                              style={styles.textInput}
                              onChangeText={(ghiChuImage2) => this.setState({ ghiChuImage2 })}
                              value={this.state.ghiChuImage2}
                              multiline
                            />
                          </View>
                          {
                            this.state.demError > 1 && this.state.ghiChuImage2 == ''
                              ? <Text style={styles.textError}>Bạn phải nhập ghi chú ảnh!</Text>
                              : null
                          }
                        </View>
                        : null
                    }
                  </View>
                  : null
              }


              {
                this.state.themNoiDung > 3
                  ?
                  <View>
                    <Text style={styles.text}>Nội dung</Text>
                    <View style={styles.noiDung1}>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={(noiDung3) => this.setState({ noiDung3 })}
                        value={this.state.noiDung3}
                        multiline
                      />
                    </View>
                    <Text style={styles.text}>Ảnh</Text>
                    {
                      this.state.image3 !== null
                        ? <View style={styles.image1}>
                          {
                            (() => {
                              switch (this.state.image3) {
                                case null:
                                  return null
                                case '':
                                  return <ActivityIndicator />
                                default:
                                  return (
                                    <View>
                                      <Image
                                        source={{ uri: this.state.image3 }}
                                        style={{ width: '100%', height: '100%', }}
                                        resizeMode='contain'
                                      />
                                    </View>
                                  )
                              }
                            })()
                          }
                        </View>
                        : null
                    }
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                      <TouchableOpacity style={styles.chonAnh} onPress={() => this._pickImage3()}>
                        <Text style={styles.textChonAnh}>Chọn ảnh</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.xoaAnh} onPress={() => this.xoaAnh3()}>
                        <Text style={styles.textChonAnh}>Xóa ảnh</Text>
                      </TouchableOpacity>
                    </View>
                    {
                      this.state.image3 !== null
                        ?
                        <View>
                          <Text style={styles.text}>Ghi chú ảnh</Text>
                          <View style={styles.ghiChuImage1}>
                            <TextInput
                              style={styles.textInput}
                              onChangeText={(ghiChuImage3) => this.setState({ ghiChuImage3 })}
                              value={this.state.ghiChuImage3}
                              multiline
                            />
                          </View>
                          {
                            this.state.demError > 1 && this.state.ghiChuImage3 == ''
                              ? <Text style={styles.textError}>Bạn phải nhập ghi chú ảnh!</Text>
                              : null
                          }
                        </View>
                        : null
                    }
                  </View>
                  : null
              }

              {
                this.state.themNoiDung > 4
                  ?
                  <View>
                    <Text style={styles.text}>Nội dung</Text>
                    <View style={styles.noiDung1}>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={(noiDung4) => this.setState({ noiDung4 })}
                        value={this.state.noiDung4}
                        multiline
                      />
                    </View>
                    <Text style={styles.text}>Ảnh</Text>
                    {
                      this.state.image4 !== null
                        ?
                        <View style={styles.image1}>
                          {
                            (() => {
                              switch (this.state.image4) {
                                case null:
                                  return null
                                case '':
                                  return <ActivityIndicator />
                                default:
                                  return (
                                    <View>
                                      <Image
                                        source={{ uri: this.state.image4 }}
                                        style={{ width: '100%', height: '100%', }}
                                        resizeMode='contain'
                                      />
                                    </View>
                                  )
                              }
                            })()
                          }
                        </View>
                        : null
                    }
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                      <TouchableOpacity style={styles.chonAnh} onPress={() => this._pickImage4()}>
                        <Text style={styles.textChonAnh}>Chọn ảnh</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.xoaAnh} onPress={() => this.xoaAnh4()}>
                        <Text style={styles.textChonAnh}>Xóa ảnh</Text>
                      </TouchableOpacity>
                    </View>
                    {
                      this.state.image4 !== null
                        ?
                        <View>
                          <Text style={styles.text}>Ghi chú ảnh</Text>
                          <View style={styles.ghiChuImage1}>
                            <TextInput
                              style={styles.textInput}
                              onChangeText={(ghiChuImage4) => this.setState({ ghiChuImage4 })}
                              value={this.state.ghiChuImage4}
                              multiline
                            />
                          </View>
                          {
                            this.state.demError > 1 && this.state.ghiChuImage4 == ''
                              ? <Text style={styles.textError}>Bạn phải nhập ghi chú ảnh!</Text>
                              : null
                          }
                        </View>
                        : null
                    }
                  </View>
                  : null
              }
              <View style={styles.themNoiDung}>
                <TouchableOpacity onPress={() => this.touchThemItem()} >
                  <Icon name='add-circle' style={{ color: '#a71e36' }}></Icon>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.touchXoaItem()} style={styles.iconInsert}>
                  <Icon name='remove-circle-outline' style={{ color: '#a71e36' }}></Icon>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Content>
          <Footer style={styles.footer}>
            <FooterTab >
              <Button full onPress={() => this.onPush()} style={styles.button}>
                <Text style={{ color: 'white', fontSize: 16 }}>Edit</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </Root>
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
  theLoai: {
    width: '100%',
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 0.5,
    marginBottom: 5,
    marginTop: 5,
  },
  title: {
    width: '100%',
    height: 60,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 0.5,
    marginBottom: 10,
    marginTop: 5,
  },
  trichDan: {
    width: '100%',
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 0.5,
    marginBottom: 10,
    marginTop: 5,
  },
  tomTat: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 0.5,
    marginBottom: 10,
    marginTop: 5,
  },
  noiDung1: {
    width: '100%',
    height: 120,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 0.5,
    marginBottom: 10,
    marginTop: 5,
  },
  ghiChuImage1: {
    width: '100%',
    height: 60,
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
  image1: {
    height: 200,
    width: '100%',
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 5,
  },
  text: {
    fontSize: 13
  },
  themNoiDung: {
    height: 40,
    flexDirection: 'row',
  },
  iconInsert: {
    marginLeft: 10,
  },
  footer: {
    height: 40,
    backgroundColor: 'white',
    padding: 5,
    borderTopWidth: 0,
  },
  button: {
    backgroundColor: '#a71e36',
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textError: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  chonAnh: {
    flex: 1,
    marginRight: 5,
    height: 40,
    backgroundColor: '#a71e36',
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  xoaAnh: {
    flex: 1,
    marginLeft: 5,
    height: 40,
    backgroundColor: '#a71e36',
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textChonAnh: {
    color: 'white',
    fontSize: 14
  }
});
