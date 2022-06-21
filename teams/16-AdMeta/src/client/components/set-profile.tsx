import { FC } from "react";
import styles from './index.module.scss';
import { Input, Switch, Radio, Button } from 'antd'

type Props = {
  handleSubmitProfile: () => void
  handleProfileAge: (age: string) => void
  handleProfileGender: (gender: number) => void
  handleProfilePreferences: (preferences: number) => void
  handleProfileAdDisplay: (adDisplay: boolean) => void
  adSwitchDisplay: boolean
};

const SetProfile: FC<Props> = ({ handleSubmitProfile, handleProfileAge, handleProfileGender, handleProfilePreferences, handleProfileAdDisplay, adSwitchDisplay }) => {
  return (
    <div className={styles.formInfo}>
      <div className={styles.formWrp}>
        <div className={styles.inpuItem}>
          <span className={styles.left}>Age</span>
          <Input
            className={styles.right}
            placeholder="Please enter age"
            onChange={(e) => handleProfileAge(e.target.value)}
          />
        </div>
        <div className={styles.inpuItem}>
          <span className={styles.left}>Gender</span>
          <div className={styles.radioItem}>
            <Radio.Group onChange={(e) => handleProfileGender(e.target.value)}>
              <Radio value={1} style={{ color: '#fff', fontSize: '20px' }}>
                Male
              </Radio>
              <Radio value={2} style={{ color: '#fff', fontSize: '20px' }}>
                Female
              </Radio>
            </Radio.Group>
          </div>
        </div>
        <div className={styles.inpuItem}>
          <span className={styles.left}>Preferences</span>
          <div className={styles.radioItem}>
            <Radio.Group onChange={(e) => handleProfilePreferences(e.target.value)}>
              <Radio value={1} style={{ color: '#fff', fontSize: '20px' }}>
                DeFi
              </Radio>
              <Radio value={2} style={{ color: '#fff', fontSize: '20px' }}>
                GameFi
              </Radio>
              <Radio value={3} style={{ color: '#fff', fontSize: '20px' }}>
                Metaverse
              </Radio>
            </Radio.Group>
          </div>
        </div>
        <div className={styles.inpuItem}>
          <span className={styles.left}>Ad Display</span>
          <Switch defaultChecked={adSwitchDisplay} onChange={e => handleProfileAdDisplay(e)} />
        </div>
        <Button type="primary" style={{ width: '100px' }} shape="round" size="large" onClick={handleSubmitProfile}>Submit
        </Button >
      </div>

    </div>
  )
}

export default SetProfile;