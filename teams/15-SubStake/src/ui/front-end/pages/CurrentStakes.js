import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import TopBar from '../components/TopBar/TopBar';
import Layout from '../components/Layout';
import { useAsyncStorage } from '../components/Context/AsyncStorage';
import westend from '../assets/westend.png';
import { useEffect, useState } from 'react';

export default function CurrentStakes({ navigation, route }) {
  const [bonds, setBonds] = useState(null);
  const { accounts, currentIndex } = useAsyncStorage();

  // TODO: unlock랑 bonding이랑 나누어서 state로 저장하기
  useEffect(() => {
    const getAssets = async () => {
      if (!accounts) return;

      const response = await fetch('https://rest-api.substake.app/api/request/dev/asset', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          of: accounts[currentIndex].sr25519,
        }),
      });
      console.log(response);
      const result = await response.json();
      console.log(result);
      setBonds(result);
    };

    getAssets();
  }, [accounts, route]);

  // TODO: Unlock과 Bonding을 나누어서 map으로 보여주기
  return (
    <Layout white={true}>
      <TopBar white={true} title="Current Stakes" navigation={navigation} path="Home" hideIcon={true} />
      <View style={styles.container}>
        {bonds &&
          bonds.map(
            (el, i) =>
              el.is_bonding === 'True' && (
                <Pressable
                  key={i}
                  onPress={() => navigation.navigate('CurrentStakeDetails', { bond: bonds[i] })}
                  style={styles.content}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={westend} style={{ marginRight: 15, width: 36, height: 36 }} />
                    <View style={{ marginRight: 15 }}>
                      <Text style={styles.network}>Westend</Text>
                      <Text style={styles.balance}>You nomination : {el.total} WND</Text>
                    </View>
                  </View>
                </Pressable>
              )
          )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  network: {
    color: 'black',
    fontSize: 20,
  },
  balance: {
    color: '#A8A8A8',
    fontSize: 13,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  text: {
    color: 'black',
    fontSize: 20,
    marginBottom: 3,
  },
  serviceDetail: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#343781A1',
    borderRadius: 10,
    marginTop: 30,
  },
});
