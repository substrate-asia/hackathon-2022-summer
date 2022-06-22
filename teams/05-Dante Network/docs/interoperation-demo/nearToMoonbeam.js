const blockchain = require('./basic/blockchain.js');
const { program } = require('commander');

async function sendGreeting() {
  ///////////////////////////////////////////////
  ///////      NEAR To MOONBEAM      ////////////
  ///////////////////////////////////////////////

  // send greeting to smart contract on MOONBEAM
  let id = await blockchain.sendMessageFromNearToEthereum('MOONBEAM');

  // query greeting from smart contract on MOONBEAM
  console.log('Wait for the message to be synchronized.', id);

  let interval = setInterval(async() => {
    const message = await blockchain.queryMessageFromEthereum('MOONBEAM', id);
    if (message.title != '') {
      clearInterval(interval);
      console.log(message);
      return;
    }
  }, 5 * 1000);
};

async function sendOCTask(nums) {
  ///////////////////////////////////////////////
  ///////     NEAR To MOONBEAM     ////////////
  ///////////////////////////////////////////////

  // send outsourcing computing task to smart contract from NEAR to MOONBEAM
  let id = await blockchain.sendOCTaskFromNearToEthereum('MOONBEAM', nums);
  // query greeting from smart contract on NEAR
  console.log('Wait for the message to be synchronized.', id);

  var interval = setInterval(async() => {
    const message = await blockchain.queryOCResultFromNear(id);
    if (message.result) {
      clearInterval(interval);
      console.log(message);
      return;
    }
  }, 5 * 1000);
  
};

(async function() {
  function list(val) {
    // val.split(',').map(function (val) {
    //   return Number(val);
    // })
    let nums = val.split(',').map(function (val) {
      return val;
    });
    return nums;
	}

  program
	  .version('0.1.0')
	  .option('-g, --greet', 'send greeting to MOONBEAM')
	  .option('-c, --compute <num1, ..., numn>', 'send outsourcing computing task to MOONBEAM', list)
	  .parse(process.argv);

  if (program.opts().greet) {
    await sendGreeting();
  }
  else if (program.opts().compute) {
    await sendOCTask(program.opts().compute);
  }
})();

async function sleep(seconds) {
  await new Promise((resolve) => {
      setTimeout(() => {
      resolve();
      }, seconds * 1000);
  });
}