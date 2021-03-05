import { LocalStorage, Loading } from "quasar";
import axios from "axios";

export default {
    namespaced: true,
    state: {
        tutorials: {}
    },
    getters: {
        tutorials: state => state.tutorials
    },
    mutations: {
        setTutorials(state, payload) {
            state.tutorials = payload
        },
    },
    actions: {
        getTutorials({ commit }) {
            axios.get("/api/learning-materials")
            .then(response => {
                if(response != null) {
                    commit('setTutorials', response.data.data)
                }
            })
        }
    }
}