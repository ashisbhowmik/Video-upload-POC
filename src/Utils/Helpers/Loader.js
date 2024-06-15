import React from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import PropTypes from 'prop-types';
import normalize from '../Helpers/Dimen';

export default function Loader(props) {
  return props.visible ? (
    <View
      style={[
        {
          position: 'absolute',
          backgroundColor: 'rgba(1,1,1,.5)',
          zIndex: 999,
          top: 0,
          left: 0,
          height: Dimensions.get('screen').height,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          // margin:0,bottom:-30
        },
        props.modal == true
          ? { height: '133%', width: '116.5%', borderRadius: normalize(15) }
          : null,
      ]}>
      <View
        style={{
          height: normalize(140),
          width: normalize(140),
          borderRadius: normalize(10),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
        <ActivityIndicator size={'large'} color={'white'}></ActivityIndicator>
      </View>
    </View>
  ) : null;
}

Loader.propTypes = {
  visible: PropTypes.bool,
  modal: PropTypes.bool,
};

Loader.defaultProps = {
  modal: false,
  visible: false,
};
