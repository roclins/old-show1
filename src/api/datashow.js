import request from '@/utils/request'

export function getList(params) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/old/list',
        method: 'get',
        params
    })
}

export function addSingleOld(data) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/old/one',
        method: 'post',
        data
    })
}

export function updateSingleOld(params, data) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/old/' + params,
        method: 'post',
        data
    })
}

export function deleteSingleOld(params) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/old/' + params,
        method: 'delete',
    })
}

export function getOldList(params) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/data/',
        method: 'get',
        params
    })
}

export function getBehRowData(params) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/data/'+params.oldId+'/activity',
        method: 'get',
        params
    })
}

export function getAlaRowData(params) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/data/'+params.oldId+'/alarm',
        method: 'get',
        params
    })
}

export function getRecRowData(params) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/data/'+params.oldId+'/recognize',
        method: 'get',
        params
    })
}

// 获得行为统计数据 behavior statistical 
export function getBehStaData(params) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/data/'+params+'/activity/count',
        method: 'get',
    })
}

// 获得行为统计数据 alarm statistical  "/data/{oldId}/alarm/count"
export function getAlaStaData(params) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/data/'+params+'/alarm/count',
        method: 'get',
    })
}

export function getRecStaData(params) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/data/'+params+'/recognize/count',
        method: 'get',
    })
}

export function getOldId(params) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/old/getoldid',
        method: 'get',
        params
    })
}
