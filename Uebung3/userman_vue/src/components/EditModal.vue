<template>
  <div v-if="!modalClosed">
    <b-modal id="editModal" title="Edit User" hide-footer>
      <form v-on:submit.prevent="$emit('editUser', [firstName, lastName, description])">
        <div class="modal-body">
          <div class="form-group">
            <label for="firstNameInput">First Name</label>
            <input type="text" class="form-control" id="firstNameInput" v-model="firstName">
          </div>
          <div class="form-group">
            <label for="lastNameInput">Last Name</label>
            <input type="text" class="form-control" id="lastNameInput" v-model="lastName">
          </div>
          <div class="form-group">
            <label for="descriptionInput">Last Name</label>
            <input type="text" class="form-control" id="descriptionInput" v-model="description">
          </div>
        </div>
        <div class="modal-footer">
          <b-button class="btn btn-outline-dark" @click="$bvModal.hide('editModal')" >Schließen</b-button>
          <b-button type="submit" class="btn btn-outline-success" @click="$bvModal.hide('editModal')">Speichern</b-button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import {User} from "@/model/User";

export default {
  name: "EditModal",
  props: {
    modalClosed: Boolean,
  },
  data(){
    return {
      firstName: '',
      lastName: '',
      description: '',
    }
  },
}
</script>

<style scoped>

</style>