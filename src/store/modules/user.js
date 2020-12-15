import { adminLogin, adminLogout, getAdminInfo, userLogin, getUserInfo, userLogout } from '@/api/user'
import { getToken, setToken, removeToken, removeSession } from '@/utils/auth'  //从cookie中拿，现在用isLogin 来做验证
import { resetRouter } from '@/router'
import router from '@/router'
// import Cookies from 'js-cookie'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    isLogin: false, //用isLogin代替Token，
    roles: [],
    loginType: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ISLOGIN: (state, isLogin) => {
    state.isLogin = isLogin
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_LOGINTYPE: (state, loginType) => {
    state.loginType = loginType
  },
}

const actions = {
  // user login
  login({ commit, state }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      if (state.loginType == 'admin') {
        adminLogin({ account: username, password: password }).then(response => {
          // const { data } = response
          const data = response.data
          // console.log(response.data);
          // 把Token 保存在vuex中
          commit('SET_TOKEN', data.token)
          commit('SET_ISLOGIN', true)
          setToken(data.token)  //可删  这个是设置cookie中的值
          // console.log(Cookies.get('old-back-sid'))
          resolve()
        }).catch(error => {
          reject(error)
        })
      } else {
        userLogin({ account: username, password: password }).then(response => {
          // const { data } = response
          const data = response.data
          // console.log(response.data);
          // 把Token 保存在vuex中
          commit('SET_TOKEN', data.token)
          commit('SET_ISLOGIN', true)
          setToken(data.token)  //可删  这个是设置cookie中的值
          // console.log(Cookies.get('old-back-sid'))
          resolve()
        }).catch(error => {
          reject(error)
        })
      }
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.loginType == 'admin') {
        getAdminInfo().then(response => {
          const { data } = response
          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          const { roles, name, avatar } = data
          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      } else {
        getUserInfo().then(response => {
          const { data } = response
          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          const { roles, name, avatar } = data
          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      }

    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.loginType == 'admin') {
        adminLogout().then(() => {
          removeSession()
          resetRouter()
          commit('RESET_STATE')
          router.push({
            name: 'Login'
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      }else {
        userLogout().then(() => {
          removeSession()
          resetRouter()
          commit('RESET_STATE')
          router.push({
            name: 'Login'
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      }

    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

