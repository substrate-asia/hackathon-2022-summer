module.exports = {
  // 通过私钥签名交易
  async sendTransaction(
    provider, chainId, targetContract, methodName, accountPrivateKey, arguments) {
    try {
      const account =
      provider.eth.accounts.privateKeyToAccount(accountPrivateKey)
          .address;  // 私钥导出公钥
      const to = targetContract.options.address;
      const nonce = provider.utils.numberToHex(
        await provider.eth.getTransactionCount(account));  // 获取生成 nonce
      const data = targetContract.methods[methodName]
        .apply(targetContract.methods, arguments)
        .encodeABI();  // encode ABI
      // const gas = provider.utils.numberToHex(
      //   parseInt((await provider.eth.getBlock('latest')).gasLimit - 1));
      const gas = 1000000;
      let gasPrice = await provider.eth.getGasPrice();
      gasPrice = 50000000000;

      // 准备交易数据
      const tx = { account, to, chainId, data, nonce, gasPrice, gas };
      console.log(tx);

      // 签名交易
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