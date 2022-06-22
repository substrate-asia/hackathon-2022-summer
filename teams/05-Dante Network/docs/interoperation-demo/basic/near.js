const { providers, utils, transactions } = require("near-api-js");
const sha256 = require("js-sha256");
// const { sendTransaction } = require("./avalanche");
const networkId = "testnet";
const provider = new providers.JsonRpcProvider({
  url: `https://rpc.${networkId}.near.org`,
});

module.exports = {
  async sendTransaction(contractId, sender, privateKey, methodName, params) {
    console.log("Processing transaction...");
    let keyPair = utils.key_pair.KeyPairEd25519.fromString(privateKey);
    let publicKey = keyPair.getPublicKey();
    let actions = [transactions.functionCall(methodName,
    params,
    "30000000000000",
    "0"
    )];
    
    let accessKey = await provider.query(
      `access_key/${sender}/${publicKey}`,
      ""
    );
    let nonce = ++accessKey.nonce;
    let blockHash = accessKey.block_hash;
    console.log("nonce =", nonce, ", blockHash =", blockHash);
    // let { nonce, blockHash } = await get_nonce_and_recent_block();
    // let signedTx = await sign(sender, nonce, blockHash, actions, sender);
    // await send_transaction(signedTx);
    const transaction = transactions.createTransaction(
      sender,
      publicKey,
      contractId,
      nonce,
      actions,
      utils.serialize.base_decode(blockHash)
    );
  
    const serializedTx = utils.serialize.serialize(
      transactions.SCHEMA,
      transaction
    );
  
    const serializedTxHash = new Uint8Array(sha256.sha256.array(serializedTx));
    const signature = keyPair.sign(serializedTxHash);
    const signedTransaction = new transactions.SignedTransaction({
      transaction,
      signature: new transactions.Signature({
        keyType: transaction.publicKey.keyType,
        data: signature.signature,
      }),
    });
    const signedSerializedTx = signedTransaction.encode();
    // send the transaction!
    try {
      // sends transaction to NEAR blockchain via JSON RPC call and records the result
      const result = await provider.sendJsonRpc("broadcast_tx_commit", [
        Buffer.from(signedSerializedTx).toString("base64"),
      ]);
      // console results :)
      console.log("Transaction Results: ", result.transaction);
      console.log(
        "--------------------------------------------------------------------------------------------"
      );
      console.log("OPEN LINK BELOW to see transaction in NEAR Explorer!");
      console.log(
        `$https://explorer.${networkId}.near.org/transactions/${result.transaction.hash}`
      );
      console.log(
        "--------------------------------------------------------------------------------------------"
      );
      return providers.getTransactionLastResult(result);
    } catch (error) {
      console.log(error);
    }
  },
  
  async contractCall(contract_id, method, args) {
    const serializedArgs = (Buffer.from(JSON.stringify(args))).toString('base64');
    const rawResult = await provider.query({
      request_type: "call_function",
      account_id: contract_id,
      method_name: method,
      args_base64: serializedArgs,
      finality: "optimistic",
    });
    const res = JSON.parse(Buffer.from(rawResult.result).toString());
    return res;
  }
}