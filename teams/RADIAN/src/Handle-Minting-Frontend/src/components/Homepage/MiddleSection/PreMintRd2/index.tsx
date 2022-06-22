import { Button, Row, Typography } from "antd";
import { FC } from "react";
import { config, useSpring, animated } from "react-spring";
import ProgressBarBox from "../ProgressBarBox";
import ProgressBar from "../ProgressBarBox/ProgressBar";

interface PreMintRd2Props {
    minted: number,
    total: number,
}

const PreMintRd2: FC<PreMintRd2Props> = ({minted, total}) => {

    const { number } = useSpring({
        from: { number: 0},
        number: minted,
        delay: 0,
        config: config.molasses,
    })

    return (
        <ProgressBarBox disabled>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography.Title level={1} className='gradient-text'>
                    Pre-mint 2
                </Typography.Title>
                <Button type="primary" shape="round" size="large" disabled>
                    Coming Soon
                </Button>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography.Title level={5}>
                    Secound round of profile NFT presale
                </Typography.Title>
                <div style={{color: '#CACACA', fontWeight: 600}}>
                    To be announced
                </div>
                {/* <ProgressBar minted={minted} total={total} /> */}
            </div>
        </ProgressBarBox>
    )
};

export default PreMintRd2;