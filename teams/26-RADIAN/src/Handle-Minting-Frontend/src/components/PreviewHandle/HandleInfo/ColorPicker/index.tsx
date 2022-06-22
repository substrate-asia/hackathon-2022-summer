import { Typography } from "antd";
import { FC, useContext } from "react";
import { ClaimContext } from "../../../ClaimContext";
import { IClaimContext } from "../../../ClaimContext/type";
import ColorIcon from "./colorBtn";
import './colorPicker.css';

const HandleColorPicker: FC = () => {

    const COLOR_OPTIONS = [
        '#5829E3',
        '#9400FF',
        '#171717'
    ];
    const { passColor, setPassColor } = useContext<IClaimContext>(ClaimContext);

    const handleSelect = (val: string) => {
        setPassColor(val);
    }

    return (
        <div>
            <Typography.Title level={5}>
                <span style={{color: '#cacaca'}}>Background color:</span>
            </Typography.Title>
            <div style={{display: 'flex', gap: 10, padding: '10px 0 0'}}>
                {COLOR_OPTIONS.map((c) => {
                    return <ColorIcon 
                        key={`colorPicker:${c}`} 
                        value={c} 
                        currentColor={passColor}
                        onClick={handleSelect}
                    />
                })}
            </div>
        </div>
    )
};

export default HandleColorPicker;