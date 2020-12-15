import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import datashow from './modules/datashow'
import device from './modules/device'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    datashow,
    device,
    tagsView,
    permission
  },
  getters
})

export default store
