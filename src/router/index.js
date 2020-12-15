import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {  roles: ['admin']  }
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
    meta: {  roles: ['admin']  }
  },

  {
    path: '/',
    component: Layout,
    // redirect: '/oldlist',
    meta: {  roles: ['admin']  },
    hidden: true
  },


  // {
  //   path: '/oldlist',
  //   component: Layout,
  //   redirect: '/oldlist/index',
  //   meta: { title: '老人管理', icon: 'form' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'oldListIndex',
  //       component: () => import('@/views/oldlist/index'),
  //       meta: { title: '老人信息总览', icon: 'form' }
  //     },
  //     {
  //       path: 'oldexcel',
  //       name: 'oldExcel',
  //       component: () => import('@/views/oldlist/oldexcel'),
  //       meta: { title: '批量上传老人信息', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/datashow',
  //   component: Layout,
  //   redirect:'/datashow/index',
  //   meta: { title: '数据管理', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'DataShowIndex',
  //       component: () => import('@/views/datashow/index'),
  //       meta: { title: '老人数据总览', icon: 'tree'}
  //     },
  //     {
  //       path: 'behrowdata',
  //       name: 'BehRowData',
  //       component: () => import('@/views/datashow/behrowdata'),
  //       meta: { title: '行为数据管理', icon: 'tree' }
  //     },
  //     {
  //       path: 'alarowdata',
  //       name: 'AlaRowData',
  //       component: () => import('@/views/datashow/alarowdata'),
  //       meta: { title: '告警数据管理', icon: 'tree' }
  //     },
  //     {
  //       path: 'recrowdata',
  //       name: 'RecRowData',
  //       component: () => import('@/views/datashow/recrowdata'),
  //       meta: { title: '评估数据管理', icon: 'tree' }
  //     },
  //     // /data/{oldId}/activity/count
  //     {
  //       path: 'behstadata',
  //       name: 'BehStaData',
  //       component: () => import('@/views/datashow/behstadata'),
  //       meta: { title: '行为统计数据管理', icon: 'tree' }
  //     },
  //     {
  //       path: 'alastadata',
  //       name: 'AlaStaData',
  //       // hidden: true,
  //       component: () => import('@/views/datashow/alastadata'),
  //       meta: { title: '告警统计数据管理', icon: 'tree' }
  //     }
  //   ]
  // },
  // {
  //   path: '/device',
  //   component: Layout,
  //   meta: { title: '设备管理', icon: 'nested' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'DeviceIndex',
  //       component: () => import('@/views/device/index'),
  //       meta: { title: '设备总览', icon: 'form' }
  //     },
  //     {
  //       path: 'devrowdata/',
  //       name: 'DevRowData',
  //       component: () => import('@/views/device/devrowdata'),
  //       meta: { title: '设备数据管理', icon: 'form' }
  //     },
  //     {
  //       path: 'devstadata/',
  //       name: 'DevStaData',
  //       component: () => import('@/views/device/devstadata'),
  //       meta: { title: '设备统计数据管理', icon: 'form' }
  //     },
  //     {
  //       path: 'deviceexcel',
  //       name: 'DeviceExcel',
  //       component: () => import('@/views/device/deviceexcel'),
  //       meta: { title: '批量上传设备信息', icon: 'form' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  {
    path: '/oldlist',
    component: Layout,
    redirect: '/oldlist/index',
    meta: { title: '老人管理', icon: 'form', roles: ['admin']  },
    children: [
      {
        path: 'index',
        name: 'oldListIndex',
        component: () => import('@/views/oldlist/index'),
        meta: { title: '老人信息总览', icon: 'form', roles: ['admin']  }
      },
      {
        path: 'oldexcel',
        name: 'oldExcel',
        component: () => import('@/views/oldlist/oldexcel'),
        meta: { title: '批量上传老人信息', icon: 'form', roles: ['admin']  }
      }
    ]
  },

  {
    path: '/datashow',
    component: Layout,
    redirect: '/datashow/index',
    meta: { title: '数据管理', icon: 'el-icon-s-help', roles: ['admin']  },
    children: [
      {
        path: 'index',
        name: 'DataShowIndex',
        component: () => import('@/views/datashow/index'),
        meta: { title: '老人数据总览', icon: 'tree',  roles: ['admin']  }
      },
      {
        path: 'behrowdata',
        name: 'BehRowData',
        component: () => import('@/views/datashow/behrowdata'),
        meta: { title: '行为数据管理', icon: 'tree', roles: ['admin']  }
      },
      {
        path: 'alarowdata',
        name: 'AlaRowData',
        component: () => import('@/views/datashow/alarowdata'),
        meta: { title: '告警数据管理', icon: 'tree', roles: ['admin']  }
      },
      {
        path: 'recrowdata',
        name: 'RecRowData',
        component: () => import('@/views/datashow/recrowdata'),
        meta: { title: '评估数据管理', icon: 'tree', roles: ['admin']  }
      },
      // /data/{oldId}/activity/count
      {
        path: 'behstadata',
        name: 'BehStaData',
        component: () => import('@/views/datashow/behstadata'),
        meta: { title: '行为统计数据管理', icon: 'tree', roles: ['admin']  }
      },
      {
        path: 'alastadata',
        name: 'AlaStaData',
        // hidden: true,
        component: () => import('@/views/datashow/alastadata'),
        meta: { title: '告警统计数据管理', icon: 'tree', roles: ['admin']  }
      }
    ]
  },
  {
    path: '/device',
    component: Layout,
    meta: { title: '设备管理', icon: 'nested', roles: ['admin']  },
    children: [
      {
        path: 'index',
        name: 'DeviceIndex',
        component: () => import('@/views/device/index'),
        meta: { title: '设备总览', icon: 'form', roles: ['admin']   }
      },
      {
        path: 'devrowdata/',
        name: 'DevRowData',
        component: () => import('@/views/device/devrowdata'),
        meta: { title: '设备数据管理', icon: 'form', roles: ['admin']   }
      },
      {
        path: 'devstadata/',
        name: 'DevStaData',
        component: () => import('@/views/device/devstadata'),
        meta: { title: '设备统计数据管理', icon: 'form', roles: ['admin']   }
      },
      {
        path: 'deviceexcel',
        name: 'DeviceExcel',
        component: () => import('@/views/device/deviceexcel'),
        meta: { title: '批量上传设备信息', icon: 'form', roles: ['admin']   }
      }
    ]
  },
  // {
  //   path: '/dashboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'Dashboard',
  //       meta: { title: 'Dashboard', icon: 'dashboard', roles: ['user'] }
  //     }
  //   ]
  // },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/userIndex/index'),
        name: 'userIndex',
        meta: { title: '用户首页', icon: 'dashboard', roles: ['user'] }
      }
    ]
  },
  {
    path: '/behavior',
    component: Layout,
    meta: { title: '行为数据', icon: 'dashboard', roles: ['user'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/behavior/index'),
        name: 'BehStaDataForUser',
        meta: { title: '前七天行为数据', icon: 'dashboard', roles: ['user'] }
      },
      {
        path:'detail',
        name:'BehaviorDetail',
        component: () => import('@/views/behavior/detail'),
        meta: { title: '每日行为数据', icon: 'dashboard', roles: ['user'] }
      }
    ]
  },
  {
    path: '/alarm',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/alarm/index'),
        name: 'AlaStaDataForUser',
        meta: { title: '告警数据', icon: 'dashboard', roles: ['user'] }
      }
    ]
  },
  {
    path: '/recogize',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/recognize/index'),
        name: 'RecStaDataForUser',
        meta: { title: '评分数据', icon: 'dashboard', roles: ['user'] }
      }
    ]
  },

]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
  mode: 'history'
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
