import { generateStaticParamsFor, importPage } from 'nextra/pages'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

interface PageProps {
  params: Promise<{
    mdxPath: string[]
  }>
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const { default: MDXPage } = await importPage(params.mdxPath)
  return <MDXPage {...props} />
}
