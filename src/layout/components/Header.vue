<template>
  <header class="header">
    <img class="logo"/>
    <div class="right-menu">
      <div class="avatar-container">
        <img src="../../assets/avatar.gif" class="user-avatar" />
      </div>
      <div>
        <el-dropdown class="dropdown-container" trigger="click">
          <div class="name-wrapper">
            <span>{{ username }}</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>
                Home
              </el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
              <el-dropdown-item>Docs</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">Log Out</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>
<script>
  import accountApi from '../../api/V1/account';
  import { Message } from 'element-ui';
  import { mapActions } from 'vuex';

  export default {
    name: 'Header',
    created() {
      this.getUserInfo();
    },
    data() {
      return {
        username: '匿名用户1',
      };
    },
    methods: {
      ...mapActions('permission', ['updateRefresh']),
      async logout() {
        await accountApi.logout();
        const millisecond = new Date().getTime();
        this.$cookie.set('is_login', 0, { expires: millisecond });
        this.$cookie.set('sessionId', 0, { expires: millisecond });
        this.$session.clear();
        await this.updateRefresh(-1);
        location.reload();
        await this.$router.replace('/login');
        Message.success({
          message: '登出成功！',
          duration: 1000,
        });
      },
      async getUserInfo() {
        if (this.$session.exists('userInfo')) {
          let userInfo = this.$session.get('userInfo');
          userInfo = JSON.parse(userInfo);
          this.username = userInfo.username;
        } else {
          // const { data } = await accountApi.getInfo();
          const { data } = {};
          this.username = data.username;
          const userInfo = JSON.stringify(data);
          this.$session.set('userInfo', userInfo);
        }
      },
    },
  };
</script>
<style scoped>
  .header {
    width: 100%;
    height: 100%;
    color: #fff;
    line-height: 60px;
    overflow: hidden;
    background-color: rgb(19, 153, 168);
    display: flex;
    justify-content: space-between;
  }
  .logo {
    height: 200px;
    width: 200px;
    margin-left: 3px;
    vertical-align: middle;
    display: inline-block;
    transform: translate(-20px, -70px);
  }
  .el-dropdown {
    color: #fff;
  }
  .right-menu {
    display: flex;
    justify-content: left;
  }
  a {
    text-decoration: none;
    color: #fff;
  }
  .icon-font i {
    font-size: 20px;
  }
  .avatar-container {
    margin-right: 10px;
  }
  .dropdown-container {
    margin-right: 30px;
  }
  .name-wrapper {
    position: relative;
  }
  .user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
  .el-icon-caret-bottom {
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px;
  }
</style>
