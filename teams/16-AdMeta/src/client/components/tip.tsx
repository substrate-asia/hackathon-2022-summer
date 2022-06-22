import { FC } from "react";
import styles from './index.module.scss';

type Props = {
  text: string
};

const Tip: FC<Props> = ({ text }) => {
  return (
    <div className={styles.emptyLabel}>{text}</div>
  )
}

export default Tip;