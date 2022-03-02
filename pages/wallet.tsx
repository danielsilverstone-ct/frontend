import { NextSeo } from 'next-seo'
import Router from 'next/router'
import { ReactElement, useEffect } from 'react'
import Main from '../src/components/layout/Main'
import Spinner from '../src/components/Spinner'
import UserDetails from '../src/components/user/Details'
import SavedCards from '../src/components/user/wallet/SavedCards'
import { useUserContext } from '../src/context/user-info'
import styles from './userpage.module.scss'

// This is a proof of concept page, ideally this information will be
// integrated into the user page as a tab or similar
export default function Wallet() {
  const user = useUserContext()

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
    </div>
  }

  return (
    <Main>
      <NextSeo title='User wallet' noindex={true} />
      {content}
    </Main>
  )
}
