<template>
  <q-page class="flex bg-svg">
        <q-card class="q-card full-height full-width q-px-lg q-mt-lg q-mb-auto bg-transparent q-border-radius no-box-shadow">
            <q-card-section class="bg-white q-mb-lg">
                <div>
                    <b v-show="invalid">Password not match</b>
                    <b v-show="success">Password change successfully</b>   
                    <q-input v-model="password" standout="bg-secondary text-white" color="secondary" filled :type="isPwd ? 'password' : 'text'" label="Password" :dense="dense">
                        <template v-slot:append>
                        <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                        />
                        </template>
                    </q-input>
                    <q-input v-model="retypepassword" standout="bg-secondary text-white" color="secondary" filled :type="isPwd1 ? 'password' : 'text'" label="Retype Password" :dense="dense">
                        <template v-slot:append>
                        <q-icon
                            :name="isPwd1 ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd1 = !isPwd1"
                        />
                        </template>
                    </q-input>
                </div>
                <div class="flex q-mt-sm">
                    <q-btn @click="onSubmit()" class="q-ml-auto full-width" color="primary" label="Change Password" :size="'lg'" />
                </div>
            </q-card-section>
        </q-card>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import { debounce } from 'quasar'
import axios from "axios";

export default {
    name: 'Login',
    data() {
        return {
            retypepassword:'',
            password:'',
            isPwd: true,
            isPwd1: true,
            dense: false,
            invalid: false,
            success: false
        }
    },
    watch: {
        password: debounce(function(newVal){
            this.checkPassword()
        }, 300),
        retypepassword: debounce(function(newVal){
            this.checkPassword()
        }, 300)
    },
    computed: {
        ...mapGetters({
            loggedIn: 'user/loggedIn',
            student: 'user/details'
        }),
    },
    methods: {
        onSubmit() {
            if(this.invalid && (this.password == '' || this.retypepassword == '')) {
               this.invalid = true
               return
            } else {
                if(!this.invalid) {
                    this.submit()
                    this.password = ''
                    this.retypepassword = ''
                    this.success = true
                }
            }
        },
        async submit() {
            await axios.put(`api/change-password/${this.student.id}`, {password: this.password})
            this.invalid = false
        },
        checkPassword() {
            setTimeout(() => this.success = false, 3000);
            if(this.password != this.retypepassword) {
                if(this.password == '' || this.retypepassword == '') {
                    this.invalid = false
                }else {
                    this.invalid = true
                }
            } else {
                this.invalid = false
            }
        }
    },
    created() {
        console.log(this.student)
    },
    mounted() {
        if(!this.loggedIn) {
            this.$router.push("/login");
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
