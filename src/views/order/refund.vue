<template>
  <div>
    <div
      style="width: 830px; display: flex; justify-content: space-between; margin-left: 50px; margin-bottom:30px "
    >
      <div style="width: 150px; display:flex; justify-content: center">
        commerceItem_id
      </div>
      <div style="width: 300px; display:flex; justify-content: center">
        产品名称
      </div>
      <div style="width: 200px; display:flex; justify-content: center">
        退款数量
      </div>
      <div style="width: 200px; display:flex; justify-content: center">
        预计退款金额
      </div>
    </div>
    <div
      style="width: 900px; display: flex; justify-content: space-between; margin-left: 50px"
      v-for="(item, index) of orderList"
    >
      <div style="width: 150px; height: 50px; display:flex; justify-content: center">
        {{ item.id }}
      </div>
      <div style="width: 300px; height: 50px; display:flex; justify-content: center">
        {{ item.name }}
      </div>
      <div style="width: 200px; height: 50px; display:flex; justify-content: center">
        <el-input-number
          v-model="item.refund_num"
          :min="0"
          :max="item.qty"
          @change="computeRefund(item)"
        ></el-input-number>
      </div>
      <div style="width: 300px; height: 50px; display:flex; justify-content: center">
        {{ item.expect_refund_money }}
      </div>
    </div>
    <div style="display: flex; justify-content: flex-start">
      <div style="margin-left: 70px">预计退款总额：</div>
      <div>{{ this.total_expect_money }}</div>
    </div>
    <div
      style="margin-top: 50px; margin-left: 50px; width: 300px; display: flex; justify-content: space-between"
    >
      <el-button type="primary" :loading="btnLoading" @click="refund">退款</el-button>
      <el-button type="primary" @click="back">返回</el-button>
    </div>
  </div>
</template>
<script>
  import orderApi from '@/api/order';
  import { Message } from 'element-ui';
  export default {
    name: 'OrderRefund',

    created() {
      this.initData(this.$route.params.id);
    },
    data() {
      return {
        total_expect_money: 0,
        btnLoading: false,
        orderList: [],
      };
    },
    methods: {
      refund() {
        this.btnLoading = true;
        const commerceitems = [];
        for (const item of this.orderList) {
          if (item.refund_num != 0) {
            commerceitems.push({
              commerceitem_id: item.id,
              qty: item.refund_num,
            });
          }
        }
        if (commerceitems.length === 0) {
          Message.error({
            message: '请选择退款产品！',
            duration: 2000,
          });
        } else {
          const data = {
            apply_reason: '',
            apply_reason_title_id: 3,
            commerceitems,
          };
          orderApi
            .orderRefund(data)
            .then((res) => {
              if (res.errorCode === 0) {
                Message.success({
                  message: '退款成功！',
                  duration: 2000,
                });
                this.back();
              } else {
                Message.error({
                  message: res.message,
                  duration: 2000,
                });
              }
            })
            .finally(() => {
              this.btnLoading = false;
            });
        }
      },
      back() {
        this.$router.back();
      },
      computeRefund(item) {
        item.expect_refund_money = (item.single_price * item.refund_num).toFixed(2);
        this.total_expect_money = 0;
        for (const item of this.orderList) {
          this.total_expect_money += Number(item.expect_refund_money);
          this.total_expect_money.toFixed(2);
        }
      },
      async initData(id) {
        const res = await orderApi.getOrderItem(id);
        const items = res['data']['item'][0]['items'];
        for (const item of items) {
          this.orderList.push({
            id: item.commerceitem_id,
            qty: Number(item.can_after_sale_commerceitem_qty),
            name: item.subitems.frame.name,
            refund_num: 0,
            expect_refund_money: 0,
            single_price: (item.total_money / item.qty).toFixed(2),
          });
        }
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
