<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <div class="row container-fluid">
            <div class="row container-fluid">
                <a class="navbar-brand" href="#">Usermanager</a>
            </div>
        </div>
      </div>
    </nav>
    <div class="container-fluid">
      <div class="row">
    <div class="col-9">
    <user-list v-bind:user-list="userList" v-on:user-delete="deleteUser($event)" v-on:user-edit="editUser($event)"></user-list>
    </div>
    <div class="col-3">
    <create-user v-on:create-user="addUser($event)"></create-user>
  </div>
  </div>
  </div>
  </div>
</template>

<script>
import UserList from "./components/userList";
import CreateUser from "./components/CreateUser";
import {User} from "./User";

export default {
  name: 'App',
  data() {
    return {
      userList: [
        new User("Carl", "Friedrich", "Friederlich"),
        new User("Frieda", "Carlo", "Car-los")
      ],
      userCounter: 2
    }
  },
  methods: {
    addUser: function (user){
      if(user.firstName && user.lastName){
        this.userList.push(new User(user.firstName, user.lastName, user.description));
      }
    },
    editUser: function (user){
      for(let entry of this.userList) {
        if (entry.id === user.id){
          this.$set(this.userList, this.userList.indexOf(entry), user)
        }
      }
    },
    deleteUser: function (user){
      if(confirm('Are you sure you wanna delete ' + user.firstName + ' ' + user.lastName + '?')){
        this.userList.splice(this.userList.indexOf(user), 1);
      }
    }
  },
  components: {
    CreateUser,
    UserList
  }
}
</script>

<style lang="scss">
@import "~@/assets/scss/vendors/bootstrap-vue/index";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
