import { FC, useContext, useEffect } from "react";
import "./claim.css";
import InputHandle from "../../components/InputHandle";
import PreviewHandle from "../../components/PreviewHandle";
import { ClaimContext } from "../../components/ClaimContext";
import { IClaimContext } from "../../components/ClaimContext/type";
import HandleComplete from "../../components/HandleComplete";
import DefaultLayout from "../../components/Layout";

const ClaimPage: FC = () => {
  const { step } = useContext<IClaimContext>(ClaimContext);

  return (
    <DefaultLayout>
      <div id="claimPageRoot">
        <div id="claimPageInner">
          {step === 0 && <InputHandle />}
          {step === 1 && <PreviewHandle />}
          {step === 2 && <HandleComplete />}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ClaimPage;
