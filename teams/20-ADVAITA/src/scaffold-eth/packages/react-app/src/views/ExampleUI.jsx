import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState, useCallback } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";

import { useHistory } from 'react-router-dom';
import styles from './zhuqianbaojiemian.module.css';
import { useContractReader } from "eth-hooks";
// import component 👇
import Drawer from 'react-modern-drawer'

//import styles 👇
import 'react-modern-drawer/dist/index.css'
// import ADTqianbao from './ADTqianbao/ADTqianbao'

export default function ExampleUI({
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
  const [newPurpose, setNewPurpose] = useState("loading...");
  const history = useHistory();

  const data = {
    tokenList: [
        {
            name: "ART",
            baseUrl: "/ARTqianbao",
            picUrl: "https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709254271371530.png"
        }, 
        {
            name: "ADT",
            baseUrl: "/ADTqianbao",
            picUrl: "https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709254287373162.png"
        }
    ],
    nftList: [
        {
            name: "脉轮 NFT",
            picUrl: "https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709254389900417.png"
        }, 
        {
            name: "宝石",
            picUrl: "https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709254394128119.png"
        }
    ],
  };

  const [isADTqianbaoOpen, setisADTqianbaoOpen] = React.useState(false);
  const toggleADTqianbaoDrawer = () => {
      setisADTqianbaoOpen((prevState) => !prevState)
  };

  function handleClick(baseUrl) {
    history.push(baseUrl);
  }

  return (
    <div className={`flex-col ${styles['page']}`}>
        <div className={`justify-center ${styles['header']}`}>
        <img
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
        {/* <div className={`flex-row ${styles['equal-division']}`}>
            <div className={`flex-col items-center ${styles['equal-division-item']}`}>
            <img
                src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709254266462546.png"
                className={`${styles['image_2']}`}
            />
            <span className={`${styles['text_2']}`}>接收</span>
            </div>
            <div className={`flex-col items-center ${styles['equal-division-item']}`}>
            <img
                src="https://project-user-resource-1256085488.cos.ap-guangzhou.myqcloud.com/617a2ca7e4f1450011362b37/62ac76cac1c22a0011eb9872/16554709254265347254.png"
                className={`${styles['image_2']}`}
            />
            <span className={`${styles['text_2']}`}>发送</span>
            </div>
        </div> */}
        <div className={`flex-col ${styles['group_4']}`}>
            <span className={`${styles['text_5']}`}>钱包账号</span>
            <div className={`flex-col ${styles['list']}`}>
            {data.tokenList.map((item, i) => (
                <div className={`justify-between ${styles['list-item']}`} key={i} onClick={() => handleClick(item.baseUrl)}>
                <div className={`flex-row`}>
                    <img
                    src={item.picUrl}
                    className={`${styles['image_5']}`}
                    />
                    <span className={`${styles['text_6']}`}>{item.name}</span>
                </div>
                <span className={`${styles['text_8']}`}>88.88888888</span>
                </div>
            ))}
            </div>
            <div className={`flex-col ${styles['group_7']}`}>
            <span className={`${styles['text_12']}`}>NFT</span>
            <div className={`flex-col ${styles['list_1']}`}>
                {data.nftList.map((item, i) => (
                <div className={`justify-between ${styles['list-item_1']}`} key={i}>
                    <div className={`flex-row`}>
                    <img
                        src={item.picUrl}
                        className={`${styles['image_8']}`}
                    />
                    <span className={`${styles['text_13']}`}>{item.name}</span>
                    </div>
                    <span className={`${styles['text_15']}`}>3</span>
                </div>
                ))}
            </div>
            </div>
        </div>
        </div>

    </div>
    // <div>
    //   {/*
    //     ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
    //   */}
    //   <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
    //     <h2>Example UI:</h2>
    //     <h4>purpose: {purpose}</h4>
    //     <Divider />
    //     <div style={{ margin: 8 }}>
    //       <Input
    //         onChange={e => {
    //           setNewPurpose(e.target.value);
    //         }}
    //       />
    //       <Button
    //         style={{ marginTop: 8 }}
    //         onClick={async () => {
    //           /* look how you call setPurpose on your contract: */
    //           /* notice how you pass a call back for tx updates too */
    //           const result = tx(writeContracts.YourContract.setPurpose(newPurpose), update => {
    //             console.log("📡 Transaction Update:", update);
    //             if (update && (update.status === "confirmed" || update.status === 1)) {
    //               console.log(" 🍾 Transaction " + update.hash + " finished!");
    //               console.log(
    //                 " ⛽️ " +
    //                   update.gasUsed +
    //                   "/" +
    //                   (update.gasLimit || update.gas) +
    //                   " @ " +
    //                   parseFloat(update.gasPrice) / 1000000000 +
    //                   " gwei",
    //               );
    //             }
    //           });
    //           console.log("awaiting metamask/web3 confirm result...", result);
    //           console.log(await result);
    //         }}
    //       >
    //         Set Purpose!
    //       </Button>
    //       <Button
    //         style={{ marginTop: 8 }}
    //         onClick={async () => {
    //           /* look how you call setPurpose on your contract: */
    //           /* notice how you pass a call back for tx updates too */
    //           const result = tx(writeContracts.TokenReward.transferERC20(
    //             "0x258fA771b190D44C64471f7401517A4914062C1F",
    //             200,
    //             "0x1233",
    //             "0x7d4B33079e2D76425868b02F7cD6CEdd4ac2B6D0"
    //           ), update => {
    //             console.log("📡 Transaction Update:", update);
    //             if (update && (update.status === "confirmed" || update.status === 1)) {
    //               console.log(" 🍾 Transaction " + update.hash + " finished!");
    //               console.log(
    //                 " ⛽️ " +
    //                   update.gasUsed +
    //                   "/" +
    //                   (update.gasLimit || update.gas) +
    //                   " @ " +
    //                   parseFloat(update.gasPrice) / 1000000000 +
    //                   " gwei",
    //               );
    //             }
    //           });
    //           console.log("awaiting metamask/web3 confirm result...", result);
    //           console.log(await result);
    //         }}
    //       >
    //         give money!
    //       </Button>
    //     </div>
    //     <Divider />
    //     Your Address:
    //     <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
    //     <Divider />
    //     ENS Address Example:
    //     <Address
    //       address="0x34aA3F359A9D614239015126635CE7732c18fDF3" /* this will show as austingriffith.eth */
    //       ensProvider={mainnetProvider}
    //       fontSize={16}
    //     />
    //     <Divider />
    //     {/* use utils.formatEther to display a BigNumber: */}
    //     <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
    //     <div>OR</div>
    //     <Balance address={address} provider={localProvider} price={price} />
    //     <Divider />
    //     <div>🐳 Example Whale Balance:</div>
    //     <Balance balance={utils.parseEther("1000")} provider={localProvider} price={price} />
    //     <Divider />
    //     {/* use utils.formatEther to display a BigNumber: */}
    //     <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
    //     <Divider />
    //     Your Contract Address:
    //     <Address
    //       address={readContracts && readContracts.YourContract ? readContracts.YourContract.address : null}
    //       ensProvider={mainnetProvider}
    //       fontSize={16}
    //     />
    //     <Divider />
    //     <div style={{ margin: 8 }}>
    //       <Button
    //         onClick={() => {
    //           /* look how you call setPurpose on your contract: */
    //           tx(writeContracts.YourContract.setPurpose("🍻 Cheers"));
    //         }}
    //       >
    //         Set Purpose to &quot;🍻 Cheers&quot;
    //       </Button>
    //     </div>
    //     <div style={{ margin: 8 }}>
    //       <Button
    //         onClick={() => {
    //           /*
    //           you can also just craft a transaction and send it to the tx() transactor
    //           here we are sending value straight to the contract's address:
    //         */
    //           tx({
    //             to: writeContracts.YourContract.address,
    //             value: utils.parseEther("0.001"),
    //           });
    //           /* this should throw an error about "no fallback nor receive function" until you add it */
    //         }}
    //       >
    //         Send Value
    //       </Button>
    //     </div>
    //     <div style={{ margin: 8 }}>
    //       <Button
    //         onClick={() => {
    //           /* look how we call setPurpose AND send some value along */
    //           tx(
    //             writeContracts.YourContract.setPurpose("💵 Paying for this one!", {
    //               value: utils.parseEther("0.001"),
    //             }),
    //           );
    //           /* this will fail until you make the setPurpose function payable */
    //         }}
    //       >
    //         Set Purpose With Value
    //       </Button>
    //     </div>
    //     <div style={{ margin: 8 }}>
    //       <Button
    //         onClick={() => {
    //           /* you can also just craft a transaction and send it to the tx() transactor */
    //           tx({
    //             to: writeContracts.YourContract.address,
    //             value: utils.parseEther("0.001"),
    //             data: writeContracts.YourContract.interface.encodeFunctionData("setPurpose(string)", [
    //               "🤓 Whoa so 1337!",
    //             ]),
    //           });
    //           /* this should throw an error about "no fallback nor receive function" until you add it */
    //         }}
    //       >
    //         Another Example
    //       </Button>
    //     </div>
    //   </div>

    //   {/*
    //     📑 Maybe display a list of events?
    //       (uncomment the event and emit line in YourContract.sol! )
    //   */}
    //   <Events
    //     contracts={readContracts}
    //     contractName="YourContract"
    //     eventName="SetPurpose"
    //     localProvider={localProvider}
    //     mainnetProvider={mainnetProvider}
    //     startBlock={1}
    //   />

    //   <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 256 }}>
    //     <Card>
    //       Check out all the{" "}
    //       <a
    //         href="https://github.com/austintgriffith/scaffold-eth/tree/master/packages/react-app/src/components"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         📦 components
    //       </a>
    //     </Card>

    //     <Card style={{ marginTop: 32 }}>
    //       <div>
    //         There are tons of generic components included from{" "}
    //         <a href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">
    //           🐜 ant.design
    //         </a>{" "}
    //         too!
    //       </div>

    //       <div style={{ marginTop: 8 }}>
    //         <Button type="primary">Buttons</Button>
    //       </div>

    //       <div style={{ marginTop: 8 }}>
    //         <SyncOutlined spin /> Icons
    //       </div>

    //       <div style={{ marginTop: 8 }}>
    //         Date Pickers?
    //         <div style={{ marginTop: 2 }}>
    //           <DatePicker onChange={() => {}} />
    //         </div>
    //       </div>

    //       <div style={{ marginTop: 32 }}>
    //         <Slider range defaultValue={[20, 50]} onChange={() => {}} />
    //       </div>

    //       <div style={{ marginTop: 32 }}>
    //         <Switch defaultChecked onChange={() => {}} />
    //       </div>

    //       <div style={{ marginTop: 32 }}>
    //         <Progress percent={50} status="active" />
    //       </div>

    //       <div style={{ marginTop: 32 }}>
    //         <Spin />
    //       </div>
    //     </Card>
    //   </div>
    // </div>
  );
}
