import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import TopBar from '../components/TopBar/TopBar';
import Layout from '../components/Layout';
import { useAsyncStorage } from '../components/Context/AsyncStorage';
import westend from '../assets/westend.png';
import { useEffect, useState } from 'react';
import LoadingModal from '../components/LoadingModal';
import { BigNumber } from 'ethers';
import { bignumber, subtract } from 'mathjs';
import { Divider } from '@rneui/base';

export default function CurrentStakes({ navigation, route }) {
  const [bond, setBond] = useState(0);
  const [unBond, setUnBond] = useState(0);
  const [pending, setPending] = useState(false);

  const { accounts, currentIndex } = useAsyncStorage();

  useEffect(() => {
    const getAssets = async () => {
      setPending(true);
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

      if (result[0].is_bonding === 'False') {
        setBond(0);
        setUnBond(0);
      } else {
        if (result[0].unlock.length > 0) {
          setBond(subtract(bignumber(result[0].total), bignumber(result[0].unlock[0].value)).toString());
          setUnBond(result[0].unlock[0].value);
        } else setBond(result[0].total);
      }

      setPending(false);
    };

    getAssets();
  }, [accounts, route]);

  return (
    <Layout white={true}>
      {pending && <LoadingModal />}
      <TopBar white={true} title="Current Stakes" navigation={navigation} path="Home" hideIcon={true} />
      <View style={styles.container}>
        {bond > 0 && (
          <>
            <Pressable
              onPress={() => navigation.navigate('CurrentStakeDetails', { amount: bond, isBonding: true })}
              style={styles.content}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={westend} style={{ marginRight: 15, width: 36, height: 36 }} />
                <View style={{ marginRight: 15 }}>
                  <Text style={styles.network}>Westend</Text>
                  <Text style={styles.balance}>You nomination : {bond} WND</Text>
                </View>
              </View>
              <View style={{ backgroundColor: '#E5E5E5', padding: 10, borderRadius: 5 }}>
                <Text style={{ fontSize: 12 }}>Bonding</Text>
              </View>
            </Pressable>
            <Divider />
          </>
        )}
        {unBond > 0 && (
          <Pressable
            onPress={() => navigation.navigate('CurrentStakeDetails', { amount: unBond, isBonding: false })}
            style={styles.content}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={westend} style={{ marginRight: 15, width: 36, height: 36 }} />
              <View style={{ marginRight: 15 }}>
                <Text style={styles.network}>Westend</Text>
                <Text style={styles.balance}>You nomination : {unBond} WND</Text>
              </View>
            </View>
            <View style={{ backgroundColor: '#E5E5E5', padding: 10, borderRadius: 5 }}>
              <Text style={{ fontSize: 12 }}>UnBonding</Text>
            </View>
          </Pressable>
        )}
        {bond === 0 && unBond === 0 && <Text>No current stakes</Text>}
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
    marginVertical: 20,
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
