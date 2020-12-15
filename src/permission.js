import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getSession, removeSession } from '@/utils/auth' // get token from 全是从cookie中拿到 现在想要用isLogin 所以不需要这个
// import store from '@/store'


import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()
  const hasOldId = getSession()
  let isLogin = false;
  if (hasOldId) {
    store.commit('user/SET_ISLOGIN', true);
    isLogin = true
  }
  // isLogin = store.getters.isLogin
  // if(Cookies.get())
  // 在登录的逻辑中要把isLogin 和 name 存到store中
  // console.log(hasToken)
  // if (hasToken) {
  //   if (to.path === '/login') {
  //     // if is logged in, redirect to the home page
  //     next({ path: '/' })
  //     NProgress.done()
  //   } else {
  //     const hasGetUserInfo = store.getters.name
  //     if (hasGetUserInfo) {
  //       next()
  //     } else {
  //       try {
  //         // get user info
  //         await store.dispatch('user/getInfo')

  //         next()
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         await store.dispatch('user/resetToken')
  //         Message.error(error || 'Has Error')
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }
  //     }
  //   }
  // } 

  //登录了 
  if (isLogin) {
    // 如果跳转的是login页面
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 如果跳转的不是login页面，则获取vuex里面的名字，
      // const hasGetUserInfo = store.getters.name
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // 如果有名字，继续；
      if (hasRoles) {
        // next({ ...to, replace: true })
        next();
      } else {
        // 如果没有名字等信息，发起查询；如果检测到错误，则把session和isLogin去掉
        try {
          // get user info
          // await store.dispatch('user/getInfo')
          const { roles } = await store.dispatch('user/getInfo')
          console.log(roles)
          // 在下面这一行中，不仅把roles对应的路由找到了，还把路由设置到了vuex中
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          console.log(accessRoutes)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          router.options.routes=store.getters.permission_routes;
          // console.log(1)
          console.log(router)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          // next({ ...to, replace: true })
          next({ ...to, replace: true });
          // next()  //因为这是拦截，所以记得要加个next
        } catch (error) {
          // remove token and go to login page to re-login
          // await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          // next(`/login?redirect=${to.path}`)
          // next(`/login?redirect=oldlist`)
          store.commit('user/SET_ISLOGIN', false)
          removeSession()
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没登录*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      // next(`/login?redirect=oldlist`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
