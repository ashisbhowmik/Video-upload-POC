import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import normalize from '../Utils/Helpers/Dimen';
import Imagepath from '../Themes/Imagepath';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';

export default function TextFieldIn(props) {
  const [eyeVisible, setEyeVisible] = useState(true);

  function onChangeText(text) {
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  }

  function onFocus() {
    if (props.onFocus) {
      props.onFocus();
    }
  }

  function onBlur() {
    if (props.onBlur) {
      props.onBlur();
    }
  }

  return (
    <View
      style={{
        justifyContent: 'space-between',
        height: props.height,
        flexDirection: 'row',
        width: props.width,
        borderRadius: props.borderRadius,
        borderWidth: props.borderWidth,
        backgroundColor: props.backgroundColor,
        marginTop: props.marginTop,
        marginLeft: props.marginLeft,
        borderColor: props.borderColor,
        alignSelf: props.alignTextField ? props.alignTextField : 'center',
        alignItems: props.alignItems ? props.alignItems : 'center',
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        borderTopRightRadius: props.borderTopRightRadius,
        borderBottomRightRadius: props.borderBottomRightRadius,
        borderTopLeftRadius: props.borderTopLeftRadius,
        borderBottomLeftRadius: props.borderBottomLeftRadius,
        shadowOpacity: props.shadowOpacity,
        shadowRadius: props.shadowRadius,
        shadowOffset: props.shadowOffset,
        shadowColor: props.shadowColor,
        elevation: props.elevation,
        paddingVertical: props.paddingVertical,
        paddingHorizontal: props.paddingHorizontal,
      }}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          // backgroundColor:'red'
        }}>
        {/* +91 */}
        <Text style={{ marginLeft: normalize(12), marginBottom:normalize(4),fontSize: props.fontSize, color: Colorpath.placeholder }}>+91</Text>

        {/* TextInput */}
        <TextInput
          secureTextEntry={eyeVisible ? props.isSecure : !props.isSecure}
          keyboardType={props.keyboardType}
          autoCapitalize={props.autoCapitalize}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor}
          maxLength={props.maxLength}
          value={props.value}
          onChangeText={(text) => onChangeText(text)}
          onBlur={() => {
            onBlur();
          }}
          onFocus={() => onFocus()}
          multiline={props.multiline}
          textAlignVertical={props.textAlignVertical}
          editable={props.editable}
          style={{
            paddingHorizontal: props.paddingHorizontal
              ? props.paddingHorizontal
              : normalize(12),
            width: props.textWidth ? props.textWidth : '90%',
            fontFamily: props.fontFamily
              ? props.fontFamily
              : Fonts.PoppinsRegular,
            fontSize: props.fontSize,
            textAlign: props.textAlign,
            paddingLeft: props.paddingLeft,
            color: Colorpath.black,
            marginTop: props.marginTopInput ? props.marginTopInput : null,
          }}
        />

        {/* Eye Icon */}
        {props.eye && (
          <TouchableOpacity
            onPress={() => setEyeVisible(!eyeVisible)}
            style={
              Platform.OS == 'ios'
                ? { position: 'absolute', right: normalize(12) }
                : { position: 'absolute', right: normalize(12), top: normalize(12) }
            }>
            <Image
              source={eyeVisible ? Imagepath.eyeClose : Imagepath.eye}
              style={{
                resizeMode: 'contain',
                height: normalize(15),
                width: normalize(15),
                tintColor: Colorpath.black,
              }}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Additional Icons */}
      {props.image && (
        <View
          style={{
            position: 'absolute',
            right: props.right ? props.right : normalize(15),
          }}>
          <TouchableOpacity onPress={() => props.onPress()} disabled={props.disabled}>
            <Image
              source={props.source}
              style={{
                resizeMode: 'contain',
                height: props.iheight,
                width: props.iwidth,
                tintColor: props.tintColor,
              }}
            />
          </TouchableOpacity>
        </View>
      )}

      {props.image2 && (
        <TouchableOpacity
          onPress={() => props.onPressCamera()}
          disabled={props.disabledCamera}
          style={{
            position: 'absolute',
            right: props.right2,
            left: props.left2,
          }}>
          <Image
            source={props.source2}
            style={{
              resizeMode: 'contain',
              height: props.iheight2,
              width: props.iwidth2,
              tintColor: props.tintColor2,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

TextFieldIn.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  widthText: PropTypes.number,
  borderRadius: PropTypes.number,
  borderWidth: PropTypes.number,
  backgroundColor: PropTypes.string,
  marginTop: PropTypes.number,
  color: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  paddingTop: PropTypes.number,
  borderColor: PropTypes.string,
  paddingLeft: PropTypes.number,
  paddingRight: PropTypes.number,
  marginLeft: PropTypes.number,
  borderTopRightRadius: PropTypes.number,
  borderBottomRightRadius: PropTypes.number,
  borderTopLeftRadius: PropTypes.number,
  borderBottomLeftRadius: PropTypes.number,
  maxLength: PropTypes.number,
  image: PropTypes.bool,
  textAlign: PropTypes.number,
  paddingLeft: PropTypes.number,
  keyboardType: PropTypes.number,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  multiline: PropTypes.bool,
  textAlignVertical: PropTypes.string,
  editable: PropTypes.bool,
  calender: PropTypes.bool,
  date: PropTypes.string,
  datePlaceholder: PropTypes.string,
  onPress: PropTypes.func,
  marginTopInput: PropTypes.number,
  keyboardType: PropTypes.string,
  source: PropTypes.string,
  tintColor: PropTypes.string,
  iheight: PropTypes.number,
  iwidth: PropTypes.number,
  borderWidth: PropTypes.number,
  image2: PropTypes.bool,
  right2: PropTypes.number,
  left2: PropTypes.number,
  source2: PropTypes.string,
  tintColor2: PropTypes.string,
  iheight2: PropTypes.number,
  iwidth2: PropTypes.number,
  shadowOpacity: PropTypes.number,
  shadowRadius: PropTypes.number,
  shadowOffset: PropTypes.number,
  shadowColor: PropTypes.string,
  elevation: PropTypes.number,
  fontFamily: PropTypes.string,
  autoCapitalize: PropTypes.string,
  isSecure: PropTypes.bool,
  isRightIconVisible: PropTypes.bool,
  rightimage: PropTypes.string,
  rightimageheight: PropTypes.number,
  rightimagewidth: PropTypes.number,
  eye: PropTypes.bool,
  textWidth: PropTypes.number,
  disabled: PropTypes.bool,
  paddingVertical: PropTypes.number,
  paddingHorizontal: PropTypes.number,
  alignTextField: PropTypes.string,
  onPressCamera: PropTypes.func,
  disabledCamera: PropTypes.bool,
  textTransform: PropTypes.string,
};
