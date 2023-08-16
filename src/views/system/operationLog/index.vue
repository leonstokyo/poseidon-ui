<template>
  <div v-loading="tableLoading" element-loading-text="加载中...">
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="操作人">
          <el-input v-model="filter.username" placeholder="姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="模块">
          <el-select
            v-model="filter.module_name"
            placeholder="请选择"
            style="width: 200px"
            filterable
            clearable
          >
            <el-option
              v-for="item in moduleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="filter.code"
            placeholder="请选择"
            style="width: 200px"
            filterable
            clearable
          >
            <el-option
              v-for="item in codeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求时间">
          <el-date-picker
            v-model="filter.created_at"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="对象ID">
          <el-input v-model="filter.object_id" placeholder="对象ID" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-table :data="tableData" border highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="编号" minWidth="55"></el-table-column>
      <el-table-column prop="username" label="操作人" minWidth="120"></el-table-column>
      <el-table-column prop="source_ip" label="登录IP" minWidth="100"></el-table-column>
      <el-table-column prop="created_at" label="调用时间" minWidth="160"></el-table-column>
      <el-table-column prop="status" label="状态" minWidth="100"></el-table-column>
      <el-table-column prop="action_name_label" label="操作类型" minWidth="100"></el-table-column>
      <el-table-column prop="origin_data" label="原始数据" minWidth="200"></el-table-column>
      <el-table-column prop="request" label="操作内容" minWidth="200"></el-table-column>
      <el-table-column prop="module_name" label="模块" minWidth="100"></el-table-column>
      <el-table-column prop="object_id" label="对象ID" minWidth="100"></el-table-column>
      <el-table-column label="操作" fixed="right" minWidth="140">
        <div slot-scope="operations">
          <el-button
            :disabled="!canDo('operation_logs-index')"
            size="mini"
            @click="view(operations.row.id)"
          >
            详情
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
  import operationApi from '@/api/operation';
  import HandleIndexSession from '@/utils/HandleIndexSession';
  import { mapGetters } from 'vuex';

  export default {
    name: 'OperationLog',
    created() {
      this.initList();
    },
    computed: mapGetters('permission', {
      canDo: 'canDo',
      isAdmin: 'isAdmin',
    }),
    data() {
      return {
        tableLoading: false,
        tableData: [],
        moduleOptions: [],
        codeOptions: [
          {
            label: '成功',
            value: '1',
          },
          {
            label: '失败',
            value: '2',
          },
        ],
        pagination: {
          pageSize: 10,
          currentPage: 1,
          total: 100,
        },
        filter: {
          username: '',
          module_name: '',
          created_at: 0,
          code: '',
          object_id: '',
        },
        pickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              },
            },
          ],
        },
      };
    },
    methods: {
      async getOperationLogListWithPage(current) {
        const currentPage = current ? current : this.pagination.currentPage;
        const { data } = await operationApi.getOperationLogList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter: this.filter,
        });
        this.pagination.total = data.total;
        this.pagination.currentPage = currentPage;
        HandleIndexSession.setSession(this, 'operation_log');
        this.tableData = [];
        data.items.forEach((e) => {
          this.tableData.push({
            id: e.id,
            username: e.username,
            request: e.request.length > 200 ? e.request.substring(0, 100) + ' ...' : e.request,
            module_name: e.module_name,
            action_name: e.action_name,
            action_name_label: e.action_name_label,
            source_ip: e.source_ip,
            status: e.code === 200 ? '成功' : '失败',
            created_at: e.created_at,
            object_id: e.object_id,
            origin_data: e.origin_data
              ? e.origin_data.length > 200
                ? e.origin_data.substring(0, 100) + ' ...'
                : e.origin_data
              : '',
          });
        });
      },
      async initList() {
        this.tableLoading = true;
        if (
          HandleIndexSession.exitSession(this, 'operation_log') &&
          this.$cookie.get('is_edit_back') == 1
        ) {
          HandleIndexSession.getSession(this, 'operation_log');
        }
        await this.getOperationLogListWithPage();
        await this.getOptions();
        this.tableLoading = false;
      },
      search() {
        this.pagination.currentPage = 1;
        this.getOperationLogListWithPage();
      },
      async change(current) {
        this.pagination.currentPage = current;
        await this.getOperationLogListWithPage(current);
      },
      async getOptions() {
        const { data } = await operationApi.getOperationLogOption();
        this.moduleOptions = data;
      },
      view(id) {
        this.$router.push({ path: `/system/operation/log/edit/${id}` });
      },
    },
  };
</script>

<style></style>
