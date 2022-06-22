import styles from "./dao.less"
import logo from "@/assets/images/logo.png"
import React, { useState, useEffect } from 'react'
import { useStorage } from "@/hooks/useStorage.ts"
import Stars from "@/components/Stars"
import { create } from 'ipfs-http-client'
import { rand_msg, create_user } from "@/request/fass.js"
import { ethers } from "ethers";
import Web3 from "web3";
import Web3Modal from "web3modal";
const web3Modal = new Web3Modal({
  cacheProvider: false,
  disableInjectedProvider: false,
});
export default function index(props) {
  const [infos, setInfos] = useStorage("infos")
  const [info, setInfo] = useState({
    name: '',
    mission: '',
    gist_id: '1a301c084577fde54df73ced3139a3cb',
    soulcard_contract_addr: '0x91607e5C9aD97b8AA7C7c6ACC35FA366D074532D',
    soulcard_homepage: 'https://soulcard_dao_home_example.surge.sh/'
  })
  useEffect(()=>{
    setInfos({...infos, ...info})
  },[info])
  const nameChange = (event) => {
    const name = event.target.value
    setInfo({ ...info, name })
  }
  const missionChange = (event) => {
    const mission = event.target.value
    setInfo({ ...info, mission })
  }
  const gistIdChange = (event) => {
    const gist_id = event.target.value
    setInfo({ ...info, gist_id })
  }
  const soulcardContractAddrChange = (event) => {
    const soulcard_contract_addr = event.target.value
    setInfo({ ...info, soulcard_contract_addr })
  }
  const soulcardHomepageChange = (event) => {
    const soulcard_homepage = event.target.value
    setInfo({ ...info, soulcard_homepage })
  }
  const addInfoByIPFS = async (infos) => {
    const info = JSON.stringify(infos)
    const client = create(new URL('https://ipfs.infura.io:5001'))
    const { cid } = await client.add(info)
    return cid
  }
  const randMsg = async () => {
    const res = await rand_msg({ "params": [] })
    return res.data.result
  }
  const createUser = async (data) => {
    const res = await create_user(data)
    return res
  }
  const signByMetamask = async () => {
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const web3 = new Web3(instance)
    const signer = provider.getSigner();
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    const dataToSign = await randMsg()
    const signature = await signer.signMessage(dataToSign)
    return {
      addr: address,
      msg: dataToSign,
      signature
    }
  } 
  const submitInfos = async () => {
    const { _baseCache } = await addInfoByIPFS(infos)
    const hash = _baseCache.get('z')
    const { addr, msg, signature } = await signByMetamask()
    const data = {
      params: [
        {ipfs: hash },
        'dao',
        addr,
        msg,
        signature
      ]
    }
    const res = await createUser(JSON.stringify(data))
    if(res.data.result.status=='ok'){
      props.history.push({
        pathname:'/home',
        query:{
          address:infos.ethereum_addr,
          role:'dao'
        }
      });
    }
  }

  return (
    <>
      <header>
        <div className={styles.logo}>
          <img src={logo} alt="" />
          <h2>SoulCard</h2>
        </div>
      </header>
      <main>
        <div className={styles.text}>
          <p className={styles.textTop}>Goodmorning~</p>
          <p className={styles.textBottom}>Let’s create your basic informationv</p>
        </div>
        <div className={styles.form}>
          <div className={styles.formItem}>
            <p>Name</p>
            <input type="text" value={info.name} onChange={nameChange} />
          </div>
          <div className={styles.formItem}>
            <p>Describe your misson</p>
            <textarea style={{ height: '120px' }} name="" id="" placeholder="you can only use 50 words" value={info.mission} onChange={missionChange}></textarea>
          </div>
          <div className={styles.formItem}>
            <p>Add your template gist id</p>
            <input type="text" value={info.gist_id} onChange={gistIdChange} />
          </div>
          <div className={styles.formItem}>
            <p>Add your SoulCard Contract Address</p>
            <input type="Email" value={info.soulcard_contract_addr} onChange={soulcardContractAddrChange} />
            <button className={styles.button}>Quick Deploy</button>
          </div>
          <div className={styles.formItem}>
            <p>Add your soulcard homepage</p>
            <input type="Email" value={info.soulcard_homepage} onChange={soulcardHomepageChange} />
            <button className={styles.button}>Quick Deploy</button>
          </div>
        </div>
      </main>
      <footer>
        <button onClick={async() => {
          await submitInfos(infos)
        }}>
          Upload to ipfs and submit
        </button>
      </footer>
      <Stars></Stars>
    </>
  )
}
