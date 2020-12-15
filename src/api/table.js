import request from '@/utils/request'

export function getList() {
  return request({
    // url: '/vue-admin-template/table/list',
    url: '/test/old/list',
    method: 'get',
  })
}
