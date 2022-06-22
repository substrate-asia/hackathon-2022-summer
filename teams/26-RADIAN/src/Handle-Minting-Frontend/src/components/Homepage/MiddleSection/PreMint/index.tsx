import { Button, Row, Typography } from "antd";
import { FC } from "react";
import { useHistory } from "react-router";
import { ROUTE_CLAIM } from "../../../../common/route";
import ProgressBarBox from "../ProgressBarBox";
import ProgressBar from "../ProgressBarBox/ProgressBar";

interface PreMintProps {
    minted: number,
    total: number,
}

const PreMint: FC<PreMintProps> = ({minted, total}) => {
    const history = useHistory();

    const routeToMint = () => {
        history.push(ROUTE_CLAIM)
    }


    return (
        <ProgressBarBox>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography.Title level={1} className='gradient-text'>
                    Free Mint
                </Typography.Title>
                <Button type="primary" shape="round" size="large" onClick={routeToMint}>
                    Click to mint
                </Button>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography.Title level={5}>
                    First round of Profile NFT free mint
                </Typography.Title>
                <div style={{color: '#CACACA', fontWeight: 600}}>
                    {minted} / {total}
                </div>
            </div>
            <ProgressBar minted={minted} total={total}/>
        </ProgressBarBox>
    )
};

export default PreMint;