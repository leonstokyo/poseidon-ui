<template>
  <div v-loading="tableLoading" element-loading-text="加载中...">
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="用户手机号">
          <el-input
            v-model="filter['@customer_phone']"
            placeholder="手机号"
            style="width: 160px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input
            v-model="filter['customer_id']"
            placeholder="用户ID"
            style="width: 160px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="SKU">
          <el-input
            v-model="filter['@sku']"
            placeholder="SKU"
            style="width: 100px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" border highlight-current-row style="width: 100%">
      <el-table-column prop="sku" label="sku" minWidth="100"></el-table-column>
      <el-table-column prop="name" label="产品名称" minWidth="100"></el-table-column>
      <el-table-column label="正视图" minWidth="140">
        <div slot-scope="frontImage">
          <el-image :src="frontImage.row.front_image"></el-image>
        </div>
      </el-table-column>
      <el-table-column label="侧视图" minWidth="140">
        <div slot-scope="angleImage">
          <el-image :src="angleImage.row.angle_image"></el-image>
        </div>
      </el-table-column>
      <el-table-column prop="created_at" label="收藏时间" minWidth="160"></el-table-column>
    </el-table>
    <div
      style="margin-top: 20px; margin-left: -10px; display: flex; justify-content: space-between"
    >
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :current-page="pagination.currentPage"
        @current-change="change"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
  import customerApi from '@/api/customer';
  import HandleIndexSession from '@/utils/HandleIndexSession';
  import HandleFilter from '@/utils/HandleFilter';
  import { mapGetters } from 'vuex';
  export default {
    name: 'CustomerAllWishlistIndex',
    created() {
      if (this.$route.params.id) {
        this.filter.customer_id = this.$route.params.id;
      }
      this.initList();
    },
    computed: mapGetters('permission', {
      availableButton: 'availableButton',
      isAdmin: 'isAdmin',
    }),
    data() {
      return {
        activities: [],
        tableLoading: false, // 表格loading
        statusOptions: [],
        filter: {
          wishlist_item_id: '',
          '@customer_phone': '',
          '@sku': '',
          customer_id: '',
        },
        pagination: {
          pageSize: 10,
          currentPage: 1,
          total: 100,
        },
        tableData: [],
        originData: {},
      };
    },
    methods: {
      search() {
        this.pagination.currentPage = 1;
        this.getCouponListWithPage();
      },
      async change(current) {
        this.pagination.currentPage = current;
        await this.getCouponListWithPage(current);
      },
      async getCouponListWithPage(current) {
        const currentPage = current ? current : this.pagination.currentPage;
        const filter = HandleFilter.handleFilter(this.filter);
        const tmp = await customerApi.getAllWishlistList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter,
        });
        const res = tmp['data'][0];
        let { items = [], total } = res;
        this.pagination.total = total;
        this.tableData = [];
        HandleIndexSession.setSession(this, 'all-address');
        items.forEach((e) => {
          this.tableData.push({
            id: e.wishlist_item_id,
            sku: e.sku,
            name: e.name,
            front_image: e.front_image,
            angle_image: e.angle_image,
            digitized_with_ditto: e.digitized_with_ditto,
            created_at: e.created_at,
          });
        });
      },
      async initList() {
        this.tableLoading = true;
        if (
          HandleIndexSession.exitSession(this, 'all-address') &&
          this.$cookie.get('is_edit_back') == 1
        ) {
          HandleIndexSession.getSession(this, 'all-address');
        }
        await this.getCouponListWithPage();
        this.tableLoading = false;
      },
    },
  };
</script>
<style>
  /*表格样式*/
  .el-table td,
  .el-table th {
    text-align: center;
  }
</style>
