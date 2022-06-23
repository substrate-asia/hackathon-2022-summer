import { Fragment } from "react";
import { useNavigate } from "react-router";

type CardProps = {
  id: string;
  token: {
    name: string;
    symbol: string;
  };
  asset: {
    id: string;
    name: string;
    symbol: string;
  };
  mints: [
    {
      id: string;
      date: string;
      nftIds: string[];
    }
  ];
  image: string;
  symbolImage: string;
  isManage: boolean;
};

const Card = ({
  id,
  token,
  mints,
  image,
  symbolImage,
  isManage,
}: CardProps) => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <div
        className="flex flex-col transition-all transform hover:-translate-y-1 backface-invisible
                    hover:shadow-2xl rounded-md shadow-xl dark:text-white text-lm-gray-700 dark:bg-gray-800
                    bg-blue-primary bg-opacity-50 border dark:border-gray-700 border-transparent p-3"
        onClick={() => {
          if (isManage) {
            navigate(`/vault/${id}/manage`);
          } else {
            navigate(`/vault/${id}/redeem`);
          }
        }}
      >
        <div
          className="h-0 w-full rounded-md relative overflow-hidden backface-invisible"
          style={{ paddingTop: "100%" }}
        >
          <img
            loading="lazy"
            src={image}
            className="w-full h-full object-cover absolute top-0 backface-invisible"
            alt={token.symbol}
          />
        </div>
        <div className="py-2 flex justify-between items-center">
          <div>
            <h3 className="font-medium text-xl flex items-center mb-1">
              <img
                className="w-6 h-6 mr-2 bg-cover"
                src={symbolImage}
                alt={token.symbol}
              />
              {token.symbol}
            </h3>
            <h4 className="text-sm dark:text-gray-300 text-gray-500">
              {token.name}
            </h4>
          </div>
          <div>
            <div className="mt-2 text-right">
              <dt className="text-gray-400 text-xs">Items</dt>
              <dd className="text-xl">{mints.length}</dd>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Card;
