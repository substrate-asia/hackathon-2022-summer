export default function index(props) {
  if (props.type === 'article') {
    return (
      <div className="mt-2 flex items-start">
        {
          props.paras.map((para, index) => <div className="grow mr-11" key={index}>{para} {index + 1 === props.paras.length && <span className='ml-1 text-gray-500'>More</span>}</div>)
        }
        <img className='w-thumb-sm' src={props.image} alt="thumb-small" />
      </div>
    )
  }
  else if (props.type === 'design') {
    return (
      <div className="mt-2 flex items-start">
        <img className='w-full' src={props.image} alt="design-banner" />
      </div>
    )
  }
  else if (props.type === 'code') {
    return (
      <div className="mt-2 flex flex-col items-start">
        {
          props.paras.map((para, index) => <div className="grow mb-2" key={index}>{para} {index + 1 === props.paras.length && <span className='ml-1 text-gray-500'>More</span>}</div>)
        }
        <img className='w-full' src={props.image} alt="code-screen" />
      </div>
    )
  }
}
