<template>
  <div class="parent-container d-flex">
    <AddUserForm v-on:addUser="addUser($event)"/>
    <UserTable v-bind:users="users" v-on:delete="deleteUser($event)"/>
  </div>
</template>

              <script lang="ts">
import Vue from 'vue';
import UserTable from "@/components/UserTable.vue";
import AddUserForm from "@/components/AddUserForm.vue";
import EditModal from "@/components/EditModal.vue"
import { User } from './model/User';

export default Vue.extend({
  name: 'App',
  data() {
    return{
      modalShow: false,
      userIds: 1,
      users: [
        new User(0, 'Niklas',  'Thy', 'TestDescription is here', new Date()),
        new User(1, 'Kevin',  'Linne', 'Description for Kevin Linne', new Date())
      ]
    }
  },
  methods: {
    addUser(args: string[]){//firstName: string, lastName: string, username: string, password: string) {
      console.log(args)
      this.userIds++;
      this.users.push(new User(this.userIds, args[0], args[1], args[2], new Date()));
    },
    deleteUser(id: number){
      this.users.splice(id, 1);
    }
  },
  components: {
    //EditModal,
    UserTable,
    AddUserForm,
    //HelloWorld
  }
});
</script>

<style lang="scss">
//@import "~@/assets/scss/vendors/bootstrap-vue/index";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
