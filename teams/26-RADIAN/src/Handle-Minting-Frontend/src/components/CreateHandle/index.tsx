import { Input, InputRef, Tooltip, Typography } from "antd";
import { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import CreateHandleAddOnAfter from "./AddOnAfter.components";
import HandleTooltip from "./HandleTooltip.components";
import "./createHandle.css";
import debounce from "lodash.debounce";
import { IClaimContext } from "../ClaimContext/type";
import { ClaimContext } from "../ClaimContext";
import { getProvider } from "../../controllers/web3/erc/utils";
import ProfileContract from "../../controllers/profile/contract";
import Web3Context from "../../controllers/web3/context";
import { IWeb3Context } from "../../controllers/web3/type";

const CreateHandle: FC = () => {
  const { connect, isRopsten } = useContext<IWeb3Context>(Web3Context);

  const { setHandle, step, setStep } = useContext<IClaimContext>(ClaimContext);
  const inputRef = useRef<InputRef>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [tooltipMsg, setTooltipMsg] = useState<string>("");
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);

  const onConfirm = (val: string) => {
    setHandle(val);
    setStep(step + 1);
  };

  /**
   * @method
   * listen button click
   * this method validate the handle
   * if validation is passed, jump to the next page
   * @param e
   * @returns
   */
  const handleSubmit = async (e: any) => {
    const val = inputRef.current?.input?.value;
    if (!validateHandle(val)) {
      return;
    }

    /**
     * @todo validate uniqueness of the handle
     */
    if (!val) return;

    if (await checkHandleExist(val)) {
      return afterHandleInvalid("This handle is taken already");
    }

    onConfirm(val as string);
  };

  const checkHandleExist = async (handle: string): Promise<boolean> => {
    try {
      await connect();
      await isRopsten();
      const provider = await getProvider();
      const profileContract = new ProfileContract(provider);
      const handleOwner = await profileContract.getAddressByHandle(handle);
      if (handleOwner) return true;

      return false;
    } catch (error) {
      return false;
    }
  };

  /**
   * @method
   * method to validate the handle
   * 1. must be between 5-8 characters
   * 2. must be unique
   *
   * call after hooks for notification
   * @param val
   * @returns
   */
  const validateHandle = async (val?: string): Promise<boolean> => {
    if (!val) {
      return afterHandleNull();
    }
    let length = val.length;
    if (length < 5 || length > 8) {
      return afterHandleInvalid("handle should be between 5-8 characters");
    }
    // validate special character
    if (!new RegExp("^[a-zA-Z0-9_.-]*$").test(val)) {
      return afterHandleInvalid("Can only include 0-9, a-z, - and _");
    }
    return afterHandleValid();
  };

  const afterHandleNull = () => {
    setTooltipVisible(false);
    return false;
  };

  /**
   * @method
   * valid return hooks
   * @returns
   */
  const afterHandleValid = () => {
    setIsValid(true);
    setTooltipVisible(true);
    setTooltipMsg("This username is available");
    return true;
  };

  /**
   * @method
   * invalid return hooks
   * @param msg
   * @returns
   */
  const afterHandleInvalid = (msg: string) => {
    setTooltipMsg(msg);
    setTooltipVisible(true);
    setIsValid(false);
    return false;
  };

  /**
   * @method
   * listen to onChange event
   * this method DO NOT mutate state
   * only validate the input value
   *
   * this method is throttled by debounce
   * @param e
   */
  const handleChange = (e: any) => {
    let val = e.target.value;
    validateHandle(val);
  };

  /**
   * @method
   * debounce for handleChange method
   */
  const handleChangeDebounce = useMemo(() => debounce(handleChange, 300), []);

  return (
    <div
      style={{ width: "max-content", marginLeft: "auto", marginRight: "auto" }}
    >
      <Typography.Title level={1} style={{ textTransform: "uppercase" }}>
        Create Your Profile NFT
      </Typography.Title>
      <Typography.Text strong style={{ marginLeft: 10 }}>
        Handle (within 5-8 characters)
      </Typography.Text>
      <div className="rd-input-root">
        <Tooltip
          title={<HandleTooltip valid={isValid} message={tooltipMsg} />}
          visible={tooltipVisible}
          placement="bottomLeft"
          color="#ffffff"
          overlayInnerStyle={{ padding: 10 }}
        >
          <Input
            ref={inputRef}
            size="large"
            maxLength={8}
            placeholder="RADIAN"
            onChange={handleChangeDebounce}
            addonAfter={
              <CreateHandleAddOnAfter
                onSubmit={handleSubmit}
                disabled={!isValid}
              />
            }
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default CreateHandle;
