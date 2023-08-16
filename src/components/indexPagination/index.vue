<template>
  <div class="index-pagination">
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="totalCount"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="change"
    ></el-pagination>
  </div>
</template>

<script>
  export default {
    props: {
      totalCount: {
        type: Number,
        default: 0,
      },
      pageSize: {
        type: Number,
        default: 10,
      },
    },

    data() {
      let current_page = 1;
      if (this.$route.query.currentPage) {
        current_page = parseInt(this.$route.query.currentPage);
      }

      return {
        currentPage: current_page,
      };
    },

    computed: {},

    created() {},

    methods: {
      async change(current) {
        let currentQuery = this.$route.query;
        let newQuery = {
          ...currentQuery,
          currentPage: current,
        };
        await this.$router.push({ query: newQuery });
      },
      resetCurrentPage() {
        let current_page = this.$route.query.currentPage || 1;
        this.currentPage = current_page;
      },
    },
    watch: {
      $route: function() {
        this.resetCurrentPage();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .index-pagination {
    margin-top: 20px;
    margin-left: -10px;
    display: flex;
    justify-content: space-between;
  }
</style>
