import { Button, Typography } from "antd";
import React, { FC, useContext } from "react";
import { ClaimContext } from "../ClaimContext";
import { IClaimContext } from "../ClaimContext/type";


interface CreateHandleAddOnAfterProps {
    onSubmit: any,
    disabled: boolean
}

const CreateHandleAddOnAfter : FC<CreateHandleAddOnAfterProps> = ({onSubmit, disabled}) => {
    const { handle } = useContext<IClaimContext>(ClaimContext);
    return (
        <>
            <div className="rd-addon-item">
                <Typography.Text style={{fontWeight: 600}} >.RADI</Typography.Text>
                <Button 
                    onClick={onSubmit}
                    size="large"
                    type="primary"
                    disabled={disabled}
                >
                    Lock & Claim
                </Button>
            </div>
        </>
    )
};

export default CreateHandleAddOnAfter;