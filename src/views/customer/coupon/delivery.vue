<template>
  <div>
    <el-form ref="form" :model="detailForm" :rules="rules" label-width="120px" style="width: 500px">
      <el-form-item label="用户ID" style="width: 500px">
        <el-input v-model="detailForm.customer_id" style="width: 200px" disabled></el-input>
      </el-form-item>
      <el-form-item required label="优惠券类型" style="width: 500px">
        <el-select
          v-model="detailForm.coupon_type"
          @change="getSublist"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in couponTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item required label="优惠券码" style="width: 500px" prop="coupon_code">
        <el-select
          v-model="detailForm.coupon_code"
          placeholder="请选择"
          style="width: 500px"
          clearable
          filterable
        >
          <el-option
            v-for="item in couponCodeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width: 500px">
        <div style="display: flex; width: 500px">
          <el-button type="primary" :loading="btnLoading" @click="create('form')">
            确认发放
          </el-button>
          <el-button @click="back">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { Message } from 'element-ui';
  import couponApi from '@/api/coupon';
  import { mapGetters } from 'vuex';

  export default {
    name: 'CouponDelivery',
    created() {
      if (this.$route.params.id) {
        this.detailForm.customer_id = this.$route.params.id;
      }
    },
    computed: mapGetters('permission', {
      availableButton: 'availableButton',
      isAdmin: 'isAdmin',
    }),
    data() {
      return {
        detailForm: {
          customer_id: '',
          coupon_code: '',
        },
        btnLoading: false,
        couponCodeOptions: [],
        couponTypeOptions: [
          {
            label: '固定额度',
            value: '1',
          },
          {
            label: '折扣',
            value: '7',
          },
        ],
        rules: {
          coupon_code: [{ required: true, message: '请输入优惠券码', trigger: 'none' }],
        },
      };
    },
    methods: {
      async create(fromName) {
        this.btnLoading = true;
        this.$refs[fromName].validate(async (valid) => {
          if (valid) {
            couponApi
              .deliveryCoupon(this.detailForm)
              .then((res) => {
                if (res.errorCode === 0) {
                  Message.success({
                    message: '添加成功！',
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
          } else {
            this.btnLoading = false;
            return false;
          }
        });
      },
      async getSublist(type) {
        this.couponCodeOptions = [];
        this.detailForm.coupon_code = '';
        const filter = {
          coupon_type: type,
          status: 31,
        };
        const { data } = await couponApi.getCouponSublist({ filter });
        const result = data[0]['items'];
        for (const item of result) {
          let tmp = {};
          if (item.coupon_type == 1) {
            // 固定金额
            let label = `${item.coupon_name}-优惠金额 ¥${item.coupon_amount}-${item.coupon_desc}`;
            if (item.x_days > 0) {
              label += `-发放后${item.x_days}天过期`;
            } else {
              label += `-${item.to_date.split(' ')[0]}过期`;
            }
            tmp = {
              label,
              value: item.coupon_code,
            };
          } else if (item.coupon_type == 7) {
            //折扣
            let label = `${item.coupon_name}-折扣 ${(100 - item.coupon_amount) / 10}折-${
              item.coupon_desc
            }`;
            if (item.x_days > 0) {
              label += `-发放后${item.x_days}天过期`;
            } else {
              label += `-${item.to_date.split(' ')[0]}过期`;
            }
            tmp = {
              label,
              value: item.coupon_code,
            };
          }
          this.couponCodeOptions.push(tmp);
        }
      },
      back() {
        this.$router.go(-1);
      },
    },
  };
</script>

<style scoped>
  .input-style {
    width: 350px;
  }
  .select-style {
    width: 250px;
  }
</style>
