<template>
  <div class="account container" id="account">
    <div class="row">
      <div class="col-12" style="font-size: x-small">
        ※ユーザ名 sample でキャッシュ登録し、<br>ブックへ遷移すると沢山の画像が確認できます！
      </div>
      <div class="col-12">
        <input class="form-control" placeholder="ユーザ名を入力して下さい！"
               v-model="codeBehind.UserName" />
      </div>
      <div class="col-12 mt-3 mb-2">
        <img class="target-image"
             :src="codeBehind.ImageBase64" />
      </div>
      <div class="col-12">
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
import AccountBehind from '@/app.codebehinds/account/AccountBehind.ts';
import TrAccount from '@/app.entities/TrAccount.ts';

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