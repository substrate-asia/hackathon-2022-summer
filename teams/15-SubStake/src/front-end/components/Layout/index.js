import { View, StyleSheet, Image, SafeAreaView } from 'react-native';
import background_1 from '../../assets/background_1.png';
import background_2 from '../../assets/background_2.png';

export default function Layout({ children }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Image style={styles.background_1} source={background_1} />
        <Image style={styles.background_2} source={background_2} />
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'row',
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
