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

export function getTemplatePath() {
  return request({
    // url: '/vue-admin-template/table/list',
    url: '/test/old/templatepath',
    method: 'get',
  })
}

// 通过excel文件上传老人数据
export function uploadOld(data) {
  return request({
    // url: '/vue-admin-template/table/list',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    }, 
    url: '/test/old',
    method: 'post',
    data
  })
}
