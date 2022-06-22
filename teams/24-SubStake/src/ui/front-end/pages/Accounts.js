import { Button, Divider } from '@rneui/base';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import AccountIcon from '../components/common/AccountIcon';
import { useAsyncStorage } from '../components/Context/AsyncStorage';
import Layout from '../components/Layout';
import TopBar from '../components/TopBar/TopBar';
import checked from '../assets/checked.png';

export default function Accounts({ navigation }) {
  const { accounts, currentIndex, setCurrentIndex } = useAsyncStorage();

  return (
    <Layout>
      <TopBar title="Accounts" navigation={navigation} path="Home" hideIcon={true} />
      <View style={styles.container}>
        <View>
          {accounts.map((el, i) => (
            <Pressable onPress={() => setCurrentIndex(i)}>
              <View key={i} style={styles.accountRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AccountIcon publicKey={el.bip39} />
                  <Text style={styles.nickname}>{el.nickname}</Text>
                </View>
                {currentIndex === i && <Image source={checked} />}
              </View>
              <Divider style={{ marginVertical: 15 }} />
            </Pressable>
          ))}
        </View>
        <Button title="Add accounts" onPress={() => navigation.navigate('ReRegister')} />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nickname: {
    color: 'white',
    fontSize: 24,
    marginLeft: 15,
  },
});
