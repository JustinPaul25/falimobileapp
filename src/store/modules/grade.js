import { LocalStorage, Loading } from "quasar";
import axios from "axios";

export default {
    namespaced: true,
    state: {
        grades: {},
    },
    getters: {
        grades: state => state.grades,
    },
    mutations: {
        setGrades(state, payload) {
            state.grades = payload
        },
    },
    actions: {
        getGrades({ commit }, payload) {
            axios.get(`/api/grades/${payload.id}`)
            .then(response => {
                if(response != null) {
                    commit('setGrades', response.data)
                    return
                }
            })
        },
    }
}