import { FC, useEffect, useState } from "react";
import { SupportedProvider } from "../../controllers/baseContract/type";
import ProfileContract from "../../controllers/profile/contract";
import { getProvider } from "../../controllers/web3/erc/utils";
import HandleCard from "../PreviewHandle/HandleCard";
import HandleCardTemplate from "../PreviewHandle/HandleCard/template";

interface HandleGridItemProps {
    handle: string,
    provider: SupportedProvider,
}

const HandleGridItem: FC<HandleGridItemProps> = ({
    handle,
    provider,
}) => {
    const [ imageHtml, setImageHtml ] = useState<string>();
    const fetchHandleSvg = async (_handle: string) => {
        try {
            const profileContract = new ProfileContract(provider);
            const dataURI = await profileContract.getHandleCard(_handle);

            setImageHtml(dataURI);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (handle) fetchHandleSvg(handle);

    }, [handle])

    return (
        <div >
            { imageHtml && <div style={{width: 300}} dangerouslySetInnerHTML={{__html: imageHtml}} />}
            {/* <HandleCardTemplate handle={handle} passColor='#5829E3' /> */}
        </div>
    )
};

export default HandleGridItem;