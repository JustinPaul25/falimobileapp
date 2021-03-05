<template>
  <q-page class="q-py-md full-height">
        <div class="full-height">
            <div class="q-gutter-sm q-mb-md flex justify-end q-pr-md full-width">
                <!-- <q-btn clickable :to="`/stories/${$route.params.id}/terms`" round color="primary q-px-sm" label="Important Terms" /> -->
                <q-btn v-show="showQuizButton" clickable :to="`/stories/${this.$route.params.id}/quiz`" round color="primary q-px-sm" label="Take Quiz" />
                <q-btn clickable :to="'/stories'" round color="primary" icon="keyboard_arrow_left" />
            </div>
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
                <div class="text-h4 text-center text-weight-bold text-grey-10">{{ sentence.sentence }}</div>
            </q-layout>
            <div v-if='showSubmitButton'>
                <div class="flex q-mt-sm q-pt-xl">
                    <q-btn @click="submitGrade()" class="q-ml-auto full-width" color="primary" label="Proceed To Quiz" :size="'lg'" />
                </div>
            </div>
            <div v-else>
                <div v-show="page != 0" class="q-gutter-sm flex justify-between q-pr-md full-width" style="margin-top: 1px">
                    <div v-if="page > 1">
                        <q-btn clickable @click="prevPage()" round color="primary q-pa-xs" icon="arrow_left"/>
                    </div>
                    <div v-else>
                        <q-btn round color="primary q-pa-xs" icon="arrow_left"/>
                    </div>
                    <div>
                        <q-btn v-show="page != 0" clickable @click="!btnStop ? record('record') : stop()" round color="primary q-pa-sm" :icon="!btnStop ? 'mic' : 'stop'"/>
                    </div>
                    <div>
                        <q-btn clickable @click="nextPage()" round color="primary q-pa-xs" icon="arrow_right"/>
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
import { QSpinnerFacebook } from 'quasar'
import axios from "axios";

export default {
  name: 'PageIndex',
  data() {
      return {
          page: 0,
          text: '',
          read: '',
          sentencesLength: 0,
          continuous: true,
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
      }
  },
  computed: {
      ...mapGetters({
          loggedIn: 'user/loggedIn',
          story: 'story/story',
          details: 'user/details',
          sentences: 'story/sentences',
          grades: 'grade/grades'
      }),
  },
  methods: {
    ...mapActions('story', ['getStory', 'getSentences', 'submitResult']),
    ...mapActions('grade', ['getGrades']),
      playAudio () {
        this.$speechTalkCordova(this.sentences.data[this.page-1].sentence)
      },
      getData() {
          this.getStory({
            id: this.$route.params.id
          }).then(() => {
            this.sentencesLength = this.sentences.data.length
          }) 
          this.checkGrade();
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
      nextPage() {
            if(this.page < this.sentencesLength) {
                this.page = this.page + 1
            } else {
                this.showSubmitButton = true
            }
            this.record('next')
            this.timer = setTimeout(() => {
                this.stop()
            }, 1000)
      },
      submitGrade() {
        var errors = this.pronounciation + this.repitition + this.transposition + this.insertion + this.omission + this.substitution
        console.log(errors)
        this.submitResult({
            material_id: this.$route.params.id,
            student_id: this.details.id,
            errors: errors,
            studentReading: this.studentReading
        })
        this.$router.push(`/stories/${this.$route.params.id}/terms`);
      },
      prevPage() {
            this.page = this.page - 1
      },
      record (type) {
            if(type == 'record') {
                this.$q.loading.show({
                message: 'Start Reading After Loading'
                })
                this.timer = setTimeout(() => {
                    this.$q.loading.hide()
                    this.timer = void 0
                }, 3000)
            }
            this.text = ''
            this.btnStop = true
            this.$speechToText.start("en-US", 'waitingAudioDesc', this.continuous)
            .then((suc) => {
            this.text += ' ' + suc
            this.studentReading = this.studentReading + ' ' + suc
            this.read = this.text.toUpperCase()
            this.computeResult()
            })
            .catch(() => {
                this.btnStop = false
            })
        },
        stop () {
            this.$speechToText.stop()
            this.btnStop = false
        },
        async computeResult() {
            const res1 = await this.findDuplicate(this.sentences.data[this.page-1].sentence, 'sentence');
            this.wordCount = this.sentenceRes.length
            const res2 = await this.findDuplicate(this.read, 'read');
            if(res1.length != res2.length) {
                for (var i = 0; i < res1.length; i++) {
                    if(res1[i] != res2[i+1]) {
                        this.repitition = this.repitition + 1
                    }
                } 
            }
            this.checkPronounce();
            this.checkOmmission();
            this.checkTransposition();
        },
        checkTransposition() {
            for(var ctr = 1; ctr < this.readRes.length;ctr++) {
                if(this.readRes[ctr] != this.sentenceRes[ctr-1]) {
                    this.transposition = this.transposition + 1
                }
            }
        },
        checkOmmission() {
            var sentence = this.text.toLowerCase()
            for(var ctr = 0; ctr < this.sentenceRes.length;ctr++) {
                var str_pos = sentence.indexOf(this.sentenceRes[ctr]);
                if (str_pos > -1) {

                } else {
                    this.omission = this.omission + 1
                }
            }
        },
        checkPronounce() {
            var sentence = this.sentences.data[this.page-1].sentence.toLowerCase()

            if(sentence.charAt(sentence.length-1) == '.') {
                sentence = sentence.slice(0, -1)
            }
            for(var ctr = 1; ctr < this.readRes.length;ctr++) {
                var str_pos = sentence.indexOf(this.readRes[ctr]);
                if (str_pos > -1) {
                    
                } else {
                    this.pronounciation = this.pronounciation + 1
                    this.substitution = this.substitution + 1
                    // this.insertion = this.insertion + 1
                }
            }
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
            for (var i = 0; i < this.wordCount; i++) {
                if(this.sentenceRes[i] != this.readRes[i+1]) {
                    this.errors = this.errors + 1
                }
            }
            return
        }
  },
  mounted() {
    if(!this.loggedIn) {
      this.$router.push("/login");
    } else {
      this.getData();
      this.getGrade();
    }
  },
  created() {
      
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