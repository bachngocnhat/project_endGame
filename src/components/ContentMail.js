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
  Platform
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

export default class ContentMail extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const data = this.props.data
    return (
      <Root>
        <Container>
          <Header style={styles.header}>
            <Left style={{flex:1}}>
              <Button transparent onPress={() => Actions.pop()}>
                <Icon name='arrow-back' style={{ color: 'white' }} />
              </Button>
            </Left>
            <Body style={{ flex: 5 }}>
              <Title style={styles.textHeader}>Thư từ độc giả</Title>
            </Body>
            <Right style={{ flex: 1 }}/>
          </Header>
          <Content style={styles.content}>
            <Text style={styles.title}>Thông tin độc giả</Text>
            <Text style={styles.nd}>{data.data.lienHe}</Text>
            <Text style={styles.title}>Ngày gửi</Text>
            <Text style={styles.nd}>{data.data.timePush}</Text>
            <Text style={styles.title}>Gửi</Text>
            <Text style={styles.nd}>{data.data.chonMuc}</Text>
            <Text style={styles.title}>Nội dung</Text>
            <Text style={styles.nd}>{data.data.noiDung}</Text>
            {
              data.data.imgAnh !== '' || data.data.imgThuVien !=='' || data.data.imgVideo !==''
              ?
              <View>
                  <Text style={styles.title}>Tệp đính kèm</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, }}>
                      <Image
                        source={{ uri: data.data.imgAnh }}
                        style={{ width: '100%', height: 100 }}
                        resizeMode='contain'
                      />
                    </View>
                    <View style={{ flex: 1, }}>
                      <Image
                        source={{ uri: data.data.imgVideo }}
                        style={{ width: '100%', height: 100 }}
                        resizeMode='contain'
                      />
                    </View>
                    <View style={{ flex: 1, }}>
                      <Image
                        source={{ uri: data.data.imgThuVien }}
                        style={{ width: '100%', height: 100 }}
                        resizeMode='contain'
                      />
                    </View>
                  </View>
              </View>
              :null
            }
          </Content>
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
  item: {
    height: 100,
    width: '100%',
    flexDirection: 'row',
    borderRadius: 5,
  },
  title:{
    fontSize:16,
    color: '#a71e36',
    marginTop: 10,
  },
  nd:{
    fontSize:14
  }
});
