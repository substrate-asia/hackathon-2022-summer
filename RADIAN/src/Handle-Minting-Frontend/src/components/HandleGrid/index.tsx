import { FC, ReactNode, useEffect, useState } from "react";
import HandleGridItem from "./item";
import './handleGrid.css';
import { SupportedProvider } from "../../controllers/baseContract/type";
import { Scrollbars } from 'react-custom-scrollbars';

interface HandleGridProps {
    handles: string[],
    provider: SupportedProvider,
    children: ReactNode,
}

const HandleGrid: FC<HandleGridProps> = ({
    handles,
    provider,
    children
}) => {
    const HANDLE_WIDTH = 300;
    const DEFAULT_PADDING = 30;
    const CONTAINER_PADDING = 10;

    const [containerW, setContainerW] = useState<number>(HANDLE_WIDTH + DEFAULT_PADDING * 2);

    const handleResize = () => {
        let el = document.getElementById('HandlePageRoot');
        if (!el) return;
        let elRect = el?.getBoundingClientRect();
        if (!elRect) return;

        let vw = elRect?.width;
        let cardPerRow = Math.floor((vw - DEFAULT_PADDING * 2) / HANDLE_WIDTH)
        let cw = HANDLE_WIDTH * cardPerRow + (cardPerRow - 1) * DEFAULT_PADDING + CONTAINER_PADDING * 2;
        setContainerW(cw)
    }

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div style={{ width: containerW }}>
            {children}
            <Scrollbars 
                style={{ height: 600 }}
                autoHide={false}
                renderThumbVertical={({style, ...props}) =>
                <div {...props} style={{...style, width: '3px', borderRadius: '4px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.16)', backgroundColor: '#ffffff'}}/>
            }> 
                <div className="handleGrid-root" >
                    {
                        handles?.map((handle) => {
                            return <HandleGridItem
                                key={`handle:${handle}`}
                                handle={handle}
                                provider={provider}
                            />
                        })
                    }
                </div>

            </Scrollbars>

        </div>
    )
};

export default HandleGrid;
