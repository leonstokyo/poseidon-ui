<template>
  <div>
    <el-form ref="form" :rules="rules" :model="detailForm" label-width="150px" style="width: 500px">
      <el-form-item label="验光单名" prop="prescription_name" style="width: 500px">
        <el-input v-model="detailForm.prescription_name" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="验光单来源" style="width: 500px">
        <el-input v-model="detailForm.source" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="验光单日期" style="width: 500px">
        <el-date-picker
          v-model="detailForm.date_of_prescription"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="瞳距类型" prop="pd_type" style="width: 500px">
        <el-select v-model="detailForm.pd_type" @change="pdTypeChange" placeholder="请选择">
          <el-option
            v-for="item in pdTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item required label="瞳距数" style="width: 500px" v-show="detailForm.pd_type == '0'">
        <el-select v-model="detailForm.pd" placeholder="请选择" clearable>
          <el-option v-for="item in pdOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        required
        label="右眼瞳距数"
        style="width: 500px"
        v-show="detailForm.pd_type == '1'"
      >
        <el-select v-model="detailForm.right_pd" placeholder="请选择" clearable>
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
        style="width: 500px"
        v-show="detailForm.pd_type == '1'"
      >
        <el-select v-model="detailForm.left_pd" placeholder="请选择" clearable>
          <el-option
            v-for="item in singlePdOptions"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="验光单类型" prop="prescription_type_id" style="width: 500px">
        <el-select
          v-model="detailForm.prescription_type_id"
          @change="prescriptionTypeChange"
          placeholder="请选择"
        >
          <el-option
            v-for="item in prescriptionTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="od_sph">
        <div style="margin-left: -88px">
          <div style="width: 500px; height: 50px">
            <span style="margin-left: 100px">球镜</span>
            <span style="margin-left: 100px">柱镜</span>
            <span style="margin-left: 100px">轴位</span>
          </div>
          <div style="width: 500px; height: 50px; display: flex; justify-content: left">
            <span style="font-size: 14px; color: #676c77; line-height: 50px">右眼 OD</span>
            <el-select
              v-model="detailForm.od_sph"
              placeholder="请选择"
              style="width: 90px; margin-left: 20px"
            >
              <el-option
                v-for="item in sphOptions"
                :key="item"
                :label="item > 0 ? `+${item}` : item"
                :value="item"
              ></el-option>
            </el-select>
            <el-select
              v-model="detailForm.od_cyl"
              placeholder="请选择"
              style="width: 90px; height: 10px; margin-left: 40px"
            >
              <el-option
                v-for="item in cylOptions"
                :key="item"
                :label="item > 0 ? `+${item}` : item"
                :value="item"
              ></el-option>
            </el-select>
            <el-select
              v-model="detailForm.od_axis"
              placeholder="请选择"
              style="width: 90px; margin-left: 40px"
            >
              <el-option
                v-for="item in axisOptions"
                :key="item"
                :label="item > 0 ? `+${item}` : item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div style="width: 500px; height: 60px; display: flex; justify-content: left">
            <span style="font-size: 14px; color: #676c77; line-height: 40px ">左眼 OS</span>
            <el-select
              v-model="detailForm.os_sph"
              placeholder="请选择"
              style="width: 90px; margin-left: 22px"
            >
              <el-option
                v-for="item in sphOptions"
                :key="item"
                :label="item > 0 ? `+${item}` : item"
                :value="item"
              ></el-option>
            </el-select>
            <el-select
              v-model="detailForm.os_cyl"
              placeholder="请选择"
              style="width: 90px; margin-left: 40px"
            >
              <el-option
                v-for="item in cylOptions"
                :key="item"
                :label="item > 0 ? `+${item}` : item"
                :value="item"
              ></el-option>
            </el-select>
            <el-select
              v-model="detailForm.os_axis"
              placeholder="请选择"
              style="width: 90px; margin-left: 40px"
            >
              <el-option
                v-for="item in axisOptions"
                :key="item"
                :label="item > 0 ? `+${item}` : item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        required
        label="下加光ADD"
        style="width: 500px"
        v-show="detailForm.prescription_type_id == 'Progressive'"
      >
        <el-select v-model="detailForm.nv_add" placeholder="请选择">
          <el-option
            v-for="item in nvaddOptions"
            :key="item"
            :label="item > 0 ? `+${item}` : item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="完整验光单" style="width: 500px">
        <el-radio v-model="detailForm.import_type" label="2">是</el-radio>
        <el-radio v-model="detailForm.import_type" label="1">否</el-radio>
      </el-form-item>
      <el-form-item style="width: 500px">
        <div style="display: flex;">
          <!--justify-content: space-between-->
          <el-button v-show="!isNew" type="primary" @click="update('form')">保存</el-button>
          <el-button v-show="isNew" type="primary" @click="create('form')">创建</el-button>
          <el-button style="margin-left:70px;" @click="back">{{ buttonText }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import customerApi from '@/api/customer';
  import field from '@/components/mixins/customer/field';
  import label from '@/components/mixins/common/label';
  import { Message } from 'element-ui';
  import { mapActions, mapGetters } from 'vuex';
  export default {
    mixins: [field, label],
    created() {
      if (this.$route.params.id) {
        this.prescription_id = this.$route.params.id;
        this.initData(this.$route.params.id);
      } else if (this.$route.params.customerId) {
        this.isNew = true;
        this.customerId = this.$route.params.customerId;
      }
    },
    computed: mapGetters('permission', {
      availableButton: 'availableButton',
      isAdmin: 'isAdmin',
    }),
    data() {
      // 自定义字段校验
      const checkPd = (rule, value, callback) => {
        if (value == '0') {
          if (this.detailForm.pd > 0) {
            callback();
          } else {
            callback(new Error('请填写瞳距！'));
          }
        } else {
          if (this.detailForm.left_pd > 0 && this.detailForm.right_pd > 0) {
            callback();
          } else {
            callback(new Error('请填写左、右眼瞳距！'));
          }
        }
      };
      const checkPrescription = (rule, value, callback) => {
        if (value != 'Progressive' && value != 'SingleVision') {
          callback(new Error('请填验光单类型！'));
        } else if (value == 'Progressive') {
          if (this.detailForm.nv_add > 0) {
            callback();
          } else {
            callback(new Error('请填写老花数！'));
          }
        }
        callback();
      };
      const checkData = (rule, value, callback) => {
        if (
          Number(this.detailForm.od_axis) == '0' &&
          Number(this.detailForm.od_cyl) == '0' &&
          Number(this.detailForm.od_sph) == '0' &&
          Number(this.detailForm.os_axis) == '0' &&
          Number(this.detailForm.os_cyl) == '0' &&
          Number(this.detailForm.os_sph) == '0'
        ) {
          callback(new Error('请填写眼镜参数'));
        } else {
          if (
            Number(this.detailForm.os_axis) * Number(this.detailForm.os_cyl) === 0 &&
            Number(this.detailForm.os_axis) + Number(this.detailForm.os_cyl) !== 0
          ) {
            callback(new Error('左眼柱镜、轴位需要同时填写！'));
          }
          if (
            Number(this.detailForm.od_axis) * Number(this.detailForm.od_cyl) === 0 &&
            Number(this.detailForm.od_axis) + Number(this.detailForm.od_cyl) !== 0
          ) {
            callback(new Error('右眼柱镜、轴位需要同时填写！'));
          }
        }
        callback();
      };

      return {
        originData: {},
        isNew: false,
        customerId: '',
        detailForm: {
          prescription_id: '',
          customer_id: '',
          source: '',
          prescription_name: '',
          date_of_prescription: '',
          pd_type: '0',
          prescription_type_id: '',
          left_pd: '30',
          right_pd: '30',
          pd: '60',
          od_sph: '0.00',
          od_cyl: '0.00',
          od_axis: '0',
          os_sph: '0.00',
          os_cyl: '0.00',
          os_axis: '0',
          nv_add: '',
          import_type: '2',
        },
        prescriptionTypeOptions: [
          {
            label: '单光',
            value: 'SingleVision',
          },
          {
            label: '渐进',
            value: 'Progressive',
          },
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
        prescription_id: '',
        buttonText: '取消',
        magentoDataOrigin: {},
        // 表单验证
        rules: {
          prescription_name: [
            { required: true, message: '请输入验光单名称', trigger: 'blur' },
            { min: 3, max: 50, message: '长度在 3 到 20 个字符', trigger: 'blur' },
          ],
          pd_type: [{ required: true, validator: checkPd, trigger: 'none' }],
          prescription_type_id: [{ required: true, validator: checkPrescription, trigger: 'none' }],
          od_sph: [{ required: true, validator: checkData, trigger: 'none' }],
        },
      };
    },
    methods: {
      ...mapActions('loading', ['setLoading', 'setLoadingComplete']),
      async initData(id) {
        this.setLoading();
        const { data } = await customerApi.getPrescriptionItem(id);
        for (let item in this.detailForm) {
          this.detailForm[item] = data[item];
        }
        this.originData = data;
        this.detailForm.od_axis = String(parseInt(this.detailForm.od_axis));
        this.detailForm.os_axis = String(parseInt(this.detailForm.os_axis));
        this.detailForm.date_of_prescription = this.detailForm.date_of_prescription.replace(
          /-/g,
          '/'
        );
        this.detailForm.nv_add === '0.00' ? (this.detailForm.nv_add = '') : this.detailForm.nv_add;
        this.setLoadingComplete();
      },
      async update(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            // 需要对提交数据的数字类型字段进行转化
            for (const item of this.prescriptionNumberFields) {
              this.detailForm[item] = this.detailForm[item];
            }
            if (this.detailForm.pd_type == '0') {
              this.detailForm.right_pd = '0';
              this.detailForm.left_pd = '0';
            } else if (this.detailForm.pd_type == '1') {
              this.detailForm.pd = '0';
            }
            if (this.detailForm.prescription_type_id === 'SingleVision') {
              delete this.detailForm.nv_add;
            }
            const res = await customerApi.updatePrescription(this.detailForm, this.originData);
            if (res.errorCode === 0) {
              Message.success({
                message: '更新成功！',
                duration: 2000,
              });
              this.back();
            } else {
              Message.error({
                message: res.message,
                duration: 2000,
              });
            }
          } else {
            Message.error({
              message: '表单验证失败！',
              duration: 2000,
            });
          }
        });
      },
      async create(fromName) {
        this.$refs[fromName].validate(async (valid) => {
          if (valid) {
            // 需要对提交数据的数字类型字段进行转化
            for (const item of this.prescriptionNumberFields) {
              this.detailForm[item] = this.detailForm[item];
            }
            if (this.detailForm.pd_type == '0') {
              this.detailForm.right_pd = '0';
              this.detailForm.left_pd = '0';
            } else if (this.detailForm.pd_type == '1') {
              this.detailForm.pd = '0';
            }
            if (this.detailForm.prescription_type_id === 'SingleVision') {
              delete this.detailForm.nv_add;
            }
            this.detailForm['customer_id'] = this.customerId;
            const res = await customerApi.createPrescription(this.detailForm);
            if (res.errorCode === 0) {
              Message.success({
                message: '创建！',
                duration: 2000,
              });
              this.back();
            } else {
              Message.error({
                message: res.message,
                duration: 2000,
              });
            }
          } else {
            Message.error({
              message: '表单验证失败！',
              duration: 2000,
            });
          }
        });
      },
      fixData() {},
      back() {
        this.$router.back();
      },
      pdTypeChange(type) {
        if (type == '0') {
          this.detailForm.left_pd = '';
          this.detailForm.right_pd = '';
        } else if (type == '1') {
          this.detailForm.pd = '';
        }
      },
      prescriptionTypeChange(type) {
        if (type === 'SingleVision') {
          this.detailForm.nv_add = '';
        }
      },
    },
  };
</script>
<style scoped>
  .input-style {
    width: 350px;
  }
</style>
