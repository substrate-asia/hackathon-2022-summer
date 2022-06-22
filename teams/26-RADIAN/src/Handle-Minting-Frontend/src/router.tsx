import {
    BrowserRouter,
    Route,
    Switch,
} from 'react-router-dom';
import { Suspense, lazy } from "react";
import { ROUTE_ALL_HANDLE, ROUTE_BASE, ROUTE_CLAIM, ROUTE_MY_HANDLE } from './common/route'
import SuspenseScreen from './components/SuspenseScreen';
import ClaimProvider from './components/ClaimContext';

const ClaimRouter = lazy(() => import('./page/claim'));
const HomePage = lazy(() => import('./page/root'));
const AllHandlePage = lazy(() => import('./page/allHandle'));
const MyHandlePage = lazy(() => import('./page/myHandle'));


export default function Router() {
    return (
        <BrowserRouter basename='/'>
            <Suspense fallback={<SuspenseScreen logoOnly />}>
                <Switch >
                    <Route exact path={ROUTE_BASE}>
                        <HomePage />
                    </Route>
                </Switch>
                <Switch>
                    <Route exact path={ROUTE_CLAIM}>
                        <ClaimProvider>
                            <ClaimRouter />
                        </ClaimProvider>
                    </Route>
                    <Route exact path={ROUTE_ALL_HANDLE} >
                        <AllHandlePage />
                    </Route>
                    <Route exact path={ROUTE_MY_HANDLE} >
                        <MyHandlePage />
                    </Route>
                </Switch>
            </Suspense>
        </BrowserRouter>
    )
}
