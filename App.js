import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import BookTransaction from './Screens/BookTransaction'
import SearchScreen from './Screens/SearchScreen'
import {createAppContainer} from 'react-navigation'
import {createBottomTabNavigator} from 'react-navigation-tabs'
export default function App() {
  return (
    
      <AppContainer></AppContainer>
   
  );
}
const TabNavigator = createBottomTabNavigator({
  Transaction:{
    screen:BookTransaction
  },
  Search:{
    screen:SearchScreen
  }
},{defaultNavigationOptions:({navigation})=>({
  tabBarIcon:()=>{
    const routename=navigation.state.routeName
    console.log(routename)
    if (routename==="Transaction"){
      return(<Image source={require("./assets/book.png")} style={{width:40,height:40}}/>)
    }
    else if(routename==="Search"){
      return(<Image source={require("./assets/searchingbook.png")} style={{width:40,height:40}}/>)
    }
  }}
)})
const AppContainer = createAppContainer(TabNavigator)
