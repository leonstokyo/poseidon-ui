<template>
  <el-container>
    <el-header style="padding: 0"><Header /></el-header>
    <el-container>
      <el-aside width="200px"><SideMenu></SideMenu></el-aside>
      <el-main v-loading="loading">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import Header from './components/Header';
  import SideMenu from './components/SideMenu';
  import { mapGetters } from 'vuex';
  export default {
    components: {
      Header,
      SideMenu,
    },
    computed: mapGetters('loading', {
      loading: 'loading',
    }),
  };
</script>

<style>
  .el-aside {
    background-color: #f4f7f9;
    text-align: left;
    display: block;
    position: absolute;
    top: 68px;
    bottom: 0;
  }
  .el-main {
    position: absolute;
    left: 200px;
    top: 68px;
    bottom: 0;
    right: 8px;
    overflow-y: scroll;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
</style>
