<template>
  <div class="mt-20">
    <div style="font-size: 16px;font-weight:700;color: #303133;" class="mb-20">
      编辑验光单
    </div>
    <el-form
      :inline="true"
      ref="form"
      :model="formPrescription"
      label-width="150px"
      style="width: 1200px"
      v-if="formPrescription.pd_type"
      :rules="rules"
    >
      <!-- <el-form-item label="处方名" prop="prescription_name" style="width: 500px">
      <el-input v-model="formPrescription.prescription_name" class="input-style"></el-input>
    </el-form-item>
    <el-form-item label="处方来源" style="width: 500px">
      <el-input v-model="formPrescription.source" class="input-style"></el-input>
    </el-form-item>
    <el-form-item label="处方日期" style="width: 500px">
      <el-date-picker
        readonly
        v-model="formPrescription.date_of_prescription"
        type="date"
        placeholder="选择日期"
      ></el-date-picker>
    </el-form-item> -->

      <el-form-item label="处方类型" prop="prescription_type_id" style="width: 1200px">
        <el-select
          v-model="formPrescription.prescription_type_id"
          @change="prescriptionTypeChange"
          placeholder="请选择"
          class="input-style"
          disabled
          style="width: 860px"
        >
          <el-option
            v-for="item in prescriptionTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="瞳距类型" prop="pd_type" style="width: 1200px">
        <el-select
          v-model="formPrescription.pd_type"
          style="width: 860px"
          class="input-style"
          placeholder="请选择"
        >
          <el-option
            v-for="item in pdTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        required
        label="瞳距数"
        style="width: 1200px"
        v-show="formPrescription.pd_type == '0'"
      >
        <el-select
          v-model="formPrescription.pd"
          class="input-style"
          placeholder="请选择"
          style="width: 860px"
          clearable
        >
          <el-option v-for="item in pdOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        required
        label="右眼瞳距数"
        style="width: 500px"
        v-show="formPrescription.pd_type == '1'"
      >
        <el-select
          v-model="formPrescription.right_pd"
          class="input-style"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in singlePdOptions"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        required
        label="左眼瞳距数"
        class="input-style"
        style="width: 500px"
        v-show="formPrescription.pd_type == '1'"
      >
        <el-select
          v-model="formPrescription.left_pd"
          placeholder="请选择"
          style="width: 350px"
          clearable
        >
          <el-option
            v-for="item in singlePdOptions"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="od_sph" label="右眼球镜" style="width: 345px">
        <el-select
          v-model="formPrescription.od_sph"
          placeholder="请选择"
          class="input-style"
          style="width: 150px"
        >
          <el-option
            v-for="item in sphOptions"
            :key="item"
            :label="item > 0 ? `+${item}` : item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="od_sph" label="右眼柱镜" style="width: 345px">
        <el-select
          v-model="formPrescription.od_cyl"
          placeholder="请选择"
          class="input-style"
          style="width: 150px"
        >
          <el-option
            v-for="item in cylOptions"
            :key="item"
            :label="item > 0 ? `+${item}` : item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="od_sph" label="右眼轴位" style="width: 345px">
        <el-select
          v-model="formPrescription.od_axis"
          placeholder="请选择"
          class="input-style"
          style="width: 150px"
        >
          <el-option
            v-for="item in axisOptions"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="od_sph" label="左眼球镜" style="width: 345px">
        <el-select
          v-model="formPrescription.os_sph"
          placeholder="请选择"
          class="input-style"
          style="width: 150px"
        >
          <el-option
            v-for="item in sphOptions"
            :key="item"
            :label="item > 0 ? `+${item}` : item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="od_sph" label="左眼柱镜" style="width: 345px">
        <el-select
          v-model="formPrescription.os_cyl"
          placeholder="请选择"
          class="input-style"
          style="width: 150px"
        >
          <el-option
            v-for="item in cylOptions"
            :key="item"
            :label="item > 0 ? `+${item}` : item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="od_sph" label="左眼轴位" style="width: 345px">
        <el-select
          v-model="formPrescription.os_axis"
          placeholder="请选择"
          class="input-style"
          style="width: 150px"
        >
          <el-option
            v-for="item in axisOptions"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        required
        label="下加光ADD"
        style="width: 1200px"
        v-show="formPrescription.prescription_type_id == 'Progressive'"
      >
        <el-select style="width: 150px" v-model="formPrescription.nv_add" placeholder="请选择">
          <el-option
            v-for="item in nvaddOptions"
            :key="item"
            :label="item > 0 ? `+${item}` : item"
            :value="item"
            class="input-style"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- //TODO 确认完整验光单参数枚举值，现在看起来不对  -->
      <el-form-item label="完整验光单" style="width: 1000px">
        <el-radio v-model="formPrescription.import_type" label="2">
          是
        </el-radio>
        <el-radio v-model="formPrescription.import_type" label="1">
          否
        </el-radio>
      </el-form-item>
      <el-form-item
        label="验光单图片"
        style="width: 500px"
        v-show="formPrescription.customer_prescription_image"
      >
        <el-image
          :src="IMAGE_URL + formPrescription.customer_prescription_image"
          :preview-src-list="[IMAGE_URL + formPrescription.customer_prescription_image]"
          style="width: 100px"
        ></el-image>
      </el-form-item>

      <div style="margin-left: 80px; margin-bottom: 10px; display: flex; justify-content: center">
        <div style="width: 500px">
          <div style="width: 700px">
            <slot name="cancelAction">
              <el-button type="primary" @click="cancelForm">
                取消
              </el-button>
            </slot>

            <el-button type="primary" @click="update('form')">
              保存
            </el-button>
            <el-button type="primary" @click="importPrescription()">
              {{ isImport ? '取消导入' : '导入' }}
            </el-button>
            <el-select
              v-model="selectPrescriptionId"
              placeholder="请选择"
              style="margin-left: 20px"
              @change="selectPrescription"
              clearable
              v-show="isImport"
            >
              <el-option
                v-for="item in prescriptionOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import field from '@/components/mixins/customer/field';
  import label from '@/components/mixins/common/label';
  import orderApi from '@/api/order';
  import customerApi from '@/api/customer';
  import { Message } from 'element-ui';
  export default {
    mixins: [field, label],
    name: 'PrescriptionForm',
    props: {
      prescription: {
        type: Object,
        required: true,
      },
      commerceitem_id: {
        type: String,
        default: '0',
      },
      customerId: {
        type: String,
        default: '0',
      },
    },
    created() {
      this.initFormPrescription();
    },
    data() {
      const checkPd = (rule, value, callback) => {
        if (this.formPrescription.prescription_type_id === 'nonPrescription') {
          if (
            this.formPrescription.pd > 0 ||
            this.formPrescription.left_pd > 0 ||
            this.formPrescription.right_pd > 0
          ) {
            callback(new Error('无处方不可填写瞳距！'));
          } else {
            callback();
          }
        } else {
          if (value == '0') {
            if (this.formPrescription.pd > 0) {
              callback();
            } else {
              callback(new Error('请填写瞳距！'));
            }
          } else {
            if (this.formPrescription.left_pd > 0 && this.formPrescription.right_pd > 0) {
              callback();
            } else {
              callback(new Error('请填写左、右眼瞳距！'));
            }
          }
        }
      };
      const checkPrescription = (rule, value, callback) => {
        if (value !== 'Progressive' && value !== 'SingleVision' && value !== 'nonPrescription') {
          callback(new Error('请填验光单类型！'));
        } else if (value === 'Progressive') {
          if (this.formPrescription.nv_add > 0) {
            callback();
          } else {
            callback(new Error('请填写下加光ADD！'));
          }
        }
        callback();
      };
      const checkData = (rule, value, callback) => {
        if (this.formPrescription.prescription_type_id === 'nonPrescription') {
          if (
            Number(this.formPrescription.od_axis) !== 0 ||
            Number(this.formPrescription.od_cyl) !== 0 ||
            Number(this.formPrescription.od_sph) !== 0 ||
            Number(this.formPrescription.os_axis) !== 0 ||
            Number(this.formPrescription.os_cyl) !== 0 ||
            Number(this.formPrescription.os_sph) !== 0 ||
            Number(this.formPrescription.nv_add) !== 0
          ) {
            callback(new Error('无处方眼镜不可填处方相关参数！'));
          }
          callback();
        } else {
          if (
            Number(this.formPrescription.od_axis) === 0 &&
            Number(this.formPrescription.od_cyl) === 0 &&
            Number(this.formPrescription.od_sph) === 0 &&
            Number(this.formPrescription.os_axis) === 0 &&
            Number(this.formPrescription.os_cyl) === 0 &&
            Number(this.formPrescription.os_sph) === 0
          ) {
            callback(new Error('请填写眼镜参数'));
          } else {
            if (
              Number(this.formPrescription.os_axis) * Number(this.formPrescription.os_cyl) === 0 &&
              Number(this.formPrescription.os_axis) + Number(this.formPrescription.os_cyl) !== 0
            ) {
              callback(new Error('左眼柱镜、轴位需要同时填写！'));
            }
            if (
              Number(this.formPrescription.od_axis) * Number(this.formPrescription.od_cyl) === 0 &&
              Number(this.formPrescription.od_axis) + Number(this.formPrescription.od_cyl) !== 0
            ) {
              callback(new Error('右眼柱镜、轴位需要同时填写！'));
            }
          }
          callback();
        }
      };
      return {
        IMAGE_URL: process.env.VUE_APP_IMG_URL,
        formPrescription: {},
        isImport: false,
        selectPrescriptionId: '',
        prescriptionOptions: [],
        rules: {
          pd_type: [{ required: true, validator: checkPd, trigger: 'none' }],
          prescription_type_id: [{ required: true, validator: checkPrescription, trigger: 'none' }],
          od_sph: [{ required: true, validator: checkData, trigger: 'none' }],
        },
        // orderItem: {},
        prescriptionTypeOptions: [
          {
            label: '单光',
            value: 'SingleVision',
          },
          {
            label: '渐进',
            value: 'Progressive',
          },
          // {
          //   label: '平光',
          //   value: 'nonPrescription'
          // },
          // {
          //   label: '仅镜框',
          //   value: 'FrameOnly'
          // }
        ],
        pdTypeOptions: [
          {
            label: '瞳距',
            value: '0',
          },
          {
            label: '单眼瞳距',
            value: '1',
          },
        ],
      };
    },
    methods: {
      initFormPrescription() {
        let data = JSON.parse(JSON.stringify(this.prescription));
        data.import_type === '1' ? (data.import_type = '1') : (data.import_type = '2');
        this.formPrescription = JSON.parse(JSON.stringify(data));
      },
      cancelForm() {
        this.$emit('cancel');
      },
      onSave() {
        this.$emit('save-success', true);
      },
      async update(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const sendData = {
              pd_type: this.formPrescription.pd_type,
              prescription_type_id: this.formPrescription.prescription_type_id,
              pd: this.formPrescription.pd,
              od_sph: this.formPrescription.od_sph,
              os_sph: this.formPrescription.os_sph,
              od_cyl: this.formPrescription.od_cyl,
              os_cyl: this.formPrescription.os_cyl,
              od_axis: this.formPrescription.od_axis,
              os_axis: this.formPrescription.os_axis,
              import_type: this.formPrescription.import_type,
              prescription_name: this.formPrescription.prescription_name,
              source: this.formPrescription.source,
              date_of_prescription: this.formPrescription.date_of_prescription,
              left_pd: this.formPrescription.left_pd,
              right_pd: this.formPrescription.right_pd,
              nv_add: this.formPrescription.nv_add,
            };
            if (this.formPrescription.prescription_type_id === 'SingleVision') {
              delete sendData.nv_add;
            }
            let originData = JSON.parse(JSON.stringify(this.prescription));

            originData['module_name'] = 'orders_prescriptions';
            originData['object_id'] = this.prescription['prescription_id'];
            const res = await orderApi.updateCommerceitemPrescription(
              sendData,
              this.commerceitem_id,
              originData
            );
            if (res.errorCode === 0) {
              Message.success({
                message: '更新成功！',
                duration: 2000,
              });
              this.onSave();
            } else {
              Message.error({
                message: res.message,
                duration: 2000,
              });
            }
          } else {
            return false;
          }
        });
      },
      prescriptionTypeChange(type) {
        if (type === 'SingleVision') {
          this.formPrescription.nv_add = '';
        } else if (type === 'FrameOnly') {
          const empty = {
            source: '',
            prescription_name: '',
            date_of_prescription: '',
            pd_type: '',
            left_pd: '',
            right_pd: '',
            pd: '',
            od_sph: '0.00',
            od_cyl: '0.00',
            od_axis: '0',
            os_sph: '0.00',
            os_cyl: '0.00',
            os_axis: '0',
            nv_add: '',
          };
          for (let item in empty) {
            this.formPrescription[item] = empty[item];
          }
        }
      },
      importPrescription() {
        if (!this.isImport) {
          this.isImport = true;
          this.getCustomerPrescriptionList();
        } else {
          this.isImport = false;
          this.selectPrescriptionId = '';
        }
      },

      // 获取用户验光单
      async getCustomerPrescriptionList() {
        const res = await customerApi.getAllPrescriptionList({
          filter: { customer_id: this.customerId },
        });
        const result = res['data'][0]['items'];
        this.prescriptionOptions = [];
        for (const item of result) {
          if (this.formPrescription.prescription_type_id === item.prescription_type_id) {
            this.prescriptionOptions.push({
              label: item.prescription_name,
              id: item.prescription_id,
              value: JSON.stringify({
                date_of_prescription: item.date_of_prescription,
                import_type: item.import_type,
                left_pd: item.left_pd,
                nv_add: item.nv_add,
                od_axis: item.od_axis,
                od_cyl: item.od_cyl,
                od_sph: item.od_sph,
                os_axis: item.os_axis,
                os_cyl: item.os_cyl,
                os_sph: item.os_sph,
                pd: item.pd,
                pd_type: item.pd_type,
                prescription_id: item.prescription_id,
                prescription_name: item.prescription_name,
                prescription_type_id: item.prescription_type_id,
                right_pd: item.right_pd,
                source: item.source,
              }),
            });
          }
        }
      },
      selectPrescription(data) {
        const tmp = JSON.parse(data);
        for (let item in tmp) {
          this.formPrescription[item] = tmp[item];
        }
      },
    },
    computed: {},
  };
</script>

<style>
  .input-style {
    width: 350px;
  }
</style>
