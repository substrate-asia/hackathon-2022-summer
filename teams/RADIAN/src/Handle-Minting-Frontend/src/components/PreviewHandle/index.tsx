import { FC, useEffect } from "react";
import HandleCard from './HandleCard';
import { Col, Row } from "antd";
import HandleInfo from "./HandleInfo";

const PreviewHandle: FC = () => {

    
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
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <HandleCard />
                    </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12}>
                    <HandleInfo />
                </Col>
            </Row>
        </>
    )
}

export default PreviewHandle;