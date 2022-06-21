import { FC } from "react";
import styles from './index.module.scss';
import LogoSVG from './logo-svg'

const Bg: FC = () => {
  return (
    <div className={styles.bg}>
      <LogoSVG width={64 * 30} height={46 * 30} />
    </div>
  )
}

export default Bg;