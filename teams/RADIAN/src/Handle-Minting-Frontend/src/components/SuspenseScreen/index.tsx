import { FC } from "react";
import SplashScreen from "../SplashScreen/SplashScreen";

interface PageProps {
    logoOnly?: boolean
}

const SuspenseScreen : FC<PageProps> = ({logoOnly=false}) => {

    return (
        <div className="rd-flexbox rd-flexbox-vertical-center">
            <div className="rd-flexbox rd-flexbox-vertical" >
                <div className="rd-splash-root">
                    <div className="rd-splash-inner">
                        <SplashScreen />
                    </div>
                    <div className="rd-bkgd-circle-group rd-bkgd-circle-group-1">
                        <div className="rd-bkgd-circle rd-bkgd-circle-4 rd-bkgd-circle-orange-1"></div>
                        <div className="rd-bkgd-circle rd-bkgd-circle-5 rd-bkgd-circle-purple-2"></div>
                    </div>

                    <div className="rd-bkgd-circle-group rd-bkgd-circle-group-2">
                        <div className="rd-bkgd-circle rd-bkgd-circle-1 rd-bkgd-circle-blue-1"></div>
                        <div className="rd-bkgd-circle rd-bkgd-circle-2 rd-bkgd-circle-purple-2"></div>
                        <div className="rd-bkgd-circle rd-bkgd-circle-3 rd-bkgd-circle-orange-1"></div>
                    </div>

                    <div className="rd-bkgd-circle-group rd-bkgd-circle-group-3">
                        <div className="rd-bkgd-circle rd-bkgd-circle-1 rd-bkgd-circle-purple-1"></div>
                        <div className="rd-bkgd-circle rd-bkgd-circle-2 rd-bkgd-circle-orange-1"></div>
                        <div className="rd-bkgd-circle rd-bkgd-circle-3 rd-bkgd-circle-blue-1"></div>
                    </div>

                </div>
            </div>
        </div>
    )
};

export default SuspenseScreen;