import request from '@/utils/request'

export function getDeviceList(params) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/device',
        method: 'get',
        params
    })
}

export function disabledDevice(params) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/device/'+params,
        method: 'post',
        // params
    })
}
// device/devicedata?deviceId=5f6889e16b9ff4082fc678c5
export function getDeviceData(params) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/device/devicedata/',
        method: 'get',
        params
    })
}

export function getDevStaData(params) {
    return request({
        // url: '/vue-admin-template/table/list',
        url: '/test/device/devicecountdata/',
        method: 'get',
        params
    })
}

export function uploadDevice(data) {
    return request({
      // url: '/vue-admin-template/table/list',
      headers: {
        'Content-Type': 'multipart/form-data;charset=UTF-8'
      }, 
      url: '/test/device/upload',
      method: 'post',
      data
    })
  }