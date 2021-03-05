<template>
  <q-page class="full-height bg-indigo-1">
    <div>
        <div class="flex q-mt-sm justify-end q-pr-md full-width">
            <q-btn clickable :to="'/menu'" round color="primary" icon="keyboard_arrow_left" />
        </div>
    </div>
    <div class="q-py-sm">
      <p class="text-center text-primary text-weight-bold text-h4">
        Hello {{details.first_name}} here is your overall progress
      </p>
    </div>
    <div class="flex flex-center q-mt-lg">
      <img
        alt="Quasar logo"
        src="~assets/greeting.png"
        width="80%"
      >
    </div>
    <div class="q-pa-sm flex justify-center">
        <p class="text-center text-primary text-weight-bold text-h4">
            Very Good!
        </p>
        <q-rating
        :value="calculateValue()"
        size="xl"
        :max="5"
        color="primary"
        >
        <template v-slot:tip-1>
            <q-tooltip>Not bad</q-tooltip>
        </template>
        <template v-slot:tip-2>
            <q-tooltip>Good</q-tooltip>
        </template>
        <template v-slot:tip-3>
            <q-tooltip>Very good!</q-tooltip>
        </template>
        <template v-slot:tip-4>
            <q-tooltip>Excellent!</q-tooltip>
        </template>
        <template v-slot:tip-5>
            <q-tooltip>Perfect!</q-tooltip>
        </template>
        </q-rating>
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
        ratingModel: 5,
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
      calculateValue() {
        var total = 0;
        var numberOfGrades = this.grades.length;
        for(var ctr = 0; ctr < this.grades.length; ctr++) {
          var result = (this.grades[ctr].comprehension + this.grades[ctr].reading)/2
          total = total + result
        }
        if(total/numberOfGrades < 59) {
          return 3
        }
        if(total/numberOfGrades > 58 && total/numberOfGrades < 80) {
          return 4
        }
        if(total/numberOfGrades > 79) {
          return 5
        }
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
