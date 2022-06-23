import { Fragment } from "react";

const VaultCard = ({ number, image, name, callback, selectList }: any) => {
  let isSelect = false;
  selectList.forEach((item: any) => {
    if (item.number === number) {
      isSelect = true;
      return;
    }
  });

  return (
    <Fragment>
      <div
        className="group relative"
        onClick={() =>
          callback({ number: number, imageUrl: image, name: name })
        }
      >
        <div
          className={`p-3 cursor-pointer opacity-100 break-words min-h-full rounded-lg
          text-purple-second border  transition-colors duration-300 ease-in-out border-transparent bg-blue-primary
          bg-opacity-50 bg-lm-gray-100 hover:bg-purple-primary  hover:border-purple-primary flex flex-col
          ${isSelect ? "bg-purple-primary" : ""}`}
        >
          <header className="flex">
            <h3 className="text-xs mb-2 pr-1">#{number} </h3>
            <h4 className="ml-auto font-medium text-xs overflow-hidden overflow-ellipsis whitespace-nowrap">
              {""}
            </h4>
          </header>
          <div className="flex flex-1">
            <div className="w-0 h-0 relative pt-full"></div>
            <div className="flex-grow flex justify-center items-center rounded-md overflow-hidden ">
              <img
                loading="lazy"
                src={image}
                className="rounded-md w-full"
                alt="null 8331"
              />
            </div>
          </div>
        </div>
        {/*<a*/}
        {/*  className="transition-all duration-300 sm:opacity-0 absolute bottom-2 right-2 sm:group-hover:opacity-100 */}
        {/*    rounded-md dark:bg-black bg-lm-gray-700  border border-black p-0.5 hover:border-white text-gray-50 cursor-pointer"*/}
        {/*  href="/vault/0x269616d549d7e8eaa82dfb17028d0b212d11232a/8331/"*/}
        {/*>*/}
        {/*  <img src={exclamation} alt="" className="h-8 w-8" />*/}
        {/*</a>*/}
      </div>
    </Fragment>
  );
};

export default VaultCard;
