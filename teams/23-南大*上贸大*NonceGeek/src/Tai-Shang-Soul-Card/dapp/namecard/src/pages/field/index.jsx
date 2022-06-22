import React, { useState ,useEffect} from 'react'
import { useStorage } from "@/hooks/useStorage.ts"
import styles from "./field.less"
import logo from "@/assets/images/logo.png"
import Stars from '@/components/Stars'
export default function index(props) {
    const [infos, setInfos] = useStorage("infos")
    const [field, setField] = useState([])
    const [fields,SetFields] = useState([
        {id:1,content:"3D animation",checked:false},
        {id:2,content:"Metaverse",checked:false},
        {id:3,content:"Web 3.0",checked:false},
        {id:4,content:"Extreme Sport",checked:false},
        {id:5,content:"Web Design",checked:false},
        {id:6,content:"Writing",checked:false},
        {id:7,content:"Video Edict",checked:false},
        {id:8,content:"Technology",checked:false},
        {id:9,content:"Web 3.0",checked:false},
        {id:10,content:"Illustration",checked:false},
    ])
    const changeFiledChecked =(id)=>{
        fields.map(field=>{
            if(field.id==id){
                field.checked = !field.checked
            }
        })
        SetFields([...fields])
    }
    useEffect(()=>{
        const arr = fields.filter(field=>field.checked)
        setField([...arr])
    },[fields])
    useEffect(()=>{
        const f = []
        field.map(field=>{
            f.push(field.content)
        })
        setInfos({...infos,fields:f})
    },[field])
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
          <p className={styles.textBottom}>Recommended fields</p>
        </div>
        <div className={styles.fields}>
            <div className={styles.fieldList}>
                {fields.map(field=>{
                    return (
                        <span 
                        key={field.id} 
                        className={field.checked?styles.spanChecked:null}
                        onClick={()=>changeFiledChecked(field.id)}
                        >
                        {field.content}
                        </span>
                    )
                })}
            </div>
            <div className={styles.fieldInput}>
                <div className={styles.inputText}>Add your interesting fields</div>
                <div className={styles.inputContents}>
                    {field.map(field=>{
                        return (
                            <span 
                            key={field.id} 
                            className={field.checked?styles.spanChecked:null}
                            onClick={()=>changeFiledChecked(field.id)}
                            >
                            {field.content}
                            </span>
                        )
                    })}
                </div>
            </div>
        </div>
      </main>
      <footer>
        <button className={styles.submitButton} onClick={()=>{
            props.history.push("/link")
        }}>
          submit
        </button>
      </footer>
      <Stars></Stars>
        </>
    )
}
