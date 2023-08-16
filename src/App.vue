<template>
  <a-locale-provider :locale="zh_CN">
    <div id="app">
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
  import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import { mapGetters } from 'vuex';
  export default {
    name: 'app',
    computed: mapGetters('permission', {
      availableRouter: 'availableRouter',
    }),
    data() {
      return {
        zh_CN,
      };
    },
    mounted() {
      window.addEventListener('beforeunload', (e) => this.beforeunloadHandler(e));
    },
    methods: {
      beforeunloadHandler(e) {
        this.$router.addRoutes(this.availableRouter);
      },
    },
  };
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
