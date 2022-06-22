export default function index(props) {
  const classes = `${props.classes} text-sm origin-left inline-block scale-xs text-gray-500`
  const text = props.text || ''
  return (
    <span className={ classes }>{ text }</span>
  )
}
