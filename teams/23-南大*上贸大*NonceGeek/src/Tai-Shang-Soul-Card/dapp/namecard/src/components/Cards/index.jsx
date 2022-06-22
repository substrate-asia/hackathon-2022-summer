import styles from "./cards.less"

export default function index() {
  return (
    <div className={styles.cards}>
    <div className={styles.card}>
      <h6>SoulCard</h6>
      <div className={styles.rounds}>
        <div className={styles.round}></div>
        <div className={styles.round}></div>
        <div className={styles.round}></div>
      </div>
      <div className={styles.line}></div>
    </div>
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.left}>
          <p>Jane Cooper</p>
          <p>mic*******@example.com</p>
          <p>New York·US </p>
          <p>529***704</p>
        </div>
        <div className={styles.right}>
        </div>
      </div>
      <div className={styles.cardBottom}>
        <div className={styles.round}></div>
        <div className={styles.round}></div>
        <div className={styles.round}></div>
        <div className={styles.round}></div>
      </div>
    </div>
    <div className={styles.card}>
    </div>
  </div>
  )
}
