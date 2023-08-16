<template>
  <div>
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="ID">
          <el-input v-model="filter.id" placeholder="ID" style="width: 100px" clearable></el-input>
        </el-form-item>
        <el-form-item label="属性名">
          <el-input
            v-model="filter.name"
            placeholder="属性名"
            style="width: 100px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="属性标签">
          <el-input
            v-model="filter.label"
            placeholder="属性标签"
            style="width: 100px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input
            v-model="filter.status"
            placeholder="状态"
            style="width: 100px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table ref="table" v-loading="tableLoading" :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="编号" minWidth="120"></el-table-column>
      <el-table-column prop="name" label="属性名" minWidth="120"></el-table-column>
      <el-table-column prop="label" label="属性标签" minWidth="120"></el-table-column>

      <el-table-column prop="status" label="数据状态">
        <div slot-scope="color">
          <el-tag v-if="color.row.status == 0" type="danger">已下架</el-tag>
          <el-tag v-else type="success">使用中</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="220">
        <div slot-scope="operation">
          <el-button size="mini" type="primary" @click="edit(operation.row)">编辑</el-button>
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
  import distributionApi from '@/api/distribution';
  import { Message } from 'element-ui';
  export default {
    name: 'OptionBannerIndex',
    created() {
      this.initList();
    },
    data() {
      return {
        tableLoading: false, // 表格loading
        filter: {
          id: '',
          name: '',
          label: '',
          status: '',
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
      async load(tree, treeNode, callback) {
        const res = await distributionApi.getOptionBannerChildren(tree.id);
        const { items } = res.data;
        const tmp = [];
        items.forEach((e) => {
          tmp.push({
            id: e.mapping_id,
            field: e.field || e.group,
            attribute_name: e.attribute_name || e.option,
            position: e.position || '-',
            status: e.status,
            parent_id: e.parent_id,
            hasChildren: !!e.child_items && e.child_items != 0,
          });
        });
        callback(tmp);
      },
      add() {
        this.$router.push({ name: 'OptionBannerAdd' });
      },
      addSubItem(row) {
        this.$router.push({ name: 'OptionBannerAdd', params: { parent_id: row.id } });
      },
      search() {
        this.pagination.currentPage = 1;
        this.getOptionBannerListWithPage();
      },
      async change(current) {
        this.pagination.currentPage = current;
        await this.getOptionBannerListWithPage(current);
      },
      edit(row) {
        this.$router.push({ path: `/config/option-banner/edit/${row.id}` });
      },
      async deleteItem(row) {
        await distributionApi.deleteOptionBanner(row.id);
        Message.success({
          message: '删除成功！',
          duration: 2000,
        });
        if (row.parent_id != 0) {
          console.log(this.$refs.table.store.states.lazyTreeNodeMap);
        }
      },
      async getOptionBannerListWithPage(current) {
        this.tableLoading = true;
        const currentPage = current ? current : this.pagination.currentPage;
        const res = await distributionApi.getOptionBannerList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter: this.filter,
        });
        const { items, pageSize, total } = res.data;
        this.pagination.pageSize = pageSize;
        this.pagination.total = total;
        this.tableData = [];
        this.$session.set('optionBanner_pagination', this.pagination);
        this.$session.set('optionBanner_filter', this.filter);
        items.forEach((e) => {
          this.tableData.push({
            id: e.mapping_id,
            field: e.field,
            attribute_name: e.attribute_name,
            position: e.position || '-',
            status: e.status,
            parent_id: e.parent_id,
            hasChildren: !!e.child_items && e.child_items != 0,
          });
        });
        this.tableLoading = false;
      },
      async initList() {
        if (
          this.$session.exists('optionBanner_pagination') &&
          this.$session.exists('optionBanner_filter')
        ) {
          this.pagination = this.$session.get('optionBanner_pagination');
          this.filter = this.$session.get('optionBanner_filter');
        }
        await this.getOptionBannerListWithPage();
      },
      showRow({ row }) {
        let styleJson = {};
        if (row.level == 2) {
          styleJson = {
            'background-color': '#e9eaea',
          };
        } else if (row.level == 3) {
          styleJson = {
            'background-color': '#a1d5d5',
          };
        }
        return styleJson; // 返回对象
      },
    },
  };
</script>
