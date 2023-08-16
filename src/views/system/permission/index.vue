<template>
  <div v-loading="tableLoading" element-loading-text="加载中...">
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="ID">
          <el-input v-model="filter.id"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filter.type" class="select-style" clearable placeholder="请选择">
            <el-option
              v-for="item in permissionTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="别名">
          <el-input v-model="filter.alias"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="filter.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button
            :disabled="!canDo('operation_logs-index')"
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
      <el-table-column prop="type" label="类型" minWidth="80"></el-table-column>
      <el-table-column prop="name" label="名称" minWidth="150"></el-table-column>
      <el-table-column prop="redirect_alias" label="跳转页面" minWidth="150"></el-table-column>
      <el-table-column prop="alias" label="别名" minWidth="150"></el-table-column>
      <el-table-column label="api列表" minWidth="200">
        <div slot-scope="apis">
          <li v-for="api in apis.row.api_list">{{ api }}</li>
        </div>
      </el-table-column>
      <el-table-column prop="position" label="排序" minWidth="150"></el-table-column>
      <el-table-column prop="created_at" label="创建时间" minWidth="160"></el-table-column>
      <el-table-column label="操作" fixed="right" minWidth="150">
        <div slot-scope="operations">
          <el-button size="mini" type="primary" @click="edit(operations.row.id)">
            编辑
          </el-button>
          <el-button size="mini" type="warning" @click="deleteBtn(operations.row.id)">
            删除
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
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>你确定过要删除该权限吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletePermission">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import permissionApi from '@/api/permission';
  import HandleIndexSession from '@/utils/HandleIndexSession';
  import { mapGetters } from 'vuex';
  import { Message } from 'element-ui';
  export default {
    name: 'PermissionIndex',
    created() {
      this.initList();
    },
    computed: mapGetters('permission', {
      availableButton: 'availableButton',
      isAdmin: 'isAdmin',
    }),
    data() {
      return {
        dialogVisible: false,
        tableLoading: false, // 表格loading
        deleteId: 0,
        filter: {
          id: '',
          type: '',
          alias: '',
          parent_id: '',
          name: '',
        },
        pagination: {
          pageSize: 10,
          currentPage: 1,
          total: 100,
        },
        tableData: [],
        permissionTypeOptions: [
          {
            label: '导航',
            value: 1,
          },
          {
            label: '页面',
            value: 2,
          },
          {
            label: '按钮',
            value: 3,
          },
        ],
      };
    },
    methods: {
      add() {
        this.$router.push({ name: `PermissionAdd` });
      },
      edit(id) {
        this.$router.push({ path: `/system/permission/edit/${id}` });
      },
      deleteBtn(id) {
        this.dialogVisible = true;
        this.deleteId = id;
      },
      async deletePermission() {
        const res = await permissionApi.deletePermission(this.deleteId);
        if (res.errorCode === 0) {
          Message.success({
            message: '删除成功！',
            duration: 2000,
          });
          await this.getPermissionListWithPage();
        }
        this.dialogVisible = false;
      },
      search() {
        this.pagination.currentPage = 1;
        this.getPermissionListWithPage();
      },
      async change(current) {
        this.pagination.currentPage = current;
        await this.getPermissionListWithPage(current);
      },
      async getPermissionListWithPage(current) {
        const currentPage = current ? current : this.pagination.currentPage;
        const { data } = await permissionApi.getPermissionList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter: this.filter,
        });
        this.pagination.total = data.total;
        this.pagination.currentPage = currentPage;
        HandleIndexSession.setSession(this, 'permission');
        this.tableData = [];
        data.items.forEach((e) => {
          let api_list = [];
          if (e.api_list) {
            api_list = JSON.parse(e.api_list);
          }
          this.tableData.push({
            id: e.id,
            name: e.name,
            type: ['导航', '页面', '按钮'][e.type - 1],
            alias: e.alias,
            api_list,
            created_at: e.created_at,
            position: e.position,
            redirect_alias: e.redirect_alias,
          });
        });
      },
      async initList() {
        this.tableLoading = true;
        // 进入列表前先检测之前的页面信息
        if (
          HandleIndexSession.exitSession(this, 'permission') &&
          this.$cookie.get('is_edit_back') == 1
        ) {
          HandleIndexSession.getSession(this, 'permission');
        }
        await this.getPermissionListWithPage();
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
