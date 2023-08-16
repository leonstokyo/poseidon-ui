<template>
  <div v-loading="tableLoading" element-loading-text="加载中...">
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="ID">
          <el-input v-model="filter.id" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="filter.username" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="add"
          >
            添加
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="编号" minWidth="80"></el-table-column>
      <el-table-column prop="username" label="用户名" minWidth="200"></el-table-column>
      <el-table-column prop="email" label="邮箱" minWidth="200"></el-table-column>
      <el-table-column prop="status" label="状态">
        <div slot-scope="color">
          <el-tag v-if="color.row.status == 0" type="danger">已禁用</el-tag>
          <el-tag v-else type="success">启用中</el-tag>
        </div>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" minWidth="160"></el-table-column>
      <el-table-column label="操作" fixed="right" minWidth="140">
        <div slot-scope="operations">
          <el-button
            size="mini"
            @click="edit(operations.row.id)"
          >
            编辑
          </el-button>
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
  import accountApi from '@/api/V1/account';
  import HandleIndexSession from '@/utils/HandleIndexSession';
  export default {
    name: 'AccountIndex',
    created() {
      this.initList();
    },
    data() {
      return {
        tableLoading: false, // 表格loading
        filter: {
          id: '',
          username: '',
        },
        pagination: {
          pageSize: 10,
          currentPage: 1,
          total: 100,
        },
        tableData: [],
      };
    },
    methods: {
      add() {
        this.$router.push({ name: `AccountAdd` });
      },
      edit(id) {
        this.$router.push({ path: `/system/account/edit/${id}` });
      },
      search() {
        this.pagination.currentPage = 1;
        this.getList();
      },
      async change(current) {
        this.pagination.currentPage = current;
        await this.getList(current);
      },
      async initList() {
        this.tableLoading = true;
        try {
          // 进入列表前先检测之前的页面信息
          if (
            HandleIndexSession.exitSession(this, 'account') &&
            this.$cookie.get('is_edit_back') == 1
          ) {
            HandleIndexSession.getSession(this, 'account');
          }
          await this.getList();
        } finally {
          this.tableLoading = false;
        }
      },
      async getList(current) {
        const currentPage = current ? current : this.pagination.currentPage;
        const { data } = await accountApi.getList({
          size: this.pagination.pageSize,
          current: currentPage,
          ...this.filter,
        });

        console.log(data);
        this.pagination.total = data.total;
        this.pagination.currentPage = currentPage;
        HandleIndexSession.setSession(this, 'account');
        this.tableData = [];
        data.records.forEach((e) => {
          this.tableData.push({
            id: e.id,
            username: e.username,
            email: e.email,
            status: e.status,
            created_at: e.createdAt,
          });
        });
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
