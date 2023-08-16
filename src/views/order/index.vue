<template>
  <div v-loading="tableLoading" element-loading-text="加载中...">
    <SearchForm ref="searchForm" :formOptions="searchFormData" @getData="getData">
      <template slot="extra-export">
        <el-form-item label=" ">
          <el-button
            type="primary"
            :loading="btnLoading"
            @click="exportFactoryDialog"
            v-if="canDo('orders-export')"
          >
            {{ export_text }}
          </el-button>
          <el-button
            type="primary"
            :loading="btnLoading"
            @click="exportInnerDialog"
            v-if="canDo('orders-exportNew')"
          >
            {{ export_text_new }}
          </el-button>
        </el-form-item>
      </template>
    </SearchForm>

    <el-table :data="tableData" border highlight-current-row style="width: 100%">
      <el-table-column prop="ordersn" label="订单号" minWidth="130"></el-table-column>
      <el-table-column prop="customer_phone" label="用户手机号" minWidth="130"></el-table-column>
      <el-table-column
        prop="factory_order_number"
        label="工厂订单号"
        minWidth="130"
      ></el-table-column>
      <el-table-column prop="waybill" label="运单号" minWidth="130">
        <template slot-scope="{ row }">
          {{ row.waybill ? row.waybill : '暂无' }}
        </template>
      </el-table-column>
      <el-table-column prop="status_label" label="订单状态" minWidth="100"></el-table-column>
      <el-table-column prop="pay_at" label="支付时间" minWidth="160"></el-table-column>
      <el-table-column prop="place_at" label="下单时间" minWidth="160"></el-table-column>
      <el-table-column prop="description" label="备注" minWidth="100">
        <template slot-scope="{ row }">
          <el-tooltip
            v-if="row.description"
            class="item"
            effect="dark"
            :content="row.description"
            placement="top"
          >
            <span>
              {{
                row.description.length > 4 ? `${row.description.substr(0, 4)}...` : row.description
              }}
            </span>
          </el-tooltip>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="origin_total_money" minWidth="100">
        <template slot="header">
          套餐原价
          <el-tooltip class="item" effect="dark" content="镜框+镜片" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template slot-scope="{ row }">
          {{ parseFloat(row.origin_total_money).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="total_discount_money" label="套餐优惠" minWidth="100">
        <template slot-scope="{ row }">
          -{{ parseFloat(row.total_discount_money).toFixed(2) }}
        </template>
      </el-table-column>

      <el-table-column prop="total_money" minWidth="100">
        <template slot="header">
          实付金额
          <el-tooltip class="item" effect="dark" content="套餐原价-套餐优惠" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template slot-scope="{ row }">
          {{ parseFloat(row.total_money).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" minWidth="210">
        <div slot-scope="{ row }">
          <router-link
            class="mr-10"
            :to="`/order/edit/${row.order_id}`"
            v-if="canDo('orders-show')"
          >
            <el-button size="mini" type="primary">
              订单详情
            </el-button>
          </router-link>

          <LogisticsBtn
            :disabled="!row.waybill"
            v-if="canDo('orders-show')"
            :waybill="row.waybill"
          />
        </div>
      </el-table-column>
    </el-table>
    <IndexPagination :total-count="total_count" />
    <el-dialog title="提示" :visible.sync="exportFactoryDialogVisible" width="30%">
      <span>确定导出工厂订单数据？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportFactoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="exportFactoryBtnLoading" @click="exportFactory">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="exportInnerDialogVisible" width="30%">
      <span>确定导出运营订单数据？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportInnerDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="exportInnerBtnLoading" @click="exportInner">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import orderApi from '@/api/order';
  //TODO 确定订单状态和订单来源枚举值是不是可以前端写死。
  import { labelSwitchOptions } from '@/utils/tools';

  import { Message } from 'element-ui';
  import { mapGetters } from 'vuex';
  import OrderV1Api from '@/api/V1/order';
  import SearchForm from '@/components/search_forms/index';
  import IndexPagination from '@/components/indexPagination';
  import LogisticsBtn from '@/components/logisticsBtn';
  export default {
    name: 'OrderIndex',
    created() {
      this.getData();
    },
    components: {
      SearchForm,
      IndexPagination,
      LogisticsBtn,
    },
    data() {
      return {
        btnLoading: false,
        exportFactoryBtnLoading: false,
        exportInnerBtnLoading: false,
        activities: [],
        exportFactoryDialogVisible: false,
        exportInnerDialogVisible: false,
        tableLoading: false, // 表格loading
        tableData: [],
        total_count: 0,
      };
    },
    methods: {
      async getData() {
        let query = this.$route.query;
        this.tableLoading = true;
        const resp = await orderApi.getOrderList(query);
        const res = resp['data'][0];
        let { items = [], total } = res;
        this.total_count = total;
        this.tableData = items;
        this.tableLoading = false;
      },
      exportFactoryDialog() {
        this.exportFactoryDialogVisible = true;
      },
      exportInnerDialog() {
        this.exportInnerDialogVisible = true;
      },
      async exportFactory() {
        this.exportFactoryBtnLoading = true;
        let query = this.$refs.searchForm.getFormData();
        OrderV1Api.getOrderExportDataToFactory(query)
          .then((result) => {
            let blob = new Blob([result], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const elink = document.createElement('a');
            elink.download = '工厂订单数据';
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href);
            document.body.removeChild(elink);
            Message.success({
              message: '导出成功',
              duration: 2000,
            });
            this.exportFactoryDialogVisible = false;
          })
          .catch((e) => {
            Message.error({
              message: e.message,
              duration: 2000,
            });
          })
          .finally(() => {
            this.exportFactoryBtnLoading = false;
          });
      },
      async exportInner() {
        this.exportInnerBtnLoading = true;
        let query = this.$refs.searchForm.getFormData();
        OrderV1Api.getOrderExportDataToInner(query)
          .then((result) => {
            let blob = new Blob([result], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const elink = document.createElement('a');
            elink.download = '运营订单数据';
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href);
            document.body.removeChild(elink);
            Message.success({
              message: '导出成功',
              duration: 2000,
            });
            this.exportInnerDialogVisible = false;
          })
          .catch((e) => {
            Message.error({
              message: e.message,
              duration: 2000,
            });
          })
          .finally(() => {
            this.exportInnerBtnLoading = false;
          });
      },
    },
    computed: {
      ...mapGetters('permission', {
        canDo: 'canDo',
      }),
      ...mapGetters(['OrderStatusLabel', 'OrderPlaceFromLabel']),
      export_text() {
        return this.canDo('orders-export') && this.canDo('orders-exportNew') ? '工厂导出' : '导出';
      },
      export_text_new() {
        return this.canDo('orders-export') && this.canDo('orders-exportNew') ? '运营导出' : '导出';
      },

      searchFormData() {
        let query = this.$route.query || {};
        if (typeof query.status === 'string') {
          query.status = [query.status];
        }
        return [
          {
            label: '订单号',
            prop: 'ordersn',
            element: 'el-input',
            placeholder: 'magento订单编号',
            initValue: query.ordersn,
          },
          {
            label: '工厂订单号',
            prop: 'factory_order_number',
            element: 'el-input',
            placeholder: '工厂订单编号',
            initValue: query.factory_order_number,
          },
          {
            label: '用户手机号',
            prop: '@customer_phone',
            placeholder: '用户手机号',
            initValue: query['@customer_phone'],
            element: 'el-input',
          },
          {
            label: '订单状态',
            prop: 'status',
            element: 'el-select',
            multiple: true,
            rowspan: 2,
            initValue: query.status,
            options: labelSwitchOptions(this.OrderStatusLabel),
          },
          {
            label: '下单时间',
            prop: 'place_at',
            element: 'a-range-picker',
            rowspan: 2,
            initValue: query.place_at,
          },
          {
            label: '支付时间',
            prop: 'pay_at',
            element: 'a-range-picker',
            rowspan: 2,
            initValue: query.pay_at,
          },
        ];
      },
    },
    watch: {
      $route: function() {
        this.getData();
        this.$refs.searchForm.reload(this.searchFormData);
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
