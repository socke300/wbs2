<template>
  <div>
    <NavBar></NavBar>
    <AddUser></AddUser>

    <Alert></Alert>
    <UserList></UserList>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator';
import NavBar from "@/components/NavBar.vue";
import AddUser from "@/components/AddUser.vue";
import {DataService} from "@/model/DataService";
import UserList from "@/components/UserList.vue";
import {AlertService} from "@/model/AlertService";
import Alert from "@/components/Alert.vue";

@Component({
  components: {
    Alert,
    UserList,
    AddUser,
    NavBar,
  }
})
export default class App extends Vue {
  @Provide("dataService") dataService: DataService = new DataService();
  @Provide("alertService") alertService: AlertService = new AlertService();
}
</script>

<style lang="scss">
</style>
