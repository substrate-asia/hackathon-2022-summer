import { Text, View, StyleSheet, Image } from 'react-native';
import Layout from '../Layout';
import logo from '../../assets/logo.png';
import background_1 from '../../assets/background_1.png';
import background_2 from '../../assets/background_2.png';

export default function AppLoading() {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Image style={styles.background_1} source={background_1} />
        <Image style={styles.background_2} source={background_2} />
        <Image source={logo} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background_1: {
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
  background_2: {
    top: 0,
    left: 0,
    position: 'absolute',
  },
});
