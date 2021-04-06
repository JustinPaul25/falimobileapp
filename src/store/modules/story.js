import { LocalStorage, Loading } from "quasar";
import axios from "axios";

export default {
    namespaced: true,
    state: {
        stories: {},
        story: {},
        terms: {},
        sentences: [
            {
                test: 'lang'
            }
        ],
        pronounciation: {}
    },
    getters: {
        stories: state => state.stories,
        story: state => state.story,
        terms: state => state.terms,
        sentences: state => state.sentences,
        pronounciation: state => state.pronounciation
    },
    mutations: {
        setStories(state, payload) {
            state.stories = payload
        },
        setSentences(state, payload) {
            state.sentences = payload
        },
        setStory(state, payload) {
            state.story = payload
        },
        setTerms(state, payload) {
            state.terms = payload
        },
        setPronounciation(state, payload) {
            state.pronounciation = payload
        }
    },
    actions: {
        getStories({ commit }, payload) {
            axios.get(`/api/stories/${payload.id}`)
            .then(response => {
                if(response != null) {
                    commit('setStories', response.data.data)
                }
            })
        },
        getStory({ commit, dispatch }, payload) {
            axios.get(`/api/story/${payload.id}`)
            .then(response => {
                if(response != null) {
                    commit('setStory', response.data)
                    dispatch('getSentence', payload);
                }
            })
        },
        getSentence({ commit }, payload) {
            axios.get(`/api/sentence/${payload.id}`)
            .then(response => {
                if(response != null) {
                    commit('setSentences', response.data)
                }
            })
        },
        submitResult({ commit }, payload) {
            axios.post(`/api/story/submit-result`, payload)
            .then(response => {
                if(response != null) {
                    
                }
            })
        },
        computePronounciation({ commit }, payload) {
            axios.post(`/calculate-pronounciation`, payload)
            .then(response => {
                commit('setPronounciation', response)
            });
        }
    }
}