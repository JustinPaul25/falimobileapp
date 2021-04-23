<template>
  <q-page class="q-py-sm full-height">
    <div class="q-my-sm">
      <p class="text-center text-primary text-weight-bold text-h4">
        Hi There!<br>
        {{ student.first_name }}
      </p>
    </div>
    <div class="flex flex-center q-mt-lg q-mb-lg">
      <img
        alt="Quasar logo"
        src="~assets/greeting.png"
        width="30%"
      >
    </div>
    <div class="full-height">
        <div class="row">
            <div class="col flex flex-center q-px-md">
                <q-btn clickable :to="'/stories'" class="full-width bg-primary">
                    <q-img
                        class="q-mt-md"
                        src="~assets/story.png"
                        width="100%"
                    />
                    <p class="q-ma-none q-pt-sm text-white text-weight-bold">
                        Stories
                    </p>
                </q-btn>
            </div>
            <div class="col flex flex-center q-px-md">
                <q-btn clickable :to="'/tutorials'"  class="full-width bg-primary">
                    <q-img
                        class="q-mt-md"
                        src="~assets/tutorial.png"
                        width="84%"
                    />
                    <p class="q-ma-none q-pt-sm text-white text-weight-bold">
                        Tutorials
                    </p>
                </q-btn>
            </div>
        </div>
        <div class="row q-pt-lg q-mb-auto">
            <div class="col flex flex-center q-px-md">
                <q-btn clickable :to="'/progress'" class="full-width bg-primary">
                    <q-img
                        class="q-mt-md"
                        src="~assets/mp.png"
                        width="100%"
                    />
                    <p class="q-ma-none q-pt-sm text-white text-weight-bold">
                        Progress
                    </p>
                </q-btn>
            </div>
            <div class="col flex flex-center q-px-md">
                <q-btn clickable :to="'/result'" class="full-width bg-primary">
                    <q-img
                        class="q-mt-md"
                        src="~assets/results.png"
                        width="84%"
                    />
                    <p class="q-ma-none q-pt-sm text-white text-weight-bold">
                        Results
                    </p>
                </q-btn>
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
  computed: {
      ...mapGetters({
          loggedIn: 'user/loggedIn',
          student: 'user/details'
      }),
  },
  methods: {
    ...mapActions('user', ['logout']),
    ...mapActions('grade', ['getGrades']),
      onLogout() {
          this.logout()
      },
      getGrade() {
        this.getGrades({
          id: this.student.id
        })
      },
  },
  mounted() {
    if(!this.loggedIn) {
      this.$router.push("/login");
    }
    this.getGrades()
  }
}
</script>
