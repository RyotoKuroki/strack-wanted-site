<template>
  <div class="bingoBook container">
  <!--
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  -->
  <div class="row">
    <div class="col-12" v-for="(item, rownum) in bingoBookBehind.WantedList" :key="rownum">
      <div class="col-6">
        <div class="card" style="width: 18em;">
          <img class="card-img-top" src="" alt="ターゲット！" />
          <div class="card-body">
            <h5 class="card-title">{{item.plize_money}}</h5>
            <p class="card-text">{{item.warning}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import BingoBookBehind from '@/app.viewmodels/BingoBookBehind.ts';

@Component({
  components: {
    HelloWorld,
  },
})
export default class BingoBook extends Vue {
  protected bingoBookBehind: BingoBookBehind = new BingoBookBehind();
  constructor() {
    super();
    // this._BingoBookBehind = new BingoBookBehind();
  }
}
</script>
