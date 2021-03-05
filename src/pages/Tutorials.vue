<template>
  <q-page class="q-py-md full-height">
      <div v-if="video == null" class="flex flex-center q-mb-md">
        <div class="q-gutter-sm q-mb-md flex justify-end q-pr-md full-width">
            <q-btn clickable :to="'/menu'" round color="primary" icon="keyboard_arrow_left" />
        </div>
        <img
          alt="Quasar logo"
          src="~assets/8600.jpg"
          width="100%"
        >
      </div>
      <div v-else>
        <div class="row">
          <div class="col">
            <p class="text-h5 q-ml-sm text-white text-weight-bold" style="line-height: 20px">{{ video.title }}<br><span class="text-caption">{{ video.uploader }}</span></p>
          </div>
          <div class="col">
            <div class="q-gutter-sm q-mb-md flex justify-end q-pr-md full-width">
              <q-btn clickable :to="'/menu'" round color="primary" icon="keyboard_arrow_left" />
              <q-btn clickable @click="video = null" round color="primary" icon="cancel_presentation" />
            </div>
          </div>
        </div>
        <video width="100%" :src="video.video" :type="video.file_type" autoplay controls></video>
      </div>
     <q-layout view="lHh Lpr lFf" container style="height: 200px" class="rounded-borders">
      <q-header elevated>
        <q-toolbar>
          <q-toolbar-title>
            <strong>Videos</strong>
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding>
          <div class="full-width">
            <q-item v-for="tutorial in tutorials"
              clickable
              @click="video = tutorial"
              v-ripple
              v-bind:data="tutorial"
              v-bind:key="tutorial.id"
              class="bg-orange-2 rounded">
              <q-item-section avatar>
                <q-avatar square>
                  <img :src="tutorial.thumbnail" draggable="false">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <p class="text-h6 text-primary text-weight-bold" style="line-height: 15px">
                  {{ tutorial.title }}<br>
                  <span class="text-black text-weight-light text-caption">{{ tutorial.uploader }}</span>
                </p>
              </q-item-section>
            </q-item>
          </div>

          <!-- place QPageScroller at end of page -->
          <q-page-scroller expand position="top" :scroll-offset="150" :offset="[0, 0]">
            <div class="col cursor-pointer q-pa-sm bg-accent text-white text-center">
              Scroll back up...
            </div>
          </q-page-scroller>
        </q-page>
      </q-page-container>
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
          video:null,
      }
  },
  computed: {
      ...mapGetters({
          tutorials: 'tutorial/tutorials',
          loggedIn: 'user/loggedIn',
      }),
  },
  methods: {
    ...mapActions('tutorial', ['getTutorials']),
      getVideos() {
          this.getTutorials()
      },
  },
  created() {
    this.getVideos();
  },
  mounted() {
    if(!this.loggedIn) {
      this.$router.push("/login");
    }
  }
}
</script>
