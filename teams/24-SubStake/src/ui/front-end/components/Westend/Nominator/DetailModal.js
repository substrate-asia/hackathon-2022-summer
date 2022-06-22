import { Text, View, Pressable, Modal, StyleSheet, Image } from 'react-native';
import { Button } from '@rneui/base';

export default function NominatorDetailModal({ isVisible, setModalVisible, setSwitchModalVisible, validator, icon }) {
  const validatorInfo = {
    avgBlockPerRound: 20,
    blockLastRound: 20,
    minBond: 20,
    delegations: 20,
    totalBonded: 2684646,
    commission: 10,
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={() => setModalVisible(!isVisible)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
        <Pressable style={styles.modalContent}>
          <View style={styles.modalTitle}>
            <Image style={{ width: 38, height: 38 }} source={icon} />
            <Text style={styles.modalTitleHeader}>{validator.display_name}</Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.subTitle}>Information</Text>
            <View style={styles.informationRowContainer}>
              <View style={styles.informationBox}>
                <Text style={styles.informationHeader}>Average Blocks per Round</Text>
                <Text style={styles.informationContent}>{validatorInfo.avgBlockPerRound}</Text>
              </View>
              <View style={styles.informationBox}>
                <Text style={styles.informationHeader}>Blocks Last Round</Text>
                <Text style={styles.informationContent}>{validatorInfo.blockLastRound}</Text>
              </View>
              <View style={styles.informationBox}>
                <Text style={styles.informationHeader}>Minimum Bond</Text>
                <Text style={styles.informationContent}>{validatorInfo.minBond}</Text>
              </View>
            </View>
            <View style={styles.informationRowContainer}>
              <View style={styles.informationBox}>
                <Text style={styles.informationHeader}>Delegations</Text>
                <Text style={styles.informationContent}>{validatorInfo.delegations}</Text>
              </View>
              <View style={styles.informationBox}>
                <Text style={styles.informationHeader}>Total Bonded</Text>
                <Text style={styles.informationContent}>{validatorInfo.totalBonded}</Text>
              </View>
              <View style={styles.informationBox}>
                <Text style={styles.informationHeader}>Commission</Text>
                <Text style={styles.informationContent}>{validatorInfo.commission}</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.subTitle}>Select Action</Text>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: 10 }}>
              <Button
                title="SWITCH"
                containerStyle={{ marginRight: '1%', flex: 2 }}
                buttonStyle={{ backgroundColor: '#2745E2' }}
                titleStyle={{ fontSize: 10 }}
                onPress={() => {
                  setModalVisible(false);
                  setSwitchModalVisible(true);
                }}
              />
              <Button
                title="REMOVE"
                containerStyle={{ marginLeft: '1%', flex: 1 }}
                buttonStyle={{ backgroundColor: '#FF4545' }}
                titleStyle={{ fontSize: 10 }}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '95%',
    padding: 25,
  },
  modalTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitleHeader: {
    fontSize: 18,
    marginLeft: 10,
  },
  informationRowContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  informationBox: {
    width: '32%',
    height: 60,
    backgroundColor: '#CDE1FF',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  informationHeader: {
    color: '#8F8F8F',
    textAlign: 'center',
    fontSize: 10,
  },
  informationContent: {
    fontSize: 13,
  },
  subTitle: { fontSize: 10, color: '#7E7794' },
});
