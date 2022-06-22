import { FC } from "react";
import HandleCard from '../PreviewHandle/HandleCard';
import { Col, Row } from "antd";
import HandleCompleteInfo from "./Info";
import './handleComplete.css'


const HandleComplete: FC = () => {
    const GUTTER_LARGE = 45;

    return (
        <>
            <Row
                gutter={[{
                    xs: GUTTER_LARGE,
                    sm: GUTTER_LARGE,
                    md: GUTTER_LARGE,
                    lg: GUTTER_LARGE
                }, {
                    xs: GUTTER_LARGE,
                    sm: GUTTER_LARGE,
                    md: GUTTER_LARGE,
                    lg: GUTTER_LARGE
                }]}
                align='middle'
                justify="center"
            >
                <Col xs={24} sm={24} md={24} lg={12}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <HandleCard />
                    </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12}>
                    <HandleCompleteInfo />
                </Col>
            </Row>
        </>
    )
};

export default HandleComplete;