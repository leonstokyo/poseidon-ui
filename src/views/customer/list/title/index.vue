<template>
  <div v-loading="tableLoading" element-loading-text="加载中...">
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="ID">
          <el-input
            v-model="filter.invoicetmpl_id"
            placeholder="ID"
            style="width: 100px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input
            v-model="filter.customer_id"
            placeholder="用户ID"
            style="width: 100px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="用户手机号">
          <el-input
            v-model="filter['@customer_phone']"
            placeholder="手机号"
            style="width: 160px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" border highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="编号" minWidth="80"></el-table-column>
      <el-table-column prop="customer_id" label="用户ID" minWidth="80"></el-table-column>
      <el-table-column prop="customer_phone" label="用户手机号" minWidth="120"></el-table-column>
      <el-table-column label="抬头类型" minWidth="100">
        <div slot-scope="type">
          <span>{{ ['企业', '个人'][type.row.tax_type - 1] }}</span>
        </div>
      </el-table-column>
      <el-table-column prop="tax_name" label="名称" minWidth="150"></el-table-column>
      <el-table-column prop="tax_number" label="税号" minWidth="150"></el-table-column>
      <el-table-column label="是否默认" minWidth="50">
        <div slot-scope="isDefault">
          <el-tag v-if="isDefault.row.is_default === '1'" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </div>
      </el-table-column>
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
    name: 'CustomerAllTitleIndex',
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
        couponTypeLabel: {},
        couponStatusLabel: {},
        couponStatus: {},
        statusOptions: [],
        filter: {
          invoicetmpl_id: '',
          customer_id: '',
          '@customer_phone': '',
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
        const tmp = await customerApi.getAllTitleList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter,
        });
        const res = tmp['data'][0];
        let { items = [], total } = res;
        this.pagination.total = total;
        this.tableData = [];
        HandleIndexSession.setSession(this, 'all-title');
        items.forEach((e) => {
          this.tableData.push({
            id: e.invoicetmpl_id,
            customer_id: e.customer_id,
            tax_type: e.tax_type,
            tax_name: e.tax_name,
            area: e.area,
            tax_number: e.tax_number,
            is_default: e.is_default,
            customer_phone: e.customer_phone,
          });
        });
      },
      async initList() {
        this.tableLoading = true;
        if (
          HandleIndexSession.exitSession(this, 'all-title') &&
          this.$cookie.get('is_edit_back') == 1
        ) {
          HandleIndexSession.getSession(this, 'all-title');
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
