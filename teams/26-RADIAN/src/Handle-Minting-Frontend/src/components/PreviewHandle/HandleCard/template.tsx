import { FC } from "react";

interface HandleCardTemplateProps {
    handle: string,
    passColor: string
}

const HandleCardTemplate: FC<HandleCardTemplateProps> = ({
    handle,
    passColor
}) => {

    return (
        <svg width="100%" height="100%" viewBox="0 0 416 449" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="416" height="449" rx="15" fill={passColor} />
            <image href="https://radian-static-content-cdn.s3.ap-east-1.amazonaws.com/misc/handleTplPlain.svg" />
            <text x='50%' y='241.527' textAnchor="middle" dominantBaseline='central' fill="white" xmlSpace="preserve" style={{ whiteSpace: 'pre' }} font-family="Raleway" font-size="30" font-weight="bold" letterSpacing="0em">@{handle}</text>
        </svg>
    )
};

export default HandleCardTemplate;