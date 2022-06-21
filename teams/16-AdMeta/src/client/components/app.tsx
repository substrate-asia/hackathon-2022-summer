import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import TopBar from '../components/top-bar'
import ConnectModal from '../components/connect-modal'
import Bg from '../components/bg'
import Tip from '../components/tip'
import SetProfile from '../components/set-profile'
import Ad from '../components/ad'
import Claim from '../components/claim'
import { useEffect, useState } from 'react'
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { FC } from 'react'
import type { Wallet } from '../type'
import { message } from 'antd';
import { PreferencesEnum, GenderEnum } from '../enum'

const Home: FC = () => {
  const [isConnected, setConnect] = useState(false)
  const [isShowConnectModal, setShowConnectModal] = useState(false)
  const [isShowProfile, setShowProfile] = useState(false)
  const [isShowAd, setShowAd] = useState(false)
  const [tipText, setTipText] = useState<string>('Please connect to Polkadot.js Extention first.')
  const [isShowClaimModal, setShowClaimModal] = useState(false)

  const [walletList, setWalletList] = useState<Wallet[]>([])
  const [selectAccount, setSelectAccount] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState(0)
  const [preferences, setPreferences] = useState(0)
  const [adDisplay, setAdDisplay] = useState(false)
  const [provider, setProvider] = useState<WsProvider>()
  const [api, setApi] = useState<ApiPromise>()
  const [adIndex, setAdIndex] = useState<number>()
  const [adIpfs, setAdIpfs] = useState<string>('')
  const [claimAmount, setClaimAmount] = useState<string>('')
  const [rewardAmount, setRewardAmount] = useState<string>('')
  const [adSwitchDisplay, setAdSwitchDisplay] = useState(false)

  const connectProvider = async () => {
    try {
      const wsProvider = new WsProvider('ws://168.119.116.180:9944');
      setProvider(wsProvider)
      const api = await ApiPromise.create({ provider: wsProvider });
      setApi(api)

    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    if (!provider) {
      connectProvider();
    }

  }, [api, provider])

  const addProfile = async () => {
    if (!selectAccount) {
      message.info('Please choose account')
      return
    }
    const SENDER = selectAccount;
    await web3Enable('AdMeta');
    const injector = await web3FromAddress(SENDER);
    setTipText('Please set up your profile')
    api?.tx.user
      .addProfile(age, PreferencesEnum[preferences])
      .signAndSend(SENDER, { signer: injector.signer }, (status) => {

        setTipText('You set up profile ok')
        setShowProfile(false)
      });

  }

  const queryUserAd = async () => {
    const SENDER = selectAccount;
    api?.query.user
      .users(SENDER)
      .then((c: any) => {
        console.log()
        if (!c.value.matchedAds) {
          message.info('Please first set up your profile')
        } else {
          const adArr = JSON.parse(c.value.matchedAds.toString())
          setAdSwitchDisplay(c.value.adDisplay.toString() === 'true')
          setShowAd(c.value.adDisplay.toString() === 'true')
  
          if (c.value.adDisplay.toString() !== 'true') {
            message.info('Please set up your profile ad display')
            return;
          }
  
          if (adArr.length) {
            const adIndex = adArr[0] as number
            setAdIndex(adIndex)
            getAdInfo(adIndex)
          }
        }

      })
  }

  const decodeUtf8 = (bytes: string | any[]) => {
    var encoded = "";
    for (var i = 0; i < bytes.length; i++) {
      encoded += '%' + bytes[i].toString(16);
    }
    return decodeURIComponent(encoded);
  }

  const getAdInfo = async (idx: number) => {
    api?.query.ad
      .impressionAds(idx)
      .then((c: any) => {
        const url: string = decodeUtf8(c.value.metadata)
        const cli: string = (+c.value.cpi / Math.pow(10, 12)) + ''
        const amount: string = (+c.value.amount / Math.pow(10, 12)) + ''

        setAdIpfs(url)
        setClaimAmount(idx + '')
        setRewardAmount(cli)

        setTipText(adSwitchDisplay ? 'Your customized ad' : 'Your should set up ad display')
      })
  }

  const handleShowConnectModal = () => {
    setShowConnectModal(true)
  }

  const handleCancelConnectModal = () => {
    setShowConnectModal(false)
    setConnect(false)
    setAdDisplay(false)
    setShowProfile(false)
  }

  const handleCancelConnectModalW = () => {
    setShowConnectModal(false)
  }

  const handleConfirmConnectModal = () => {
    if (!selectAccount) {
      message.info('Please select account!')
      return
    }
    if (!walletList.length) {
      message.info('Please use polkadot.js create account!')
      return
    }
    setConnect(true)
    setTipText('You need to set up your profile before using it.')
    setShowConnectModal(false)
  }

  const handleSubmitProfile = () => {
    if (!age) {
      message.info('Please input age')
      return
    }
    if (!gender) {
      message.info('Please choose gender')
      return
    }
    if (!preferences) {
      message.info('Please choose preferences')
      return
    }
    addProfile()
  }

  const handleClaimCancelModal = () => {
    setShowClaimModal(false)
  }

  const handleClaimConfirmModal = async () => {
    const SENDER = selectAccount;
    await web3Enable('AdMeta');
    const injector = await web3FromAddress(SENDER);
    setTipText('Wait will your claim reward are ready...')
    api?.tx.user
      .claimReward(adIndex)
      .signAndSend(SENDER, { signer: injector.signer }, (status) => {
        setShowClaimModal(false)
        setTipText('You will be rewarded')
      });

  }

  const handleAd = () => {
    setShowClaimModal(true)
  }

  const handleOpenPlokadot = async () => {
    if (typeof window !== "undefined") {
      await web3Enable('AdMeta');
      const allAccounts = await web3Accounts() as Wallet[];

      console.log(JSON.stringify(allAccounts))
      setWalletList(allAccounts)
      setConnect(true)
      localStorage.setItem('_account', JSON.stringify(allAccounts))
    }
  }

  const handleselectAccount = (account: string) => {
    setSelectAccount(account)
    localStorage.setItem('_select_account', account)
  }

  const handleProfileAge = (age: string) => {
    setAge(age)
  }

  const handleProfileGender = (gender: number) => {
    setGender(gender)
  }

  const handleProfilePreferences = (preferences: number) => {
    setPreferences(preferences)
  }

  const handleProfileAdDisplay = async (adDisplay: boolean) => {
    const SENDER = selectAccount;
    await web3Enable('AdMeta');
    const injector = await web3FromAddress(SENDER);
    api?.tx.user
      .setAdDisplay(adDisplay)
      .signAndSend(SENDER, { signer: injector.signer }, (status) => {
        setAdDisplay(adDisplay)
      });
  }

  const handleCreateProfile = () => {
    const SENDER = selectAccount;
    setShowAd(false)
    api?.query.user
      .users(SENDER)
      .then((c: any) => {
        console.log(c.value.adDisplay.toString() === 'true')
        setAdSwitchDisplay(c.value.adDisplay.toString() === 'true')
        setShowProfile(true)
      })
  }

  const handleShowProfileAd = async () => {
    setShowProfile(false)
    setTipText('Wait will your customized ads are ready...')
    queryUserAd()
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>AdMeta</title>
        <meta name="description" content="Metaverse advertisement platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Bg />

      <main className={styles.main}>
        <TopBar
          address={selectAccount}
          isConnected={isConnected}
          handleShowConnectModal={handleShowConnectModal}
          handleCreateProfile={handleCreateProfile}
          handleShowProfileAd={handleShowProfileAd}
        />

        <ConnectModal
          isShowModal={isShowConnectModal}
          handleCancelConnectModal={handleCancelConnectModal} 
          handleCancelConnectModalW={handleCancelConnectModalW}
          handleConfirmConnectModal={handleConfirmConnectModal}
          isConnectWallet={isConnected}
          handleOpenPlokadot={handleOpenPlokadot}
          walletList={walletList}
          handleselectAccount={handleselectAccount}
          selectAccount={selectAccount}
        />
        <Tip text={tipText} />
        {
          isShowProfile
            ?
            <SetProfile
              handleSubmitProfile={handleSubmitProfile}
              handleProfileAge={handleProfileAge}
              handleProfileGender={handleProfileGender}
              handleProfilePreferences={handleProfilePreferences}
              handleProfileAdDisplay={handleProfileAdDisplay}
              adSwitchDisplay={adSwitchDisplay}
            />
            :
            null
        }
        {
          isShowAd
            ?
            <Ad handleAd={handleAd} adIpfs={adIpfs} />
            :
            null
        }
        {
          isShowClaimModal
            ?
            <Claim
              isShowModal={isShowClaimModal}
              handleClaimCancelModal={handleClaimCancelModal}
              handleClaimConfirmModal={handleClaimConfirmModal}
              claimAmount={claimAmount}
              rewardAmount={rewardAmount}
            />
            :
            null
        }
      </main>

      <footer className={styles.footer}>
        Powered by AdMeta
      </footer>
    </div>
  )
}


export default Home
