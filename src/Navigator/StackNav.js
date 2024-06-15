import React, {Component} from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../Screen/SplashScreen/Splash';
import OnboardingScreen from '../Screen/Onboarding/Onboard';
import NewsListScreen from '../Screen/Home/Main';
import AddTraining from '../Screen/Home/Video/Video';
const StackNav = props => {
  const Stack = createStackNavigator();
  const mytheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
    },
  };
  const Screens = {
    Splash: Splash,
    OnboardingScreen:OnboardingScreen,
    NewsListScreen:NewsListScreen,
    AddTraining:AddTraining
  };
  return (
    <NavigationContainer theme={mytheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {Object.entries({
          ...Screens,
        }).map(([name, component]) => {
          return <Stack.Screen name={name} component={component} />;
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default StackNav;
