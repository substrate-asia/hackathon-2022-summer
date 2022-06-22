import { View, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';
import background_1 from '../../assets/background_1.png';
import background_2 from '../../assets/background_2.png';
import { StatusBar } from 'expo-status-bar';

export default function Layout({ children, white, noPadding }) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: white ? 'white' : 'black',
      }}
    >
      <StatusBar style={white ? 'dark' : 'light'} />
      <View style={noPadding ? { flex: 1 } : styles.wrapper}>
        {!white && (
          <>
            <Image style={styles.background_1} source={background_1} />
            <Image style={styles.background_2} source={background_2} />
          </>
        )}
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
