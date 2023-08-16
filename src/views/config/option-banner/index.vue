<template>
  <div>
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="ID">
          <el-input
            v-model="filter.mapping_id"
            placeholder="ID"
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
    <el-table
      ref="table"
      align="left"
      v-loading="tableLoading"
      element-loading-text="加载中..."
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
      <el-table-column prop="field" label="字段" minWidth="160"></el-table-column>
      <el-table-column prop="attribute_name" label="名称" minWidth="120"></el-table-column>

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
            :disabled="!canDo('filters-update')"
            @click="edit(operation.row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="primary"
            :disabled="!canDo('filters-create')"
            v-show="operation.row.level == '1'"
            @click="addSubItem(operation.row)"
          >
            添加
          </el-button>
          <el-button
            :disabled="operation.row.hasChildren || !canDo('filters-delete')"
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
  import distributionV1Api from '@/api/V1/configuration';
  import { Message } from 'element-ui';
  import { mapGetters } from 'vuex';
  import HandleIndexSession from '@/utils/HandleIndexSession';
  import configurationV1Api from '@/api/V1/configuration';
  export default {
    name: 'OptionBannerIndex',
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
          mapping_id: '',
          parent_id: '0',
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
        const res = await distributionV1Api.getOptionBannerChildren(tree.id);
        const { items } = res.data;
        const tmp = [];
        items.forEach((e) => {
          tmp.push({
            id: e.mapping_id,
            field: e.field || e.group,
            level: e.level,
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
        configurationV1Api.deleteOptionBanner(row.id).then(({ errorCode, message }) => {
          if (errorCode === 0) {
            Message.success({
              message: '删除成功！',
              duration: 2000,
            });
            this.$router.go(0);
          } else {
            Message.success({
              message,
              duration: 2000,
            });
          }
        });
      },
      async getOptionBannerListWithPage(current) {
        this.tableLoading = true;
        const currentPage = current ? current : this.pagination.currentPage;
        const res = await distributionV1Api.getOptionBannerList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter: this.filter,
        });
        const { items, total } = res.data;
        this.pagination.total = total;
        this.pagination.currentPage = currentPage;
        this.tableData = [];
        HandleIndexSession.setSession(this, 'optionBanner_pagination');
        items.forEach((e) => {
          this.tableData.push({
            id: e.mapping_id,
            field: e.field,
            level: e.level,
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
          HandleIndexSession.exitSession(this, 'optionBanner_pagination') &&
          this.$cookie.get('is_edit_back') == 1
        ) {
          HandleIndexSession.getSession(this, 'optionBanner_pagination');
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
