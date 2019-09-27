<template>
  <div class="bingoBook container">
    <div class="row">
      <div class="col-12" v-for="(row, uuid) in codeBehind.Rows" :key="uuid">
        <RowView
          :uuid="row.uuid"
          :name="row.name"
          :prize_money="row.FormattedPrizeMoney"
          :image="row.image"
          :warning="row.warning" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import RowView from '@/components/BingoBook.RowView.vue';
import BingoBookBehind from '@/app.viewmodels/BingoBookBehind.ts';

@Component({
  components: {
    // HelloWorld,
    RowView,
  },
})
export default class BingoBook extends Vue {

  codeBehind = new BingoBookBehind();

  constructor() {
    super();
  }
}
</script>
