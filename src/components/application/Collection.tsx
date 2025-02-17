import { FunctionComponent } from 'react'
import { useRouter } from 'next/router'

import { Appstream } from '../../types/Appstream'

import ApplicationCard from './ApplicationCard'
import Main from '../layout/Main'
import Pagination from '../Pagination'
import styles from './Collection.module.scss'

interface Props {
  applications: Appstream[]
  perPage?: number
  title: string
}

const ApplicationCollection: FunctionComponent<Props> = ({
  applications,
  title,
  perPage = 30,
}) => {
  const router = useRouter()
  const page = parseInt((router.query.page ?? '1') as string)
  const totalPages = Math.ceil(applications.length / perPage)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const pagedApplications = applications.slice(
    (page - 1) * perPage,
    page * perPage
  )

  return (
    <div className='main-container'>
      <div className={styles.collectionWrapper}>
        <section className={styles.applicationsCollection}>
          <div className={styles.collection}>
            <h2>{title}</h2>
            <p>{applications.length} results</p>

            <div className={styles.applications}>
              {pagedApplications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>

            <Pagination pages={pages} currentPage={page} />
          </div>
        </section>
      </div>
    </div>
  )
}

export default ApplicationCollection
