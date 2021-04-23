<template>
  <q-page class="q-py-md full-height">
        <div class="full-height">
            <!-- <audio ref="audioElmError" src="~assets/Negative-sound-effect.mp3"></audio> -->
            <div class="q-gutter-sm q-mb-md flex justify-end q-pr-md full-width">
                <q-btn v-show="showQuizButton" clickable :to="`/stories/${this.$route.params.id}/quiz`" round color="primary q-px-sm" label="Take Quiz" />
                <q-btn clickable :to="'/stories'" round color="primary" icon="keyboard_arrow_left" />
            </div>
             <q-dialog v-model="cardCorrect" position="top">
                <q-card style="width: 350px">
                    <q-linear-progress :value="1" color="green" />

                    <q-card-section class="row items-center no-wrap">
                    <div>
                        <div class="text-weight-bold text-h4 text-primary">Very Good! Keep it up</div>
                        <div class="col-3 q-pr-lg q-pb-sm">
                            <img
                            alt="login_illustration"
                            src="~assets/Correct.png"
                            width="100%"
                                >
                        </div>
                    </div>

                    <q-space />
                    </q-card-section>
                </q-card>
            </q-dialog>
            <q-dialog v-model="cardWrong" position="top">
                <q-card style="width: 350px">
                    <q-linear-progress :value="1" color="red" />

                    <q-card-section class="row items-center no-wrap">
                    <div>
                        <div class="text-weight-bold text-h4 text-primary">Well Done, But Something is missing</div>
                        <div class="col-3 q-pr-lg q-pb-sm">
                            <img
                            alt="login_illustration"
                            src="~assets/missing.png"
                            width="100%"
                                >
                        </div>
                    </div>
                    <q-space />
                    </q-card-section>
                </q-card>
            </q-dialog>
            <div class="flex justify-center">
                <p class="text-weight-bold text-grey-10 text-h4">{{ story.title }}</p>
            </div>
            <div class="full-width">
                <img style="display: block; margin-left: auto; margin-right: auto" width="80%" :src="story.img_url" alt="">
            </div>
            <q-layout v-if="page == 0" view="lHh Lpr lFf" container style="height: 200px" class="rounded-borders bg-indigo-2">
                <div v-if="!hasGrade" class="flex q-mt-sm q-pt-xl">
                    <q-btn @click="page = 1" class="q-ml-auto full-width" color="primary" label="Start Reading" :size="'lg'" />
                </div>
                <div v-else class="flex q-mt-sm q-pt-xl">
                    <q-btn @click="page = 1" class="q-ml-auto full-width" color="primary" label="Read Again" :size="'lg'" />
                </div>
                <div v-show="hasGrade" class="flex q-mt-sm q-pt-sm">
                    <q-btn clickable :to="`/stories/${$route.params.id}/terms`" class="q-ml-auto full-width" color="primary" label="Read Important Terms" :size="'lg'" />
                </div>
                <div v-show="hasGrade" class="flex q-mt-sm q-pt-sm">
                    <q-btn clickable :to="`/result`" class="q-ml-auto full-width" color="primary" label="View Result" :size="'lg'" />
                </div>
            </q-layout>
            <q-layout v-else v-show="page == index+1" v-for="(sentence, index) in sentences.data" :key="sentence.id" view="lHh Lpr lFf" container style="height: 120px" class="rounded-borders bg-indigo-2">
                <div class="text-h4 text-center text-weight-bold text-grey-10" v-html="currentSentence == '' ? setSentence(sentence.sentence) : currentSentence"></div>
            </q-layout>
            <div v-if='showSubmitButton'>
                <div class="flex q-mt-sm q-pt-xl">
                    <q-btn @click="submitGrade()" class="q-ml-auto full-width" color="primary" label="Proceed To Quiz" :size="'lg'" />
                </div>
            </div>
            <div v-else>
                <div v-show="page != 0" class="q-gutter-sm flex justify-between q-pr-md full-width" style="margin-top: 1px">
                    <div>
                        <q-btn disable round color="primary q-pa-xs bg-white" icon="arrow_left"/>
                    </div>
                    <div>
                        <q-btn v-show="page != 0" clickable @click="record()" round color="primary q-pa-sm" icon="mic"/>
                    </div>
                    <div v-if="showNextButton">
                        <q-btn clickable @click="nextPage()" round color="primary q-pa-xs" icon="arrow_right"/>
                    </div>
                    <div v-else>
                        <q-btn disable round color="primary q-pa-xs bg-white" icon="arrow_left"/>
                    </div>
                </div>
                <div v-show="page != 0" class="flex q-mt-sm">
                    <q-btn @click="playAudio()" class="q-ml-auto full-width" color="primary" label="I Will Read It" :size="'lg'" />
                </div>
            </div>
        </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import { Loading, QSpinnerBars } from 'quasar'
import { Dialog } from 'quasar'
import axios from "axios";

export default {
  name: 'PageIndex',
  data() {
      return {
          page: 0,
          text: '',
          read: '',
          baseUrl:'http://18.139.108.244:81/',
          sentencesLength: 0,
          continuous: false,
          btnStop: false,
          prompt: false,
          sentenceRes: [],
          readRes: [],
          wordCount:0,
          errors:0,
          totalWordCount:0,
          pronounciation:0,
          repitition:0,
          transposition:0,
          insertion:0,
          omission:0,
          substitution:0,
          showSubmitButton: false,
          studentReading: '',
          hasGrade: false,
          showQuizButton: false,
          cardCorrect: false,
          cardWrong: false,
          sentencesDummy: {},
          currentSentence: '',
          checkError: false,
          audio:null,
          chunks: [],
          audioFile: null,
          computing: false,
          showNextButton: false,
      }
  },
  computed: {
      ...mapGetters({
          loggedIn: 'user/loggedIn',
          story: 'story/story',
          details: 'user/details',
          sentences: 'story/sentences',
          grades: 'grade/grades',
          pronounciationScore: 'story/pronounciation'
      }),
  },
  methods: {
    ...mapActions('story', ['getStory', 'getSentences', 'submitResult', 'computePronounciation']),
    ...mapActions('grade', ['getGrades']),
      setSentence(sentence) {
          this.currentSentence = sentence
          return this.currentSentence
      },
      playAudio () {
        this.$speechTalkCordova(this.sentences.data[this.page-1].sentence)
      },
      getData() {
          this.getStory({
            id: this.$route.params.id
          }).then(() => {
            this.sentencesLength = this.sentences.data.length
            this.sentencesDummy = this.sentences
          }) 
          this.checkGrade();
          this.$q.loading.hide()
      },
      getGrade() {
        this.getGrades({
          id: this.details.id
        })
      },
      async checkGrade() {
          await axios.post(`api/grade`, {
              storyID: this.$route.params.id,
              studentID: this.details.id
          }).then((response) => {
              var count = 0;
            var i;

            for (i in response.data) {
                if (response.data.hasOwnProperty(i)) {
                    if(response.data.comprehension == null) {
                        this.showQuizButton = true
                    }
                    this.hasGrade = true
                } else {
                    this.hasGrade = false
                }
            }
          }) 
      },
      async getSentences() {
          await this.getSentences({
            id: this.$route.params.id
          }).then((response) => {
              this.sentencesLength = this.sentences.data.length  
          })          
      },
      async nextPage() {
            this.showNextButton = false
            this.checkError = false
            await this.computeResult()
            if(this.page < this.sentencesLength) {
                this.page = this.page + 1
            } else {
                this.showSubmitButton = true
            }
            this.timer = setTimeout(() => {
                this.stop()
            }, 1000)
            this.studentReading = this.studentReading + ' ' + this.text+'.'
            this.currentSentence = this.sentences.data[this.page-1].sentence
      },
      submitGrade() {
        var errors = this.pronounciation + this.repitition + this.transposition + this.insertion + this.omission + this.substitution
        this.submitResult({
            material_id: this.$route.params.id,
            student_id: this.details.id,
            errors: errors,
            studentReading: this.studentReading,
            pronounciation: this.pronounciation,
            repitition: this.repitition,
            transposition: this.transposition,
            insertion: this.insertion,
            omission: this.omission,
            substitution: this.substitution
        })
        this.$router.push(`/stories/${this.$route.params.id}/terms`);
      },
      prevPage() {
            this.page = this.page - 1
            this.currentSentence = this.sentences.data[this.page-1].sentence
      },
      record () {
            this.text = ''
            this.btnStop = true
            this.$speechToText.start("en-US", 'waitingAudioDesc', this.continuous)
            .then((suc) => {
                this.text += ' ' + suc
                this.read = this.text.toUpperCase()
                console.log(' '+this.sentences.data[this.page-1].sentence.toUpperCase())
                console.log(this.text.toUpperCase()+'.')
                console.log(this.text.toUpperCase()+'.' == ' '+this.sentences.data[this.page-1].sentence.toUpperCase())
                if(this.text.toUpperCase()+'.' == ' '+this.sentences.data[this.page-1].sentence.toUpperCase()) {
                    
                } else {
                    this.checkError = true
                }
                this.checkMissing()
                this.btnStop = false
            })
            .catch(() => {
                this.btnStop = false
            })
        },
        stop () {
            this.$speechToText.stop()
            this.btnStop = false
        },
        checkMissing() {
            this.showNextButton = true
            this.$axios.post(`/api/story/check-missing`, {
                sentence: this.sentences.data[this.page-1].sentence,
                read: this.read
            }).then(response => {
                this.currentSentence = response.data
                if(response.data.includes("<B STYLE='COLOR: RED'>")) {
                    this.playError()
                } else {
                    this.playCorrect()
                };
            });
        },
        async computeResult() {
            var errors = this.pronounciation + this.repitition + this.transposition + this.insertion + this.omission + this.substitution
            const res1 = await this.findDuplicate(this.sentences.data[this.page-1].sentence, 'sentence');
            this.wordCount = this.sentenceRes.length
            const res2 = await this.findDuplicate(this.read, 'read');
            if(res1.length != res2.length) {
                for (var i = 0; i < res1.length; i++) {
                    if(res1[i] != res2[i+1]) {
                        if(!this.checkError) {
                            this.repitition = this.repitition + 1  
                        }
                        console.log('repitition')
                    }
                } 
            }
            await this.checkPronounce();
            await this.checkOmmission();
            await this.checkTransposition();
            return
        },
        checkTransposition() {
            for(var ctr = 1; ctr < this.readRes.length;ctr++) {
                if(this.readRes[ctr] != this.sentenceRes[ctr-1] && this.readRes[ctr] == this.sentenceRes[ctr]) {
                    if(!this.checkError) {
                        this.transposition = this.transposition + 1
                    }
                    console.log('transposition')
                }
            }
            return
        },
        checkOmmission() {
            var sentence = this.text.toLowerCase()
            if(this.sentenceRes.length != this.readRes.length-1) {
                if(!this.checkError) {
                    this.omission = this.omission + 1
                }
            }
            return
        },
        checkPronounce() {
            console.log(this.sentences.data[this.page-1].sentence)
            this.$axios.post(`/api/story/calculate`, {
                sentence: this.sentences.data[this.page-1].sentence,
                read: this.read
            }).then(response => {
                console.log(response.data)
                this.pronounciation = parseInt(this.pronounciation) + parseInt(response.data)
                return
            });
        },
        findDuplicate(str, type) {
            if(str.charAt(str.length-1) == '.') {
                str = str.slice(0, -1)
            }
            const dupes = [];
            const strLowerCase = str.toLowerCase();
            const strArr = strLowerCase.split(" ");
            if(type == 'read') {
                this.readRes = strArr;
            } else {
                this.sentenceRes = strArr;
            }
            const wordFreqCounter = {};

            strArr.forEach((word) => {
                if (!wordFreqCounter[word]) {
                    wordFreqCounter[word] = 1;
                } else {
                    wordFreqCounter[word] += 1;
                }
            });

            let allKeys = Object.keys(wordFreqCounter);

            allKeys.forEach((key) => {
                if (wordFreqCounter[key] > 1) {
                    dupes.push(key);
                }
            });

            return dupes;
        },
        computeErrors() {
            if(!this.checkError) {
                for (var i = 0; i < this.wordCount; i++) {
                    if(this.sentenceRes[i] != this.readRes[i+1]) {
                        this.errors = this.errors + 1
                    }
                }
            }
            return
        },
        playError() {
            this.cardWrong = true
            const audio = new Audio(`${this.baseUrl}sounds/Negative-sound-effect2.mp3`)
            audio.play()
        },
        playCorrect() {
            this.cardCorrect = true
            const audio = new Audio(`${this.baseUrl}sounds/Correct-answer.mp3`)
            audio.play()
        }
  },
  mounted() {
    if(!this.loggedIn) {
      this.$router.push("/login");
    } else {
    this.$q.loading.show({
        spinner: QSpinnerBars, // ms,
        backgroundColor: 'primary',
        message: 'Fetching Story',
        messageColor: 'white'
    })
      this.getData();
      this.getGrade();
    }
  },
  created() {
    //   this.playCorrect()
  }
}
</script>
<style lang="css">
    .ql-align-right {
        text-align: right;
    }
    .ql-align-left {
        text-align: left;
    }
    .ql-align-center {
        text-align: center;
    }
    .ql-align-justify {
        text-align: justify;
    }
    .ql-container {
        max-height: 200px; overflow-y: scroll
    }
</style>