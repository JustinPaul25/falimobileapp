<template>
  <q-page class="flex bg-svg">
        <div class="flex flex-center q-pt-md q-pb-sm relative-position">
            <img
            class="bg-transparent"
            alt="login_illustration"
            src="~assets/login.png"
            width="65%"
                >
        </div>
        <q-card class="q-card full-height full-width q-px-lg q-mb-auto bg-transparent q-border-radius no-box-shadow">
            <q-card-section class="bg-white q-mb-lg">
                <div class="row text-h7 text-weight-bolder text-primary">
                    <div class="col-3 q-pr-lg q-pb-sm">
                        <img
                        alt="login_illustration"
                        src="~assets/logo.png"
                        width="50px"
                        height="50px"
                            >
                    </div>
                    <div class="col-9 q-mt-auto">
                        <p style="line-height: 1; font-size: 18px">FALI Student Reading<br> Comprehension App</p>
                    </div>
                </div>
                <div>
                    <q-input class="q-py-md full-width input-secondary" standout="bg-secondary text-white" color="secondary" v-model="username" type="text" label="Username" :dense="dense"/>
                    <q-input v-model="password" standout="bg-secondary text-white" color="secondary" filled :type="isPwd ? 'password' : 'text'" label="Password" :dense="dense">
                        <template v-slot:append>
                        <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                        />
                        </template>
                    </q-input>
                </div>
                <div class="flex q-mt-sm">
                    <q-btn @click="onSubmit()" class="q-ml-auto full-width" color="primary" label="Login" :size="'lg'" />
                </div>
            </q-card-section>
        </q-card>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

export default {
    name: 'Login',
    data() {
        return {
            username:'',
            password:'',
            isPwd: true,
            dense: false
        }
    },
    computed: {
        ...mapGetters({
            loggedIn: 'user/loggedIn',
        }),
    },
    methods: {
        ...mapActions('user', ['login']),
        onSubmit() {
            this.login({
                username: this.username,
                password: this.password
            })
        }
    },
    created() {
        if(this.loggedIn) {
            this.$router.push("/");
        }
    }
}
</script>

<style lang="sass">
    .image-position
        top: 10px;
    .bg-svg
        background-image: url(../statics/wave.svg);
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-position: bottom;
        background-color: #ed8936;
    .bg-wave

    .wave-2
        bottom: 0px;
</style>
