<template>
  <div class="bingoBook container">
    <div class="row">
      <div class="col-12">
        <div class="row" v-for="(row, uuid) in codeBehind.rows" :key="uuid">
          <div class="col-4 col-sm-4">
            <img class="target-image" />
          </div>
          <div class="col-8 col-sm-8">
            <div class="row">
              <div class="col-12 col-sm-12">
                <input type="text" v-model="row.name" class="target-name" />
              </div>          
            </div>
            <div class="row">
              <div class="col-12 col-sm-12">
                <input type="text" v-model="row.prize_mmoney" />
              </div>          
            </div>
            <div class="row">
              <div class="col-12 col-sm-12">
                <input type="text" v-model="row.warning" />
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-sm-12">
                <input type="button" class="btn btn-info btn-sm btn-block" value="save" />
              </div>
            </div>
          </div>
          <div class="col-12">
            <hr class="m-1 p-0" style="color: gray;" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
// import RowView from '@/components/BingoBook.RowView.vue';
import BingoBookBehind from '@/app.viewmodels/BingoBookBehind.ts';
// import Row from '@/app.viewmodels/BingoBookBehind.ts';
import TrWanted from '@/app.entities/TrWanted.ts';

@Component({
  components: {
    // HelloWorld,
    // RowView,
  },
})
export default class BingoBook extends Vue {

  codeBehind = new BingoBookBehind();

  constructor() {
    super();
  }
}
</script>
<style>

.target-image {
  width:100%;
  height:100%;
  min-height: 120px;
  min-width: 100px;
  background: #aaa;
}
.target-name-label {
  font-size: x-small;
  background: gray;
  color: white;
}
.target-warning {
  width: 98%;
}
input[type=text] {
  height: 22px;
  width: 98%;
  margin: 0;
}
</style>