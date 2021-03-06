<template>
  <q-page class="q-py-md full-height bg-indigo-11">
        <div class="full-height">
            <div class="q-gutter-sm q-mb-md flex justify-end q-pr-md full-width">
                <q-btn clickable :to="`/stories/${$route.params.id}`" round color="primary" icon="keyboard_arrow_left" />
            </div>
        </div>
        <div v-show="currentQuestion == index" v-for="(quiz, index) in quizzes" :key="quiz.id">
          <div class="full-width flex justify-center">
            <img width="50%" :src="quiz.img_url" alt="">
          </div>
          <div class="q-pa-md bg-orange-1">
            <p class="text-h6 text-grey-9 text-weight-bold">{{`${index+1}. ${quiz.question}`}}</p>
            <div class="q-gutter-sm">
              <q-radio v-model="answer" v-for="(choice, index) in quiz.choices" :key="index" class="text-grey-9 text-weight-bold text-h6" size="lg" :val="choice.choice" :label="choice.choice" />
            </div>
            <div class="flex q-mt-sm">
              <q-btn @click="playAudio(quiz.question)" class="q-ml-auto full-width" color="primary" label="Read Question" :size="'lg'" />
            </div>
          </div>
          <div v-show="next">
            <div class="flex q-mt-lg" v-if="currentQuestion < quizzes.length-1">
              <q-btn @click="nextQuestion()" class="q-ml-auto full-width" color="primary" label="Next" :size="'lg'" />
            </div>
            <div class="q-my-sm" v-else>
              <q-btn @click="submitAnswer()" class="q-ml-auto full-width" color="primary" label="Submit Answers" :size="'lg'" />
              <div class="q-my-sm">
                <img style="display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;" src="https://media.giphy.com/media/U7helkiPxHjsY5bs5h/source.gif" alt="this slowpoke moves"  width=250/>
              </div>
            </div>
          </div>
        </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

export default {
  name: 'PageIndex',
  data() {
      return {
        currentQuestion: 0,
        voiceSelect: 'select',
        shape: false,
        optionsVoice: [],
        answers: [],
        answer:null,
        next: false,
      }
  },
  watch: {
      answer:function(val) {
        if(val != null) {
          this.chooseAnswer()
          this.next = true
        }
      },
  },
  computed: {
      ...mapGetters({
          loggedIn: 'user/loggedIn',
          quizzes: 'quiz/quizzes',
          user: 'user/details'
      }),
  },
  methods: {
    ...mapActions('quiz', ['getQuizzes', 'saveResult']),
    ...mapActions('grade', ['getGrades']),
      getDatas() {
          this.getQuizzes({
            id: this.$route.params.id
          })
      },
      nextQuestion() {
        if(this.currentQuestion < this.quizzes.length-1) {
          this.currentQuestion = this.currentQuestion + 1
          this.next = false
          const answer = {
            question_id: this.quizzes[this.currentQuestion-1].id,
            answer: this.answer
          }
          this.answers.push(answer)
          this.answer = null
        }
      },
      async submitAnswer() {
        const answer = {
          index: this.currentQuestion-1,
          answer: this.answer
        }
        this.answers.push(answer)
        var result = await this.calculate();
        result = (result/this.quizzes.length)*100;
        await this.saveResult({
          material_id: this.$route.params.id,
          student_id: this.user.id,
          result: result
        })
        this.$router.push(`/stories/${this.$route.params.id}/terms`);
      },
      calculate() {
        var correct = 0;
        for(var ctr = 0; ctr < this.quizzes.length; ctr++) {
          if(this.answers[ctr].answer == this.quizzes[ctr].answer) {
            correct = correct + 1
          }
        }
        return correct
      },
      playAudio (question) {
        this.$speechTalkCordova(question)
      },
      setVoices () {
        let id = setInterval(() => {
          if (this.optionsVoice.length === 0) {
            this.voicesList()
          } else {
            clearInterval(id)
          }
        }, 50)
      },
      voicesList () {
        let teste = window.speechSynthesis
        this.optionsVoice = teste.getVoices().map(voice => ({
          label: voice.name, value: voice.lang
        }))
      },
      chooseAnswer() {
        console.log(this.answer);
      }
  },
  mounted() {
    if(!this.loggedIn) {
      this.$router.push("/login");
    } else {
       this.getDatas();
       this.setVoices();
    }
  }
}
</script>