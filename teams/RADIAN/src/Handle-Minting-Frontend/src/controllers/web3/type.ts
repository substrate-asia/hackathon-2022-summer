/*
 * @Author: Yosan
 * @Date: 2022-05-11 20:29:32
 * @LastEditors: Yosan
 * @LastEditTime: 2022-05-22 15:21:00
 * @Descripttion: 
 */
export interface WalletProvider {
    selected: string
    [key: string]: string,
}

export interface IWeb3Context {
    connect(): Promise<any>,
    connectedWallet: string,
    isPolygon(): Promise<void>,
    isMumbai(): Promise<void>,
    isRopsten(): Promise<void>,
    network?: number,
    hasMetamask: boolean,
}