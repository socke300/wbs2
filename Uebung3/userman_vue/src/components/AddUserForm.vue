<template>
  <div class="container">
    <form ref="addForm" id="add-user-form" v-on:submit.prevent="$emit('addUser', [firstName, lastName, description])" v-on:submit="onSubmit">
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" id="add-user-first-name">First name</span>
        </div>
        <input type="text" class="form-control" placeholder="First name" aria-label="First name"
               aria-describedby="add-user-first-name" id="add-first-name-input" v-model="firstName">
        <div class="input-group-prepend">
          <span class="input-group-text" id="add-user-last-name">Last name</span>
        </div>
        <input type="text" class="form-control" placeholder="Last name" aria-label="Last name"
               aria-describedby="add-user-last-name" id="add-last-name-input" v-model="lastName">
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" id="add-description">Description</span>
        </div>
        <input type="text" class="form-control" placeholder="Description" aria-label="Description"
               aria-describedby="add-description" id="add-description-input" v-model="description">
      </div>
      <div class="input-group mb-3">
        <button type="submit" class="btn btn-info">Add user</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {User} from "@/model/User";
import UserTable from "@/components/UserTable.vue"

export default {
  name: "AddUserForm",
  data(){
    return {
      firstName: '',
      lastName: '',
      description: '',
    }
  },
  methods:{
    onSubmit(){
      //this.$refs.addForm.resetForm();
    }
  }
}
</script>

<style scoped>

</style>