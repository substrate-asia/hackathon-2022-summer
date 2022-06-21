import React, {useCallback} from 'react';
import { useHistory } from 'react-router-dom';
import styles from './ARTqianbao.module.css';
import ARTjieshou from '../ARTjieshou/ARTjieshou'

// import component 👇
import Drawer from 'react-modern-drawer'

//import styles 👇
import 'react-modern-drawer/dist/index.css'

export default function ARTqianbao(
    {
        purpose,
        address,
        mainnetProvider,
        localProvider,
        yourLocalBalance,
        price,
        tx,
        readContracts,
        writeContracts,
        ARTTokenList
    }
) {
  const history = useHistory();

//   const data = {
//     ARTTokenList: [null, null],
//   };

  const data = {
    ARTTokenList: ARTTokenList,
  };

  const goBackToMain = useCallback(() => history.push('/exampleui'), [history]);
  const goToARTfachu = useCallback(() => history.push('/ARTfachu'), [history]);

  const [isARTqianbaoOpen, setisARTqianbaoOpen] = React.useState(false)
  const toggleARTqianbaoDrawer = () => {
      setisARTqianbaoOpen((prevState) => !prevState)
  }

  return (
    <div className={`flex-col ${styles['page']}`}>
      <div className={`justify-center ${styles['header']}`}>
        <img onClick={goBackToMain}
          src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709254240968674.png"
          className={`${styles['image']}`}
        />
        <span className={`${styles['text']}`}>ART</span>
      </div>
      <div className={`flex-col ${styles['group']}`}>
        <div className={`flex-col items-center`}>
          <img
            src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709254250119433.png"
            className={`${styles['image_1']}`}
          />
          <span className={`${styles['text_1']}`}>88.88888888 ART</span>
        </div>
        <div className={`flex-row ${styles['equal-division']}`}>
          <div className={`flex-col items-center ${styles['equal-division-item']}`} onClick={toggleARTqianbaoDrawer}>
            <img
              src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709254266462546.png"
              className={`${styles['image_2']}`}
            />
            <span className={`${styles['text_2']}`}>接收</span>
          </div>
          <div className={`flex-col items-center ${styles['equal-division-item']}`}  onClick={goToARTfachu}>
            <img
              src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709254265347254.png"
              className={`${styles['image_2']}`}
            />
            <span className={`${styles['text_2']}`}>发送</span>
          </div>
        </div>
        <div className={`flex-col ${styles['list']}`}>
          {data.ARTTokenList.map((item, i) => (
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
            open={isARTqianbaoOpen}
            onClose={toggleARTqianbaoDrawer}
            direction='bottom'
            className='bla bla bla'
            size='82vh'
        >
            <div>
                <ARTjieshou
                    address={address}
                />
            </div>
        </Drawer>
    </div>
  );
}