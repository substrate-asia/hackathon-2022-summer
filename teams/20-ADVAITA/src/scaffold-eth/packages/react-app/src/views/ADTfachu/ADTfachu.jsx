import React, {useCallback} from 'react';
import { useHistory } from 'react-router-dom';
import styles from './ADTfachu.module.css';
const { ethers } = require("ethers");

export default function ADTfachu({
    purpose,
    address,
    mainnetProvider,
    localProvider,
    yourLocalBalance,
    price,
    tx,
    readContracts,
    writeContracts,
    setADTTokenList
}) {
  const history = useHistory();

  const data = {};

  const [balance, setBalance] = React.useState(0);
  const [remaining, setRemaining] = React.useState(balance);

  if (readContracts && readContracts.TokenReward) {
      readContracts.TokenReward.getContractBalance("0x258fA771b190D44C64471f7401517A4914062C1F").then(result => {
        setBalance(Number(result._hex)/100);
        setRemaining(Number(result._hex)/100);
      })
  }

  function goToADTqianbao() {
    history.push('/ADTqianbao');
  }

  function handleAmountChange() {
    setRemaining(balance - document.getElementById("sendAmountADT").value);
  }

//   const goToADTqianbao = useCallback(() => history.push('/ADTqianbao'), [history]);

  return (
    <div className={`flex-col ${styles['page']}`}>
      <div className={`justify-center ${styles['header']}`}>
        <img onClick={() => goToADTqianbao()}
          src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709254240968674.png"
          className={`${styles['image']}`}
        />
        <span className={`${styles['text']}`}>发出</span>
      </div>
      <div className={`flex-col ${styles['group']}`}>
        <div className={`flex-col items-center`}>
          <span className={`${styles['text_1']}`}>ADT</span>
          <img
            src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709265787895986.png"
            className={`${styles['image_1']}`}
          />
          <span className={`${styles['text_2']}`}>{balance} ADT</span>
        </div>
        <div className={`flex-col ${styles['group_2']}`}>
          <span className={`${styles['text_3']}`}>地址</span>
          <div className={`justify-between ${styles['section_1']}`}>
            <span className={`${styles['text_4']}`}>
                <input id="receiverAddressADT" className={`${styles['text_4']}`} placeholder='Enter Receiver address'/>
            </span>
            <img
              src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709212048672235.png"
              className={`${styles['image_2']}`}
            />
          </div>
        </div>
        <div className={`flex-col ${styles['group_3']}`}>
          <span className={`${styles['text_5']}`}>数量</span>
          <div className={`flex-col items-start ${styles['text-wrapper']}`}>
            <span className={`${styles['text_6']}`}>
                <input id="sendAmountADT" className={`${styles['text_4']}`} placeholder='Amount' onChange={handleAmountChange}/>
            </span>
          </div>
          <span className={`${styles['text_7']}`}>余额：{remaining}</span>
        </div>
        <div className={`flex-col items-center ${styles['button']}`} onClick={
            async () => {
              /* look how you call setPurpose on your contract: */
              /* notice how you pass a call back for tx updates too */
              const result = tx(writeContracts.TokenReward.transferERC20(
                "0x258fA771b190D44C64471f7401517A4914062C1F", // hard coded contracts for now
                ethers.utils.parseUnits(document.getElementById("sendAmountADT").value, 2),
                '_' + Math.random().toString(36).substr(2, 9), // random hash,
                document.getElementById("receiverAddressADT").value
              ), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
              const now = new Date(); // should use onchain time later
              setADTTokenList(oldList => 
                [                 
                    {
                    address: document.getElementById("receiverAddressADT").value,
                    time: now.getDate() + '/' + now.getMonth() + '/' + now.getFullYear() + ' ' + now.getHours() + ':' + now.getMinutes()
                    },
                    ...oldList
                ]);
              goToADTqianbao();
            }}>
          <span className={`${styles['text_8']}`}>发送</span>
        </div>
      </div>
    </div>
  );
}