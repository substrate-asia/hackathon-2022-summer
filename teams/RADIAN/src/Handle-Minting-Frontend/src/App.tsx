import Router from './router';
import 'antd/dist/antd.less';
import './index.css';
import Web3Context from './controllers/web3/context';
import Web3Provider from './controllers/web3/provider';

function App() {
  return (
    <div className="App">
      <Web3Provider>
        <Router />
      </Web3Provider>
    </div>
  );
}

export default App;
