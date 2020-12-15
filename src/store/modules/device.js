const state = {
    currentDeviceId:"",
}

const mutations = {
    SET_CURRENTDEVICEID: (state,deviceId)=>{
        state.currentDeviceId = deviceId
    },
}

export default {
    // namespaced: true,
    state,
    mutations
}