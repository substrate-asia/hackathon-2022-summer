import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { FC } from "react";


const DonationTooltip: FC = () => {

    return (
        <Tooltip 
            title={
                <>
                    <div style={{fontWeight: 600, marginBottom: 10}}>What is Donation?</div>
                    <div>Donation is donation</div>
                </>
            } 
            overlayInnerStyle={{
                backgroundColor: '#272727',
                borderRadius: 5,
                padding: 20,
            }}
        >
            <QuestionCircleOutlined style={{fontSize: 20}} />
        </Tooltip>
    )
};

export default DonationTooltip;