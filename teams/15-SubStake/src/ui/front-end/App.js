import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  useFonts,
} from '@expo-google-fonts/nunito';
import { useWestend, WestendContextProvider } from './components/Context/WestendContext';
import Home from './pages/Home';
import StakableAssets from './pages/StakableAssets';
import WestendNominator from './pages/Westend/Nominator';
import WestendNominationPool from './pages/Westend/NominationPool';
import WestendValidator from './pages/Westend/Validator';
import MoonbaseCollator from './pages/Moonbase/Collator';
import MoonbaseDelegator from './pages/Moonbase/Delegator';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import { AsyncStorageProvider, useAsyncStorage } from './components/Context/AsyncStorage';
import AppLoading from './components/AppLoading';
import Accounts from './pages/Accounts';
import ReRegister from './pages/ReRegister';
import { MoonbeamContextProvider, useMoonbeam } from './components/Context/MoonbeamContext';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserBalance } from './query';
import { Platform } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import CurrentStakes from './pages/CurrentStakes';
import CurrentStakeDetails from './pages/CurrentStakeDetails';

const Stack = createNativeStackNavigator();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: true,
    },
  },
});

export function Root() {
  const { isLoaded: asyncStorageLoaded, accounts } = useAsyncStorage();
  const { isLoaded: westendLoaded } = useWestend();
  // const { isLoaded: moonbeamLoaded } = useMoonbeam();

  // useEffect(() => {
  //   const clearAsyncStorage = async () => {
  //     const asyncStorageKeys = await AsyncStorage.getAllKeys();

  //     if (asyncStorageKeys.length > 0) {
  //       if (Platform.OS === 'android') {
  //         await AsyncStorage.clear();
  //       }
  //       if (Platform.OS === 'ios') {
  //         await AsyncStorage.multiRemove(asyncStorageKeys);
  //       }
  //     }
  //   };
  //   clearAsyncStorage();
  // }, []);

  const isRegistered = accounts && accounts.length > 0;

  console.log(asyncStorageLoaded, westendLoaded);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {asyncStorageLoaded && westendLoaded ? (
          <>
            {!isRegistered && <Stack.Screen name="Register" component={Register} />}
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="StakableAssets" component={StakableAssets} />
            <Stack.Screen name="WestendNominator" component={WestendNominator} />
            <Stack.Screen name="WestendNominationPool" component={WestendNominationPool} />
            <Stack.Screen name="WestendValidator" component={WestendValidator} />
            <Stack.Screen name="MoonbaseCollator" component={MoonbaseCollator} />
            <Stack.Screen name="MoonbaseDelegator" component={MoonbaseDelegator} />
            <Stack.Screen name="Accounts" component={Accounts} />
            <Stack.Screen name="ReRegister" component={ReRegister} />
            <Stack.Screen name="CurrentStakes" component={CurrentStakes} />
            <Stack.Screen name="CurrentStakeDetails" component={CurrentStakeDetails} />
          </>
        ) : (
          <Stack.Screen name="Loading" component={AppLoading} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  useFonts({ Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold });

  return (
    <QueryClientProvider client={queryClient}>
      <MoonbeamContextProvider>
        <WestendContextProvider>
          <AsyncStorageProvider>
            <Root />
          </AsyncStorageProvider>
        </WestendContextProvider>
      </MoonbeamContextProvider>
    </QueryClientProvider>
  );
}
