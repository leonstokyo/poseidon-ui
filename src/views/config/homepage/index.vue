<template>
  <div v-loading="tableLoading" element-loading-text="加载中...">
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="ID">
          <el-input v-model="filter.id" placeholder="ID" style="width: 100px" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属终端">
          <el-select v-model="filter.endpoint" placeholder="请选择" style="width: 160px" clearable>
            <el-option
              v-for="item in endpointOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            :disabled="!canDo('homepages-create')"
            @click="add"
          >
            添加
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" border highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="编号" minWidth="80"></el-table-column>
      <el-table-column label="图片" minWidth="80">
        <template slot-scope="scope">
          <el-image :src="scope.row.image"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="名称" minWidth="200"></el-table-column>
      <el-table-column prop="position" label="排序位置" minWidth="100"></el-table-column>
      <el-table-column prop="status" label="数据状态">
        <div slot-scope="color">
          <el-tag v-if="color.row.status == 0" type="danger">已下架</el-tag>
          <el-tag v-else type="success">使用中</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="操作" fixed="right" minWidth="80">
        <div slot-scope="operation">
          <el-button
            size="mini"
            type="primary"
            :disabled="!canDo('banners-update')"
            @click="edit(operation.row)"
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
  import configurationV1Api from '@/api/V1/configuration';
  import { mapGetters } from 'vuex';
  import HandleIndexSession from '@/utils/HandleIndexSession';
  import options from '@/components/mixins/configuration/options';
  export default {
    name: 'HomepageIndex',
    mixins: [options],
    created() {
      this.initList();
    },
    computed: mapGetters('permission', {
      isAdmin: 'isAdmin',
      canDo: 'canDo',
    }),
    data() {
      return {
        tableLoading: false, // 表格loading
        filter: {
          id: '',
          title: '',
        },
        pagination: {
          pageSize: 10,
          currentPage: 1,
          total: 100,
        },
        tableData: [],
        typeOptions: [
          {
            label: '轮播图',
            value: '1',
          },
        ],
        endpointOptions: [
          {
            label: '多端',
            value: '1',
          },
          {
            label: 'PC',
            value: '2',
          },
          {
            label: '小程序',
            value: '3',
          },
        ],
      };
    },
    methods: {
      add() {
        this.$router.push({ name: 'HomepageAdd' });
      },
      search() {
        this.pagination.currentPage = 1;
        this.getHomepageListWithPage();
      },
      async change(current) {
        this.pagination.currentPage = current;
        await this.getHomepageListWithPage(current);
      },
      edit(row) {
        this.$router.push({ path: `/config/homepage/edit/${row.id}` });
      },
      async getHomepageListWithPage(current = 1) {
        const currentPage = current ? current : this.pagination.currentPage;
        const res = await configurationV1Api.getHomepageList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter: this.filter,
        });
        const { items, total } = res.data;
        this.pagination.total = total;
        this.pagination.currentPage = currentPage;
        this.tableData = [];
        HandleIndexSession.setSession(this, 'homepage');
        items.forEach((e) => {
          this.tableData.push({
            id: e.id,
            title: e.title,
            description: e.description,
            label: e.label,
            endpoint: e.endpoint,
            position: e.position,
            image: process.env.VUE_APP_IMG_URL + e.image_url,
            status: e.status,
          });
        });
      },
      async initList() {
        this.tableLoading = true;
        if (
          HandleIndexSession.exitSession(this, 'homepage') &&
          this.$cookie.get('is_edit_back') == 1
        ) {
          HandleIndexSession.getSession(this, 'homepage');
        }
        await this.getHomepageListWithPage();
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
