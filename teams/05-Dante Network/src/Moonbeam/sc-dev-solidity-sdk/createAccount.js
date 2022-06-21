const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:6789');

var account = web3.eth.accounts.create();
console.log(account);
