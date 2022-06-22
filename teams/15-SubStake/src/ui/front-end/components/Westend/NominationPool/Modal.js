import { ScrollView, Text, View, Pressable, Modal, StyleSheet, TextInput } from 'react-native';
import { useEffect, useRef, useState } from 'react';

export function NominationPoolModal({ setModalVisible, modalVisible, selectedValidator, setSelectedValidator }) {
  const [nominationPoolList, setNominationPoolList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState();
  const [selectedName, setSelectedName] = useState();

  useEffect(() => {
    const getNominationList = async () => {
      const response = await fetch('https://rest-api.substake.app/api/request/dev/curate', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          which: 'nomination_pool',
        }),
      });
      const result = await response.json();
      console.log(result);
      setNominationPoolList(result);
    };

    getNominationList();
  }, []);

  const scrollViewRef = useRef();

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
              <Text style={styles.modalTitle}>Select a Nomination Pool</Text>
              <Text style={styles.modalMain}>Do you have a specific pool you want to join?</Text>
              <TextInput
                autoCapitalize="none"
                style={styles.modalTextInput}
                placeholder="명칭, 주소, 혹은 계좌 인덱스로 필터링합니다."
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.tableHeader}>Open Pools</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ ...styles.tableHeaderRight }}>Points</Text>
                  <Text style={{ ...styles.tableHeaderRight }}>Member Counts</Text>
                </View>
              </View>
            </View>
            <ScrollView ref={scrollViewRef}>
              {nominationPoolList.map((el, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    setSelectedIndex(el.index);
                    setSelectedName(el.display_name);
                  }}
                  onStartShouldSetResponder={() => true}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 25,
                    backgroundColor: selectedName === el.display_name ? '#93A2F1' : 'white',
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ ...styles.tableMain, marginRight: 10 }}>{i + 1}</Text>
                    <Text style={styles.tableMain}>
                      {el.display_name.slice(0, el.display_name.length > 30 ? 30 : el.display_name.length)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.tableMainRight}>{Number.parseFloat(el.points.toFixed(3))}</Text>
                    <Text style={styles.tableMainRight}>{el.member_counts}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={selectedName ? styles.confirmButton : styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                setSelectedValidator({ selectedIndex, selectedName });
              }}
            >
              <Text style={{ color: selectedName ? '#ffffff' : 'black' }}>{selectedName ? 'Confirm' : 'Close'}</Text>
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
