import { FC, useEffect, useState } from "react";
import styles from './index.module.scss';
import Image from 'next/image'
import { Modal, Button, Avatar } from 'antd'
import { CloseCircleOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import LogoSVG from './logo-svg'
import type { Wallet } from '../type'

type Props = {
  isShowModal: boolean
  handleCancelConnectModal: () => void
  handleConfirmConnectModal: () => void
  isConnectWallet: boolean
  handleOpenPlokadot: () => void
  walletList: Wallet[]
  handleselectAccount: (account: string) => void
  selectAccount: string
  handleCancelConnectModalW: () => void
};

const ConnectModal: FC<Props> = ({ isShowModal, handleCancelConnectModal, handleConfirmConnectModal, isConnectWallet, handleOpenPlokadot, walletList, handleselectAccount, selectAccount, handleCancelConnectModalW }) => {

  return (
    <Modal
      title="Sign in to view your account balance"
      style={{ top: 20 }}
      visible={isShowModal}
      onCancel={handleCancelConnectModalW}
      footer={null}
      centered
      width={'50%'}
      closeIcon={<CloseCircleOutlined style={{ fontSize: '20px', color: '#fff' }} />}
    >
      <div className={styles.modalContentLogo}>
        <LogoSVG width={1280} height={920} />
      </div>
      {
        !isConnectWallet
          ?
          <div className={styles.modalTextContent}>
            <p className={styles.modalText}>Connect using the Polkadot.js Extension to start using our App. You can do this anytime although most of the functionalities will not be available.</p>
            <Button shape="round" type="primary" onClick={handleOpenPlokadot}>Log in with Polkadot.js</Button>
          </div>
          :
          <div className={styles.selectAccount}>
            <p className={styles.modalText}>Select the account you wish to use in our App. You can change this anytime.</p>
            <div className={styles.accountList}>
              {
                walletList.length
                  ?
                  walletList.map((item, index) => (
                    <div
                      className={styles.accountItem}
                      key={index}
                      onClick={() => handleselectAccount(item.address)}
                    >
                      <div className={styles.left}>
                        <Avatar style={{ border: '2px solid #ffffff' }} size={32} src='https://joeschmoe.io/api/v1/random' />
                        <div className={styles.accountInfo}>
                          <p className={styles.name}>{item.meta.name}</p>
                          <p className={styles.address}>{item.address}</p>
                        </div>
                      </div>
                      <div className={styles.right}>
                        <CheckCircleTwoTone twoToneColor={(selectAccount === item.address) ? '#4390f7' : '#ffffff'} style={{ fontSize: '20px'}} />
                      </div>
                    </div>
                  ))
                  :
                  null
              }
            </div>
            <div className={styles.footerBtns}>
              <Button type="dashed" shape="round" ghost onClick={handleCancelConnectModal}>Cancel</Button>
              <Button shape="round" type="primary" onClick={handleConfirmConnectModal}>Confirm</Button>
            </div>
          </div>
      }
    </Modal>
  )
}

export default ConnectModal;

