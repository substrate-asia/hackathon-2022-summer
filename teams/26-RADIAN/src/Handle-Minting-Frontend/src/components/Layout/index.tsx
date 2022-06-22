import { Layout } from "antd";
import { FC, ReactNode } from "react";
import { useLocation } from "react-router";
import BackBtn from "../BackBtn";
import DefaultNavbar from "../Navbar";

interface DefaultLayoutProps {
    children: ReactNode
}

const DefaultLayout: FC<DefaultLayoutProps> = ({children}) => {

    const location = useLocation()

    return (
        <Layout>
            <Layout.Header>
                <DefaultNavbar />
            </Layout.Header>
            <Layout.Content>
                { location.pathname != '/' && <BackBtn />}
                {children}
            </Layout.Content>
        </Layout>
    )
};

export default DefaultLayout;