import { FC } from "react";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

interface HandleTooltipProps {
    valid: boolean,
    message: string
}

const HandleTooltip : FC<HandleTooltipProps> = ({valid=true, message=''}) => {

    const tooltipTitleStyle = {
        color: '#000000',
        fontWeight: 600,
    } as const;

    const iconCommonStyle = {
        marginRight: 5,
    }

    return (
        <span 
            style={tooltipTitleStyle}> 
                {
                    valid 
                    ? <CheckCircleFilled style={{color: '#79EFAE', ...iconCommonStyle}} />
                    : <CloseCircleFilled style={{color: '#F41001', ...iconCommonStyle}} />
                }
                {message}
            </span>

    )
};

export default HandleTooltip;