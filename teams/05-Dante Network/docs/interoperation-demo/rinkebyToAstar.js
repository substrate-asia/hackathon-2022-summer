const blockchain = require('./basic/blockchain.js');
const { program } = require('commander');

let fromChain = 'RINKEBY';
let toChain = 'ASTAR';

async function sendGreeting() {
  ///////////////////////////////////////////////
  ///////      RINKEBY To ASTAR      ////////////
  ///////////////////////////////////////////////

  // send greeting to smart contract
  await blockchain.sendMessageFromEthereum(fromChain, toChain);
}

async function queryGreeting(id) {
  console.log('Wait for the message to be synchronized.', id);

  let interval = setInterval(async() => {
    const message = await blockchain.queryMessageFromEthereum('RINKEBY', id);
    if (message.title != '') {
      clearInterval(interval);
      console.log(message);
      return;
    }
  }, 5 * 1000);
}

(async function() {
	function list(val) {
		return val.split(',')
	}

  program
	  .version('0.1.0')
	  .option('-g, --greet', 'send greeting to ASTAR')
	  .option('-q, --query <id>', 'query greeting from RINKEBY')
	  .parse(process.argv);

  if (program.opts().greet) {
    await sendGreeting();
  }
  else if (program.opts().query) {
    await queryGreeting(program.opts().query);
  }
})();