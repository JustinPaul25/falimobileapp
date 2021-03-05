<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-show="loggedIn" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          {{title}}
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-show="loggedIn"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import { mapGetters } from 'vuex'

const linksData = [
  {
    title: 'Home',
    caption: '',
    icon: 'house',
    link: '/'
  },
  {
    title: 'Account Settings',
    caption: '',
    icon: 'settings',
    link: '/settings'
  },
];

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      title: 'FALI Reading Comprehension'
    }
  },

  watch: {
    $route(to, from) {
      if(to.path == "/menu") {
        this.title = 'Menu'
      } else if (to.path == "/result") {
        this.title = 'Result'
      } else if (to.path == "/progress") {
        this.title = 'Progress'
      } else if (to.path == "/tutorials") {
        this.title = 'Tutorials'
      } else if (to.path.includes("/quiz")) {
        this.title = 'Quiz'
      } else if (to.path.includes("/terms")) {
        this.title = 'Important Terms'
      } else if (to.path.includes("/stories")) {
        this.title = 'Stories'
      } else {
        this.title = 'FALI Reading Comprehension'
      }
    }
  },

  computed: {
      ...mapGetters({
          loggedIn: 'user/loggedIn',
      }),
  },
}
</script>
