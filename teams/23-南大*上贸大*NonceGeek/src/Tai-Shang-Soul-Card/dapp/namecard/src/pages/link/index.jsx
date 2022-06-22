import styles from "./link.less"
import logo from "@/assets/images/logo.png"
import React, { useState,useEffect } from 'react'
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
  const [mirrorLink, setMirrorLink] = useState('')
  const [githubLink, setGithubLink] = useState("")
  const [designLink, setDesignLink] = useState("")
  useEffect(()=>{
    setInfos({...infos,mirrorLink,githubLink,designLink})
  },[mirrorLink,githubLink,designLink])
  const alChange = (event) => {
    const mirrorLink = event.target.value
    if(mirrorLink == 'true'){
      setMirrorLink(false)
    }else{
      setMirrorLink(true)
    }
  }
  const clChange = (event) => {
    const githubLink = event.target.value
    setGithubLink(githubLink)
  }
  const dlChange = (event) => {
    const designLink = event.target.value
    setDesignLink(designLink)
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
        'user',
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
          role:'user'
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
          <p className={styles.textBottom}>Add more details to feed your soul</p>
        </div>
        <div className={styles.form}>
          <div className={styles.formItem}>
            <p>Mirror Link</p>
            <input type="checkbox" value={mirrorLink} onChange={alChange}/>
          </div>
          <div className={styles.formItem}>
            <p>Github Link</p>
            <input type="text" value={githubLink} onChange={clChange} />
          </div>
          <div className={styles.formItem}>
            <p>Design Link</p>
            <input type="text" value={designLink} onChange={dlChange} />
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

