import { LocalStorage, Loading } from "quasar";
import axios from "axios";

export default {
    namespaced: true,
    state: {
        loggedIn: false,
        permissions: [],
        details: {}
    },
    getters: {
        loggedIn: state => state.loggedIn,
        permissions: state => state.permissions,
        details: state => state.details
    },
    mutations: {
        setLoggedIn(state, payload) {
            state.loggedIn = payload
        },
        setDetails(state, payload) {
            state.details = payload
        },
    },
    actions: {
        async login({ commit }, payload) {
            var returnResult = true;
            await axios.post("/api/student-login", payload)
            .then(response => {
                if(response.data != false) {
                    this.$router.push("/menu");
                    commit('setLoggedIn', true)
                    commit('setDetails', response.data)
                    LocalStorage.set("user.loggedIn", true);
                } else {
                   returnResult = false
                }
            })
            return returnResult
        },
        logout({ commit }) {
            console.log('test')
            commit('setLoggedIn', false)
            this.$router.push("/login");
            LocalStorage.set("user.loggedIn", false);
        }
    }
}