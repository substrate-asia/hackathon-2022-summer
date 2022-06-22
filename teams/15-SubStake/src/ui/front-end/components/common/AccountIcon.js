import { View, Image } from 'react-native';
import ring from '../../assets/substake_ring.png';

const getHexColorFromPubkey = (publicKey) => {
  var hash = 0;
  for (var i = 0; i < publicKey.length; i++) {
    hash = publicKey.charCodeAt(i) + ((hash << 5) - hash);
  }
  var color = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
};

export default function AccountIcon({ publicKey }) {
  return (
    <View style={{ borderRadius: 1000, backgroundColor: getHexColorFromPubkey(publicKey) }}>
      <Image source={ring} />
    </View>
  );
}
