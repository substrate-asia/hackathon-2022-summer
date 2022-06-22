import { ScrollView, Text, View, Pressable, Modal, StyleSheet, TextInput } from 'react-native';
import { useRef, useEffect, useState } from 'react';

const totalValidatorList = [
  { name: 'Substake_1', points: 43, nominees: 9 },
  { name: 'Substake_2', points: 43, nominees: 9 },
  { name: 'Substake_3', points: 43, nominees: 9 },
  { name: 'Substake_4', points: 43, nominees: 9 },
  { name: 'Substake_5', points: 43, nominees: 9 },
  { name: 'Substake_6', points: 43, nominees: 9 },
  { name: 'Substake_7', points: 43, nominees: 9 },
  { name: 'Substake_8', points: 43, nominees: 9 },
  { name: 'Substake_9', points: 43, nominees: 9 },
  { name: 'Substake_10', points: 43, nominees: 9 },
  { name: 'Substake_11', points: 43, nominees: 9 },
  { name: 'Substake_12', points: 43, nominees: 9 },
  { name: 'Substake_13', points: 43, nominees: 9 },
  { name: 'Substake_14', points: 43, nominees: 9 },
  { name: 'Substake_15', points: 43, nominees: 9 },
  { name: 'Substake_16', points: 43, nominees: 9 },
];

export default function NominatorSwitchModal({
  modalVisible,
  setModalVisible,
  newValidator,
  setNewValidator,

  selectedValidator,
  validatorList,
  setValidatorList,
}) {
  const scrollViewRef = useRef();
  const [fetchedValidatorList, setFetchedValidatorList] = useState([]);
  const [pressed, setPressed] = useState();

  useEffect(() => {
    const getTotalValidatorList = async () => {
      const response = await fetch('https://rest-api.substake.app/api/request/dev/curate', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          which: 'validators',
          is_curate: 'False',
        }),
      });
      const result = await response.json();
      console.log(result);
      const filteredResult = result.filter((i) => !validatorList.map((el) => el.public_key).includes(i.validator));
      setFetchedValidatorList(filteredResult);
    };

    getTotalValidatorList();
  }, []);

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
        <Pressable style={styles.modalContent}>
          <View style={{ justifyContent: 'space-between', flex: 1 }}>
            <View style={{ marginHorizontal: 25, marginBottom: 10 }}>
              <Text style={styles.modalTitle}>Switch to a new Validator</Text>
              {/* <Text style={styles.modalMain}>Do you have a specific pool you want to join?</Text>
              <TextInput
                autoCapitalize="none"
                style={styles.modalTextInput}
                placeholder="명칭, 주소, 혹은 계좌 인덱스로 필터링합니다."
              /> */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.tableHeader}>Validators</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ ...styles.tableHeaderRight }}>Points</Text>
                  <Text style={{ ...styles.tableHeaderRight }}>Nominees</Text>
                </View>
              </View>
            </View>
            <ScrollView ref={scrollViewRef}>
              {fetchedValidatorList.map((el, i) => (
                <Pressable
                  key={i}
                  onPress={() =>
                    setPressed({ public_key: el.validator, validator: el.validator, display_name: el.display_name })
                  }
                  onStartShouldSetResponder={() => true}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 25,
                    backgroundColor: pressed?.validator === el.validator ? '#93A2F1' : 'white',
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ ...styles.tableMain, marginRight: 10 }}>{i + 1}</Text>
                    <Text style={styles.tableMain}>
                      {el.display_name === 'No value'
                        ? el.validator.slice(0, 4) + '...' + el.validator.slice(44, 48)
                        : el.display_name}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.tableMainRight}>{el.points}</Text>
                    <Text style={styles.tableMainRight}>{el.nominees}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={pressed ? styles.confirmButton : styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                setValidatorList([...validatorList.filter((el) => el.public_key !== selectedValidator), pressed]);
              }}
            >
              <Text style={{ color: pressed ? '#ffffff' : 'black' }}>{pressed ? 'Confirm' : 'Close'}</Text>
            </Pressable>
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
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingVertical: 25,
    alignSelf: 'stretch',
    height: '65%',
  },
  modalTitle: {
    fontSize: 15,
    marginBottom: 15,
  },
  modalMain: {
    marginTop: 15,
    fontSize: 10,
    color: '#7E7794',
  },
  modalTextInput: {
    marginTop: 5,
    marginBottom: 15,
    borderColor: '#AAAAAA',
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 5,
    borderRadius: 5,
    fontSize: 10,
  },
  tableHeader: {
    fontSize: 10,
    color: '#7E7794',
    textAlign: 'center',
  },
  tableHeaderRight: {
    fontSize: 10,
    color: '#7E7794',
    width: 50,
    textAlign: 'center',
  },
  tableMain: {
    fontSize: 10,
    marginVertical: 10,
  },
  tableMainRight: {
    fontSize: 10,
    marginVertical: 10,
    width: 50,
    textAlign: 'center',
  },
  closeButton: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    backgroundColor: '#E7E7E7',
  },
  confirmButton: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    backgroundColor: '#2745E2',
  },
});
