const state = {
    currentOldId:"",
    currentOldName:""
}

const mutations = {
    SET_CURRENTOLDID: (state,oldId)=>{
        state.currentOldId = oldId
    },
    SET_CURRENTOLDNAME:(state,oldName)=>{
        state.currentOldName = oldName
    },
}

export default {
    // namespaced: true,
    state,
    mutations
}