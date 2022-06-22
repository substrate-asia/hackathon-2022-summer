import resume from "@/assets/images/resume.png"
import dot from "@/assets/images/round.png"

export default function index({
  name,
  email,
  addr,
  phone,
}) {
  return (
    <div className={'mt-10 flex flex-col'}>
      <div className="text-rg">Resume</div>
      <div className="mt-2 w-full p-px rounded-lg bg-gradient-to-r from-lg-green2-start to-lg-green2-end">
        <div className="w-full h-full rounded-lg bg-namecard px-2 py-4 flex flex-col">
          <div className="text-lg text-center font-bold">Resume</div>
          <div className="flex justify-between items-center">
            <div className="w-1/2 flex flex-col">
              <span className="text-sm origin-left inline-block scale-xxxs font-bold">{name}</span>
              <span className="text-sm origin-left inline-block scale-xxxs font-bold">{email}</span>
              <span className="text-sm origin-left inline-block scale-xxxs font-bold">{addr}</span>
              <span className="text-sm origin-left inline-block scale-xxxs font-bold">{phone}</span>
            </div>
            <img className="w-1/2" src={resume} alt="" />
          </div>
          <div className="mt-4 flex flex-col">
            <img className="w-2.5 z-10" src={dot} alt="" />
            <div className="shrink-0 ml-1 -my-1 h-12 border border-r-0 border-t-0 border-b-0 border-solid border-lg-green2-start"></div>
            <img className="w-2.5 z-10" src={dot} alt="" />
            <div className="shrink-0 ml-1 -my-1 h-12 border border-r-0 border-t-0 border-b-0 border-solid border-lg-green2-start"></div>
            <img className="w-2.5 z-10" src={dot} alt="" />
            <div className="shrink-0 ml-1 -my-1 h-12 border border-r-0 border-t-0 border-b-0 border-solid border-lg-green2-start"></div>
            <img className="w-2.5 z-10" src={dot} alt="" />
            <div className="shrink-0 ml-1 -my-1 h-12 border border-r-0 border-t-0 border-b-0 border-solid border-lg-green2-start"></div>
            <img className="w-2.5 z-10" src={dot} alt="" />
          </div>
        </div>
      </div>
  </div>
  )
}
