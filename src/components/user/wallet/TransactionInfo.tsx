import { Elements } from '@stripe/react-stripe-js'
import { Stripe } from '@stripe/stripe-js'
import { FunctionComponent, useEffect, useState } from 'react'
import { TRANSACTION_INFO_URL, TRANSACTION_STRIPE_INFO_URL } from '../../../env'
import { Transaction } from '../../../types/Payment'
import PaymentForm from './PaymentForm'
import styles from './TransactionInfo.module.scss'

interface Props {
  transaction: Transaction
  stripe: Stripe
}

async function getTransactionData(txn: string) {
  const txndata = await (await fetch(TRANSACTION_INFO_URL(txn), { credentials: 'include' })).json()
  let stripedata = {client_secret: null}
  if (txndata.summary.status == "new"  || txndata.summary.status == "retry") {
    stripedata = await (await fetch(TRANSACTION_STRIPE_INFO_URL(txn), { credentials: 'include' })).json()
  }
  return { txn: txndata, client_secret: stripedata.client_secret }
}

const TransactionInfo: FunctionComponent<Props> = ({ transaction, stripe }) => {
  const clientLocale = new Intl.NumberFormat().resolvedOptions().locale

  const [txndata, setTxnData] = useState(null)

  // If we don't have the transaction data, fetch it
  useEffect(() => {
    let alive = true;
    if (txndata === null) {
      getTransactionData(transaction.id).then( data => {
        if (alive) {
          setTxnData(data)

        }
      })
    }

    return () => { alive = false }
  }, [transaction, stripe, txndata])

  if (txndata === null) {
    return <></>
  }

  if (transaction.status != "new"  && transaction.status != "retry") {
    return (<tr className={styles.info}>
      <td>{new Date(transaction.created).toISOString()}</td>
      <td>{
        new Intl.NumberFormat(
          clientLocale,
          {style: 'currency', currency: transaction.currency}
        ).format(transaction.value / 100)
      }</td>
      <td>{transaction.status}</td>
    </tr>)
  }

  const options = {clientSecret: txndata.client_secret};

  return (<tr className={styles.info}>
    <td>{new Date(transaction.created).toISOString()}</td>
    <td>{
      new Intl.NumberFormat(
        clientLocale,
        {style: 'currency', currency: transaction.currency}
      ).format(transaction.value / 100)
    }</td>
    <td>
      <Elements stripe={stripe} options={options}>
        Payment method:
        <PaymentForm transaction={transaction.id}/>
      </Elements>
    </td>
  </tr>)


}

export default TransactionInfo
