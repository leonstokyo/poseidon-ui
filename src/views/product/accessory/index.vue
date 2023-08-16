j
<template>
  <div v-loading="tableLoading" element-loading-text="加载中...">
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="ID">
          <el-input
            v-model="filter.entity_id"
            placeholder="ID"
            style="width: 100px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="SKU">
          <el-input
            v-model="filter.sku"
            placeholder="SKU"
            style="width: 100px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-select v-model="filter.type_id" placeholder="请选择" style="width: 130px" clearable>
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filter.status" placeholder="请选择" style="width: 100px" clearable>
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
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="编号" minWidth="80"></el-table-column>
      <el-table-column prop="name" label="产品名称" minWidth="200"></el-table-column>
      <el-table-column prop="sku" label="SKU" minWidth="160"></el-table-column>
      <el-table-column prop="type_id" label="产品类型" minWidth="100"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="status" label="数据状态">
        <div slot-scope="color">
          <el-tag v-if="color.row.status == 2" type="danger">已下架</el-tag>
          <el-tag v-else type="success">使用中</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="操作" fixed="right" minWidth="80">
        <div slot-scope="operation">
          <el-button
            :disabled="!canDo('accessories-update')"
            size="mini"
            type="primary"
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
  import productApi from '@/api/product';
  import options from '@/components/mixins/common/options';
  import label from '@/components/mixins/common/label';
  import HandleIndexSession from '@/utils/HandleIndexSession';
  import { mapGetters } from 'vuex';
  export default {
    name: 'AccessoryIndex',
    mixins: [options, label],
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
          entity_id: '',
          sku: '',
          status: '',
          type_id: '',
          attribute_set_id: '13,14',
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
        this.$router.push({ name: 'AccessoryAdd' });
      },
      search() {
        this.pagination.currentPage = 1;
        this.getProductListWithPage();
      },
      async change(current) {
        this.pagination.currentPage = current;
        await this.getProductListWithPage(current);
      },
      edit(row) {
        this.$router.push({ name: 'AccessoryEdit', params: { sku: row.sku } });
      },
      async getProductListWithPage(current) {
        const currentPage = current ? current : this.pagination.currentPage;
        const { data } = await productApi.getAccessoryList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter: this.filter,
        });
        const { items, total, pageSize } = data;
        this.pagination.pageSize = pageSize;
        this.pagination.total = total;
        this.tableData = [];
        HandleIndexSession.setSession(this, 'accessory');
        items.forEach((e) => {
          this.tableData.push({
            id: e.id,
            name: e.name,
            type_id: e.type_id,
            sku: e.sku,
            price: e.price,
            status: e.status,
            category: e.attributes.category_ids,
          });
        });
      },
      async initList() {
        this.tableLoading = true;
        if (
          this.$session.exists('accessory_pagination') &&
          this.$session.exists('accessory_filter')
        ) {
          this.pagination = this.$session.get('accessory_pagination');
          this.filter = this.$session.get('accessory_filter');
        }
        await this.getAttributesByName();
        await this.getProductListWithPage();
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
