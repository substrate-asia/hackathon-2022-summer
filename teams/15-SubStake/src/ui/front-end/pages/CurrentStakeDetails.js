import { StyleSheet, Text, View, Image, ScrollView, Pressable } from 'react-native';
import { Button } from '@rneui/base';
import TopBar from '../components/TopBar/TopBar';
import Layout from '../components/Layout';
import { useAsyncStorage } from '../components/Context/AsyncStorage';
import westend from '../assets/westend.png';

export default function CurrentStakeDetails({ route, navigation }) {
  const { accounts, currentIndex } = useAsyncStorage();
  const { bond } = route.params;

  const handleUnBond = async () => {
    const response = await fetch('https://rest-api.substake.app/api/request/dev/stake', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        env: 'substrate',
        provider: 'westend',
        method: 'stakeLess',
        userAddress: accounts[currentIndex].sr25519,
        amount: bond.total,
      }),
    });
    console.log(response);
    const result = await response.json();
    console.log(result);
    navigation.navigate('CurrentStakes', { paramPropKey: 'paramPropValue' });
  };

  const handleBondMore = async () => {
    const response = await fetch('https://rest-api.substake.app/api/request/dev/stake', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        env: 'substrate',
        provider: 'westend',
        method: 'stakeMore',
        userAddress: accounts[currentIndex].sr25519,
        amount: bond.total,
        isPool: 'False',
      }),
    });
    console.log(response);
    const result = await response.json();
    console.log(result);
    navigation.navigate('CurrentStakes', { paramPropKey: 'paramPropValue' });
  };

  const handleReBond = async () => {
    const response = await fetch('https://rest-api.substake.app/api/request/dev/stake', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        env: 'substrate',
        provider: 'westend',
        method: 'reStake',
        userAddress: accounts[currentIndex].sr25519,
        amount: bond.total,
      }),
    });
    console.log(response);
    const result = await response.json();
    console.log(result);
    navigation.navigate('CurrentStakes', { paramPropKey: 'paramPropValue' });
  };

  return (
    <Layout white={true} noPadding>
      <View style={{ paddingHorizontal: 20 }}>
        <TopBar white={true} title="Current Stakes" navigation={navigation} path="CurrentStakes" hideIcon={true} />
      </View>
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <View style={styles.content}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={westend} style={{ marginRight: 15, width: 36, height: 36 }} />
            <View style={{ marginRight: 15 }}>
              <Text style={styles.network}>Westend</Text>
              <Text style={styles.balance}>You nomination : {bond.total} WND</Text>
            </View>
          </View>
        </View>
        <View style={styles.mainContainer}>
          <Text style={styles.mainHeader}>Selected Validators</Text>
          <Text style={styles.mainText}>blah blah blah</Text>
        </View>
        <View style={styles.mainContainer}>
          <Text style={styles.mainHeader}>Validator Condition</Text>
          <Text style={styles.mainText}>blah blah blah</Text>
        </View>
        <View style={styles.mainContainer}>
          <Text style={styles.mainHeader}>Staking Option</Text>
          <Text style={styles.mainText}>blah blah blah</Text>
        </View>
        <View style={styles.mainContainer}>
          <Text style={styles.mainHeader}>My Rank in NPoS</Text>
          <Text style={styles.mainText}>blah blah blah</Text>
        </View>
      </ScrollView>
      <View>
        <View style={{ backgroundColor: '#F2F2F2', height: 10, width: '100%' }} />
        <View style={styles.buttonContainer}>
          <Pressable style={styles.buttonFlex} onPress={handleReBond}>
            <Text style={styles.buttonSymbol}>+</Text>
            <Text style={styles.buttonText}>Re Bond</Text>
          </Pressable>
          <Pressable style={styles.buttonFlex} onPress={handleBondMore}>
            <Text style={styles.buttonSymbol}>+</Text>
            <Text style={styles.buttonText}>Bond More</Text>
          </Pressable>
          <Pressable style={styles.buttonFlex} onPress={handleUnBond}>
            <Text style={styles.buttonSymbol}>-</Text>
            <Text style={styles.buttonText}>UnBond</Text>
          </Pressable>
          <Pressable style={styles.buttonFlex}>
            <Text style={styles.buttonSymbol}>x</Text>
            <Text style={styles.buttonText}>Claim UnBond</Text>
          </Pressable>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: 130,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  buttonFlex: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSymbol: {
    color: '#7B7B7B',
    marginBottom: 3,
    fontSize: 20,
  },
  buttonText: {
    color: '#7B7B7B',
  },
  mainContainer: {
    width: '100%',
    marginTop: 30,
  },
  mainHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mainText: {
    fontSize: 15,
    fontWeight: 'normal',
  },
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
