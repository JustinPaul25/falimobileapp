<template>
  <q-page class="q-mx-md full-height">
    <div class="q-my-lg">
      <p class="text-center text-primary text-weight-bold text-h4">
        Hi There!<br>
        {{ student.first_name }}
      </p>
    </div>
    <div class="flex flex-center q-mt-lg q-mb-lg">
      <img
        alt="Quasar logo"
        src="~assets/greeting.png"
        width="80%"
      >
    </div>
    <q-btn clickable :to="'/menu'" :size="'lg'" class="full-width q-my-md" color="primary" push>
      <div class="row items-center no-wrap">
        <q-icon left name="apps" />
        <div class="text-center text-weight-bold">
          Menu
        </div>
      </div>
    </q-btn>
    <q-btn clickable :to="'/profile'" :size="'lg'" class="full-width q-mb-md" color="primary" push>
      <div class="row items-center no-wrap">
        <q-icon left name="account_box" />
        <div class="text-center text-weight-bold">
          Profile
        </div>
      </div>
    </q-btn>
    <!-- <q-btn @click="logout()" :size="'lg'" class="full-width" color="primary" push>
      <div class="row items-center no-wrap">
        <q-icon left name="exit_to_app" />
        <div class="text-center text-weight-bold">
          Logout
        </div>
      </div>
    </q-btn> -->
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
      onLogout() {
          this.logout()
      }
  },
  mounted() {
    if(!this.loggedIn) {
      this.$router.push("/login");
    }
  }
}
</script>
