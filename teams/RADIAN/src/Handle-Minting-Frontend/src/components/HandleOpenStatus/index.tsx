import { CheckCircleFilled } from "@ant-design/icons";
import { Typography } from "antd";
import { FC } from "react";
import './handleOpenStatus.css';

const HandleOpenStatus : FC = () => {

    return (
        <div style={{width: 'fit-content', marginLeft: 'auto', marginRight: 'auto'}}>
            <Typography.Title level={3}>
                Account opening status
            </Typography.Title>
            <ul className="rd-openStatus">
                <li className="rd-disabled">1-4 digits: Open in sale during NFT Domain Accounts auction</li>
                <li>5-8 digits: Partially open <CheckCircleFilled style={{color: '#79EFAE'}} /></li>
                <li className="rd-disabled">9 digits and above: Will open after mainnet release</li>
            </ul>
            <Typography.Title level={3}>
                Supported Donation Methods
            </Typography.Title>
            <ul className="rd-openStatus">
                <li className="rd-disabled">MATIC</li>
            </ul>
        </div>
    )
};

export default HandleOpenStatus;