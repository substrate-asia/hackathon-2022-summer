import { FC, ReactNode } from "react";

interface ProgressBarBoxProps {
    children: ReactNode,
    disabled?: boolean,
}

const ProgressBarBox: FC<ProgressBarBoxProps> = ({children, disabled}) => {

    return (
        <div 
            className="rd-progressBar-root"
            style={{
                margin: '10px 0',
                backgroundColor: '#2D2D2D',
                maxWidth: '600px',
                width: '90vw',
                borderRadius: 20,
                padding: 25,
                opacity: disabled ? 0.5 : 1,
            }}
        >
            {children}
        </div>
    )
};

export default ProgressBarBox;