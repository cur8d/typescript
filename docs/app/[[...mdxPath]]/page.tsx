import { importPage } from 'nextra/pages'

export async function generateStaticParams() {
  const { entries } = await importPage()
  return Object.keys(entries).map(mdxPath => ({
    mdxPath: mdxPath.split('/')
  }))
}

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
