<template>
  <div id="userList">
    <table class="table table-striped p-4">
      <thead class="thead-light">
      <tr>
        <th>ID</th>
        <th>Vorname</th>
        <th>Nachname</th>
        <th>Beschreibung</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user of userList" v-bind:key="user.id">
        <td>{{user.id}}</td>
        <td>{{user.firstName}}</td>
        <td>{{user.lastName}}</td>
        <td>{{user.description}}</td>
        <td>
          <b-button v-b-modal.editModal class="btn btn-outline-dark btn-sm edit-user-button mr-4" v-on:click="setActiveUser(user)">Edit
          </b-button>
          <button class="btn btn-outline-dark btn-sm delete-user-button" v-on:click="$emit('user-delete', user)">Delete
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <b-modal id="editModal" title="Edit User" @ok="$emit('user-edit', activeUser)">
      <label for="editInputId">ID</label>
      <input id="editInputId" aria-label="Id" disabled v-model="activeUser.id" class="form-control">
      <label for="editInputFirstName">First Name</label>
      <input class="form-control" id="editInputFirstName" type="text" aria-label="First name" v-model="activeUser.firstName">
      <label for="editInputLastName">Last Name</label>
      <input class="form-control" id="editInputLastName" type="text" aria-label="Last name" v-model="activeUser.lastName">
      <label for="editInputDescription">Description</label>
      <input class="form-control" id="editInputDescription" type="text" aria-label="Description" v-model="activeUser.description">
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "userList",
  data() {
    return {
      activeUser: {}
    }
  },
  props: {
    userList: Array
  },
  methods: {
    setActiveUser: function (user){
      this.activeUser = {...user};
    }
  }
}
</script>

<style scoped>

</style>