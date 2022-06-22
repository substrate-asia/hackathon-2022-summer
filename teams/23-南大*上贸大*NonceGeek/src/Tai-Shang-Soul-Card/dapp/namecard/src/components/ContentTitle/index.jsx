import TipText from '@/components/TipText'

export default function index(props) {
  const classes = `${props.classes} mt-4 flex items-center`
  const title = props.title || ''
  const time = props.time || ''
  return (
    <div className={ classes }>
      <span className='text-lg font-bold'>{ title }</span>
      <TipText classes={ 'ml-5' } text={ time } />
    </div>
  )
}
