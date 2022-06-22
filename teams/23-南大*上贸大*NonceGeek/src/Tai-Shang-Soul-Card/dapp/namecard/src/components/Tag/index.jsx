export default function index(props) {
  const text = props.text || ''
  return (
    <span className='mr-2 mb-2 py-1 px-1.5 border border-solid border-white rounded-lg text-sm'>{ text }</span>
  )
}
