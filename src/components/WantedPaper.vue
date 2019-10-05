<template>
  <div class="wantedPaper" id="wantedPaper">
    <div class="image-bg m-4" @click="onTouched($event, uuid)">
      <div class="row">
        <div class="col-12">
          <img src="data:image/png;base64,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"
                class="wanted-image"/>
        </div>
      </div>
      <div class="row mt-3 py-0">
        <div class="col-12 my-0 py-0">
          <img :src="image" class="target-image"/>
        </div>
      </div>
      <div class="row my-0 py-0">
        <div class="col-12 my-0 py-0">
          <div>{{ name }}</div>
          <div>{{ prize_money }}</div>
          <div>{{ warning }}</div>
        </div>
      </div>
      <div v-if="is_done" class="done-layer">
      </div>
      <div v-if="is_done" class="done-layer-text">
        <div>
          <i>
            Done !
          </i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import WantedPaperDesignedModel from '@/app.codebehinds/strackout/WantedPaper.designedmodel.ts';

@Component
export default class WantedPaper extends Vue {
  @Prop() protected uuid!: string;
  @Prop() protected name!: string;
  @Prop() protected prize_money!: string;
  @Prop() protected image!: string;
  @Prop() protected msg!: string;
  @Prop() protected warning!: string;
  @Prop() protected done!: string;
  @Prop() protected is_done!: boolean;

  constructor(){
    super();
  }
  protected onTouched() {
    // 親Viewへ通知
    this.$emit('onTouchedBubbleEvent');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#wantedPaper .image-bg{
  position: relative; /* Done 時のレイヤー用 */
  min-height: 320px;
  min-width: 230px;
  border: solid 1px lightgray;
}
#wantedPaper .done-layer {
  position: absolute;
  background: black;
  opacity: 0.75;
  width: 100%;
  height: 100%;
  top: 0;
}
#wantedPaper .done-layer-text {
  position: absolute;
  color:white;
  width: 100%;
  top: 45%;
  font-size: 32px;
}
#wantedPaper .wanted-image {
  width: 60px;
  height: 30px;
}
#wantedPaper .target-image {
  min-width: 75%;
  max-width: 75%;
  min-height: 75%;
  max-height: 75%;
  /*
  margin:auto;
  margin-top: 70px;
  min-width:120px;
  min-height: 120px;
  */
}
</style>
