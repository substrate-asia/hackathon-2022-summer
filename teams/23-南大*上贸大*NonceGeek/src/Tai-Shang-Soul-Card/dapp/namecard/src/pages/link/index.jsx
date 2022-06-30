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
  const [infoByAddr, setInfoByAddr] = useStorage(`${infos.ethereum_addr}`)
  const [mirror_link, setMirrorLink] = useState(false)
  const [github_link, setGithubLink] = useState("")
  const [design_link, setDesignLink] = useState("")
  const [twitter,setTwitter] = useState('')
  const [ng,setNg] = useState(false)
  const [offical,setOffical] = useState(false)
  const [speedruns,setSpeedruns] = useState([])
  useEffect(()=>{
    setInfos({...infos,mirror_link,github_link,design_link,twitter,speedruns})
  },[mirror_link,github_link,design_link,twitter,speedruns])

  useEffect(()=>{
    setInfoByAddr(infos)
  },[infos])
  useEffect(()=>{
    const speedruns = []
    if(ng){
      speedruns.push('ng')
    }
    if(offical){
      speedruns.push('offical')
    }
    setSpeedruns(speedruns)
  },[ng,offical])

  const alChange = (event) => {
    const mirror_link = event.target.value
    if(mirror_link == 'true'){
      setMirrorLink(false)
    }else{
      setMirrorLink(true)
    }
  }
  const clChange = (event) => {
    const github_link = event.target.value
    setGithubLink(github_link)
  }
  const dlChange = (event) => {
    const design_link = event.target.value
    setDesignLink(design_link)
  }
  const twChange = (event)=>{
    const twitter = event.target.value
    setTwitter(twitter)
  }
  const ngChange = (event) => {
    const ng = event.target.value
    if(ng == 'true'){
      setNg(false)
    }else{
      setNg(true)
    }
  }
  const ofChange = (event) => {
    const offical = event.target.value
    if(offical == 'true'){
      setOffical(false)
    }else{
      setOffical(true)
    }
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
            <input type="checkbox" value={mirror_link} onChange={alChange}/>
          </div>
          <div className={styles.formItem}>
            <p>Github Link</p>
            <input type="text" value={github_link} onChange={clChange} />
          </div>
          <div className={styles.formItem}>
            <p>Design Link</p>
            <input type="text" value={design_link} onChange={dlChange} />
          </div>
          <div className={styles.formItem}>
            <p>Twitter</p>
            <input type="text" value={twitter} onChange={twChange} />
          </div>
          <div className={styles.formItem}>
            <p>speedruns</p>
            <div className="flex justify-center items-center mb-5">
              <input type="checkbox" id='ng' style={{width:'50px'}} value={ng} onChange={ngChange}/><label htmlFor="ng" style={{width:"100px"}}>ng</label>
            </div>
            <div className="flex justify-center items-center">
              <input type="checkbox" id='offical'style={{width:'50px'}} value={offical} onChange={ofChange}/><label htmlFor="offical" style={{width:"100px"}}>offical</label> 
            </div>
          </div>
        </div>
      </main>
      <footer>
        <button onClick={async() => {
           await submitInfos()
        }}>
          Upload to ipfs and submit
        </button>
      </footer>
      <Stars></Stars>
    </>
  )
}

