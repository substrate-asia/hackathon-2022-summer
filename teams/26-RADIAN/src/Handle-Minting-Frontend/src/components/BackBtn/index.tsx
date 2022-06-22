import { FC, SyntheticEvent } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";


const BackBtn: FC = () => {
    const SIZE = 30;
    const history = useHistory();

    const goBack = (e: SyntheticEvent) => {
        e.preventDefault();
        history.goBack();
    }


    return (
        <div id='BackBtn' 
            onClick={goBack}
            style={{
                display: 'flex', 
                gap: SIZE / 10, 
                padding: '40px 20px 0 45px',
                cursor: 'pointer',
                width: 'max-content'
            }}
        >
            <LeftOutlined style={{fontSize: SIZE, color: '#777777'}} />
            <span style={{fontSize: SIZE * 2/3, color: '#777777', fontWeight: 600}} >Back</span>
        </div>
    )
};

export default BackBtn;