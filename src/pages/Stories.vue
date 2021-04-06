<template>
  <q-page class="q-py-md full-height">
        <div class="full-height">
            <div class="q-gutter-sm q-mb-md flex justify-end q-pr-md full-width">
                <q-btn clickable :to="'/menu'" round color="primary" icon="keyboard_arrow_left" />
            </div>
        </div>
        <div class="full-height">
          <q-layout view="lHh Lpr lFf" container v-bind:style="{ height: mobileHeight + 'px' }" class="rounded-borders">
              <q-intersection
                  v-for="(story, index) in stories"
                  :key="story.id"
                  transition="scale"
                  class="example-item"
              >
                  <q-card clickable
                  @click="toStory(story.id)"
                  class="q-ma-sm">
                    <img :src="story.img_url">

                    <q-card-section class="bg-primary text-white">
                        <div class="text-h6 text-weight-bold">{{`${index+1}. ${story.title}` }}</div>
                    </q-card-section>
                  </q-card>
              </q-intersection>
          </q-layout>
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
      getStory() {
          this.getStories({
            id: this.details.section_id
          })
      },
      toStory(id) {
        this.$router.push(`/stories/${id}`);
      }
  },
  mounted() {
    if(!this.loggedIn) {
      this.$router.push("/login");
    } else {
      this.getStory();
    }
  },
  created() {
    console.log(window.innerHeight);
  }
}
</script>