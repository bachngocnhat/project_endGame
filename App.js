import React from 'react';
import { Icon, Root } from "native-base";
import { AsyncStorage, Text, View } from "react-native";
import { ActionConst, Router, Scene, Tabs } from "react-native-router-flux";
import Home from './src/components/Home';
import Insert from './src/components/Insert';
import Contents from './src/components/Contents';
import InsertTheLoai from './src/components/InsertTheLoai';
import TraLoiComment from './src/components/TraLoiComment';
import TinNong from './src/components/TinNong';
import EditItem from './src/components/EditItem';
import EditItemXL from './src/components/EditItemXL';
import DeleteItem from './src/components/DeleteItem';
import GuiToa from './src/components/GuiToa';
import ListThuCuaToa from './src/components/ListThuCuaToa';
import ContentMail from './src/components/ContentMail';
import LogIn from './src/components/LogIn';
import DangKy from './src/components/DangKy';
import HomeInsert from './src/components/HomeInsert';
import EditTheLoai from './src/components/EditTheLoai';
import EditTheLoaiXL from './src/components/EditTheLoaiXL';
import HomeEdit from './src/components/HomeEdit';
import HomeDelete from './src/components/HomeDelete';
import DeleteTheLoai from './src/components/DeleteTheLoai';
import Loading from './src/components/Loading';
import Logout from './src/components/Logout';
console.disableYellowBox = true;

const TabIcon = props => {
  const color = props.focused ? '#ffffff' : "#d2d2d2";
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 100,
        paddingTop: 5
      }}
    >
      <Icon
        style={{ color }}
        size={20}
        name={props.iconName || "circle"}
        active={props.focused}
      />
      <Text style={{ fontSize: 10, color, marginTop:3 }}>{props.label}</Text>
    </View>
  );
};

class App extends React.Component {
  _getCompanyId = async () => {
    try {
      const company_id = await AsyncStorage.getItem("company_id");
      return company_id;
    } catch (error) {
      return null;
    }
  };

  render() {
    return (
      <Root>
        <Router {...this.props}>
          <Scene key="root" panHandlers={null}>
            <Scene key="home" component={Home} hideNavBar />
            <Scene key="contents" component={Contents} hideNavBar />
            <Scene key="traLoiComment" component={TraLoiComment} hideNavBar />
            <Scene key="tinNong" component={TinNong} hideNavBar />
            <Scene key="guiToa" component={GuiToa} hideNavBar />
            <Scene key="contentMail" component={ContentMail} hideNavBar />
            <Scene key="logIn" component={LogIn} hideNavBar />
            <Scene key="dangKy" component={DangKy} hideNavBar />
            <Scene key="loading" component={Loading} hideNavBar initial />
            <Scene
              key="tabs"
              panHandlers={null}
              hideNavBar
              type={ActionConst.RESET}
            >
              <Tabs
                initial
                key="main"
                tabBarPosition="bottom"
                showLabel={false}
                tabBarStyle={{
                  backgroundColor: '#a71e36',
                  height: 60
                }}
                lazy
                backgroundColor="white"
              >
                
                <Scene key="insertTab" tabBarLabel="Insert" label="Insert" iconName="create" icon={TabIcon}>
                  <Scene key="homeInsert" component={HomeInsert} hideNavBar />
                  <Scene key="insert" component={Insert} hideNavBar />
                  <Scene key="insertTheLoai" component={InsertTheLoai} hideNavBar  />
                </Scene>
                <Scene key="editTab" tabBarLabel="Edit" label="Edit" iconName="construct" icon={TabIcon}>
                  <Scene key="homeEdit" component={HomeEdit} hideNavBar initial />
                  <Scene key="editTheLoai" component={EditTheLoai} hideNavBar />
                  <Scene key="editTheLoaiXL" component={EditTheLoaiXL} hideNavBar />

                  <Scene key="editItem" component={EditItem} hideNavBar  />
                  <Scene key="editItemXL" component={EditItemXL} hideNavBar />
                </Scene>
                <Scene key="DLTTab" tabBarLabel="Delete" label="Delete" iconName="close-circle" icon={TabIcon}>
                  <Scene key="homeDelete" component={HomeDelete} hideNavBar initial />
                  <Scene key="deleteTheLoai" component={DeleteTheLoai} hideNavBar  />
                  <Scene key="deleteItem" component={DeleteItem} hideNavBar  />
                </Scene>
                <Scene key="guiToaTab" tabBarLabel="Email" label="Email" iconName="mail" icon={TabIcon}>
                  <Scene key="listGuiToa" component={ListThuCuaToa} hideNavBar />
                </Scene>
                <Scene key="logoutTab" tabBarLabel="Logout" label="Logout" iconName="contact" icon={TabIcon}>
                  <Scene key="logout" component={Logout} hideNavBar />
                </Scene>
              </Tabs>
            </Scene>
          </Scene>
        </Router>
      </Root>
    );
  }
}

export default App;