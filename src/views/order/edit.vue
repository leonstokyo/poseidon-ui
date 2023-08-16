<template>
  <div>
    <div>
      <el-descriptions
        class="margin-top zenni-description-list"
        :title="`${detailForm.ordersn}(${detailForm.status_label})`"
        :column="4"
        size="medium"
        border
      >
        <el-descriptions-item :span="2">
          <template slot="label">
            <i class="el-icon-mobilephone"></i>
            工厂订单号
          </template>
          {{ detailForm.factory_order_number }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            订单状态
          </template>
          {{ detailForm.status_label }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            套餐原价
          </template>
          {{ detailForm.origin_total_money }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            套餐优惠
          </template>
          {{ detailForm.total_discount_money }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            订单原价
          </template>
          {{ detailForm.origin_order_money }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            订单优惠
          </template>
          {{ detailForm.discount_order_money }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            订单item数量
          </template>
          {{ detailForm.qty }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            下单时间
          </template>
          {{ detailForm.place_at }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            付款时间
          </template>
          {{ detailForm.pay_at }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            物流编号
          </template>
          {{ detailForm.waybill }}
          <LogisticsBtn
            v-if="detailForm.waybill"
            :waybill="detailForm.waybill"
            btnText="查看物流"
            class="ml-10"
          />
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions class="margin-top" :column="2" size="medium" border v-if="!orderEditVisible">
        <template slot="title">
          <div class="mt-20">
            地址备注信息
          </div>
        </template>
        <template slot="extra" v-if="orderEditAble">
          <div class="mt-20">
            <el-button type="primary" @click="orderEditVisible = true">编辑</el-button>
          </div>
        </template>
        <el-descriptions-item>
          <template slot="label">
            收件人
          </template>
          <CompareText
            :origin="orderComparingData.firstname"
            :current="detailForm.firstname"
          ></CompareText>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            联系电话
          </template>
          <CompareText
            :origin="orderComparingData.telephone"
            :current="detailForm.telephone"
          ></CompareText>
        </el-descriptions-item>

        <el-descriptions-item :span="2">
          <template slot="label">
            收货地址
          </template>
          <CompareText
            :origin="orderComparingData.detail"
            :current="detailForm.address"
          ></CompareText>
        </el-descriptions-item>

        <el-descriptions-item :span="2">
          <template slot="label">
            订单备注
          </template>
          <CompareText
            :origin="orderComparingData.description"
            :current="detailForm.description"
          ></CompareText>
        </el-descriptions-item>
      </el-descriptions>

      <div v-else>
        <div class="form-title mt-20">
          编辑地址备注
        </div>

        <AddressForm
          style="margin-top: 20px"
          ref="address-selector"
          :address-info="orderForm.addressInfo"
        ></AddressForm>
        <el-form
          ref="orderForm"
          :rules="rules"
          :model="orderForm"
          label-width="100px"
          class="zenni-form"
        >
          <el-form-item label="订单备注" prop="description">
            <el-input :length="20" v-model="orderForm.description"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="text-right">
              <el-button class="" @click="orderEditVisible = false">取消</el-button>
              <el-button class="ml-40" type="primary" @click="saveOrder">保存</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div>
      <div class="mt-20" />
      <el-collapse v-model="activeItems">
        <el-collapse-item
          v-for="item of orderItems"
          :key="item.commerceitem_id"
          :name="item.commerceitem_id"
        >
          <template slot="title">
            <div class="customer-collapse-header">
              订单Item
              <span style="font-size:24px;font-weight:600;color: #ec0909">
                {{ item.sequenceNumber || item.subitems.frame.commerceitem_id }}
              </span>
            </div>
          </template>
          <div class="px-20">
            <OrderInfoNew
              :edit-able="prescriptionEditAble"
              :orderItem="item"
              :customerId="customerId"
              @save-success="handleSuccess"
              :editItem="true"
            ></OrderInfoNew>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div style="width: 1000px" class="mt-20">
      <div style="display: flex; justify-content:flex-end;">
        <!--justify-content: space-between-->
        <!--                    <el-button type="primary" @click="update">保存</el-button>-->
        <el-button type="primary" style="width: 300px;" @click="back">{{ buttonText }}</el-button>
        <el-button
          type="primary"
          style="width: 300px;"
          v-if="canDo('orders-pushToFactory')"
          :disabled="isPush"
          @click="pushOrder"
        >
          {{ buttonPushText }}
        </el-button>
        <el-button
          type="primary"
          style="width: 300px"
          v-show="detailForm.status_label === '加工中'"
          v-if="canDo('orders-refund')"
          @click="refundDialog(commerceitem_id)"
        >
          退款
        </el-button>
      </div>
    </div>

    <el-dialog title="物流信息" :visible.sync="centerDialogVisible" width="800px" center>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          reverse
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="退款"
      :visible.sync="refundDialogVisible"
      width="60%"
      center
      @close="closeRefundDialog"
    >
      <span slot="footer" class="dialog-footer">
        <el-scrollbar style="height: 500px">
          <div
            style="width: auto; padding: 5px; margin-bottom: 5px"
            v-for="(item, index) of orderList"
          >
            <el-descriptions
              class="margin-top zenni-description-list mini-size"
              :title="`item编号：${item.id}`"
              :column="3"
              border
            >
              <el-descriptions-item :span="3" label="镜框名称">
                {{ item.name }}
              </el-descriptions-item>
              <el-descriptions-item label="总数量">
                {{ item.total }}
              </el-descriptions-item>
              <el-descriptions-item label="已退款数量">
                {{ item.refunded_num }}
              </el-descriptions-item>
              <el-descriptions-item label="可退款数量">
                {{ item.qty }}
              </el-descriptions-item>
              <el-descriptions-item label="选择退款数量">
                <el-input-number
                  v-model="item.to_refund_num"
                  :min="0"
                  :max="item.qty"
                  style="width: 120px"
                  @change="computeRefund(item)"
                ></el-input-number>
              </el-descriptions-item>
              <el-descriptions-item label="预计退款金额">
                {{ formatMoney(item.expect_refund_money) }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <el-descriptions class="margin-top zenni-description-list" border>
            <el-descriptions-item label="预计退款总额">
              {{ formatMoney(this.total_expect_money) }}
            </el-descriptions-item>
          </el-descriptions>

          <el-descriptions class="margin-top zenni-description-list" border>
            <el-descriptions-item label="退款比例">
              <el-select v-model="refund_type" placeholder="请选择" size="small" style="width: 40%">
                <el-option
                  v-for="item in refundTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-descriptions-item>
          </el-descriptions>

          <div style="margin-top: 20px; display: flex; justify-content: flex-start">
            <span style="width: 80px">申请原因：</span>
            <el-input
              type="textarea"
              :rows="3"
              v-model="apply_reason"
              style="width: 500px"
            ></el-input>
          </div>
          <div
            style="margin-left:auto; margin-right: auto; margin-top: 20px; width: 30%; display: flex; justify-content: space-between"
          >
            <el-button type="primary" :loading="refundBtnLoading" @click="refund">退款</el-button>
            <el-button type="primary" @click="refundDialogVisible = false">返回</el-button>
          </div>
        </el-scrollbar>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import OrderInfoNew from '@/components/order/OrderInfoNew';
  import AddressForm from '@/components/address/AddressForm';
  import CompareText from '@/components/common/CompareText';
  import orderApi from '@/api/order';
  import { mapGetters, mapActions } from 'vuex';
  import { Message } from 'element-ui';
  import { formatMoney } from '@/utils/tools';
  import LogisticsBtn from '@/components/logisticsBtn';
  export default {
    name: 'OrderEdit',
    components: {
      OrderInfoNew,
      AddressForm,
      CompareText,
      LogisticsBtn,
    },
    created() {
      if (this.$route.params.id) {
        this.commerceitem_id = this.$route.params.id;
        this.initData(this.$route.params.id);
      }
    },
    computed: {
      ...mapGetters('permission', {
        isAdmin: 'isAdmin',
        canDo: 'canDo',
      }),
      prescriptionEditAble: function() {
        return (
          (this.detailForm.status == '5' || this.detailForm.status == '10') &&
          this.canDo('orders-updateOrderPrescription')
        );
      },
      orderEditAble: function() {
        return (
          (this.detailForm.status == '5' || this.detailForm.status == '10') &&
          this.canDo('orders-update')
        );
      },
    },
    data() {
      return {
        refundTypeOptions: [
          {
            label: '眼镜100%',
            value: '1',
          },
          {
            label: '眼镜50%',
            value: '2',
          },
          {
            label: '镜框100%',
            value: '3',
          },
        ],
        refund_type: '',
        descriptionChanged: false,
        addressChanged: false,
        firstnameChanged: false,
        telephoneChanged: false,
        formatMoney,
        activities: [],
        refundDialogVisible: false,
        centerDialogVisible: false,
        orderEditVisible: false,
        commerceitem_id: '',
        customerId: '',
        activeItems: [],
        rules: {
          description: [{ min: 0, max: 20, message: '长度不能大于20字符', trigger: 'blur' }],
        },
        detailForm: {
          ordersn: '',
          address: '',
          ordered_time: '',
          status: '',
          total_money: '',
          qty: '',
          waybill: '',
          factory_order_number: '',
          description: '',
        },
        orderForm: {
          addressInfo: {},
          description: '',
          order_id: '',
        },
        buttonText: '返回',
        buttonPushText: '订单推送工厂',
        orderItems: [],
        isPush: true,

        apply_reason: '',
        refundBtnLoading: false,
        total_expect_money: 0,
        orderList: [],
        originOrderInfo: {},
        orderComparingData: {},
      };
    },
    methods: {
      ...mapActions('loading', ['setLoading', 'setLoadingComplete']),
      async initData(id) {
        this.setLoading();
        const res = await orderApi.getOrderItem(id);
        const result = res['data']['item'][0];
        const { data: originData } = await orderApi.getOriginOrderInfo(result.order_id);

        this.detailForm.ordersn = result.ordersn;
        this.detailForm.factory_order_number = result.factory_order_number;
        this.detailForm.description = result.description || '';
        this.detailForm.address = `${result.address.region}${result.address.city}${result.address.area}${result.address.street}`;
        this.detailForm.firstname = result.address.firstname;
        this.detailForm.telephone = result.address.telephone;
        this.detailForm.place_at = result.place_at;
        this.detailForm.pay_at = result.pay_at;
        this.detailForm.status = result.status;
        this.detailForm.waybill = result.waybill;
        this.detailForm.total_money = result.total_money;
        this.detailForm.qty = result.items.length;
        this.detailForm.status_label = result.status_label;
        this.customerId = result.customer_id;
        this.orderItems = result.items;
        this.activeItems = result.items.map((_item) => _item.commerceitem_id);
        this.orderForm.order_id = result.order_id;
        this.orderForm.addressInfo = result.address;
        this.orderForm.description = result.description || '';

        if (!originData.address) {
          originData.address = result.address;
        }
        if (!originData.order) {
          originData.order = result;
        }
        this.orderComparingData = {
          detail: `${originData.address.region || ''}${originData.address.city || ''}${originData
            .address.area || ''}${originData.address.street || ''}`,
          firstname: originData.address.firstname,
          telephone: originData.address.telephone,
          description: originData.order.description || '',
        };

        this.originOrderInfo = {
          address: result.address,
          order: {
            description: result.description || '',
          },
        };
        let priceParams = {
          origin_total_money: result.origin_total_money, //套餐原价
          total_discount_money: `-${result.total_discount_money}`, //套餐优惠
          origin_shipping_fee: result.origin_shipping_fee, //运费原价
          discount_shipping_fee: `-${(
            parseFloat(result.origin_shipping_fee) - parseFloat(result.shipping_fee)
          ).toFixed(2)}`, //运费优惠
          origin_order_money: (
            parseFloat(result.origin_total_money) + parseFloat(result.origin_shipping_fee)
          ).toFixed(2), //订单原价 = 套餐原价+运费原价
          discount_order_money: `-${(
            parseFloat(result.total_discount_money) +
            (parseFloat(result.origin_shipping_fee) - parseFloat(result.shipping_fee))
          ).toFixed(2)}`, //订单优惠 = 套餐优惠 + 运费优惠
          total_money: (Number(result.total_money) + Number(result.shipping_fee)).toFixed(2), //用户实付金额
        };

        this.detailForm = { ...this.detailForm, ...priceParams };
        const items = res['data']['item'][0]['items'];
        this.orderList = [];
        for (const item of items) {
          this.orderList.push({
            id: item.commerceitem_id,
            total: item.qty,
            qty: Number(item.can_after_sale_commerceitem_qty),
            name: item.subitems.frame.name,
            to_refund_num: 0,
            refunded_num: Number(item.qty) - Number(item.can_after_sale_commerceitem_qty),
            expect_refund_money: 0,
            single_price: (item.total_money / item.qty).toFixed(2),
          });
        }
        // TODO: 临时逻辑，item显示编号
        const itemNumbers = this.orderItems.length;
        if (itemNumbers === 1) {
          for (const el of this.orderItems) {
            el.sequenceNumber = '1-0';
          }
        } else {
          let count = 1;
          for (const el2 of this.orderItems) {
            el2.sequenceNumber = `${itemNumbers}-${count++}`;
          }
        }

        // 处理orderItems，确实是否有非完整验光单.
        let isFinished = true;
        for (const item of result.items) {
          if (item['prescription'] && item['prescription']['import_type'] == '1') {
            isFinished = false;
            break;
          }
        }
        if (isFinished) {
          if (this.detailForm.status == 10) {
            this.isPush = false;
          }
        } else {
          this.isPush = true;
        }

        this.setLoadingComplete();
      },

      async pushOrder() {
        const { errorCode, message } = await orderApi.pushToFactory(this.detailForm.ordersn);
        if (errorCode === 0) {
          Message.success({
            message: '更新成功！',
            duration: 2000,
          });
          this.back();
        } else {
          Message.error({
            message,
            duration: 2000,
          });
        }
      },
      refund() {
        const commerceitems = [];
        let refundNumTmp = 0;
        for (const item of this.orderList) {
          if (item.to_refund_num != 0) {
            refundNumTmp += item.to_refund_num;
            commerceitems.push({
              commerceitem_id: item.id,
              qty: item.to_refund_num,
              refund_type: this.refund_type,
            });
          }
        }
        if (refundNumTmp == 0) {
          Message.error({
            message: '请选择退款产品！',
            duration: 2000,
          });
        } else {
          this.refundBtnLoading = true;
          const data = {
            apply_reason: this.apply_reason,
            apply_reason_title_id: 2, // 目前先写死 （2: 其他原因）
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
                this.initData(this.$route.params.id);
                this.refundDialogVisible = false;
                this.initData(this.commerceitem_id);
              } else {
                Message.error({
                  message: res.message,
                  duration: 2000,
                });
              }
            })
            .finally(() => {
              this.refundBtnLoading = false;
            });
        }
      },
      refundDialog() {
        this.refund_type = '';
        this.total_expect_money = 0;
        this.apply_reason = '';
        this.refundDialogVisible = true;
      },
      handleSuccess() {
        this.initData(this.$route.params.id);
      },
      back() {
        this.$router.back();
      },
      computeRefund(item) {
        item.expect_refund_money = (item.single_price * item.to_refund_num).toFixed(2);
        this.total_expect_money = 0;
        for (const item of this.orderList) {
          this.total_expect_money += Number(item.expect_refund_money);
          this.total_expect_money.toFixed(2);
        }
      },
      closeRefundDialog() {
        // 关闭弹窗初始化数据
        for (const item of this.orderList) {
          item.to_refund_num = 0;
          item.expect_refund_money = 0;
        }
      },
      async saveOrder() {
        try {
          await this.$refs['orderForm'].validate();
          const res = this.$refs['address-selector'].sendData();
          const order = {
            order_id: this.orderForm.order_id,
            description: this.orderForm.description,
          };
          const address = {
            address_id: res.address_id,
            order_id: this.orderForm.order_id,
            area_code: res.area_code,
            telephone: res.telephone,
            firstname: res.firstname,
            street: res.detail,
            customer_id: this.customerId,
          };
          this.originOrderInfo.object_id = this.orderForm.order_id;
          const data = {
            order,
            address,
          };
          const { errorCode, message } = await orderApi.updateOrderInfo(
            this.orderForm.order_id,
            data,
            this.originOrderInfo
          );
          if (errorCode === 0) {
            Message.success({
              message: '更新成功！',
              duration: 2000,
            });
            this.orderEditVisible = false;
            this.initData(this.$route.params.id);
          } else {
            Message.error({
              message,
              duration: 2000,
            });
          }
        } catch (err) {
          Message.error({
            message: '请检查表单',
            duration: 2000,
          });
        }
      },
    },
  };
</script>
<style scoped>
  .input-style {
    width: 350px;
  }
  .my-label {
    background: #e1f3d8;
    width: 50px;
  }
</style>
