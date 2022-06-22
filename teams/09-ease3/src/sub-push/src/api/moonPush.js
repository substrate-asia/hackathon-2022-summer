import request from "@/utils/request";

export function getTriggerTypes(params) {
    return request({
        url: '/api/v1/trigger-manage/getTriggerTypes',
        method: 'get',
        params
    })
}
export function getChains(params) {
    return request({
        url: '/api/v1/trigger-manage/getChains',
        method: 'get',
        params
    })
}
export function getMyTriggers(data) {
    return request({
        url: '/api/v1/trigger-manage/getMyTriggers',
        method: 'post',
        data
    })
}
export function createTrigger(data) {
    return request({
        url: '/api/v1/trigger-manage/createTrigger',
        method: 'post',
        data
    })
}
export function publishTrigger(data) {
    return request({
        url: '/api/v1/trigger-manage/publishTrigger',
        method: 'post',
        data
    })
}
export function deactiveTrigger(data) {
    return request({
        url: '/api/v1/trigger-manage/deactiveTrigger',
        method: 'post',
        data
    })
}
export function removeTrigger(data) {
    return request({
        url: '/api/v1/trigger-manage/removeTrigger',
        method: 'post',
        data
    })
}