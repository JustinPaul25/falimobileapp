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
        login({ commit }, payload) {
            axios.post("/api/student-login", payload)
            .then(response => {
                if(response.data != false) {
                    this.$router.push("/menu");
                    commit('setLoggedIn', true)
                    commit('setDetails', response.data)
                    LocalStorage.set("user.loggedIn", true);
                }
            })
        },
        logout({ commit }) {
            console.log('test')
            commit('setLoggedIn', false)
            this.$router.push("/login");
            LocalStorage.set("user.loggedIn", false);
        }
    }
}