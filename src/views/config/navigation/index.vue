<template>
  <div v-loading="tableLoading" element-loading-text="加载中...">
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="ID">
          <el-input v-model="filter.id" placeholder="ID" style="width: 100px" clearable></el-input>
        </el-form-item>
        <el-form-item label="主题">
          <el-input
            v-model="filter.title"
            placeholder="主题"
            style="width: 100px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button
            :disabled="!canDo('navigations-create')"
            type="primary"
            icon="el-icon-plus"
            @click="add"
          >
            添加
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      ref="table"
      align="left"
      :data="tableData"
      border
      highlight-current-row
      row-key="id"
      lazy
      :load="load"
      :indent="20"
      :row-style="showRow"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="width: 100%"
    >
      <el-table-column prop="id" label="编号" minWidth="120"></el-table-column>
      <el-table-column prop="title" label="所属主题" minWidth="120"></el-table-column>
      <el-table-column prop="label" label="面包屑" minWidth="120"></el-table-column>
      <el-table-column prop="description" label="描述" minWidth="120"></el-table-column>
      <el-table-column prop="position" label="排序位置" minWidth="100"></el-table-column>
      <el-table-column prop="status" label="数据状态">
        <div slot-scope="color">
          <el-tag v-if="color.row.status == 0" type="danger">已下架</el-tag>
          <el-tag v-else type="success">使用中</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="220">
        <div slot-scope="operation">
          <el-button
            size="mini"
            type="primary"
            :disabled="!canDo('navigations-update')"
            @click="edit(operation.row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="primary"
            :disabled="!canDo('navigations-create')"
            @click="addSubItem(operation.row)"
          >
            添加
          </el-button>
          <el-button
            :disabled="operation.row.hasChildren || !canDo('navigations-delete')"
            size="mini"
            type="error"
            @click="deleteItem(operation.row)"
          >
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
  </div>
</template>
<script>
  import configurationV1Api from '@/api/V1/configuration';
  import { Message } from 'element-ui';
  import { mapGetters } from 'vuex';
  export default {
    name: 'NavigationIndex',
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
          title: '',
          page_type: '',
          parent_id: '0',
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
        pageTypeOptions: [
          {
            label: '首页',
            value: '1',
          },
        ],
      };
    },
    watch: {
      $route(from, to) {
        this.$session.remove('navigation_pagination');
        this.$session.remove('navigation_filter');
        this.getNavigationListWithPage();
      },
    },
    methods: {
      async load(tree, treeNode, callback) {
        const res = await configurationV1Api.getNavigationChildren(tree.id);
        const { items } = res.data;
        const tmp = [];
        items.forEach((e) => {
          tmp.push({
            id: e.id,
            title: e.title,
            description: e.description,
            label: e.label,
            level: e.level,
            page_type: e.page_type,
            position: e.position,
            image: e.image_url,
            status: e.status,
            parent_id: e.parent_id,
            hasChildren: e.child_items != 0,
          });
        });
        callback(tmp);
      },
      add() {
        this.$router.push({ name: 'NavigationAdd' });
      },
      addSubItem(row) {
        this.$router.push({
          name: 'NavigationAdd',
          params: { parent_id: row.id, level: row.level },
        });
      },
      search() {
        this.pagination.currentPage = 1;
        this.getNavigationListWithPage();
      },
      async change(current) {
        this.pagination.currentPage = current;
        await this.getNavigationListWithPage(current);
      },
      edit(row) {
        this.$router.push({ path: `/config/navigation/edit/${row.id}` });
      },
      async deleteItem(row) {
        await configurationV1Api.deleteNavigation(row.id);
        Message.success({
          message: '删除成功！',
          duration: 2000,
        });
        if (row.parent_id != 0) {
          console.log(this.$refs.table.store.states.lazyTreeNodeMap);
        }
      },
      async getNavigationListWithPage(current) {
        const currentPage = current ? current : this.pagination.currentPage;
        const res = await configurationV1Api.getNavigationList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter: this.filter,
        });
        const { items, pageSize, total } = res.data;
        this.pagination.pageSize = pageSize;
        this.pagination.total = total;
        this.tableData = [];
        this.$session.set('navigation_pagination', this.pagination);
        this.$session.set('navigation_filter', this.filter);
        items.forEach((e) => {
          this.tableData.push({
            id: e.id,
            title: e.title,
            description: e.description,
            label: e.label,
            level: e.level,
            page_type: e.page_type,
            position: e.position,
            image: e.image_url,
            status: e.status,
            parent_id: e.parent_id,
            hasChildren: e.child_items != 0,
          });
        });
      },
      async initList() {
        this.tableLoading = true;
        if (
          this.$session.exists('navigation_pagination') &&
          this.$session.exists('navigation_filter')
        ) {
          this.pagination = this.$session.get('navigation_pagination');
          this.filter = this.$session.get('navigation_filter');
        }
        await this.getNavigationListWithPage();
        this.tableLoading = false;
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
