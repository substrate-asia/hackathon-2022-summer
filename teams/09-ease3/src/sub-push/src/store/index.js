import { createStore } from 'vuex'

export default createStore({
    state: {
        userData: {}
    },
    mutations: {
        changeUserData(state, value) {
            state.userData = value;
        }
    },
    actions: {},
    modules: {

    }
})