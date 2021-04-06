<template>
  <q-page class="q-py-md full-height bg-indigo-11">
        <div class="full-height">
            <div class="q-gutter-sm q-mb-md flex justify-end q-pr-md full-width">
                <q-btn clickable :to="'/menu'" round color="primary" icon="keyboard_arrow_left" />
            </div>
        </div>
        <q-layout view="lHh Lpr lFf" container v-bind:style="{ height: mobileHeight + 'px' }" class="rounded-borders">
            <q-intersection
                v-for="(story, index) in stories"
                :key="story.id"
                transition="scale"
                class="example-item"
            >
                <q-card 
                class="q-ma-sm">
                    <q-img
                        :src="story.img_url"
                        style="width: 100%"
                        >
                        <div class="absolute-bottom text-orange-1 text-h5 text-center">
                            {{ story.title }}
                        </div>
                    </q-img>
                  <q-card-section class="text-white">
                      <div class="q-px-xl flex justify-center">
                        <p class="text-center text-primary text-weight-bold text-h5">
                            {{ comment(story) }}
                        </p>
                        <q-rating
                        :value="calculateValue(story)"
                        size="lg"
                        :max="5"
                        color="primary"
                        class="q-ml-auto q-mr-auto"
                        >
                        </q-rating>
                    </div>
                  </q-card-section>
                </q-card>
            </q-intersection>
        </q-layout>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

export default {
  name: 'PageIndex',
  data() {
      return {
        mobileHeight: window.innerHeight - 50
      }
  },
  computed: {
      ...mapGetters({
          loggedIn: 'user/loggedIn',
          stories: 'story/stories',
          details: 'user/details',
          grades: 'grade/grades'
      }),
  },
  methods: {
    ...mapActions('story', ['getStories']),
    ...mapActions('grade', ['getGrades']),
      async getStory() {
          await this.getStories({
            id: this.details.section_id
          }).then((response) => {
              this.getGrades({
                id: this.details.id
              })
          });
      },
      toStory(id) {
        this.$router.push(`/stories/${id}`);
      },
      calculateValue(story) {
        for(var ctr = 0; ctr < this.grades.length; ctr++) {
            if(this.grades[ctr].reading_material_id == story.id) {
                if(this.grades[ctr].comprehension == null || this.grades[ctr].reading == null) {
                  return 0
                } else {
                  var result = (this.grades[ctr].comprehension + this.grades[ctr].reading)/2
                  if(result < 59) {
                    return 3
                  }
                  if(result > 58 && result < 80) {
                    return 4
                  }
                  if(result > 79) {
                    return 5
                  }
                }
            }
        }
        return 0
      },
      comment(story) {
        for(var ctr = 0; ctr < this.grades.length; ctr++) {
            if(this.grades[ctr].reading_material_id == story.id) {
                if(this.grades[ctr].comprehension == null || this.grades[ctr].reading == null) {
                  return 'Complete The Activity First'
                } else {
                  var result = (this.grades[ctr].comprehension + this.grades[ctr].reading)/2
                  if(result < 20.01) {
                    return 'Good'
                  }
                  if(result > 20 && result < 40.01) {
                    return 'Very Good'
                  }
                  if(result > 40 && result < 60.01) {
                    return 'Excellent'
                  }
                  if(result > 60 && result < 80.01) {
                    return 'Great'
                  }
                  if(result == 100) {
                    return 'Incredibly Good'
                  }
                }
            }
        }
        return 'Complete The Activity First'
      }
  },
  mounted() {
    if(!this.loggedIn) {
      this.$router.push("/login");
    } else {
      this.getStory();
    }
  }
}
</script>