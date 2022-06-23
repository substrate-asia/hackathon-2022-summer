import { Fragment } from "react";
import logo from "@/assets/footer-logo.svg";
import { useNavigate } from "react-router";

const Footer = () => {
  const navigator = useNavigate();
  const nav = [
    {
      name: "Shop",
      uri: "/",
    },
    {
      name: "Fractionalize",
      uri: "/",
    },
    {
      name: "Auction",
      uri: "/",
    },
    {
      name: "Explore pools",
      uri: "/pool/explore",
    },
    {
      name: "Swap",
      uri: "/swap",
    },
    {
      name: "Activity",
      uri: "/",
    },
  ];

  return (
    <Fragment>
      <div className="flex justify-between items-center bg-blue-primary h-16 overflow-hidden px-10 fixed bottom-0 w-full">
        <div>
          <img src={logo} alt="" className="h-16 w-64" />
        </div>
        <div className="text-purple-second flex gap-x-4">
          {nav.map(({ name, uri }) => {
            return (
              <div
                className="cursor-pointer hover:text-purple-primary"
                onClick={() => navigator(uri)}
                key={name}
              >
                {name}
              </div>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
};

export default Footer;
