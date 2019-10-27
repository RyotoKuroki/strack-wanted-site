<template>
  <div class="account container" id="account">
    <div class="row">
      <div class="col-12" style="font-size: x-small">
        ※とりあえず空欄でも全然問題ありません！<br>
        　「ブック」「パンチアウト」 へページ遷移してみて下さい。<br>
        　画像情報が表示されるはずです！！<br><br>

        　自由なユーザ名をブラウザキャッシュ登録した後、再度ページ遷移してみて下さい。<br>
        　今度は画像情報が表示されなくなるはずです！！<br><br>
        
        　ユーザ名を設定すると、ユーザ固有の表示情報を設定できるようになります！！！<br>
      </div>
      <div class="col-12">
        <input class="form-control" placeholder="ユーザ名を入力して下さい！"
               v-model="codeBehind.UserName" />
      </div>
      <div class="col-12 mt-3 mb-2" style="display: none;">
        <img class="target-image"
             :src="codeBehind.ImageBase64" />
      </div>
      <div class="col-12" style="display: none;">
        <label>画像を選択してください<span style="color:orangered;">（工事中）</span></label>
      </div>
      <div class="col-12 my-3">
        <input type="button" class="btn btn-secondary btn-block" value="ブラウザにキャッシュ"
               v-if="codeBehind.CanRegist"
               @click='codeBehind.SaveAccount($event)' />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AccountBehind from '@/app.codebehinds/account/account.behind.ts';
import TrAccount from '@/app.entities/tr.account.ts';

@Component({
  components: {
    // HelloWorld,
  },
})
export default class Account extends Vue {

  protected codeBehind = new AccountBehind();

  constructor() {
    super();
  }
}
</script>

<style>
#account .target-cancel {
  font-size: x-small;
  color: gray;
  width: 80px;
}
#account .target-image {
  width:98%;
  height:98%;
  min-height: 138px;
  min-width: 100px;
  background: #aaa;
}
#account .target-image-btn {
  width: 92%;
}
#account input[type=text],
#account input[type=number] {
  height: 25px;
  width: 98%;
  margin: 0;
}
</style>
