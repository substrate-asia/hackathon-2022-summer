import { FC, useEffect, useState } from "react";
import styles from './index.module.scss';
import Image from 'next/image'
import { Button } from 'antd'
import { Avatar } from 'antd';
import LogoSVG from './logo-svg'

type Props = {
  address: string;
  isConnected: boolean;
  handleShowConnectModal: () => void;
  handleCreateProfile: () => void
  handleShowProfileAd: () => void
};

const TopBar: FC<Props> = ({ address, isConnected, handleShowConnectModal, handleCreateProfile, handleShowProfileAd }) => {

  const formatAddress = (address: string): string => {
    const str_1 = address.substring(0, 4)
    const str_2 = address.substring(address.length - 4)
    return `${str_1}......${str_2}`
  }

  return (
    <div className={styles.topWrp}>
      <div className={styles.left}>
        <LogoSVG width={64} height={46} />
        <p className={styles.logoLabel}>AdMeta</p>
      </div>
      {
        isConnected
          ?
          <div className={styles.btns}>
            <div className={styles.btnC} onClick={handleCreateProfile}>Profile</div>
            <div className={styles.btnC} onClick={handleShowProfileAd}>AD</div>
            <Button className={styles.right} type="primary" onClick={handleShowConnectModal}>
              <Avatar style={{ border: '2px solid #ffffff' }} size={32} src='https://joeschmoe.io/api/v1/random' />
              <span className={styles.address}>{formatAddress(address)}</span>
            </Button >
          </div>
          :
          <div className={styles.btns}>
            <Button className={styles.right} type="primary" onClick={handleShowConnectModal}>
              <span className={styles.btnLabel}>Connect to Polkadot.js Extension</span>
            </Button >
          </div>

      }
    </div >
  )
}

export default TopBar;