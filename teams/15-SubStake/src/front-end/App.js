import { NavigationContainer, StackActions } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  useFonts,
} from '@expo-google-fonts/nunito';

import Home from './components/pages/Home';
import StakableAssets from './components/pages/StakableAssets';
import WestendNominator from './components/pages/Westend/Nominator';
import WestendNominationPool from './components/pages/Westend/NominationPool';
import WestendValidator from './components/pages/Westend/Validator';
import MoonbaseCollator from './components/pages/Moonbase/Collator';
import MoonbaseDelegator from './components/pages/Moonbase/Delegator';
import { useEffect, useState } from 'react';
import Register from './components/pages/Register';
import Welcome from './components/pages/Welcome';

const Stack = createNativeStackNavigator();

export default function App() {
  const [hasRegistered, setHasRegistered] = useState(false);
  const [f] = useFonts({ Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold });

  useEffect(() => {
    const checkIfRegistered = async () => {};

    checkIfRegistered();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {hasRegistered ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="StakableAssets" component={StakableAssets} />
            <Stack.Screen name="WestendNominator" component={WestendNominator} />
            <Stack.Screen name="WestendNominationPool" component={WestendNominationPool} />
            <Stack.Screen name="WestendValidator" component={WestendValidator} />
            <Stack.Screen name="MoonbaseCollator" component={MoonbaseCollator} />
            <Stack.Screen name="MoonbaseDelegator" component={MoonbaseDelegator} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
