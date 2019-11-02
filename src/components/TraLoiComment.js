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

export default class TraLoiComment extends Component {

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database();
    items = []
    this.state = {
      isModalVisible: false,
      tenHienThiTraLoi: '',
      commentTraLoi: '',
      demErro: 1,
      timeTraLoiComment: moment(),
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),

      like:0
    };
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  onTraLoiComment(){
    this.setState({ demErro: this.state.demErro + 1 })
    if (this.state.tenHienThiTraLoi !== '' && this.state.commentTraLoi !== '') {
      const data = {
        tenHienThiTraLoi: this.state.tenHienThiTraLoi,
        commentTraLoi: this.state.commentTraLoi,
        luotThich: 0,
        timeTraLoiComment: this.state.timeTraLoiComment.format('DD/MM/YYYY'),
      }
      this.itemRef.ref('theLoai')
        .child(this.props.dataComment.theLoai)
        .child(this.props.dataComment.keyBai)
        .child('comment')
        .child(this.props.dataComment.keyComment)
        .child('traLoiComment')
        .push(data)
      this.setState({
        tenHienThiTraLoi: '',
        commentTraLoi: '',
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
    this.itemRef.ref('theLoai')
      .child(this.props.dataComment.theLoai)
      .child(this.props.dataComment.keyBai)
      .child('comment')
      .child(this.props.dataComment.keyComment)
      .child('traLoiComment')
      .on('value', (snap) => {
        items = []
        snap.forEach((data) => {
          items.push({
            key: data.key,
            data: data.val(),
          })
        })
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(items)
        })
      })
  }
  onLike(data){
    this.setState({ like: this.state.like + 1 })
    if (this.state.like < 1) {
      this.itemRef.ref('theLoai')
        .child(this.props.dataComment.theLoai)
        .child(this.props.dataComment.keyBai)
        .child('comment')
        .child(this.props.dataComment.keyComment)
        .child('traLoiComment')
        .child(data.key)
        .update({
          luotThich: data.data.luotThich + 1
        })
    }
  }
  renderRow(data) {
    return (
      <View style={styles.viewTraLoi}>
        <View style={[styles.viewBinhLuan,{marginTop:20}]}>
          <View style={styles.viewAvatar}>
            <Image
              source={images.AVATAR}
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
            />
          </View>
          <View style={styles.viewComment}>
            <Text style={styles.contentComment}>{data.data.commentTraLoi}</Text>
            <View style={styles.abc}>
              <Text style={styles.nguoi}>{data.data.tenHienThiTraLoi}</Text>
              <Text style={styles.thoiGianDang}>{data.data.timeTraLoiComment}</Text>
              <Text style={styles.thoiGianDang}>{data.data.luotThich}</Text>
              <Icon name='heart' style={styles.heart}></Icon>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.onLike(data)}>
                <Text style={[styles.thoiGianDang, { marginLeft: 10 }]}>Thích</Text>
                <Icon name="thumbs-up" style={{ fontSize: 13, marginLeft: 5, color: '#a71e36' }}></Icon>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }

  render() {
    const dataComment = this.props.dataComment
    return (
      <Root>
        <Container>
          <Header style={styles.header}>
            <Left style={{flex:1}}>
              <Button transparent onPress={()=>Actions.pop()}>
                <Icon name="arrow-back" style={{ color: "#fff" }} />
              </Button>
            </Left>
            <Body style={{ flex: 5 }}>
              <Title style={styles.textHeader}>Trả lời bình luận</Title>
            </Body>
            <Right style={{ flex: 1 }}/>
          </Header>
          <Content style={styles.content}>
            <ScrollView>
              <View >
                <View style={styles.viewBinhLuan}>
                  <View style={styles.viewAvatar}>
                    <Image
                      source={images.AVATAR}
                      style={{ width: 25, height: 25 }}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.viewComment}>
                    <Text style={styles.contentComment}>{dataComment.data.comment}</Text>
                    <View style={styles.abc}>
                      <Text style={styles.nguoi}>{dataComment.data.tenHienThi}</Text>
                      <Text style={styles.thoiGianDang}>{dataComment.data.timeComment}</Text>
                      <Text style={styles.thoiGianDang}>{dataComment.data.luotThich}</Text>
                      <Icon name='heart' style={styles.heart}></Icon>
                    </View>
                    <TouchableOpacity style={styles.traLoi} onPress={this.toggleModal}>
                      <Text style={styles.textTraLoi}>Trả lời bình luận...</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.lineComment} />
              </View>
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
              />
            </ScrollView>
          </Content>
          <Footer style={styles.footer}>
            <Modal isVisible={this.state.isModalVisible} style={{ justifyContent: 'center', alignItems: 'center', }}>
              <View style={styles.viewModal}>
                <View style={styles.headerMD}>
                  <View style={{ flex: 1 }}></View>
                  <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Trả lời bình luận</Text>
                  </View>
                  <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={this.toggleModal}>
                    <Icon name='close' style={{ fontSize: 30, color: 'white' }}></Icon>
                  </TouchableOpacity>
                </View>
                <View style={styles.viewInput}>
                  <TextInput
                    style={styles.input}
                    onChangeText={(tenHienThiTraLoi) => this.setState({ tenHienThiTraLoi })}
                    value={this.state.tenHienThiTraLoi}
                    placeholder="Tên hiển thị"
                    multiline
                  />
                  {
                    this.state.demErro > 1 && this.state.tenHienThiTraLoi == ''
                      ? <Text style={{ color: 'white', fontSize: 12, marginTop: 3 }}>Bạn phải nhập tên hiển thị!</Text>
                      : null
                  }
                  <TextInput
                    style={styles.inputComment}
                    onChangeText={(commentTraLoi) => this.setState({ commentTraLoi })}
                    value={this.state.commentTraLoi}
                    placeholder="Bình luận của bạn..."
                    multiline
                  />
                  {
                    this.state.demErro > 1 && this.state.commentTraLoi == ''
                      ? <Text style={{ color: 'white', fontSize: 12, marginTop: 3 }}>Bạn phải nhập bình luận!</Text>
                      : null
                  }
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}>
                  <TouchableOpacity style={styles.binhLuan} onPress={() => this.onTraLoiComment()}>
                    <Text style={{ fontSize: 14, color: 'white' }}>Trả lời</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <FooterTab >
              <Button full style={styles.button} onPress={this.toggleModal}>
                <Text style={{ color: 'white', fontSize: 16 }}>Trả lời bình luận...</Text>
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
  },
  header: {
    backgroundColor: '#a71e36',
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
  heart: {
    color: '#a71e36',
    fontSize: 10,
    marginLeft: 5,
    marginTop: 2
  },
  textTraLoi: {
    color: 'white',
    marginLeft: 10,
    fontSize: 13
  },
  traLoi: {
    width: '100%',
    height: 30,
    backgroundColor: '#a71e36',
    marginTop: 10,
    borderRadius: 5,
    justifyContent: 'center'
  },
  viewTraLoi:{
    paddingLeft:50
  }
});
