import { View, StyleSheet, Text, Image, Pressable } from 'react-native';
import arrow from '../../assets/arrowRight.png';

export default function StakableItem({ index, img, network, balance, symbol, setModalVisible }) {
  return (
    <Pressable style={styles.container} onPress={() => setModalVisible(true)}>
      <View style={styles.content}>
        <View style={{ justifyContent: 'center', marginRight: 15 }}>
          <Text style={{ color: 'white' }}>{index}</Text>
        </View>
        <Image source={img} style={{ marginRight: 15, width: 36, height: 36 }} />
        <View style={{ marginRight: 15 }}>
          <Text style={styles.network}>{network}</Text>
          <Text style={styles.balance}>
            You have {balance} {symbol}
          </Text>
        </View>
      </View>
      <View style={{ padding: 10 }}>
        <Image source={arrow} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  network: {
    color: 'white',
    fontSize: 14,
  },
  balance: {
    color: '#A8A8A8',
    fontSize: 9,
  },
});
