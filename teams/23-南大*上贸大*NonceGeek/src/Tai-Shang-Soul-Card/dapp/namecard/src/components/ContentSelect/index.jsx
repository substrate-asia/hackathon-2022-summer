import arrowDown from "@/assets/images/arrowDown.png"

export default function index(props) {
  const text = props.text || ''
  return (
    <div className='flex items-center'>
      <span className='text-sm'>{ text }</span>
      <img className='ml-1 w-icon-xs' src={ arrowDown } alt="select" />
    </div>
  )
}
