import { Stripe } from '@stripe/stripe-js'
import { FunctionComponent, useEffect, useState } from 'react'
import { useUserContext } from '../../../context/user-info'
import { TRANSACTIONS_URL } from '../../../env'
import { Transaction } from '../../../types/Payment'
import Spinner from '../../Spinner'
import styles from './TransactionHistory.module.scss'
import TransactionInfo from './TransactionInfo'

async function getTransactions(
  setTransactions,
  sort: string = 'recent',
  limit: number = 30,
  since?: string,
) {
  const url = new URL(TRANSACTIONS_URL)
  url.searchParams.append('sort', sort)
  url.searchParams.append('limit', limit.toString())
  if (since) {
    url.searchParams.append('since', since)
  }

  const res = await fetch(url.href, { credentials: 'include' })
  const data = await res.json()

  // TODO will need to append to existing data
  setTransactions(data)
}

interface Props {
  stripe: Stripe
}

const TransactionHistory: FunctionComponent<Props> = ({stripe}) => {
  const user = useUserContext()

  const [page, setPage] = useState(0)
  const [ transactions, setTransactions ] = useState<Transaction[]>(null)

  // More transactions should be queried when user requests
  useEffect(() => {
    if (user.info) {
      // TODO: Handle page traversal
      getTransactions(setTransactions)
    }
  }, [user, page])

  // Nothing to show if not logged in
  if (!user.info) {
    return <></>
  }

  if (!transactions || !stripe) {
    return <Spinner size={100} text='Loading transaction history...' />
  }

  return (
    <div className='main-container'>
      <table className={styles.transactionList} >
        <thead><tr><td>Creation</td><td>Value</td><td>Status</td></tr></thead>
        <tbody>
        {transactions.length
          ? transactions.map(transaction => <TransactionInfo key={transaction.id} transaction={transaction} stripe={stripe}/>)
          : <tr><td>No transaction history to show.</td></tr>
        }
        </tbody>
      </table>
    </div>
  )
}

export default TransactionHistory
