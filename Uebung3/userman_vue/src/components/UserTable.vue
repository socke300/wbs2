<template>
    <div class="container">
      <table class="table table-lined">
        <thead class="thead-light">
        <tr>
          <th scope="col">#</th>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Description</th>
          <th scope="col"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" v-bind:key="user.id" >
            <td>{{user.id}}</td>
            <td>{{user.firstName}}</td>
            <td>{{user.lastName}}</td>
            <td>{{user.description}}</td>
            <td class="text-right">
              <button type="button" class="btn btn-outline-dark btn-sm edit-user-button mr-4" v-on:click="$emit('delete', user.id)">
                Delete
              </button>
              <button type="button" class="btn btn-outline-dark btn-sm edit-user-button mr-4" v-on:click="openEditModal(user)">
                Edit
              </button>
            </td>
        </tr>
        </tbody>
      </table>
      <EditModal v-bind:modalClosed="modalClosed"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { User } from '../model/User';
import EditModal from "@/components/EditModal.vue";

export default Vue.extend( {
  name: "UserTable",
  components: {EditModal},
  props: {
    users: Array,
  },
  data(){
    return{
      modalClosed: true,
    }
  },
  methods: {
    openEditModal(user: User){
      console.log(user.id);
      this.modalClosed = false;
    }


  }
})
</script>

<style scoped>

</style>