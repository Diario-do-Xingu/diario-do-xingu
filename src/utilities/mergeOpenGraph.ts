import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Jornal Diário do Xingu',
  // images: [
  //   {
  //     url: `${getServerSideURL()}/website-template-OG.webp`,
  //   },
  // ],
  siteName: 'Diário do Xingu',
  title: 'Diário do Xingu - Portal de Notícias',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
