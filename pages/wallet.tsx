import { CardElement, Elements } from '@stripe/react-stripe-js'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { NextSeo } from 'next-seo'
import Router from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import Button from '../src/components/Button'
import Main from '../src/components/layout/Main'
import Spinner from '../src/components/Spinner'
import UserDetails from '../src/components/user/Details'
import SavedCards from '../src/components/user/wallet/SavedCards'
import TransactionHistory from '../src/components/user/wallet/TransactionHistory'
import { useUserContext } from '../src/context/user-info'
import styles from './userpage.module.scss'

// Proof-of-concept memoized Stripe object retrieval
let stripePromise: Promise<Stripe>;
async function getStripeObject(setStripe) {
  if (!stripePromise) {
    const key = await Promise.resolve('pk_fake_key')
    // const key = await (await fetch(STRIPE_DATA_URL)).json()
    stripePromise = loadStripe(key)
    setStripe(stripePromise)
  }
  return stripePromise
}

// This is a proof of concept page, ideally this information will be
// integrated into the user page as a tab or similar
export default function Wallet() {
  const user = useUserContext()
  const [stripe, setStripe] = useState<Stripe>(null)

  // Nothing to show if not logged in, return to home
  useEffect(() => {
    if (!user.info && !user.loading) {
      Router.push('/')
    }
  }, [user])

  let content: ReactElement
  if (user.loading || !user.info) {
    content = <Spinner size={150} />
  } else {
    content =
    <div className={styles.userArea}>
      <UserDetails />
      <SavedCards />
      <TransactionHistory />

      <Button onClick={() => getStripeObject(setStripe)}>Load Stripe</Button>
      <div style={{width: 400}}>
        <Elements stripe={stripe}>
          <CardElement></CardElement>
        </Elements>
      </div>
    </div>
  }

  return (
    <Main>
      <NextSeo title='User wallet' noindex={true} />
      {content}
    </Main>
  )
}
