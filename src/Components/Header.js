import React, { useState } from 'react';
import {
  Platform,
  TouchableOpacity,
  View,
  Image,
  Text,
  Dimensions,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import normalize from '../Utils/Helpers/Dimen';
import { useNavigation } from '@react-navigation/native';

export default function Headerera(props) {
  const navigation = useNavigation();

  return (
    <>
      <View
        style={
          Platform.OS === 'ios'
            ? {
                flexDirection: 'row',
                paddingTop:
                  Dimensions.get('screen').height > 667
                    ? normalize(20)
                    : normalize(30),
                justifyContent: props.justifyContent
                  ? props.justifyContent
                  : 'space-between',
                paddingHorizontal: normalize(20),
                alignItems: 'center',
              }
            : {
                flexDirection: 'row',
                paddingTop:
                  Dimensions.get('screen').height > 667
                    ? normalize(20)
                    : normalize(10),
                padding: normalize(20),
                marginTop: normalize(15),
                alignItems: 'center',
                justifyContent: props.justifyContent
                  ? props.justifyContent
                  : 'space-between',
              }
        }>
        <View
          style={{
            flexDirection: 'row',
            width: props.topWidth ? props.topWidth : '70%',
            alignItems: 'center',
            right: normalize(10),
          }}>
          <TouchableOpacity
            onPress={() => props.onPress()}
            style={{
              height: props.height ? props.height : normalize(30),
              width: props.width ? props.width : normalize(30),
              backgroundColor: props.backgroundColor,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={props.topImg}
              style={{
                paddingLeft: props.paddingLeft,
                height: props.iheight,
                width: props.iwidth,
                position: props.position,
                resizeMode: 'contain',
                tintColor: props.tintColor,
              }}
            />
          </TouchableOpacity>

          {props.middleText && (
            <Text
              style={{
             marginLeft:props.marginLeft,
                textAlign: 'center',
            // Adjust the spacing between icon and text
                fontFamily: props.fontFamily,
                fontSize: props.fontSize,
                color: props.color,
              }}>
              {props.middleText}
            </Text>
          )}
        </View>
      </View>
    </>
  );
}

Headerera.propTypes = {
  height: PropTypes.number,
  backgroundColor: PropTypes.string,
  paddingLeft: PropTypes.number,
  iheight: PropTypes.number,
  iwidth: PropTypes.number,
  tintColor: PropTypes.string,
  position: PropTypes.number,
  leftText: PropTypes.bool,
  lText: PropTypes.string,
  rText: PropTypes.string,
  topImg: PropTypes.string,
  onPressRight: PropTypes.func,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  topWidth: PropTypes.any,
  search: PropTypes.bool,
  color: PropTypes.string,
  fsize: PropTypes.number,
  fontFamilyLeft: PropTypes.string,
  justifyContent: PropTypes.string,
  middleText: PropTypes.string, // New prop for middle text
};

