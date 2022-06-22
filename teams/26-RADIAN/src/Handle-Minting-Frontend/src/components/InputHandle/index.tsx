import { FC } from "react";
import { Col, Row } from "antd";
import CreateHandle from "../CreateHandle";
import HandleOpenStatus from "../HandleOpenStatus";

const InputHandle: FC = (props) => {
    const GUTTER_LARGE = 45;

    return (
        <>
            <Row gutter={[{
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
            >
                <Col xs={24} sm={24} md={24} lg={12}>
                    <CreateHandle {...props} />
                </Col>
                <Col xs={24} sm={24} md={24} lg={12}>
                    <HandleOpenStatus />
                </Col>
            </Row>

        </>
    )
};

export default InputHandle