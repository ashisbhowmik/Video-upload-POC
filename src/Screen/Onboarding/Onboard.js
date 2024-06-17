import React, { useEffect, useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Image, TouchableOpacity, SafeAreaView, StyleSheet, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Imagepath from '../../Themes/Imagepath';
import MyStatusBar from '../../Utils/MyStatusBar';
import Fonts from '../../Themes/Fonts';
import Headerera from '../../Components/Header';
import SwipeButton from '../../Components/SwipeButton';
import TextAll from '../../Themes/Strings';

const OnboardingScreen = ({ navigation }) => {
  const [toggleState, setToggleState] = useState(false);
  const isFocus = useIsFocused();
  useEffect(() => {
    if (toggleState) {
      navigation.navigate("VideoUpload")
    }
  }, [toggleState, isFocus]);
  const handleToggle = (value) => setToggleState(value);
  return (
    <>
      <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.black} />
      <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.white }}>
        <Headerera
          onPress={() => navigation.navigate('Splash')}
          topImg={Imagepath.Back}
          iheight={normalize(15)}
          iwidth={normalize(15)}
          tintColor={Colorpath.black}
          onPressRight={() => { }}
          middleText="News"
          color={Colorpath.black}
          fontFamily={Fonts.PoppinsBold}
          fontSize={normalize(15)}
          marginLeft={normalize(90)}
        />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ paddingBottom: normalize(10) }}>
            <View style={{ alignItems: 'center', marginTop: normalize(20) }}>
              <Image
                source={Imagepath.Beatlogo}
                style={{ height: normalize(70), width: normalize(110) }}
                resizeMode="contain"
              />
            </View>
            <View style={{ alignItems: 'center', marginTop: normalize(20) }}>
              <Text style={styles.newstext}>{TextAll.pranab}</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <View style={styles.swipeButtonContainer}>
                <TouchableOpacity style={{ marginTop: normalize(10) }}>
                  <SwipeButton onToggle={handleToggle} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  swipeButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.5,
    elevation: 1,
  },
  newstext: {
    fontFamily: Fonts.PoppinsBold,
    fontSize: normalize(15),
    color: "#000000"
  }
});

export default OnboardingScreen;
