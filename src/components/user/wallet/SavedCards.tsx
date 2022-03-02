import { FunctionComponent, useEffect, useState } from 'react'
import { useUserContext } from '../../../context/user-info'
import { WALLET_INFO_URL } from '../../../env'
import { PaymentCard } from '../../../types/Payment'
import Spinner from '../../Spinner'
import styles from './SavedCards.module.scss'
import CardInfo from './CardInfo'

async function getCards(setCards) {
  const res = await fetch(WALLET_INFO_URL, { credentials: 'include' })
  const data = await res.json()
  setCards(data.cards)
}

const SavedCards: FunctionComponent = () => {
  const user = useUserContext()
  const [ fetched, setFetched ] = useState(false)
  // User may have no cards saved, so unloaded state is not empty array
  const [ cards, setCards ] = useState<PaymentCard[]>(null)

  // Cards should only be retrieved once, and can only be when logged in
  useEffect(() => {
    if (user.info && !fetched) {
      setFetched(true)
      getCards(setCards)
    }
  }, [user, fetched])

  // Nothing to show if not logged in
  if (!user.info) {
    return <></>
  }

  if (!cards) {
    return <Spinner size={100} text='Loading saved payment methods...'></Spinner>
  }

  return (
    <div className='main-container'>
      <div className={styles.cardList} >
        {cards.length
          ? cards.map(card => <CardInfo key={card.id} card={card} />)
          : <p>No saved payment methods to show.</p>
        }
      </div>
    </div>
  )
}

export default SavedCards
