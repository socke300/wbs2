<template>
  <div>
    <div v-for="(item, index) in alertService.alertList" v-bind:key="index">
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
        {{ item }}
        <button v-on:click="alertService.delete_(index)" aria-label="Close" class="close" data-dismiss="alert" type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Inject, Vue} from "vue-property-decorator";
import {AlertService} from "@/model/AlertService";

@Component
export default class Alert extends Vue {
  @Inject("alertService") alertService !: AlertService;
}
</script>

<style scoped>

</style>
