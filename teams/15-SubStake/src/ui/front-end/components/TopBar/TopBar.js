import { View, StyleSheet, Text, Image, Pressable } from 'react-native';
import arrow from '../../assets/arrowLeft.png';
import arrow_black from '../../assets/arrowLeft_black.png';
import AccountIcon from '../common/AccountIcon';
import { useAsyncStorage } from '../Context/AsyncStorage';

export default function TopBar({ path, navigation, title, hideIcon, white }) {
  const { accounts, currentIndex } = useAsyncStorage();

  return (
    <View style={styles.container}>
      {path && (
        <Pressable onPress={() => navigation.navigate(path, { paramPropKey: 'paramPropValue' })}>
          <Image source={white ? arrow_black : arrow} />
        </Pressable>
      )}
      {title && <Text style={{ color: white ? 'black' : 'white', fontSize: 20 }}>{title}</Text>}
      {hideIcon ? (
        <View />
      ) : (
        <Pressable onPress={() => navigation.navigate('Accounts')}>
          <AccountIcon publicKey={accounts[currentIndex].bip39} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    marginBottom: 10,
  },
});
