<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="sidebar">
      <el-menu
        :default-active="activeMenu"
        mode="vertical"
        class="el-menu-left-menu"
        :collapse="isCollapse"
        background-color="#F4F7F9"
        :router="true"
        text-color=" #696969"
      >
        <SideMenuItem v-for="item in displayMenu" :key="item.name" :item="item"></SideMenuItem>
      </el-menu>
    </div>
  </el-scrollbar>
</template>
<script>
  import SideMenuItem from './SideMenuItem';
  import nav from '@/constant/nav'
  export default {
    name: 'SideMenu',
    components: {
      SideMenuItem,
    },
    created() {},
    computed: {
      activeMenu() {
        const route = this.$route;
        return route.path;
      },
    },
    data() {
      return {
        displayMenu: nav
      };
    },
  };
</script>

<style scoped>
  .sidebar {
    height: 100vh;
  }
</style>
