import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './ADTjieshou.module.css';
import { Skeleton, Typography } from "antd";

const { Text } = Typography;

export default function ADTjieshou({
    purpose,
    address,
    mainnetProvider,
    localProvider,
    yourLocalBalance,
    price,
    tx,
    readContracts,
    writeContracts,
}) {
  const history = useHistory();

  const data = {};

  return (
    <div className={`flex-col ${styles['page']}`}>
      {/* <div className={`flex-col items-center ${styles['header']}`}>
        <span className={`${styles['text']}`}>ADT</span>
        <div className={`flex-col items-start ${styles['image-wrapper']}`}>
          <img
            src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709254240968674.png"
            className={`${styles['image']}`}
          />
        </div>
      </div> */}
      <div className={`flex-col ${styles['group']}`}>
        {/* <div className={`flex-col items-center ${styles['section_1']}`}>
          <span className={`${styles['text_1']}`}>88.88888888 ADT</span>
          <img
            src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709265787895986.png"
            className={`${styles['image_1']}`}
          />
          <div className={`${styles['section_2']}`}>{}</div>
        </div> */}
        <div className={`flex-col ${styles['section_3']}`}>
          <span className={`${styles['text_2']}`}>接收</span>
          <span className={`${styles['text_3']}`}>ADT</span>
          <img
            src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709267316214031.png"
            className={`${styles['image_2']}`}
          />
          <div className={`flex-col ${styles['group_1']}`}>
            <div className={`flex-col ${styles['text-wrapper']}`}>
              <span id="myInput" className={`${styles['text_4']}`}>{address}</span>
            </div>
            <div className={`flex-col items-center ${styles['button']}`}>
              <Text copyable={{ text: {address}.address }} className={`${styles['text_5']}`}>复制地址</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}