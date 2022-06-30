import styles from "./detail.less"
import logo from "@/assets/images/logo.png"
import React, { useState, useEffect } from 'react'
import { useStorage } from "@/hooks/useStorage.ts"
import Stars from "@/components/Stars"
import { Select } from 'antd';
export default function index(props) {
  const { Option } = Select;
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const [infos, setInfos] = useStorage("infos")
  const [info, setInfo] = useState({
    name: '',
    role: '',
    email: '',
    avatar:'',
    about_me: '',
    abilities: ''
  })
  useEffect(()=>{
    setInfos({...infos,...info})
  },[info])
  const nameChange = (event) => {
    const name = event.target.value
    setInfo({ ...info, name })
  }
  const roleChange = (event) => {
    const role = event.target.value
    setInfo({ ...info, role })
  }
  const emailChange = (event) => {
    const email = event.target.value
    setInfo({ ...info, email })
  }
  const avatarChange = (event) =>{
    const avatar = event.target.value
    setInfo({ ...info, avatar })
  }
  const aboutMeChange = (event) => {
    const about_me = event.target.value
    setInfo({ ...info, about_me })
  }
  const abilitiesChange = (event) => {
    const abilities = event.target.value
    setInfo({ ...info, abilities })
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
            <p>Role</p>
            <select name="" id="" value={info.role} onChange={roleChange}>
              <option>coder</option>
              <option>designer</option>
              <option>others</option>
            </select>
          </div>
          <div className={styles.formItem}>
            <p>E-Mail</p>
            <input type="Email" value={info.email} onChange={emailChange} />
          </div>
          <div className={styles.formItem}>
            <p>Avatar</p>
            <input type="url" value={info.avatar} onChange={avatarChange} />
          </div>
          <div className={styles.formItem}>
            <p>About Me</p>
            <textarea style={{ height: '60px' }} name="" id="" placeholder="you can only use 20 words" value={info.about_me} onChange={aboutMeChange}></textarea>
          </div>
          <div className={styles.formItem}>
            <p>Personal Abilities</p>
            <textarea style={{ height: '120px' }} name="" id="" placeholder="you can only use 50 words" value={info.abilities} onChange={abilitiesChange}></textarea>
          </div>
        </div>
      </main>
      <footer>
        <button onClick={() => {
            props.history.push("/field")
        }}>
          submit
        </button>
      </footer>
      <Stars></Stars>
    </>
  )
}
