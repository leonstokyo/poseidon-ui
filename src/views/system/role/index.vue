<template>
  <div>
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="ID">
          <el-input v-model="filter.id" clearable></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="filter.name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button
            :disabled="!canDo('roles-create')"
            type="primary"
            icon="el-icon-plus"
            @click="add"
          >
            添加
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="编号" minWidth="80"></el-table-column>
      <el-table-column prop="name" label="名称" minWidth="200"></el-table-column>
      <el-table-column prop="created_at" label="创建时间" minWidth="160"></el-table-column>
      <el-table-column label="操作" fixed="right" minWidth="140">
        <div slot-scope="operations">
          <el-button
            :disabled="!canDo('roles-update')"
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
  import permissionApi from '@/api/permission';
  import HandleIndexSession from '@/utils/HandleIndexSession';
  import { mapGetters } from 'vuex';
  export default {
    name: 'RoleIndex',
    created() {
      this.initList();
    },
    computed: mapGetters('permission', {
      canDo: 'canDo',
      isAdmin: 'isAdmin',
    }),
    data() {
      return {
        tableLoading: false, // 表格loading
        filter: {
          id: '',
          name: '',
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
        this.$router.push({ name: `RoleAdd` });
      },
      edit(id) {
        this.$router.push({ path: `/system/role/edit/${id}` });
      },
      search() {
        this.pagination.currentPage = 1;
        this.getRoleListWithPage();
      },
      async change(current) {
        this.pagination.currentPage = current;
        await this.getRoleListWithPage(current);
      },
      async initList() {
        this.tableLoading = true;
        // 进入列表前先检测之前的页面信息
        if (HandleIndexSession.exitSession(this, 'role') && this.$cookie.get('is_edit_back') == 1) {
          HandleIndexSession.getSession(this, 'role');
        }
        await this.getRoleListWithPage();
        this.tableLoading = false;
      },
      async getRoleListWithPage(current) {
        const currentPage = current ? current : this.pagination.currentPage;
        const { data } = await permissionApi.getRoleList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter: this.filter,
        });
        this.pagination.pageSize = data.pageSize;
        this.pagination.total = data.total;
        HandleIndexSession.setSession(this, 'role');
        this.tableData = [];
        data.items.forEach((e) => {
          this.tableData.push({
            id: e.id,
            name: e.name,
            created_at: e.created_at,
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
