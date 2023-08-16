<template>
  <div v-loading="tableLoading" element-loading-text="加载中...">
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="ID">
          <el-input
            v-model="filter.entity_id"
            placeholder="ID"
            style="width: 130px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="SKU">
          <el-input v-model="filter.sku" placeholder="SKU" clearable></el-input>
        </el-form-item>
        <el-form-item label="折射率">
          <el-input v-model="filter.lens_index" placeholder="折射率" clearable></el-input>
        </el-form-item>
        <el-form-item label="处方类型">
          <el-select
            v-model="filter.prescription_type_id"
            placeholder="请选择"
            multiple
            style="width: 150px"
            clearable
          >
            <el-option
              v-for="item in prescriptionTypeIdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="套餐类型">
          <el-select
            v-model="filter.package_type"
            placeholder="请选择"
            multiple
            style="width: 150px"
            clearable
          >
            <el-option
              v-for="item in packageTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="镜片类型">
          <el-select
            v-model="filter.lens_type"
            placeholder="请选择"
            multiple
            style="width: 150px"
            clearable
          >
            <el-option
              v-for="item in lensTypeOptions"
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
          <el-button
            v-if="canDo('lens-create') && !outer"
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
      :data="tableData"
      border
      style="width: 100%"
      highlight-current-row
      @current-change="cellClick"
    >
      <el-table-column prop="id" label="编号" minWidth="80"></el-table-column>
      <el-table-column prop="name" label="产品名称" minWidth="200"></el-table-column>
      <el-table-column prop="sku" label="SKU" minWidth="160"></el-table-column>
      <el-table-column property="packageType" label="套餐类型" minWidth="120">
        <div slot-scope="packageType">
          <el-tag
            type="danger"
            v-if="packageTypeMapping[item]"
            v-for="(item, index) in packageType.row.packageType"
            :key="index"
            style="margin-top: 3px; width: 80px; text-align: center"
            size="small"
          >
            {{ packageTypeMapping[item] }}
          </el-tag>
        </div>
      </el-table-column>
      <el-table-column
        prop="prescription_type_id_label"
        label="处方类型"
        minWidth="100"
      ></el-table-column>
      <el-table-column prop="lensType" label="镜片类型" minWidth="100"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column
        prop="external_reference_id"
        label="镜片编码"
        minWidth="60"
      ></el-table-column>
      <el-table-column prop="tint_ext_id" label="染色编号" minWidth="60"></el-table-column>
      <el-table-column prop="coating_ext_id" label="镀膜编号" minWidth="60"></el-table-column>
      <el-table-column prop="status" label="数据状态">
        <div slot-scope="color">
          <el-tag v-if="color.row.status == 2" type="danger">已下架</el-tag>
          <el-tag v-else type="success">使用中</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="操作" fixed="right" minWidth="80" v-if="!outer">
        <div slot-scope="operations">
          <el-button
            :disabled="!canDo('lens-update')"
            size="mini"
            type="primary"
            @click="edit(operations.row)"
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
  import {
    PrescriptionTypeIdOptions,
    LensTypeOptions,
    LensTypeOptionsLabel,
    PrescriptionTypeIdOptionsLabel,
  } from '@/constant/options';
  import { mapGetters } from 'vuex';
  export default {
    name: 'LensIndex',
    mixins: [options, label],
    props: {
      outer: {
        type: Boolean,
        default: false,
      },
    },
    created() {
      this.initList();
      this.prescriptionTypeIdOptions = PrescriptionTypeIdOptions;
      this.lensTypeOptions = LensTypeOptions;
    },
    computed: mapGetters('permission', {
      canDo: 'canDo',
      isAdmin: 'isAdmin',
    }),
    data() {
      return {
        btnLoading: false, // 按钮loading
        tableLoading: false, // 表格loading
        filter: {
          entity_id: '',
          sku: '',
          category_id: '',
          attribute_set_id: '11', // 固定
          status: '',
          lens_type: '',
          prescription_type_id: '',
          lens_index: '',
          package_type: '',
        },
        pagination: {
          pageSize: 10,
          currentPage: 1,
          total: 100,
        },
        tableData: [],
        categoryMapping: {},
        prescriptionOptions: [],
        lensTypeOptions: [],
      };
    },
    methods: {
      search() {
        this.pagination.currentPage = 1;
        this.getLensListWithPage();
      },
      add() {
        this.$router.push({ path: '/product/lens/add' });
      },
      edit(row) {
        this.$router.push({ path: `/product/lens/edit/${row.sku}` });
      },
      change(current) {
        this.getLensListWithPage(current);
      },
      async getLensListWithPage(current) {
        const currentPage = current ? current : this.pagination.currentPage;
        const { data } = await productApi.getLensList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter: this.filter,
        });
        const { items, total, pageSize } = data;
        this.pagination.pageSize = pageSize;
        this.pagination.total = total;
        this.pagination.currentPage = currentPage;
        this.tableData = [];
        HandleIndexSession.setSession(this, 'lens');
        items.forEach((e) => {
          this.tableData.push({
            id: e.id,
            name: e.name,
            sku: e.sku,
            price: e.price ? e.price.toFixed(2) : 0,
            status: e.status,
            category: e.attributes.category_ids,
            packageType: e.attributes.package_type,
            lensType: LensTypeOptionsLabel[e.attributes.lens_type],
            prescription_type_id: e.attributes.prescription_type_id,
            lens_index: e.attributes.lens_index,
            prescription_type_id_label:
              PrescriptionTypeIdOptionsLabel[e.attributes.prescription_type_id],
            tint_ext_id: e.attributes.tint_ext_id,
            coating_ext_id: e.attributes.coating_ext_id,
            external_reference_id: e.attributes.external_reference_id,
            lens_color: e.attributes.lens_color,
          });
        });
      },

      async initList() {
        this.tableLoading = true;
        // 进入列表前先检测之前的页面信息
        if (HandleIndexSession.exitSession(this, 'lens') && this.$cookie.get('is_edit_back') == 1) {
          HandleIndexSession.getSession(this, 'lens');
        }
        await this.getAttributesByName();
        await this.getLensListWithPage();
        this.tableLoading = false;
      },
      cellClick(data) {
        this.$emit('lens-data', data);
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
