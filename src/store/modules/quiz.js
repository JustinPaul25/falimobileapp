import { LocalStorage, Loading } from "quasar";
import axios from "axios";

export default {
    namespaced: true,
    state: {
        quizzes: {}
    },
    getters: {
        quizzes: state => state.quizzes
    },
    mutations: {
        setQuizzes(state, payload) {
            state.quizzes = payload
        },
    },
    actions: {
        getQuizzes({ commit }, payload) {
            axios.get(`/api/quiz/${payload.id}`)
            .then(response => {
                if(response != null) {
                    commit('setQuizzes', response.data.data)
                }
            })
        },
        saveResult({ commit }, payload) {
            axios.post(`/api/quiz/result-save`, payload)
            .then(response => {
                if(response != null) {
                    commit('setQuizzes', response.data.data)
                    return
                }
            })
        }
    }
}