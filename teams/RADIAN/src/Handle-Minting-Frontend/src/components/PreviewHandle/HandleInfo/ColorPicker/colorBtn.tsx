import { FC, SyntheticEvent } from "react";

interface ColorIconProps {
    value: string,
    currentColor: string,
    onClick(val: string): void,
}

const ColorIcon: FC<ColorIconProps> = ({value, currentColor, onClick}) => {
    const BTN_SIZE = 25;

    const handleSelect = (e: SyntheticEvent) =>  {
        e.preventDefault();
        onClick(value);
    }

    return (
        <div 
            className="rd-colorPicker-btn"
            onClick={handleSelect}
            style={{
                height: BTN_SIZE,
                width: BTN_SIZE,
                backgroundColor: value,
                cursor: 'pointer',
                border: `${currentColor === value ? '2px' : '0px'} solid #ffffff`,
                borderRadius: '50%',
            }}
        ></div>
    )
};

export default ColorIcon;