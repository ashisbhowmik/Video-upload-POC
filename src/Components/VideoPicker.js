import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
// import {Colors, Fonts, Icons} from '../themes/index';
import Colorpath from '../Themes/Colorpath';
import PropTypes from 'prop-types';
import normalize from '../Utils/Helpers/Dimen';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
// import Button from './Button';
export default function CameraPickerGallery(props) {
    // function to open gallery
    function btnClick_galeryUpload() {
        if (props.btnClick_galeryUpload) {
            ImagePicker.openPicker({
                width: normalize(300),
                height: normalize(400),
                // cropping: true,
                multiple: props.multiple,
                mediaType: props.mediaType,
                // mediaType: "video"

            })
                .then(response => {
                    console.log(response);

                    let arr = [];
                    if (props.multiple) {
                        response.filter(data => {
                            arr.push({
                                name: data.filename
                                    ? data.filename
                                    : data.path.replace(/^.*[\\\/]/, ''),
                                type: data.mime,
                                uri: data.path,
                            });
                        });
                        props.btnClick_galeryUpload(arr);
                    } else {
                        let imageObj = {};
                        console.log(response);
                        imageObj.name = response.filename
                            ? response.filename
                            : response.path.replace(/^.*[\\\/]/, '');
                        imageObj.type = response.mime;
                        imageObj.uri = response.path;
                        console.log(imageObj);
                        props.btnClick_galeryUpload(imageObj);
                    }
                    // if (props.mediatype == 'any') {
                    //   response.filter(data => {
                    //     videoArr.push({
                    //       name: data.filename
                    //         ? data.filename
                    //         : data.path.replace(/^.*[\\\/]/, ''),
                    //       type: data.mime,
                    //       uri: data.path,
                    //     });
                    //   });
                    //   props.btnClick_galeryUpload(videoArr);
                    // }
                })
                .catch(err => console.log(err));
        }
    }


    function onBackdropPress() {
        if (props.onBackdropPress) {
            props.onBackdropPress();
        }
    }

    return (
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={props.pickerVisible}
            style={{ width: '100%', alignSelf: 'center', margin: 0 }}
            animationInTiming={800}
            animationOutTiming={1000}
            onBackdropPress={() => onBackdropPress()}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderTopRightRadius: normalize(20),
                    borderTopLeftRadius: normalize(20),
                    paddingVertical: normalize(10),
                    alignItems: 'center',
                }}
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                {/* <Button
          width={'75%'}
          height={normalize(45)}
          alignSelf={'center'}
          marginTop={normalize(10)}
          marginBottom={normalize(10)}
          backgroundColor={Colors.lightGreen}
          title={'Select from Camera'}
          textColor={Colors.white}
          borderRadius={normalize(10)}
          textAlign={'center'}
          fontSize={normalize(12)}
          justifyContent={'center'}
          fontWeight={'600'}
          onPress={() => {
            btnClick_cameraUpload();
          }}
          activeOpacity={0.6}
          titlesingle={true}
        /> */}
                {/* <TouchableOpacity
                    onPress={() => btnClick_cameraUpload()}
                    activeOpacity={0.6}
                    style={{
                        width: '75%',
                        height: normalize(45),
                        alignSelf: 'center',
                        marginTop: normalize(10),
                        marginBottom: normalize(10),
                        backgroundColor: Colorpath.yellow,
                        borderRadius: normalize(10),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: normalize(12),
                            fontWeight: '600',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: Colorpath.white,
                        }}>
                        Select from Camera
                    </Text>
                </TouchableOpacity> */}
                {/* <Button
          width={'75%'}
          height={normalize(45)}
          alignSelf={'center'}
          marginTop={normalize(0)}
          marginBottom={normalize(15)}
          backgroundColor={Colors.lightGreen}
          title={'Select from Gallery'}
          textColor={Colors.white}
          borderRadius={normalize(10)}
          textAlign={'center'}
          fontSize={normalize(12)}
          justifyContent={'center'}
          fontWeight={'600'}
          onPress={() => {
            btnClick_galeryUpload();
          }}
          activeOpacity={0.6}
          titlesingle={true}
        /> */}
                <TouchableOpacity
                    onPress={() => btnClick_galeryUpload()}
                    activeOpacity={0.6}
                    style={{
                        width: '75%',
                        height: normalize(45),
                        alignSelf: 'center',
                        marginBottom: normalize(15),
                        borderRadius: normalize(10),
                        backgroundColor: Colorpath.yellow,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: normalize(12),
                            fontWeight: '600',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: Colorpath.white,
                        }}>
                        Select from Gallery
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

//Proptypes
CameraPickerGallery.propTypes = {
    pickerVisible: PropTypes.bool,
    btnClick_galeryUpload: PropTypes.func,
    onBackdropPress: PropTypes.func,
    multiple: PropTypes.bool,
    mediaType: PropTypes.string,
};

//defaultPropsvalue
CameraPickerGallery.defaultProps = {
    pickerVisible: false,
    btnClick_galeryUpload: () => { },
    onBackdropPress: () => { },
    multiple: false,
};

