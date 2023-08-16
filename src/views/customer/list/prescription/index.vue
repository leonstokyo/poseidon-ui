<template>
  <div v-loading="tableLoading" element-loading-text="加载中...">
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="ID">
          <el-input
            v-model="filter.prescription_id"
            placeholder="ID"
            style="width: 100px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input
            v-model="filter.customer_id"
            placeholder="用户ID"
            style="width: 100px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="用户手机号">
          <el-input
            v-model="filter['@customer_phone']"
            placeholder="手机号"
            style="width: 160px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="是否完整验光单">
          <el-select
            v-model="filter.import_type"
            placeholder="请选择"
            style="width: 150px"
            clearable
          >
            <el-option
              v-for="item in importTypeOptions"
              :key="item.index"
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
    <el-table :data="tableData" border highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="编号" minWidth="80"></el-table-column>
      <el-table-column prop="import_type" label="完整验光单" minWidth="100"></el-table-column>
      <el-table-column prop="customer_id" label="用户ID" minWidth="80"></el-table-column>
      <el-table-column prop="customer_phone" label="用户手机号" minWidth="120"></el-table-column>
      <el-table-column label="类型" minWidth="100">
        <div slot-scope="prescriptionType">
          <span>{{ prescriptionTypeMapping[prescriptionType.row.prescription_type_id] }}</span>
        </div>
      </el-table-column>
      <el-table-column label="名称" minWidth="180">
        <div slot-scope="baseInfo">
          <li>名称：{{ baseInfo.row.prescription_name }}</li>
          <li>日期：{{ baseInfo.row.date_of_prescription }}</li>
          <li>来源：{{ baseInfo.row.source }}</li>
        </div>
      </el-table-column>
      <el-table-column label="瞳距" minWidth="150">
        <div slot-scope="pd">
          <li>类型：{{ ['瞳距', '单眼瞳距'][pd.row.pd_type] }}</li>
          <li v-show="pd.row.pd_type == '0'">瞳距：{{ handlePd(pd.row.pd) }}</li>
          <li v-show="pd.row.pd_type == '1'">左瞳距：{{ handlePd(pd.row.left_pd) }}</li>
          <li v-show="pd.row.pd_type == '1'">右瞳距：{{ handlePd(pd.row.right_pd) }}</li>
        </div>
      </el-table-column>

      <el-table-column label="度数" minWidth="150">
        <div slot-scope="sph">
          <li>右眼：{{ sph.row.od_sph }}</li>
          <li>左眼：{{ sph.row.os_sph }}</li>
          <div v-show="sph.row.prescription_type_id === 'Progressive'" style="margin-top: 10px">
            <li>下加光：{{ sph.row.nv_add }}</li>
          </div>
        </div>
      </el-table-column>

      <el-table-column label="散光+轴位" minWidth="230">
        <div slot-scope="cyl">
          <li>右眼：散光 {{ cyl.row.od_cyl }} 轴位 {{ parseInt(cyl.row.od_axis) }}</li>
          <li>左眼：散光 {{ cyl.row.os_cyl }} 轴位 {{ parseInt(cyl.row.os_axis) }}</li>
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
  import customerApi from '@/api/customer';
  import HandleIndexSession from '@/utils/HandleIndexSession';
  import HandleFilter from '@/utils/HandleFilter';
  import { handlePd } from '@/utils/tools';
  import { mapGetters } from 'vuex';
  export default {
    name: 'CustomerAllPrescriptionIndex',
    created() {
      if (this.$route.params.id) {
        this.filter.customer_id = this.$route.params.id;
      }
      this.initList();
    },
    computed: mapGetters('permission', {
      availableButton: 'availableButton',
      isAdmin: 'isAdmin',
    }),
    data() {
      return {
        handlePd,
        activities: [],
        tableLoading: false, // 表格loading
        couponTypeLabel: {},
        couponStatusLabel: {},
        couponStatus: {},
        statusOptions: [],
        importTypeOptions: [
          // index v-for key
          {
            label: '是',
            value: [0, 2],
            index: 1,
          },
          {
            label: '否',
            value: '1',
            index: 2,
          },
        ],
        filter: {
          prescription_id: '',
          customer_id: '',
          '@customer_phone': '',
          import_type: '',
        },
        pagination: {
          pageSize: 10,
          currentPage: 1,
          total: 100,
        },
        tableData: [],
        prescriptionTypeMapping: {
          SingleVision: '单光',
          Progressive: '渐进',
        },
      };
    },
    methods: {
      search() {
        this.pagination.currentPage = 1;
        this.getCouponListWithPage();
      },
      async change(current) {
        this.pagination.currentPage = current;
        await this.getCouponListWithPage(current);
      },
      async getCouponListWithPage(current) {
        const currentPage = current ? current : this.pagination.currentPage;
        const filter = HandleFilter.handleFilter(this.filter);
        const tmp = await customerApi.getAllPrescriptionList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter,
        });
        const res = tmp['data'][0];
        let { items = [], total } = res;
        this.pagination.total = total;
        this.tableData = [];
        HandleIndexSession.setSession(this, 'all-prescription');
        items.forEach((e) => {
          this.tableData.push({
            id: e.prescription_id,
            customer_id: e.customer_id,
            prescription_name: e.prescription_name,
            source: e.source,
            prescription_type_id: e.prescription_type_id,
            firstname: e.firstname,
            street: e.street,
            telephone: e.telephone,
            default_billing: e.default_billing,
            date_of_prescription: e.date_of_prescription,
            pd_type: e.pd_type,
            pd: e.pd,
            left_pd: e.left_pd,
            right_pd: e.right_pd,
            od_sph: e.od_sph,
            os_sph: e.os_sph,
            od_cyl: e.od_cyl,
            os_cyl: e.os_cyl,
            od_axis: e.od_axis,
            os_axis: e.os_axis,
            import_type: e.import_type == 1 ? '否' : '是',
            nv_add: e.nv_add,
            customer_phone: e.customer_phone,
          });
        });
      },
      async initList() {
        this.tableLoading = true;
        if (
          HandleIndexSession.exitSession(this, 'all-prescription') &&
          this.$cookie.get('is_edit_back') == 1
        ) {
          HandleIndexSession.getSession(this, 'all-prescription');
        }
        await this.getCouponListWithPage();
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
