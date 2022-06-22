import { CheckCircleFilled } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { FC } from "react";

const HandleCompleteInfo: FC = () => {
  const handleSubmit = () => {
    console.log("collected");
  };

  return (
    <div className="rd-handleCompleteInfo">
      <CheckCircleFilled />
      <div style={{ paddingBottom: 200 }}>
        <Typography.Title level={2} style={{ marginBottom: 0 }}>
          Congrats!
          <br />
          You have claimed your profile NFT
        </Typography.Title>
        <Typography.Title level={4} style={{ marginTop: 15 }}>
          Travel Radian DAPPs with your profile NFT
        </Typography.Title>
        <div className="rd-handleCompleteInfo-button-wrapper">
          <Button
            type="primary"
            shape="round"
            size="large"
            style={{
              marginTop: 30,
            }}
            onClick={handleSubmit}
          >
            Get Your RADIAN Pass
          </Button>
          <Button
            type="primary"
            shape="round"
            size="large"
            style={{
              marginTop: 30,
            }}
            onClick={handleSubmit}
          >
            donate for radian
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HandleCompleteInfo;
