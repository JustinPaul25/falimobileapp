import { LocalStorage, Loading } from "quasar";
import axios from "axios";

export default {
    namespaced: true,
    state: {
        terms: {}
    },
    getters: {
        terms: state => state.terms
    },
    mutations: {
        setTerms(state, payload) {
            state.terms = payload
        },
    },
    actions: {
        getTerms({ commit }, payload) {
            axios.get(`/api/terms/${payload.id}`)
            .then(response => {
                if(response != null) {
                    commit('setTerms', response.data.data)
                }
            })
        }
    }
}