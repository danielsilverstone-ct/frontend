import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import ApplicationCollection from '../../../src/components/application/Collection'
import Main from '../../../src/components/layout/Main'
import fetchCollection from '../../../src/fetchers'
import { Appstream } from '../../../src/types/Appstream'
import { Collections } from '../../../src/types/Collection'


export default function EditorChoiceGames({ applications }) {
  return (
    <Main>
      <NextSeo title="Editor's Choice Games" />
      <ApplicationCollection
        title="Editor's Choice Games"
        applications={applications}
      />
    </Main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const applications: Appstream[] = await fetchCollection(
    Collections.editorsGames
  )

  return {
    props: {
      applications,
    },
  }
}
