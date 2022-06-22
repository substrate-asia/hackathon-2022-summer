import React, { lazy } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { ResetCSS } from '@my/ui';
import BigNumber from 'bignumber.js';
// import { usePollBlockNumber } from 'state/block/hooks';
// import { useFetchProfile } from 'state/profile/hooks';
import GlobalStyle from './style/Global';
import SuspenseWithChunkError from './components/SuspenseWithChunkError';
import { ToastListener } from './contexts/ToastsContext';
import history from './routerHistory';
import { PriceProvider } from './contexts/PriceProvider';
import SideMenu from './components/SideMenu';
import { usePollCoreFarmData } from 'state/farms/hooks';
// import { usePollVaultData } from 'state/vault/hooks';
import { usePollBlockNumber } from 'state/block/hooks';
import PageLoader from 'components/Loader/PageLoader';
import useEagerConnect from 'hooks/useEagerConnect';
import { usePollVaultData } from 'state/vault/hooks';
// import { useFetchProfile } from 'state/profile/hooks';
// import { usePollCoreFarmData } from './state/farms/hooks';

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Vault = lazy(() => import('./views/Vault/index'));
const Zap = lazy(() => import('./views/Zap/index'));

const Home = lazy(() => import('./views/Home'));
const Farms = lazy(() => import('./views/Farms'));
const Governance = lazy(() => import('./views/Governance'));
const Ido = lazy(() => import('./views/Ido'));

// const Stake = lazy(() => import('./views/Stake/Stake'));
// const UnStake = lazy(() => import('./views/Stake/Unstake'));
// const Unbind = lazy(() => import('./views/Stake/Unbind'));
// const Swap = lazy(() => import('./views/Swap'));
const NotFound = lazy(() => import('./views/NotFound'));

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const App: React.FC = () => {
  usePollBlockNumber();
  useEagerConnect();
  // useFetchProfile();
  usePollCoreFarmData();
  usePollVaultData();
  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <PriceProvider />
      <SideMenu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/ido">
              <Ido />
            </Route>
            <Route path="/vault">
              <Vault />
            </Route>
            <Route path="/zap">
              <Zap />
            </Route>
            <Route path="/farms">
              <Farms />
            </Route>
            <Route path="/governance">
              <Governance />
            </Route>

            {/*             
            <Route path="/stake">
              <Stake />
            </Route>
            <Route path="/unbind">
              <Unbind />
            </Route>
            <Route path="/unstake">
              <UnStake />
            </Route>
         
            <Route path="/swap" component={Swap} /> */}

            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </SideMenu>
      <ToastListener />
    </Router>
  );
};

export default React.memo(App);
