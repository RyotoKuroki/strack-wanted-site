<template>
  <div class="strackOut container">
    <div class="row">
      <div class="col-12 col-md-12" v-for="(row, uuid) in codeBehind.papers" :key="uuid" >
        <WantedPaper
          :name="row.name"
          :prize_money="row.prize_money"
          :warning="row.warning"
          :image="row.image_base64"
          :image_bg ="row.BG_IMAGE" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import WantedPaper from '@/components/WantedPaper.vue';
import StrackOutBehind from '@/app.codebehind/StrackOutBehind.ts';
import TrWanted from '@/app.entities/TrWanted.ts';

@Component({
  components: {
    // HelloWorld,
    WantedPaper,
  },
})
export default class StrackOut extends Vue {

  codeBehind = new StrackOutBehind();

  constructor() {
    super();
  }
}
</script>
