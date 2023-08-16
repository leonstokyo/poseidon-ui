<template>
  <div v-loading="tableLoading" element-loading-text="加载中...">
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="用户名">
          <el-input v-model="filter.firstname"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="filter.telephone"></el-input>
        </el-form-item>
        <el-form-item label="openid">
          <el-input v-model="filter.wechat_mini_openid"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" minWidth="100"></el-table-column>
      <el-table-column prop="firstname" label="用户姓名" minWidth="100"></el-table-column>
      <el-table-column prop="wechat_mini_openid" label="openid" minWidth="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" minWidth="180"></el-table-column>
      <el-table-column prop="phone" label="电话" minWidth="160"></el-table-column>
      <el-table-column prop="created_at" label="创建时间" minWidth="160"></el-table-column>
      <el-table-column label="操作" fixed="right" minWidth="300">
        <div slot-scope="operations" style="flex-direction: column">
          <div style="justify-content: space-between">
            <el-button
              style="margin-top: 5px"
              :disabled="!canDo('addresses-index')"
              size="mini"
              type="primary"
              @click="viewAddress(operations.row.id)"
            >
              地址列表
            </el-button>

            <el-button
              style="margin-top: 5px"
              :disabled="!canDo('prescriptions-index')"
              size="mini"
              type="primary"
              @click="viewPrescription(operations.row.id)"
            >
              处方列表
            </el-button>

            <el-button
              style="margin-top: 5px"
              :disabled="!canDo('wishlists-index')"
              size="mini"
              type="primary"
              @click="viewWishList(operations.row.id)"
            >
              收藏夹
            </el-button>

            <el-button
              style="margin-top: 5px"
              :disabled="!canDo('customers_coupons-index')"
              size="mini"
              type="primary"
              @click="viewCoupon(operations.row.id)"
            >
              优惠券
            </el-button>

            <el-button
              style="margin-top: 5px"
              :disabled="!canDo('customers-show')"
              size="mini"
              type="primary"
              @click="edit(operations.row.id)"
            >
              基本信息
            </el-button>

            <el-button
              style="margin-top: 5px"
              :disabled="!canDo('invoice_titles-index')"
              size="mini"
              type="primary"
              @click="viewTitle(operations.row.id)"
            >
              抬头列表
            </el-button>

            <el-button
              style="margin-top: 5px"
              :disabled="!canDo('customers_coupons-create')"
              size="mini"
              type="primary"
              @click="deliveryCoupon(operations.row.id)"
            >
              发优惠券
            </el-button>

            <el-button
              style="margin-top: 5px"
              :disabled="!canDo('prescriptions-create')"
              size="mini"
              type="primary"
              @click="createPrescription(operations.row.id)"
            >
              创建验光单
            </el-button>
          </div>
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
    <el-dialog title="编辑信息" :visible.sync="editDialogVisible" width="630px">
      <span slot="footer" class="dialog-footer">
        <el-form
          ref="editForm"
          :rules="editRules"
          :model="editDetailForm"
          label-width="150px"
          style="width: 500px"
        >
          <el-form-item label="编号" style="width: 500px">
            <el-input v-model="editDetailForm.id" class="input-style" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" style="width: 500px">
            <el-input v-model="editDetailForm.zenni_email" class="input-style"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="firstname" style="width: 500px">
            <el-input v-model="editDetailForm.firstname" class="input-style"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="telephone" style="width: 500px">
            <el-input v-model="editDetailForm.telephone" class="input-style"></el-input>
          </el-form-item>
          <el-form-item style="width: 500px">
            <div style="display: flex; justify-content: space-between">
              <el-button type="primary" @click="update('editForm')">保存</el-button>
              <el-button @click="editDialogVisible = false">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </span>
    </el-dialog>

    <el-dialog
      title="发优惠券"
      v-if="couponDialogVisible"
      :visible.sync="couponDialogVisible"
      width="830px"
      :destroy-on-close="true"
    >
      <span slot="footer" class="dialog-footer">
        <el-form
          ref="couponForm"
          :model="couponDetailForm"
          :rules="couponRules"
          label-width="120px"
        >
          <el-form-item label="用户ID" prop="customer_id" style="width: 350px">
            <el-input
              v-model="couponDetailForm.customer_id"
              style="width: 200px"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item required label="优惠券类型" style="width: 350px">
            <el-select
              v-model="couponDetailForm.coupon_type"
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
          <el-form-item required label="优惠券码" style="width: 350px" prop="coupon_code">
            <el-select
              v-model="couponDetailForm.coupon_code"
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
              <el-button type="primary" :loading="couponBtnLoading" @click="deliver('couponForm')">
                确认发放
              </el-button>
              <el-button @click="couponDialogVisible = false">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import customerApi from '@/api/customer';
  import HandleIndexSession from '@/utils/HandleIndexSession';
  import { mapGetters } from 'vuex';
  import { Message } from 'element-ui';
  import couponApi from '@/api/coupon';
  export default {
    name: 'CustomerIndex',
    created() {
      this.initList();
    },
    computed: mapGetters('permission', {
      availableButton: 'availableButton',
      isAdmin: 'isAdmin',
      canDo: 'canDo',
    }),
    data() {
      return {
        editDialogVisible: false,
        couponDialogVisible: false,
        couponBtnLoading: false,

        tableLoading: false, // 表格loading
        filter: {
          firstname: '',
          telephone: '',
          wechat_mini_openid: '',
        },
        pagination: {
          pageSize: 10,
          currentPage: 1,
          total: 100,
        },
        tableData: [],
        editDetailForm: {
          id: '',
          email: '',
          zenni_email: '',
          telephone: '',
          firstname: '',
          lastname: '',
          website_id: '',
        },
        editRules: {
          firstname: [
            {
              required: true,
              message: '请输入昵称',
              trigger: 'none',
            },
          ],
          telephone: [
            {
              required: true,
              message: '请输入手机号',
              trigger: 'none',
            },
          ],
        },
        couponRules: {
          coupon_code: [{ required: true, message: '请输入优惠券码', trigger: 'blur' }],
        },
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
        couponDetailForm: {
          customer_id: '',
          coupon_code: '',
        },
        couponCodeOptions: [],
      };
    },
    methods: {
      async edit(id) {
        this.editDialogVisible = true;
        await this.initData(id);
      },
      async initData(id) {
        const { data } = await customerApi.getCustomerItem(id);
        // 遍历detailForm赋值
        for (let key in this.editDetailForm) {
          this.editDetailForm[key] = data['item'][key] || data['item']['attributes'][key];
        }
      },
      async update(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            customerApi.updateCustomer(this.editDetailForm).then(({ errorCode, message }) => {
              if (errorCode === 0) {
                Message.success({
                  message: '更新成功！',
                  duration: 2000,
                });
                this.editDialogVisible = false;
                this.getCustomerListWithPage();
              } else {
                Message.error({
                  message,
                  duration: 2000,
                });
              }
            });
          } else {
            return false;
          }
        });
      },
      async deliver(fromName) {
        this.couponDialogVisible = true;
        this.couponBtnLoading = true;
        this.$refs[fromName].validate(async (valid) => {
          if (valid) {
            couponApi
              .deliveryCoupon(this.couponDetailForm)
              .then((res) => {
                if (res.errorCode === 0) {
                  Message.success({
                    message: '添加成功！',
                    duration: 2000,
                  });
                  this.couponDialogVisible = false;
                } else {
                  Message.error({
                    message: res.message,
                    duration: 2000,
                  });
                }
              })
              .finally(() => {
                this.couponBtnLoading = false;
              });
          } else {
            this.couponBtnLoading = false;
            return false;
          }
        });
      },
      viewPrescription(id) {
        this.$router.push({ name: 'CustomerAllPrescriptionIndex', params: { id } });
      },
      viewAddress(id) {
        this.$router.push({ name: 'CustomerAllAddressIndex', params: { id } });
      },
      viewWishList(id) {
        this.$router.push({ name: 'CustomerAllWishlistIndex', params: { id } });
      },
      viewTitle(id) {
        this.$router.push({ name: 'CustomerAllTitleIndex', params: { id } });
      },
      viewCoupon(id) {
        this.$router.push({ name: 'CustomerAllCouponIndex', params: { id } });
      },
      createPrescription(id) {
        this.$router.push({ path: `/customer/prescription/add/${id}` });
      },
      deliveryCoupon(id) {
        this.couponDialogVisible = true;
        this.couponCodeOptions = [];
        this.couponDetailForm.coupon_type = '';
        this.couponDetailForm.coupon_code = '';
        this.couponDetailForm.customer_id = id;
      },
      search() {
        this.pagination.currentPage = 1;
        this.getCustomerListWithPage();
      },
      async change(current) {
        this.pagination.currentPage = current;
        await this.getCustomerListWithPage(current);
      },
      async initList() {
        // 进入列表前先检测之前的页面信息
        if (HandleIndexSession.exitSession(this, 'user') && this.$cookie.get('is_edit_back') == 1) {
          HandleIndexSession.getSession(this, 'user');
        }
        await this.getCustomerListWithPage();
      },
      async getCustomerListWithPage(current) {
        this.tableLoading = true;
        const currentPage = current ? current : this.pagination.currentPage;
        const { data } = await customerApi.getCustomerList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter: this.filter,
        });
        this.pagination.pageSize = data.pageSize;
        this.pagination.total = data.total;
        HandleIndexSession.setSession(this, 'user');

        this.tableData = [];
        data.items.forEach((e) => {
          this.tableData.push({
            id: e.id,
            email: e.attributes.zenni_email || '未设置',
            firstname: e.firstname,
            phone: e.attributes.telephone || '未设置',
            wechat_mini_openid: e.attributes.wechat_mini_openid || '未设置',
            created_at: e.created_at,
          });
        });
        this.tableLoading = false;
      },
      async getSublist(type) {
        this.couponCodeOptions = [];
        this.couponDetailForm.coupon_code = '';
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
