<template>
  <q-page class="full-height bg-indigo-1">
    <div>
        <div class="flex q-mt-sm justify-end q-pr-md full-width">
            <q-btn clickable :to="'/menu'" round color="primary" icon="keyboard_arrow_left" />
        </div>
    </div>
    <div>
        <b class="q-ml-sm text-weight-bolder">Full Name: <p class="q-ml-md text-primary text-h5">{{details.last_name}}, {{details.first_name}} {{details.middle_name}}</p></b>
        <b class="q-ml-sm text-weight-bolder">Section: <p class="q-ml-md text-primary text-h5">{{details.section.name}}</p></b>
        <b class="q-ml-sm text-weight-bolder">Address: <p class="q-ml-md text-primary text-h5">{{details.address}}</p></b>
        <b class="q-ml-sm text-weight-bolder">Gender: <p class="q-ml-md text-primary text-h5">{{details.gender == 1 ? 'Male' : 'Female'}}</p></b>
        <b class="q-ml-sm text-weight-bolder">Birth Date: <p class="q-ml-md text-primary text-h5">{{details.birth_date ? details.birth_date : 'no data'}}</p></b>
        <b class="q-ml-sm text-weight-bolder">Age: <p class="q-ml-md text-primary text-h5">{{details.birth_date ? calculateAge(details.birth_date) : 'no data'}}</p></b>
        <b class="q-ml-sm text-weight-bolder">Father's Name: <p class="q-ml-md text-primary text-h5">{{details.father_name}}</p></b>
        <b class="q-ml-sm text-weight-bolder">Father's Contact No.: <p class="q-ml-md text-primary text-h5">+63 {{details.father_contact_no}}</p></b>
        <b class="q-ml-sm text-weight-bolder">Mother's Name: <p class="q-ml-md text-primary text-h5">{{details.mother_name}}</p></b>
        <b class="q-ml-sm text-weight-bolder">Mother's Contact No.: <p class="q-ml-md text-primary text-h5">+63 {{details.mother_contact_no}}</p></b>
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
      calculateAge(input) {
            var parts = input.match(/(\d+)/g);
            var newInput = new Date(parts[0], parts[1]-1, parts[2]);
            var ageDifMs = Date.now() - newInput.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
      },
  },
  mounted() {
    if(!this.loggedIn) {
      this.$router.push("/login");
    } else {
      console.log(this.details)
    }
  }
}
</script>
