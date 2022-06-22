module.exports = {
  // Sign with private key
  async sendTransaction(
    provider, chainId, targetContract, methodName, accountPrivateKey, arguments) {
    provider.eth.handleRevert = true;
    try {
      // get pubkey
      const account = provider.eth.accounts.privateKeyToAccount(accountPrivateKey).address;
      const to = targetContract.options.address;
      const nonce = provider.utils.numberToHex(
        await provider.eth.getTransactionCount(account));
      const data = targetContract.methods[methodName]
        .apply(targetContract.methods, arguments)
        .encodeABI();  // encode ABI
      let gasPrice = 50000000000;

      const tx = { account, to, chainId, data, nonce, gas: 2000000, gasPrice };

      // sign
      let signTx =
        await provider.eth.accounts.signTransaction(tx, accountPrivateKey);
      let ret = await provider.eth.sendSignedTransaction(signTx.rawTransaction);
      console.log('gasUsed: ' + methodName + ' ' + ret.gasUsed);
      return ret;
    } catch (e) {
      console.error(e);
    }
  },
  // query info from blockchain node
  async contractCall(targetContract, method, arguments) {
    let methodObj =
      targetContract.methods[method].apply(targetContract.methods, arguments);
    let ret = await methodObj.call({});
    return ret;
  }
}