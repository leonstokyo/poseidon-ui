<template>
  <div>
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
          <el-button type="primary" icon="el-icon-plus" @click="exportCsv()">导出</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="exportLensCsv()">
            导出镜片套餐
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      ref="table"
      align="left"
      v-loading="tableLoading"
      element-loading-text="加载中..."
      :load="load"
      :row-style="showRow"
      :data="tableData"
      row-key="id"
      border
      lazy
      :indent="20"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="id" label="编号" minWidth="100"></el-table-column>
      <el-table-column prop="display_name" label="展示名称" minWidth="200"></el-table-column>
      <el-table-column prop="frame_type" label="镜框类型" minWidth="150"></el-table-column>
      <el-table-column prop="material" label="材质" minWidth="120"></el-table-column>
      <el-table-column prop="frame_Shape_type" label="框形" minWidth="100"></el-table-column>
    </el-table>
    <div style="margin-top: 20px; margin-left: -10px; float: left">
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
  import productApi from '@/api/product';
  import productV1Api from '@/api/V1/product';
  import HandleIndexSession from '@/utils/HandleIndexSession';
  export default {
    name: 'NewIndex',
    created() {
      this.initList();
    },
    data() {
      return {
        tableData: [],
        pagination: {
          pageSize: 20,
          currentPage: 1,
          total: 100,
        },
        tableLoading: false, // 表格loading
        filter: {
          id: '',
          username: '',
        },
      };
    },
    methods: {
      async getNewProductListWithPage(current) {
        this.tableLoading = true;
        const currentPage = current ? current : this.pagination.currentPage;
        const { data } = await productApi.getNewProductList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter: this.filter,
        });
        this.pagination.total = data.total;
        this.pagination.currentPage = currentPage;
        HandleIndexSession.setSession(this, 'account');
        this.tableData = [];
        data.items.forEach((e) => {
          this.tableData.push({
            id: e.id,
            display_name: e.display_name,
            frame_type: e.frame_type,
            material: e.material,
            frame_Shape_type: e.frame_Shape_type,
            hasChildren: e.hasChildren,
            child_skus: e.child_skus,
          });
        });
        this.tableLoading = false;
      },
      search() {},
      async load(tree, treeNode, callback) {
        const { data } = await productApi.getNewProductChildren(tree.child_skus);
        const tmp = [];
        data.forEach((e) => {
          tmp.push({
            id: e.id,
            title: e.title,
            description: e.description,
            label: e.label,
            page_type: e.page_type,
            position: e.position,
            image: e.image_url,
            status: e.status,
          });
        });
        callback(tmp);
      },
      async change(current) {
        this.pagination.currentPage = current;
        await this.getNewProductListWithPage(current);
      },
      async initList() {
        // 进入列表前先检测之前的页面信息
        if (
          HandleIndexSession.exitSession(this, 'new_product') &&
          this.$cookie.get('is_edit_back') == 1
        ) {
          HandleIndexSession.getSession(this, 'new_product');
        }
        await this.getNewProductListWithPage();
      },
      async exportCsv() {
        const result = await productApi.getNewProductCsv({ filter: {} });
        let blob = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const elink = document.createElement('a');
        elink.download = '上新数据';
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
      },
      async exportLensCsv() {
        const result = await productV1Api.getLensCsv();
        let blob = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const elink = document.createElement('a');
        elink.download = '镜片套餐数据';
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
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
