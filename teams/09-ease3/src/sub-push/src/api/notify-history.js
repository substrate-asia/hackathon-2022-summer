import request from "@/utils/request";

function getNotifyHistories(data) {
    return request({
        url: '/api/v1/notify-history/getNotifyHistories',
        method: "post",
        data
    });
};

export default {
    getNotifyHistories
};