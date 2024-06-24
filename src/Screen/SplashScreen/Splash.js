import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Imagepath from '../../Themes/Imagepath';
import normalize from '../../Utils/Helpers/Dimen';
export default function Splash(props) {
  useEffect(() => {
    setTimeout(() => {
      // props.navigation.navigate('VideoUpload');
      props.navigation.navigate('VideoUpload');
    }, 3000);
  }, []);
  return (
    <View style={styles.container}>
      <Image
        source={Imagepath.Beatlogo}
        style={{ width: normalize(150), height: normalize(150) }}
        resizeMode="contain"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
