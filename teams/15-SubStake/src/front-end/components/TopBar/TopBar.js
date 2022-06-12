import { View, StyleSheet, Text, Image, Pressable } from 'react-native';
import arrow from '../../assets/arrowLeft.png';
import avatar from '../../assets/avatarIcon.png';

export default function TopBar({ path, navigation, title }) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate(path)}>
        <Image source={arrow} on />
      </Pressable>
      {title && <Text style={{ color: 'white', fontSize: 20 }}>{title}</Text>}
      <Image source={avatar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
});
