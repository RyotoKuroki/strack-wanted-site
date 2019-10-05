<template>
  <div class="strackOut container">
    <div class="row">
      <div class="col-12 col-sm-6 col-md-4" v-for="(row, uuid) in codeBehind.papers" :key="uuid" >
        <WantedPaper
          :uuid="row.uuid"
          :name="row.name"
          :prize_money="row.prize_money"
          :warning="row.warning"
          :image="row.image_base64"
          :done="row.done"
          @onTouchedBubbleEvent="codeBehind.SaveDone(row)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import WantedPaper from '@/components/WantedPaper.vue';
import StrackOutBehind from '@/app.codebehinds/strackout/StrackOutBehind.ts';
import TrWanted from '@/app.entities/TrWanted.ts';

@Component({
  components: {
    // HelloWorld,
    WantedPaper,
  },
})
export default class StrackOut extends Vue {

  protected codeBehind = new StrackOutBehind();

  constructor() {
    super();
  }
}
</script>
