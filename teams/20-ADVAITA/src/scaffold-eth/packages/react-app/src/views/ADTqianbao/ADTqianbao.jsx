import React, {useCallback} from 'react';
import { useHistory } from 'react-router-dom';
import styles from './ADTqianbao.module.css';
import ADTjieshou from '../ADTjieshou/ADTjieshou'

// import component 👇
import Drawer from 'react-modern-drawer'

//import styles 👇
import 'react-modern-drawer/dist/index.css'

export default function ADTqianbao({
    purpose,
    address,
    mainnetProvider,
    localProvider,
    yourLocalBalance,
    price,
    tx,
    readContracts,
    writeContracts,
    ADTTokenList
}) {
  const history = useHistory();

//   const data = {
//     ADTTokenList: [null, null],
//   };

  const data = {
    ADTTokenList: ADTTokenList,
  };

  const goBackToMain = useCallback(() => history.push('/exampleui'), [history]);
  const goToADTfachu = useCallback(() => history.push('/ADTfachu'), [history]);

  const [isADTqianbaoOpen, setisADTqianbaoOpen] = React.useState(false)
  const toggleADTqianbaoDrawer = () => {
      setisADTqianbaoOpen((prevState) => !prevState)
  }

  const [balance, setBalance] = React.useState(0);
  if (readContracts && readContracts.TokenReward) {
      readContracts.TokenReward.getContractBalance("0x258fA771b190D44C64471f7401517A4914062C1F").then(result => {
        setBalance(Number(result._hex)/100);
      })
  }

  return (
    <div className={`flex-col ${styles['page']}`}>
      <div className={`justify-center ${styles['header']}`}>
        <img onClick={goBackToMain}
          src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709254240968674.png"
          className={`${styles['image']}`}
        />
        <span className={`${styles['text']}`}>ADT</span>
      </div>
      <div className={`flex-col ${styles['group']}`}>
        <div className={`flex-col items-center`}>
          <img
            src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709265787895986.png"
            className={`${styles['image_1']}`}
          />
          <span className={`${styles['text_1']}`}>{balance} ADT</span>
        </div>
        <div className={`flex-row ${styles['equal-division']}`}>
          <div className={`flex-col items-center ${styles['equal-division-item']}`} onClick={toggleADTqianbaoDrawer}>
            <img
              src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709254266462546.png"
              className={`${styles['image_2']}`}
            />
            <span className={`${styles['text_2']}`}>接收</span>
          </div>
          <div className={`flex-col items-center ${styles['equal-division-item']}`} onClick={goToADTfachu}>
            <img
              src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709254265347254.png"
              className={`${styles['image_2']}`}
            />
            <span className={`${styles['text_2']}`}>发送</span>
          </div>
        </div>
        <div className={`flex-col ${styles['list']}`}>
          {data.ADTTokenList.map((item, i) => (
            <div className={`justify-between ${styles['list-item']}`} key={i}>
              <div className={`flex-row`}>
                <img
                  src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709258439190196.png"
                  className={`${styles['image_5']}`}
                />
                <div className={`flex-col items-start ${styles['group_5']}`}>
                  <span className={`${styles['text_5']}`}>{item.address}</span>
                  <span className={`${styles['text_7']}`}>成功</span>
                </div>
              </div>
              <span className={`${styles['text_9']}`}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      <Drawer
            open={isADTqianbaoOpen}
            onClose={toggleADTqianbaoDrawer}
            direction='bottom'
            className='bla bla bla'
            size='82vh'
        >
            <div>
                <ADTjieshou
                    address={address}
                />
            </div>
        </Drawer>
    </div>
  );
}