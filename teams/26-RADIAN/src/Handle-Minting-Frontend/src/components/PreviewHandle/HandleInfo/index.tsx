import { Button, message, Space, Spin, Typography } from "antd";
import { FC, useContext, useEffect, useState } from "react";
import ProfileContract from "../../../controllers/profile/contract";
import Web3Context from "../../../controllers/web3/context";
import { IWeb3Context } from "../../../controllers/web3/type";
import { ClaimContext } from "../../ClaimContext";
import { IClaimContext } from "../../ClaimContext/type";
import HandleColorPicker from "./ColorPicker";
import DonationAmountStepper from "./DonationAmountStepper";
import DonationTooltip from "./DonationTooltip";
import "./handleInfo.css";
import { getProvider } from "../../../controllers/web3/erc/utils";

const HandleInfo: FC = () => {
  const { handle, setStep, passColor } =
    useContext<IClaimContext>(ClaimContext);
  const { connect, isRopsten } = useContext<IWeb3Context>(Web3Context);
  const [donation, setDonation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!handle || handle.length === 0) {
      setStep(0);
    }
  }, [handle, setStep]);

  const handleCancel = () => setStep(0);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await connect();
      await isRopsten();
      const signer = await (await getProvider()).getSigner();
      const profileContract = new ProfileContract(signer);
      // create tx
      const createHandleTx = await profileContract.createProfile(
        handle,
        passColor
      );
      // create handle tx
      message.info(`${createHandleTx.hash} is processing`);
      const receipt = await createHandleTx.wait();
      if (receipt) {
        message.info(`${createHandleTx.hash} is completed`);
        setStep(2);
      }
    } catch (error: any) {
      console.log(error);
      if (error.code === 4001) {
        message.warning("You have rejected the transaction");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="rd-handleInfo-root">
      <Space direction="vertical" size="large" style={{ marginBottom: 30 }}>
        <Typography.Title level={1}>@{handle}.RADI</Typography.Title>
        <Typography.Title level={5}>
          <span style={{ color: "#CACACA" }}>Owner:</span> none
        </Typography.Title>
        <Typography.Title level={5}>
          <span style={{ color: "#CACACA" }}>Expiration Date:</span> Permanent
        </Typography.Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography.Title level={5}>
            <span style={{ color: "#CACACA" }}>Select donation method:</span>
          </Typography.Title>
          <DonationAmountStepper amount={donation} setAmount={setDonation} />
          <DonationTooltip />
        </div>
        <div>
          <HandleColorPicker />
        </div>
      </Space>
      <div className="rd-handleInfo-action">
        <Spin spinning={isLoading}>
          <Button size="large" type="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Spin>
        <Button size="large" type="default" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default HandleInfo;
