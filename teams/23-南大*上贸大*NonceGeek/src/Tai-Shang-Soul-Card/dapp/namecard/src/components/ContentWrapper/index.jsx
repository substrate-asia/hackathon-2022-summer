import ContentSelect from '@/components/ContentSelect'
import ContentTitle from '@/components/ContentTitle'
import ContentDetail from '@/components/ContentDetail'
import FieldSelect from '@/components/FieldSelect'
import TipText from '@/components/TipText'

export default function index({
  type,
  title,
  time,
  paras,
  image,
  fields,
}) {
  return (
    <div className={'mt-12 flex flex-col'}>
      <ContentSelect text={type} />
      <ContentTitle
        classes={'mt-4'}
        title={title}
        time={time}
      />
      <ContentDetail
        type={type}
        paras={paras}
        image={image}
      />
      <div className="mt-4">
        {
          fields.map((field) => <FieldSelect key={field} text={field} />)
        }
        <TipText
          classes={'ml-2'}
          text={'Select for new field'}
        />
      </div>
  </div>
  )
}
