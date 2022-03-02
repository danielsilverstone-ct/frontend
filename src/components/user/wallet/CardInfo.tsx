import { FunctionComponent } from "react"
import { PaymentCard } from "../../../types/Payment"
import styles from './CardInfo.module.scss'


interface Props {
  card: PaymentCard
}

const CardInfo: FunctionComponent<Props> = ({ card }) => {
  return (<p className={styles.container}>
    <span className={styles.country}>
      {card.country}
    </span>
    <span className={styles.brand}>
      {card.brand}
    </span>
    <span className={styles.code}>
      {`**** **** **** ${card.last4}`}
    </span>
    <span className={styles.expiry}>
      Expiry: {card.exp_month} / {card.exp_year}
    </span>
  </p>)
}

export default CardInfo
