<template>
  <div class="strackOut">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  <!--
    <WantedPaper
      name="aaaaa"
      prizeMoney="bbbb"
      image="cccc"
      warning="dddd" />
  -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import WantedPaper from '@/components/WantedPaper.vue';

@Component({
  components: {
    // HelloWorld,
    WantedPaper,
  },
})
export default class StrackOut extends Vue {}
</script>
