import { Button } from "antd";
import { FC } from "react";
import { useHistory } from "react-router";
import { CDN_ROOT } from "../../common/config";
import {
  ROUTE_ALL_HANDLE,
  ROUTE_BASE,
  ROUTE_CLAIM,
  ROUTE_MY_HANDLE,
} from "../../common/route";
import "./navbar.css";

const DefaultNavbar: FC = () => {
  const history = useHistory();
  const MENU_OPTIONS = [
    { label: "Home", route: ROUTE_BASE },
    { label: "Claim Profile NFT", route: ROUTE_CLAIM },
    { label: "All Profile NFT", route: ROUTE_ALL_HANDLE },
  ];

  const handleMenuClick = (route: string) => history.push(route);

  return (
    <div id="navbar">
      <a onClick={(e) => handleMenuClick(ROUTE_BASE)}>
        <img
          id="logo"
          src={`${CDN_ROOT}/logo/logo_black.png`}
          alt="radian logo"
        />
      </a>
      <div id="menu">
        {MENU_OPTIONS.map((o) => (
          <span
            key={`navbar:${o.route}`}
            className={`rd-menuItem ${
              history.location.pathname === o.route ? "active" : ""
            }`}
            onClick={(e) => handleMenuClick(o.route)}
          >
            {o.label}
          </span>
        ))}
        <Button
          className="rd-menuItem"
          type="primary"
          shape="round"
          onClick={(e) => handleMenuClick(ROUTE_MY_HANDLE)}
        >
          My Profile NFT
        </Button>
      </div>
    </div>
  );
};

export default DefaultNavbar;
