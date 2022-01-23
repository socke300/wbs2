<template>
  <div>
    <b-modal ref="modal" title="Edit User">
      <div class="form-group">
        <label>ID</label>
        <input v-model="id" class="form-control" type="text" disabled>
        <label>Firstname</label>
        <input v-model="firstname" class="form-control" type="text">
        <label>Lastname</label>
        <input v-model="lastname" class="form-control" type="text">
        <label>Description</label>
        <input v-model="description" class="form-control" type="text">
      </div>
      <template #modal-footer>
        <button v-on:click="save()" class="btn btn-primary" type="button">Save changes</button>
        <button v-on:click="close()" class="btn btn-secondary" data-dismiss="modal" type="button">Close
        </button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import {Component, Inject, Vue} from "vue-property-decorator";
import {DataService} from "@/model/DataService";
import {AlertService} from "@/model/AlertService";

@Component
export default class EditUserModal extends Vue {

  firstname: string = '';
  lastname: string = '';
  description: string = '';
  id: number = 0;
  @Inject("dataService") dataService!: DataService;
  @Inject("alertService") alertService !: AlertService;

  show() {
    (this.$refs.modal as any).show();
  }

  close() {
    (this.$refs.modal as any).hide();
  }

  save() {
    if (this.lastname.trim().length > 0 && this.firstname.trim().length > 0) {
      this.dataService.editUser(this.firstname, this.lastname, this.id, this.description);
      this.close();
      this.alertService.add("User edited!");
    }
  }
}
</script>

<style scoped>

</style>
