import { FunctionComponent } from 'react'
import { Transaction } from '../../../types/Payment'
import styles from './TransactionInfo.module.scss'

interface Props {
  transaction: Transaction
}

const TransactionInfo: FunctionComponent<Props> = ({ transaction }) => {
  const clientLocale = new Intl.NumberFormat().resolvedOptions().locale

  return (<tr className={styles.info}>
    <td>{new Date(transaction.created).toISOString()}</td>
    <td>{
      new Intl.NumberFormat(
        clientLocale,
        {style: 'currency', currency: 'USD'}
      ).format(transaction.value)
    }</td>
    <td>{transaction.status}</td>
  </tr>)
}

export default TransactionInfo
