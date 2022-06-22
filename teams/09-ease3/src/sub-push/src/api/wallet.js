import request from "@/utils/request";

export function getSupportedWallet(params) {
    return request({
        url: '/api/v1/trigger-manage/getSupportedWallet',
        method: 'get',
        params
    })
}
export function web3_nonce(data) {
    return request({
        url: '/api/v1/signin/web3_nonce',
        method: 'post',
        data
    })
}
export function web3_challenge(data) {
    return request({
        url: '/api/v1/signin/web3_challenge',
        method: 'post',
        data
    })
}
export function web3_sign_out(data) {
    return request({
        url: '/api/v1/signin/web3_sign_out',
        method: 'post',
        data,
    })
}