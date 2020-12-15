import request from '@/utils/request'

// localhost:9528/dev-api/vue-admin-template/user/login
// http://127.0.0.1:3001/old-back/v1/user/user/login
// /vue-admin-template/user/login ? 为什么请求时直接用user/login  '/api/user/login'
export function adminLogin(data) {
  return request({
    url: '/test/user/login',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
  })
}

export function getAdminInfo(token) {
  return request({
    url: '/test/user/user-info',
    method: 'get',
  })
}


export function adminLogout() {
  return request({
    url: '/test/user/logout',
    method: 'delete'
  })
}

export function userLogin(data) {
  return request({
    url: '/test2/user/login',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
  })
}

export function getUserInfo(token) {
  return request({
    url: '/test2/user/user-info',
    method: 'get',
  })
}


export function userLogout() {
  return request({
    url: '/test2/user/logout',
    method: 'delete'
  })
}