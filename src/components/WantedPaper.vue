<template>
  <div class="wantedPaper">
    <h1>{{ msg }}</h1>
    <div>{{ name }}</div>
    <div>{{ prize_money }}</div>
    <div>{{ image }}</div>
    <div>{{ warning }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class WantedPaper extends Vue {
  @Prop() private msg!: string;
  @Prop() private name!: string;
  @Prop() private prize_money!: string;
  @Prop() private image!: string;
  @Prop() private warning!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
