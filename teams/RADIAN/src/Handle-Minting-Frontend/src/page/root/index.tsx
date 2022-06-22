import { FC } from "react"
import SolarSystem from "../../components/SolarSystem/SolarSystem";
import MiddleSection from "../../components/Homepage/MiddleSection";
import DefaultLayout from "../../components/Layout";


const HomePage: FC = () => {

    return (
        <DefaultLayout>
            <SolarSystem />
            <MiddleSection />
        </DefaultLayout>
    )
}


export default HomePage