import { View, StyleSheet, Text, Modal, Pressable, Image } from 'react-native';

export default function StakableModal({
  isVisible,
  setModalVisible,
  navigation,
  titleContent,
  detailContent,
  buttonContent,
  icon,
}) {
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
            <View style={{ marginLeft: 5 }}>
              <Text style={styles.modalTitleHeader}>{titleContent.header}</Text>
              <Text style={styles.modalTitleMain}>{titleContent.main}</Text>
            </View>
          </View>
          {detailContent.map((el, i) => (
            <View key={i} style={{ marginTop: 10 }}>
              <Text style={styles.modalDetailHeader}>{el.header}</Text>
              <Text style={styles.modalDetailMain}>{el.main}</Text>
            </View>
          ))}
          {buttonContent.map((el, i) => (
            <Pressable
              key={i}
              style={styles.button}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate(el.path);
              }}
            >
              <Text style={styles.buttonText}>{el.desc}</Text>
            </Pressable>
          ))}
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
    padding: 25,
  },
  modalTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitleHeader: {
    fontSize: 18,
  },
  modalTitleMain: {
    fontSize: 10,
    color: '#7E7794',
  },
  modalDetailHeader: {
    fontSize: 10,
    color: '#7E7794',
  },
  modalDetailMain: {
    fontSize: 10,
    color: '#7E7794',
  },
  button: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CDE1FF80',
    marginTop: 10,
    paddingVertical: 5,
  },
  buttonText: {
    color: '#0029FF',
    fontSize: 18,
  },
});
