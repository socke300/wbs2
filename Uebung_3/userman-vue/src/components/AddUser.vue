<template>
  <div class="container mt-2">
    <div class="row">
      <div class="col">
        <form v-on:submit.prevent="addUser()" id="form">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">First name</span>
            </div>
            <input v-model="user.firstName" class="form-control" placeholder="First name" type="text">
            <div class="input-group-prepend">
              <span class="input-group-text">Last name</span>
            </div>
            <input v-model="user.lastName" class="form-control" placeholder="Last name" type="text">
          </div>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Username</span>
            </div>
            <input v-model="user.username" class="form-control" placeholder="Username" type="text">

            <div class="input-group-prepend">
              <span class="input-group-text">Description</span>
            </div>
            <input v-model="user.description" class="form-control" placeholder="Description" type="text">

          </div>
          <div class="input-group mb-3">
            <button class="btn btn-info" type="submit">Add user</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {User} from "@/model/User";
import {Component, Inject, Vue} from "vue-property-decorator";
import {DataService} from "@/model/DataService";
import {AlertService} from "@/model/AlertService";

@Component
export default class AddUser extends Vue {

  user: User = new User(0, '', '', '', new Date(), 0, false);
  @Inject("dataService") dataService!: DataService;
  @Inject("alertService") alertService !: AlertService;

  addUser() {
    if (this.user.lastName.trim().length > 0 && this.user.firstName.trim().length > 0 &&
        this.user.username.trim().length > 0) {
      this.dataService.addUser(this.user);
      this.user = new User(0, '', '', '', new Date(), 0, false);
      (document.getElementById("form") as HTMLFormElement).reset();
      this.alertService.add("User added!");
    }
  }
}
</script>

<style scoped>

</style>
