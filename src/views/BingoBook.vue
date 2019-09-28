<template>
  <div class="bingoBook container">
    <div class="row">
      <div class="col-12">
        <div class="row" v-for="(row, uuid) in codeBehind.rows" :key="uuid">
          <div class="col-4 col-sm-4">
            <div class="row">
              <div class="col-12">
                <img class="target-image"
                      style="opacity: 0.2;"
                      v-bind:class="{dummyimage:row.image === undefined || row.image.length === ''}"
                      v-bind:src="row.image" />
              </div>
            </div>
            <div class="row">
              <div class="col-9 text-center px-0">
                <label class="px-2" style="font-size: smaller;"><u>画像選択</u>
                  <input type="file" class="form-control m-0 p-0" style="display: none;"
                          @click="codeBehind.ClickRow($event, row)"
                          @change="codeBehind.SelectImage($event)" />
                </label>
              </div>
              <div class="col-3 text-right px-0">
                <input type="button" value="×" class="btn btn-sm m-0 p-0" />
              </div>
            </div>
          </div>
          <div class="col-8 col-sm-8">
            <div class="row">
              <div class="col-12 col-sm-12">
                <input type="text" v-model="row.name" class="form-control-sm form-control" placeholder="ターゲット名" />
              </div>          
            </div>
            <div class="row">
              <div class="col-12 col-sm-12">
                <input type="number" v-model="row.prize_mmoney" class="form-control-sm form-control" placeholder="懸賞金額" />
              </div>          
            </div>
            <div class="row">
              <div class="col-12 col-sm-12">
                <input type="text" v-model="row.warning" class="form-control-sm form-control" placeholder="要注意！！" />
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-sm-12 mt-2">
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
.target-image-btn {
  width: 92%;
}
.target-image {
  width: 98%;
}
input[type=text],
input[type=number] {
  height: 25px;
  width: 98%;
  margin: 0;
}
.target-image-label {
  padding: 0 1rem;
  border: solid 1px #888;
}
.dummyimage {
  opacity: 1;
}
</style>