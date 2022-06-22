import { FC } from "react";
import { Typography } from "antd";
import HandleListPageSelect, { HandleListPageSelectProps } from "./select";
import './handleListControl.css';

interface HandleListControlProps extends HandleListPageSelectProps {
    disablePagination?: boolean,
}

const HandleListControl: FC<HandleListControlProps> = (props) => {
    const { disablePagination } = props;

    return (
        <div 
            className="HandleListControl-root"
            style={{ 
                padding: '0 5px 30px',
                display: 'flex',
                justifyContent: 'space-between'
            }}
        >
            <Typography.Title>All Profile NFTs</Typography.Title>
            { !disablePagination && <HandleListPageSelect {...props} /> }
        </div>
    )
};

export default HandleListControl;