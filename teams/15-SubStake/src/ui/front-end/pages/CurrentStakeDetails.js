import { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable, TextInput } from 'react-native';
import { Button } from '@rneui/base';
import TopBar from '../components/TopBar/TopBar';
import Layout from '../components/Layout';
import { useAsyncStorage } from '../components/Context/AsyncStorage';
import westend from '../assets/westend.png';
import LoadingModal from '../components/LoadingModal';

export default function CurrentStakeDetails({ route, navigation }) {
  const { accounts, currentIndex } = useAsyncStorage();
  const { amount, isBonding } = route.params;

  const [pending, setPending] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [action, setAction] = useState();
  const [inputAmount, setInputAmount] = useState();

  const handleUnBond = async () => {
    setPending(true);

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
        amount: inputAmount,
      }),
    });
    console.log(response);
    const result = await response.json();
    console.log(result);
    setPending(false);
    navigation.navigate('CurrentStakes', { paramPropKey: 'paramPropValue' });
  };

  const handleBondMore = async () => {
    setPending(true);
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
        amount: inputAmount,
        isPool: 'False',
      }),
    });
    console.log(response);
    const result = await response.json();
    console.log(result);
    setPending(false);
    navigation.navigate('CurrentStakes', { paramPropKey: 'paramPropValue' });
  };

  // const handleReBond = async () => {
  //   setPending(true);
  //   const response = await fetch('https://rest-api.substake.app/api/request/dev/stake', {
  //     method: 'POST',
  //     headers: {
  //       'Content-type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       env: 'substrate',
  //       provider: 'westend',
  //       method: 'reStake',
  //       userAddress: accounts[currentIndex].sr25519,
  //       amount: inputAmount,
  //     }),
  //   });
  //   console.log(response);
  //   const result = await response.json();
  //   console.log(result);
  //   setPending(false);
  //   navigation.navigate('CurrentStakes', { paramPropKey: 'paramPropValue' });
  // };

  return (
    <Layout white={true} noPadding>
      {pending && <LoadingModal />}
      <View style={{ paddingHorizontal: 20 }}>
        <TopBar white={true} title="Current Stakes" navigation={navigation} path="CurrentStakes" hideIcon={true} />
      </View>
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <View style={styles.content}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={westend} style={{ marginRight: 15, width: 36, height: 36 }} />
            <View style={{ marginRight: 15 }}>
              <Text style={styles.network}>Westend</Text>
              <Text style={styles.balance}>{`${isBonding ? 'Bonding' : 'UnBonding'} : ${amount} WND`}</Text>
            </View>
          </View>
        </View>
        <View style={styles.mainContainer}>
          <Text style={styles.mainHeader}>Selected Validators</Text>
          <Text style={styles.mainText}>PARITY WESTEND VALIDATOR 2(Active)</Text>
        </View>
        <View style={styles.mainContainer}>
          <Text style={styles.mainHeader}>Validator Condition</Text>
          <Text style={styles.mainText}>- One validator per operator</Text>
          <Text style={styles.mainText}>- Currently Elected at least in 3 days</Text>
          <Text style={styles.mainText}>- Commission rate under 20%</Text>
          <Text style={styles.mainText}>- With an onchain-identity</Text>
        </View>
        <View style={styles.mainContainer}>
          <Text style={styles.mainHeader}>Staking Option</Text>
          <Text style={styles.mainText}>Auto-restake</Text>
        </View>
      </ScrollView>
      <View>
        <View style={{ backgroundColor: '#F2F2F2', height: 10, width: '100%' }} />
        <View style={styles.buttonContainer}>
          {showInput ? (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ marginBottom: 10 }}>Please enter the amount</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ borderColor: 'black', borderWidth: 1, padding: 10, borderRadius: 5 }}>
                  <TextInput
                    style={{ width: 80 }}
                    autoCapitalize="none"
                    keyboardType="decimal-pad"
                    placeholderTextColor="#A8A8A8"
                    placeholder="Please enter only the digits"
                    onChangeText={(amount) => setInputAmount(amount)}
                    autoCorrect={false}
                  />
                </View>
                <Button
                  title="OK"
                  type="clear"
                  titleStyle={{ fontSize: 15 }}
                  onPress={action === 'bondmore' ? handleBondMore : handleUnBond}
                />
              </View>
            </View>
          ) : (
            <>
              {/* <Pressable
                style={styles.buttonFlex}
                onPress={() => {
                  setShowInput(true);
                  setAction('rebond');
                }}
              >
                <Text style={styles.buttonSymbol}>+</Text>
                <Text style={styles.buttonText}>Re Bond</Text>
              </Pressable> */}
              <Pressable
                style={styles.buttonFlex}
                onPress={() => {
                  setShowInput(true);
                  setAction('bondMore');
                }}
              >
                <Text style={styles.buttonSymbol}>+</Text>
                <Text style={styles.buttonText}>Bond More</Text>
              </Pressable>
              <Pressable
                style={styles.buttonFlex}
                onPress={() => {
                  setShowInput(true);
                  setAction('unbond');
                }}
              >
                <Text style={styles.buttonSymbol}>-</Text>
                <Text style={styles.buttonText}>UnBond</Text>
              </Pressable>
              <Pressable style={styles.buttonFlex}>
                <Text style={styles.buttonSymbol}>x</Text>
                <Text style={styles.buttonText}>Claim UnBond</Text>
              </Pressable>
            </>
          )}
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
    alignItems: 'center',
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
    marginTop: 40,
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
