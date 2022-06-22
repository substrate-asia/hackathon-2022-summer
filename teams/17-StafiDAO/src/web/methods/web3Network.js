export function Init(callback) {
    //判断用户是否安装MetaMask钱包插件
    if (typeof window.ethereum === "undefined") {
        //没安装MetaMask钱包进行弹框提示
        Message.warning("请安装MetaMask")
    } else {
        //如果用户安装了MetaMask，你可以要求他们授权应用登录并获取其账号
        ethereum.enable()
            .catch(function(reason) {
                //如果用户拒绝了登录请求
                if (reason === "User rejected provider access") {
                    // 用户拒绝登录后执行语句；
                } else {
                    // 本不该执行到这里，但是真到这里了，说明发生了意外
                    Message.warning("There was a problem signing you in");
                }
            }).then(function(accounts) {
                // 判断是否连接以太
                if (ethereum.networkVersion !== desiredNetwork) {}
                let currentProvider = web3.currentProvider;
                web3.setProvider(currentProvider);
                //如果用户同意了登录请求，你就可以拿到用户的账号
                web3.eth.defaultAccount = accounts[0];

                myContract = new web3.eth.Contract(ABI, metaMaskAddress);
                //这里返回用户钱包地址
                callback(accounts[0]);
            });
    }
}
