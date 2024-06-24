import React, { Component } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../Screen/SplashScreen/Splash';
import VideoUpload from '../Screen/Home/Video/VideoUpload';
import VideoUploadTus from '../Screen/Home/Video/VideoUploadTus';
const StackNav = props => {
  const Stack = createStackNavigator();
  const mytheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
    },
  };
  const Screens = {
    VideoUpload: VideoUpload,
    VideoUploadTus: VideoUploadTus,
  };
  return (
    <NavigationContainer theme={mytheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {Object.entries({
          ...Screens,
        }).map(([name, component], index) => {
          return <Stack.Screen name={name} component={component} key={index} />;
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default StackNav;
