import { FC, useContext, useEffect } from "react";
import { ClaimContext } from "../../ClaimContext";
import { IClaimContext } from "../../ClaimContext/type";
import HandleCardTemplate from "./template";

const HandleCard: FC = () => {

    const { handle, passColor } = useContext<IClaimContext>(ClaimContext);

    useEffect(() => {
        console.log(handle)
    })

    return (
        <div style={{width: 450}}>
            <HandleCardTemplate handle={`${handle}.RADI`} passColor={passColor} />
        </div>
    )
};

export default HandleCard;