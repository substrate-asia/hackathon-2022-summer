import dynamic from 'next/dynamic'
const Root = dynamic(
  import('./app'),
  {
    ssr: false   //这个要加上,禁止使用 SSR
  }
)

export default Root;