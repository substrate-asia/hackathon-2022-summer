import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AsyncStorageContext = createContext();

export const useAsyncStorage = () => useContext(AsyncStorageContext);

export function AsyncStorageProvider({ children }) {
  const [accounts, setAccounts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = JSON.parse(await AsyncStorage.getItem('@substake_accounts'));
      setAccounts(accounts);
      setIsLoaded(true);
    };

    getAccounts();
  }, []);

  const addAccount = async (account) => {
    let newAccounts = [];
    const accounts = JSON.parse(await AsyncStorage.getItem('@substake_accounts'));

    if (accounts) newAccounts = [...accounts, account];
    else newAccounts = [account];

    await AsyncStorage.setItem('@substake_accounts', JSON.stringify(newAccounts));

    setAccounts(newAccounts);
  };

  const removeAccount = async (account) => {
    if (account.bip39.publicKey === accounts[accounts.length - 1].bip39.publicKey) setCurrentIndex(0);

    const accounts = JSON.parse(await AsyncStorage.getItem('@substake_accounts'));
    const newAccounts = accounts.filter((el) => el.bip39.publicKey !== account.bip39.publicKey);
    await AsyncStorage.setItem('@substake_accounts', JSON.stringify(newAccounts));

    setAccounts(newAccounts);
  };

  return (
    <AsyncStorageContext.Provider
      value={{ isLoaded, accounts, currentIndex, setCurrentIndex, addAccount, removeAccount }}
    >
      {children}
    </AsyncStorageContext.Provider>
  );
}
