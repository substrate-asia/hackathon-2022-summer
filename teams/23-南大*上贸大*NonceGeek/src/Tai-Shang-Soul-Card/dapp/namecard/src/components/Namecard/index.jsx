import avatar from "@/assets/images/namecard-avatar.png"

export default function index({
  name,
  email,
  addr,
  phone,
}) {
  return (
    <div className={'mt-4 flex flex-col'}>
      <div className="text-rg font-bold">Name Card</div>
      <div className="mt-2 w-full p-px rounded-lg bg-gradient-to-r from-lg-green2-start to-lg-green2-end">
        <div className="w-full h-full rounded-lg bg-namecard p-3 flex flex-col">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm origin-left inline-block scale-50 font-bold">{name}</span>
              <span className="text-sm origin-left inline-block scale-50 font-bold">{email}</span>
              <span className="text-sm origin-left inline-block scale-50 font-bold">{addr}</span>
              <span className="text-sm origin-left inline-block scale-50 font-bold">{phone}</span>
            </div>
            <img className="ml-1 w-12 h-12" src={avatar} alt="" />
          </div>
          <div className="mt-4 flex">
            {
              [1, 2, 3, 4].map((i) => {
                return (
                  <span className="shrink-0 ml-2 rounded-full w-2.5 h-2.5 bg-gray-300" key={i}></span>
                )
              })
            }
          </div>
        </div>
      </div>
  </div>
  )
}
