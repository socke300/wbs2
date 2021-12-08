<template>
  <form class="p-4">
    <h5>Nutzer hinzufügen</h5>
    <div class="form-group">
      <label for="firstName">Vorname</label>
      <input type="text" id="firstName" class="form-control" v-model="user.firstName">
      <label for="lastName">Nachname</label>
      <input type="text" id="lastName" class="form-control" v-model="user.lastName">
    </div>
    <div class="form-group"></div>
    <label for="description">Beschreibung</label>
    <textarea id="description" class="form-control" v-model="user.description"></textarea>
    <button type="button" class="btn btn-outline-dark" v-on:click="$emit('create-user', user); clear();">Hinzufügen</button>
  </form>
</template>

<script>
export default {
  name: "CreateUser",
  data() {
    return {
      user: {}
    }
  },
  methods: {
    clear: function (){
      this.user = {}
    }
  }
}
</script>

<style scoped>

</style>