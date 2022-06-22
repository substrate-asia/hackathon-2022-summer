import "./App.css";
import { useState, useEffect } from "react";
import { Typography } from "antd";
import { config, useSpring, animated } from "react-spring";
import PreMint from "./PreMint";
import PreMintRd2 from "./PreMintRd2";
import axios from "axios";
import { RightOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import { ROUTE_ALL_HANDLE } from "../../../common/route";

const MiddleSection = () => {
  const history = useHistory();
  const [minted, setMinted] = useState<number>(0);
  const [total, setTotal] = useState<number>(1000);

  const { number } = useSpring({
    from: { number: 0 },
    number: minted,
    delay: 200,
    config: config.molasses,
  });

  const getMintedProfile = async () => {
    try {
      const { data } = await axios.get(
        "https://search.dev.radian.community/profile/minted"
      );
      if (data.supply) {
        setMinted(parseInt(data.supply));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const routeToAllProfile = () => {
    history.push(ROUTE_ALL_HANDLE);
  };

  useEffect(() => {
    getMintedProfile();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
      }}
    >
      {minted > 0 && (
        <>
          <Typography.Title level={1} style={{ marginBottom: 0 }}>
            Claim your Profile NFT with Custom Handle
          </Typography.Title>
          <Typography.Title level={4} style={{ marginBottom: 0, marginTop: 0 }}>
            <animated.span>
              {number.to((n) =>
                n.toLocaleString("en", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
              )}
            </animated.span>{" "}
            minted Profile NFT
          </Typography.Title>
          <Typography.Title
            className="rd-purple"
            level={5}
            style={{ cursor: "pointer" }}
            onClick={routeToAllProfile}
          >
            View all profiles
            <RightOutlined />
          </Typography.Title>
          <PreMint minted={minted} total={total} />
          <PreMintRd2 minted={minted} total={total} />
        </>
      )}
    </div>
  );
};

export default MiddleSection;
