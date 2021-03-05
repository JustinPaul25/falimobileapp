<template>
  <q-page class="q-py-md full-height">
        <div class="full-height">
            <div class="q-gutter-sm q-mb-md flex justify-end q-pr-md full-width">
                <q-btn clickable :to="`/stories/${$route.params.id}`" round color="primary" icon="keyboard_arrow_left" />
            </div>
        </div>
        <q-layout view="lHh Lpr lFf" container style="height: 500px" class="rounded-borders">
            <q-intersection
                v-for="term in terms"
                :key="term.id"
                transition="scale"
                class="example-item"
            >
                <q-card class="q-ma-sm">
                <img :src="term.file_url">

                <q-card-section class="bg-primary text-white">
                    <div class="text-h6 text-weight-bold">{{ term.word }}</div>
                    <div class="text-subtitle2">{{ term.definition }}</div>
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

      }
  },
  computed: {
      ...mapGetters({
          loggedIn: 'user/loggedIn',
          terms: 'term/terms',
          details: 'user/details'
      }),
  },
  methods: {
    ...mapActions('term', ['getTerms']),
      getDatas() {
          this.getTerms({
            id: this.$route.params.id
          })
      },
      takeQuiz() {
        this.$router.push(`/stories/${this.$route.params.id}/quiz`);
      }
  },
  mounted() {
    if(!this.loggedIn) {
      this.$router.push("/login");
    } else {
      this.getDatas();
    }
  }
}
</script>