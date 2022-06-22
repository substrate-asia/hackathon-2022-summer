export default function index(props) {
  const text = props.text || ''
  return (
    <span className='px-1.5 py-1 rounded-sm bg-gradient-to-r from-lg-green2-start/40 to-lg-green2-end/40 origin-left inline-block scale-2xs'>{ text }</span>
  )
}
