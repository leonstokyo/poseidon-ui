<template>
  <div v-loading="tableLoading" element-loading-text="加载中...">
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="ID">
          <el-input
            v-model="filter.coupon_customer_id"
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
        <el-form-item label="状态">
          <el-select v-model="filter.status" placeholder="请选择" style="width: 150px" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" border highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="编号" minWidth="80"></el-table-column>
      <el-table-column prop="customer_id" label="用户ID" minWidth="80"></el-table-column>
      <el-table-column prop="coupon_name" label="名称" minWidth="100"></el-table-column>
      <el-table-column prop="coupon_code" label="优惠码" minWidth="140"></el-table-column>
      <el-table-column prop="coupon_desc" label="描述" minWidth="150"></el-table-column>
      <el-table-column label="状态" prop="status_label" minWidth="100"></el-table-column>
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
  import couponApi from '@/api/coupon';
  import HandleIndexSession from '@/utils/HandleIndexSession';
  import HandleFilter from '@/utils/HandleFilter';
  import { mapGetters } from 'vuex';
  export default {
    name: 'CustomerAllCoupon',
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
        tableLoading: false, // 表格loading
        filter: {
          coupon_customer_id: '',
          customer_id: '',
          '@customer_phone': '',
          status: '',
        },
        pagination: {
          pageSize: 10,
          currentPage: 1,
          total: 100,
        },
        tableData: [],
        statusOptions: [
          {
            label: '未使用/已过期',
            value: 1,
          },
          {
            label: '已使用',
            value: 31,
          },
          {
            label: '退款消券',
            value: 91,
          },
        ],
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
        const tmp = await couponApi.getCustomerCouponList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter,
        });
        const res = tmp['data'][0];
        let { items = [], total } = res;
        this.pagination.total = total;
        this.pagination.currentPage = res.current;
        this.tableData = [];
        HandleIndexSession.setSession(this, 'all-coupon');
        items.forEach((e) => {
          this.tableData.push({
            id: e.coupon_customer_id,
            customer_id: e.customer_id,
            coupon_name: e.coupon_name,
            coupon_code: e.coupon_code,
            coupon_desc: e.coupon_desc,
            coupon_type: e.coupon_type,
            status: e.status,
            status_label: e.status_label,
          });
        });
      },
      async initList() {
        this.tableLoading = true;
        if (
          HandleIndexSession.exitSession(this, 'aal-coupon') &&
          this.$cookie.get('is_edit_back') == 1
        ) {
          HandleIndexSession.getSession(this, 'all-coupon');
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
