import React, { Component } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Image, ListView } from "react-native";
import {
  Container, Header, Title, Content, Footer, FooterTab,
  Button, Left, Right, Body, Icon, Text, Picker, Form, Root, Toast
} from 'native-base';
import { firebaseApp } from '../FirebaseConfig'
import moment from 'moment';
import images from '../theme/image'
import Modal from "react-native-modal";
import { Actions } from 'react-native-router-flux';
import TinNong from './TinNong';
import RangeSlider from 'react-native-range-slider'

export default class Contents extends Component {

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database();
    items = []
    this.state = {
      isModalVisible: false,
      optionSeen: false,
      tenHienThi: '',
      comment: '',
      demErro: 1,
      like:0,
      keyComment:'',
      timeComment: moment(),
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),

      lightColor:'#a71e36',
      darkColor:'white',
      nhoColor:'white',
      vuaColor:'#a71e36',
      lonColor:'white',
      nhoText:'#a71e36',
      vuaText:'white',
      lonText:'#a71e36',
      bookmarkColor:false,
      bookmark: this.props.data.data.bookmark,
      fontSize:16,
      fontSizeTitle:23,
      fontSizeGhiChu:14,
      contentColor:'white',
      red:'#a71e36',
      likeBai:0
    };
  }
  touchOption = () => {
    this.setState({ optionSeen: !this.state.optionSeen });
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  onComment() {
    this.setState({ demErro: this.state.demErro + 1 })
    if (this.state.tenHienThi !== '' && this.state.comment !== '') {
      const data = {
        tenHienThi: this.state.tenHienThi,
        comment: this.state.comment,
        luotThich: 0,
        timeComment: this.state.timeComment.format('DD/MM/YYYY'),
      }
      this.itemRef.ref('theLoai')
        .child(this.props.data.theLoai)
        .child(this.props.data.key)
        .child('comment')
        .push(data)
      this.setState({
        tenHienThi: '',
        comment: '',
        demErro: 1,
        isModalVisible: !this.state.isModalVisible
      })
      Toast.show({
        text: "Bình luận thành công!",
        buttonText: "Okay",
        duration: 5000,
        type: "success"
      })
    }
  }

  componentWillMount() {
    this.itemRef
      .ref('theLoai')
      .child(this.props.data.theLoai)
      .child(this.props.data.key)
      .child('comment')
      .on('value', (snap) => {
        items = []
        snap.forEach((data) => {
          items.push({
            keyComment: data.key,
            data: data.val(),
            keyBai: this.props.data.key,
            theLoai: this.props.data.theLoai
          })
        })
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(items)
        })
      })
  }

  onLike(data){
    this.setState({like:this.state.like + 1})
    if(this.state.like < 1){
      this.itemRef.ref('theLoai')
        .child(data.theLoai)
        .child(data.keyBai)
        .child('comment')
        .child(data.keyComment)
        .update({
          luotThich: data.data.luotThich + 1
        })
    }
  }

  renderRow(data) {
    return (
      <View >
        <View style={styles.viewBinhLuan}>
          <View style={styles.viewAvatar}>
            <Image
              source={images.AVATAR}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          </View>
          <View style={styles.viewComment}>
            <Text style={styles.contentComment}>{data.data.comment}</Text>
            <View style={styles.abc}>
              <Text style={styles.nguoi}>{data.data.tenHienThi}</Text>
              <Text style={styles.thoiGianDang}>{data.data.timeComment}</Text>
              <Text style={styles.thoiGianDang}>{data.data.luotThich}</Text>
              <Icon name='heart' style={styles.heart}></Icon>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={()=>this.onLike(data)}>
                <Text style={[styles.thoiGianDang, { marginLeft: 10 }]}>Thích</Text>
                <Icon name="thumbs-up" style={{ fontSize: 13, marginLeft: 5, color: '#a71e36' }}></Icon>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.traLoi,{backgroundColor:this.state.red}]} onPress={() => this.onTraLoi(data)}>
              <Text style={styles.textTraLoi}>Trả lời bình luận...</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.lineComment} />
      </View>
    )
  }

  onTraLoi(dataComment) {
    Actions.traLoiComment({ dataComment })
  }
  light(){
    this.setState({
      lightColor:'#a71e36',
      darkColor:'white',
      contentColor: 'white',
      red: '#a71e36'
    })
  }
  dark(){
    this.setState({
      lightColor: 'white',
      darkColor: '#a71e36',
      contentColor:'#c4c2c2',
      red:'black'
    })
  }

  nho(){
    this.setState({
      nhoColor:'#a71e36',
      nhoText:'white',

      vuaColor:'white',
      vuaText:'#a71e36',

      lonColor: 'white',
      lonText: '#a71e36',

      fontSize:13,
      fontSizeTitle:20,
      fontSizeGhiChu:11
    })
  }
  vua(){
    this.setState({
      vuaColor: '#a71e36',
      vuaText: 'white',

      nhoColor: 'white',
      nhoText: '#a71e36',

      lonColor: 'white',
      lonText: '#a71e36',
      fontSize: 16,
      fontSizeTitle: 23,
      fontSizeGhiChu:14
    })
  }
  lon(){
    this.setState({
      lonColor: '#a71e36',
      lonText: 'white',

      nhoColor: 'white',
      nhoText: '#a71e36',

      vuaColor: 'white',
      vuaText: '#a71e36',
      fontSize: 19,
      fontSizeTitle: 26,
      fontSizeGhiChu:16
    })
  }

  likeBai(){
    this.setState({ likeBai: this.state.likeBai + 1 })
    if (this.state.likeBai < 1) {
      this.itemRef.ref('theLoai')
        .child(this.props.data.theLoai)
        .child(this.props.data.key)
        .update({
          luotThich: this.props.data.data.luotThich + 1
        })
    }
    this.setState({})
  }
  async bookmark(){
    console.log(this.props.data)
    const dataBook = { bookmark: !this.state.bookmark}
    this.itemRef.ref('theLoai')
      .child(this.props.data.theLoai)
      .child(this.props.data.key)
      .update(dataBook)
    // const dataBookMark = this.props.data
    // await this.setState({ bookmarkColor: !this.state.bookmarkColor})
    // if (this.state.bookmarkColor == true){
    //    console.log(dataBookMark)
    //   this.itemRef.ref('dataBookMark')
    //   .push(this.props.data.data)
    //     Toast.show({
    //       text: "Lưu bookmark thành công!",
    //       buttonText: "Okay",
    //       duration: 5000,
    //       type: "success"
    //     })
    // }
  }


  render() {
    const data = this.props.data
    return (
      <Root>
        <Container>
          <Header style={[styles.header,{backgroundColor:this.state.red}]}>
            <Left style={{flex:1}}>
              <Button transparent onPress={() => Actions.pop()}>
                <Icon name='arrow-back' style={{ color: 'white' }} />
              </Button>
            </Left>
            <Body style={{ flex: 5, flexDirection:'row',justifyContent:'flex-start' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: 'white', fontSize: 12 }}>{data.data.trichDan}.</Text>
              </View>
              <View style={{flexDirection:'row', marginLeft:5}}>
                <Text style={{color:'white',fontSize:12}}>View: </Text>
                <Text style={{ color: 'white', fontSize: 12 }}>{this.props.data.data.luotXem}.</Text>
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                <Text style={{ color: 'white', fontSize: 12 }}>Like: </Text>
                <Text style={{ color: 'white', fontSize: 12 }}>{this.props.data.data.luotThich}</Text>
              </View>
                
            </Body>
            <Right style={{ flex: 4, flexDirection:'row' }}>
              {/* <Button transparent onPress={() => this.bookmark()}>
                <Icon name='bookmark' style={this.state.bookmark == false ? { color: 'white', fontSize: 25 } : { color: 'black', fontSize: 25 }} ></Icon>
              </Button> */}
              <Button transparent onPress={()=>this.likeBai()}>
                <Icon name='thumbs-up' style={{ color: 'white', fontSize:25 }}></Icon>
              </Button>
              <Button transparent onPress={this.touchOption}>
                <Icon name='more' style={{ color: 'white' }}></Icon>
              </Button>
            </Right>
          </Header>
          <Modal 
            isVisible={this.state.optionSeen}
            backdropOpacity={0.8}
            animationIn='fadeInUp'
            style={{justifyContent:'flex-end'}}
          >
            <View style={[{ width: "100%", height: 250, backgroundColor:'#a71e36', borderRadius:10,padding:5},{backgroundColor:this.state.red}]}>
              <View style={{ flexDirection: 'row', height: 40 }}>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', }}>
                  <Icon name="checkmark-circle-outline" style={{ fontSize: 25, color:'white' }}></Icon>
                  <Text style={{ color: 'white', fontSize: 16, marginLeft: 5 }}>Đánh dấu tin</Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}></View>
              </View>
              <View style={{flexDirection:'row',height:40}}>
                <View style={{ flexDirection: 'row', flex:1,alignItems:'center', }}>
                  <Icon name="color-palette" style={{ fontSize: 25, color: 'white'}}></Icon>
                  <Text style={{color:'white', fontSize:16, marginLeft:5}}>Chủ đề</Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1,alignItems:'center',justifyContent:'flex-end' }}>
                  <TouchableOpacity style={[{borderColor:'white', borderWidth:0.5, borderRadius:5, padding:5},{backgroundColor:this.state.lightColor}]} onPress={()=>this.light()}>
                    <Text style={[{ color: 'white', fontSize: 16 }, { color:this.state.darkColor}]}>Light</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[{ borderColor: 'white', borderWidth: 0.5, borderRadius: 5, padding: 5, marginLeft: 5 }, { backgroundColor: this.state.darkColor}]} onPress={() => this.dark()}>
                    <Text style={[{ color: 'white', fontSize: 16 }, { color: this.state.lightColor }]}>Dark</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: 'row', height: 40 }}>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', }}>
                  <Icon name="sunny" style={{ fontSize: 25, color: 'white' }}></Icon>
                  <Text style={{ color: 'white', fontSize: 16, marginLeft: 5 }}>Độ sáng</Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                  <RangeSlider
                    disableRange={true}
                    lineHeight={2}
                    handleDiameter={18}
                    tintColorBetweenHandles="#ffffff"
                    minLabelColour="#ffffff"
                    minValue={0}
                    maxValue={100}
                    selectedMaximum={50}
                    style={{ flex: 1, height: 70, marginTop: 20}}
                    onChange={(data) => { console.log('normal slider data: ', data.selectedMaximum); }}
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'row', height: 40 }}>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', }}>
                  <Icon name="build" style={{ fontSize: 25, color: 'white' }}></Icon>
                  <Text style={{ color: 'white', fontSize: 16, marginLeft: 5 }}>Cỡ chữ</Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                  <TouchableOpacity style={[{ borderColor: 'white', borderWidth: 0.5, borderRadius: 5, padding: 5 }, { backgroundColor:this.state.nhoColor}]} onPress={() => this.nho()}>
                    <Text style={[{ color: 'white', fontSize: 16 }, { color: this.state.nhoText }]}>Nhỏ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[{ borderColor: 'white', borderWidth: 0.5, borderRadius: 5, padding: 5, marginLeft: 5 }, { backgroundColor: this.state.vuaColor}]} onPress={() => this.vua()}>
                    <Text style={[{ color: 'white', fontSize: 16, }, { color: this.state.vuaText}]}>Vừa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[{ borderColor: 'white', borderWidth: 0.5, borderRadius: 5, padding: 5, marginLeft: 5 }, { backgroundColor: this.state.lonColor}]} onPress={() => this.lon()}>
                    <Text style={[{ color: 'white', fontSize: 16, }, { color: this.state.lonText}]}>Lớn</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: 'row', height: 40 }}>
                <View style={{ flexDirection: 'row', flex: 6, alignItems: 'center', }}>
                  <Icon name="information-circle-outline" style={{ fontSize: 25, color: 'white' }}></Icon>
                  <Text style={{ color: 'white', fontSize: 16, marginLeft: 5 }}>Báo cáo nội dung xấu</Text>
                </View>
                <View style={{ flex: 3 }}></View>
                <View style={{ flexDirection: 'row', flex: 2, alignItems: 'center' }}></View>
              </View>
              <TouchableOpacity onPress={this.touchOption} style={{ flexDirection: 'row', height: 40, justifyContent:'center',alignItems:'center', borderTopColor:'white', borderTopWidth:1}}>
                <Text style={{ color: 'white', fontSize: 16 }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Content style={[styles.content,{backgroundColor:this.state.contentColor}]}>
            <ScrollView>
              <Text style={[styles.title,{fontSize:this.state.fontSizeTitle}]}>{data.data.title}</Text>
              <View style={styles.trichDan}>
                <Text style={styles.textTrich}>{data.data.trichDan}</Text>
                <Text style={styles.textTime}>{data.data.timePush}</Text>
              </View>
              <Text style={[styles.tomTat, { fontSize: this.state.fontSize}]}>{data.data.tomTat}</Text>
              <Text style={[styles.noidung,{fontSize:this.state.fontSize}]}>{data.data.noiDung1}</Text>
              {
                data.data.image1 === ''
                  ? null
                  : <View>
                    <View style={styles.image}>
                      <Image
                        source={{ uri: data.data.image1 }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode='contain'
                      />
                    </View>
                    <Text style={[styles.ghiChu,{fontSize:this.state.fontSizeGhiChu}]}>{data.data.ghiChuImage1}</Text>
                  </View>
              }
              {
                data.data.noidung2 === ''
                  ? null
                  : <Text style={[styles.noidung,{fontSize:this.state.fontSize}]}>{data.data.noiDung2}</Text>
              }
              {
                data.data.image2 === ''
                  ? null
                  : <View>
                    <View style={styles.image}>
                      <Image
                        source={{ uri: data.data.image2 }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode='contain'
                      />
                    </View>
                    <Text style={[styles.ghiChu, { fontSize: this.state.fontSizeGhiChu }]}>{data.data.ghiChuImage2}</Text>
                  </View>
              }
              {
                data.data.noidung3 === ''
                  ? null
                  : <Text style={[styles.noidung, { fontSize: this.state.fontSize }]}>{data.data.noiDung3}</Text>
              }
              {
                data.data.image3 === ''
                  ? null
                  : <View>
                    <View style={styles.image}>
                      <Image
                        source={{ uri: data.data.image3 }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode='contain'
                      />
                    </View>
                    <Text style={[styles.ghiChu, { fontSize: this.state.fontSizeGhiChu }]}>{data.data.ghiChuImage3}</Text>
                  </View>
              }
              {
                data.data.noidung4 === ''
                  ? null
                  : <Text style={[styles.noidung, { fontSize: this.state.fontSize }]}>{data.data.noiDung4}</Text>
              }
              {
                data.data.image4 === ''
                  ? null
                  : <View>
                    <View style={styles.image}>
                      <Image
                        source={{ uri: data.data.image4 }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode='contain'
                      />
                    </View>
                    <Text style={[styles.ghiChu, { fontSize: this.state.fontSizeGhiChu }]}>{data.data.ghiChuImage4}</Text>
                  </View>
              }

              <View style={styles.line} />
              <Text style={[styles.tinKhac,{fontSize:this.state.fontSize}]}>Tin khác</Text>
              <TinNong />
              <View style={styles.line} />
              <Text style={[styles.tinKhac, { fontSize: this.state.fontSize }]}>Bình luận mới nhất</Text>
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
              />
            </ScrollView>
          </Content>
          <Footer style={[styles.footer,{backgroundColor:this.state.contentColor}]}>
            <Modal isVisible={this.state.isModalVisible} style={{ justifyContent: 'center', alignItems: 'center', }}>
              <View style={[styles.viewModal,{backgroundColor:this.state.red}]}>
                <View style={styles.headerMD}>
                  <View style={{ flex: 1 }}></View>
                  <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Bình luận</Text>
                  </View>
                  <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={this.toggleModal}>
                    <Icon name='close' style={{ fontSize: 30, color: 'white' }}></Icon>
                  </TouchableOpacity>
                </View>
                <View style={styles.viewInput}>
                  <TextInput
                    style={styles.input}
                    onChangeText={(tenHienThi) => this.setState({ tenHienThi })}
                    value={this.state.tenHienThi}
                    placeholder="Tên hiển thị"
                    multiline
                  />
                  {
                    this.state.demErro > 1 && this.state.tenHienThi === ''
                      ? <Text style={{ color: 'white', fontSize: 12, marginTop: 3 }}>Bạn phải nhập tên hiển thị!</Text>
                      : null
                  }
                  <TextInput
                    style={styles.inputComment}
                    onChangeText={(comment) => this.setState({ comment })}
                    value={this.state.comment}
                    placeholder="Bình luận của bạn..."
                    multiline
                  />
                  {
                    this.state.demErro > 1 && this.state.comment === ''
                      ? <Text style={{ color: 'white', fontSize: 12, marginTop: 3 }}>Bạn phải nhập bình luận!</Text>
                      : null
                  }
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}>
                  <TouchableOpacity style={styles.binhLuan} onPress={() => this.onComment()}>
                    <Text style={{ fontSize: 14, color: 'white' }}>Bình luận</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <FooterTab >
              <Button full style={[styles.button,{backgroundColor:this.state.red}]} onPress={this.toggleModal}>
                <Text style={{ color: 'white', fontSize: 16 }}>Bình luận...</Text>
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
    padding: 10,
    backgroundColor:'white'
  },
  header: {
    backgroundColor: '#a71e36',
    height:60,
  },
  textHeader: {
    color: 'white'
  },
  button: {
    backgroundColor: '#a71e36',
    height: 40,
    borderRadius: 20
  },
  footer: {
    height: 50,
    backgroundColor: 'white',
    padding: 5,
    borderTopWidth: 0,
  },
  title: {
    fontSize: 23,
    fontWeight: '600',
  },
  trichDan: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  textTrich: {
    fontSize: 13,
    color: 'gray'
  },
  textTime: {
    fontSize: 13,
    color: 'gray',
    marginLeft: 10,
  },
  tomTat: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  noidung: {
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 10,
  },
  image: {
    height: 200,
    width: '100%',
    marginBottom: 10,
  },
  ghiChu: {
    fontSize: 14,
    fontWeight: '300',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  line: {
    width: '100%',
    height: 4,
    backgroundColor: 'gray',
    marginBottom: 10
  },
  tinKhac: {
    fontSize: 16,
    marginBottom: 10
  },
  viewBinhLuan: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10
  },
  viewAvatar: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  viewComment: {
    flex: 7,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center'
  },
  contentComment: {
    fontSize: 14
  },
  nguoi: {
    fontSize: 12,
    color: 'gray'
  },
  thoiGianDang: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 10
  },
  abc: {
    flexDirection: 'row',
    marginTop: 5,
  },
  lineComment: {
    width: '100%',
    height: 0.5,
    backgroundColor: 'gray',
    marginTop: 10
  },
  traLoi: {
    width: '100%',
    height: 30,
    backgroundColor: '#a71e36',
    marginTop: 10,
    borderRadius: 5,
    justifyContent: 'center'
  },
  textTraLoi: {
    color: 'white',
    marginLeft: 10,
    fontSize: 13
  },
  viewModal: {
    width: "90%",
    height: 280,
    backgroundColor: '#a71e36',
    borderRadius: 5
  },
  headerMD: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    height: 50,
    flexDirection: 'row'
  },
  viewInput: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    height: 28,
    borderRadius: 5,
    paddingLeft: 5,
  },
  inputComment: {
    backgroundColor: 'white',
    width: '100%',
    height: 100,
    borderRadius: 5,
    paddingLeft: 5,
    marginTop: 10
  },
  binhLuan: {
    width: '100%',
    height: 28,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 2,
  },
  heart: {
    color: '#a71e36',
    fontSize: 10,
    marginLeft: 5,
    marginTop: 2
  }
});
