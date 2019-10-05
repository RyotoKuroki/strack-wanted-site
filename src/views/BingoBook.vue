<template>
  <div class="bingoBook container">
    <div class="row">
      <div class="col-12">
        <div class="row" v-for="(row, uuid) in codeBehind.rows" :key="uuid">
          <div  v-if="!row.IsForButton" class="col-12">
            <hr class="m-1 p-0" style="color: gray;" />
          </div>
          <!-- ▼既存情報の編集用の表示行 -->
          <div v-if="!row.IsForButton" class="col-4 col-sm-4">
            <div class="row">
              <div class="col-12">

                <!-- イメージ -->
                <img class="target-image"
                      v-bind:class="{ negativeimage: !row.hasImage, activeimage: row.hasImage }"
                      v-bind:src="row.image_base64" />
              </div>
            </div>
            <div class="row">
              <div class="col-9 text-center px-0">

                <!-- 画像選択 -->
                <label class="px-2" style="font-size: smaller;"><u>画像選択</u>
                  <input type="file" class="form-control m-0 p-0" style="display: none;"
                          @click="codeBehind.ClickRow($event, row)"
                          @change="codeBehind.SelectImage($event)" />
                </label>
              </div>
              <div class="col-3 text-right px-0">

                <!-- 画像削除 -->
                <input type="button" value="×" class="btn btn-sm m-0 p-0"
                        @click="codeBehind.ClearImage($event, row)" />
              </div>
            </div>
          </div>
          <div v-if="!row.IsForButton" class="col-8 col-sm-8">
            <div class="row">
              <div class="col-12 col-sm-12">
                <u>

                  <!-- 情報削除 -->
                  <div class="target-cancel my-1 mx-2 p-0 float-right"
                        @click="codeBehind.DeleteRow($event, row)">アイテム削除</div>
                </u>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-sm-12">

                <!-- ターゲット -->
                <input type="text" v-model="row.name" class="form-control-sm form-control" placeholder="ターゲット名" />
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-sm-12">

                <!-- 懸賞金額 -->
                <input type="number" v-model="row.prize_money" class="form-control-sm form-control" placeholder="懸賞金額" />
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-sm-12">

                <!-- 要注意情報 -->
                <input type="text" v-model="row.warning" class="form-control-sm form-control" placeholder="要注意！！" />
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-sm-12 mt-2">

                <!-- 登録/更新 -->
                <input type="button" class="btn btn-secondary btn-sm btn-block"
                        v-if="row.IsDirty"
                        v-model="row.btn_saving_caption"
                        v-on:click="codeBehind.SaveWanteds($event, row)" />
                <!-- Notice -->
                <input type="button" class="btn btn-secondary btn-sm btn-block" style="opacity: 0.1;"
                        v-if="!row.IsDirty"
                        v-model="row.btn_saving_caption"
                        disabled/>
              </div>
            </div>
          </div>
          <!-- ▼新規追加用の表示行 -->
          <div v-if="row.IsForButton" class="col-12">
            <hr class="my-4" style="color: lightgray;" />
            <!-- 追加用ボタンのみ表示 -->
            <input type="button" value="Add new item !" class="btn btn-info btn-lg btn-block mb-4"
                    @click="codeBehind.AddNewRow($event, row)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BingoBookBehind from '@/app.codebehinds/bingobook/BingoBookBehind.ts';
import TrWanted from '@/app.entities/TrWanted.ts';

@Component({
  components: {
    // HelloWorld,
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
.target-cancel {
  font-size: x-small;
  color: gray;
  width: 80px;
}
.target-image {
  width:100%;
  height:100%;
  min-height: 138px;
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
.negativeimage {
  opacity: 0.4;
}
.activeimage {
  opacity: 1;
}

</style>