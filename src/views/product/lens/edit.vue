<template>
  <div>
    <el-form ref="form" :model="detailForm" :rules="rules" label-width="120px" style="width: 500px">
      <el-form-item label="编号" style="width: 500px" v-if="!isNew">
        <el-input v-model="detailForm.id" class="input-style" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="SKU" prop="sku" style="width: 500px">
        <el-input v-model="detailForm.sku" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="产品名称" prop="name" style="width: 500px">
        <el-input v-model="detailForm.name" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="价格" style="width: 500px">
        <el-input-number
          v-model="detailForm.price"
          controls-position="right"
          :step="0.01"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="状态" style="width: 500px">
        <el-radio v-model="detailForm.status" label="1">使用中</el-radio>
        <el-radio v-model="detailForm.status" label="2">已下架</el-radio>
      </el-form-item>
      <el-form-item label="重量" style="width: 500px">
        <el-input-number
          v-model="detailForm.weight"
          controls-position="right"
          :step="1"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="处方类型" style="width: 500px" prop="prescription_type_id">
        <el-select
          v-model="detailForm.prescription_type_id"
          class="select-style"
          placeholder="请选择"
        >
          <el-option
            v-for="item in prescriptionTypeIdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="镜片类型" style="width: 500px" prop="lens_type">
        <el-select v-model="detailForm.lens_type" class="select-style" placeholder="请选择">
          <el-option
            v-for="item in lensTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="折射率" style="width: 500px" prop="lens_index">
        <el-input-number
          v-model="detailForm.lens_index"
          controls-position="right"
          :step="0.01"
          :precision="2"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="最小度数"
        style="width: 500px"
        v-show="detailForm.prescription_type_id !== 'nonPrescription'"
      >
        <el-input-number
          v-model="detailForm.min_sph"
          controls-position="right"
          :step="0.01"
          :precision="2"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="最大度数"
        style="width: 500px"
        prop="max_sph"
        v-show="detailForm.prescription_type_id !== 'nonPrescription'"
      >
        <el-input-number
          v-model="detailForm.max_sph"
          controls-position="right"
          :step="0.01"
          :precision="2"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="joint_min"
        style="width: 500px"
        v-show="detailForm.prescription_type_id !== 'nonPrescription'"
      >
        <el-input-number
          v-model="detailForm.joint_min"
          controls-position="right"
          :step="0.01"
          :precision="2"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="joint_max"
        style="width: 500px"
        prop="joint_max"
        v-show="detailForm.prescription_type_id !== 'nonPrescription'"
      >
        <el-input-number
          v-model="detailForm.joint_max"
          controls-position="right"
          :step="0.01"
          :precision="2"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="min_nvadd"
        style="width: 500px"
        v-show="
          detailForm.prescription_type_id !== 'SingleVision' &&
            detailForm.prescription_type_id !== 'nonPrescription'
        "
      >
        <el-input-number
          v-model="detailForm.min_nvadd"
          controls-position="right"
          :step="0.01"
          :precision="2"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="max_nvadd"
        style="width: 500px"
        prop="max_nvadd"
        v-show="
          detailForm.prescription_type_id !== 'SingleVision' &&
            detailForm.prescription_type_id !== 'nonPrescription'
        "
      >
        <el-input-number
          v-model="detailForm.max_nvadd"
          controls-position="right"
          :step="0.01"
          :precision="2"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="最小散光"
        style="width: 500px"
        v-show="detailForm.prescription_type_id !== 'nonPrescription'"
      >
        <el-input-number
          v-model="detailForm.min_cyl"
          controls-position="right"
          :step="0.01"
          :precision="2"
          :max="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="最大散光"
        style="width: 500px"
        prop="max_cyl"
        v-show="detailForm.prescription_type_id !== 'nonPrescription'"
      >
        <el-input-number
          v-model="detailForm.max_cyl"
          controls-position="right"
          :step="0.01"
          :precision="2"
          :min="0"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="引用编号" style="width: 500px">
        <el-input v-model="detailForm.external_reference_id" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="染色编号" style="width: 500px">
        <el-input v-model="detailForm.tint_ext_id" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="涂层编号" style="width: 500px">
        <el-input v-model="detailForm.coating_ext_id" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="镜片用途" style="width: 500px">
        <el-select
          v-model="detailForm.lens_usage"
          multiple
          class="select-style"
          placeholder="请选择"
        >
          <el-option
            v-for="item in lensUsageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="镜片颜色" style="width: 500px">
        <el-input v-model="detailForm.lens_color" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="套餐类型" style="width: 500px">
        <el-select
          v-model="detailForm.package_type"
          class="select-style"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in packageTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item style="width: 500px">
        <div style="display: flex;">
          <!--justify-content: space-between-->
          <el-button type="primary" :loading="btnLoading" @click="create('form')" v-show="isNew">
            新建
          </el-button>
          <el-button type="primary" :loading="btnLoading" @click="update('form')" v-show="!isNew">
            保存
          </el-button>
          <el-button style="margin-left:70px;" @click="back">{{ buttonText }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { Message } from 'element-ui';
  import productApi from '@/api/product';
  import options from '@/components/mixins/common/options';
  import label from '@/components/mixins/common/label';
  import { PrescriptionTypeIdOptions, LensTypeOptions } from '@/constant/options';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'LensEdit',
    mixins: [options, label],
    created() {
      if (this.$route.params.sku) {
        this.isNew = false;
        this.initData(this.$route.params.sku);
      }
      this.prescriptionTypeIdOptions = PrescriptionTypeIdOptions;
      this.lensTypeOptions = LensTypeOptions;
      this.getAttributesByName();
    },
    computed: mapGetters('permission', {
      availableButton: 'availableButton',
      isAdmin: 'isAdmin',
    }),
    data() {
      // 自定义字段校验
      const checkPrice = (rule, value, callback) => {
        if (value === 0) {
          callback();
        } else {
          if (/^\d+(\.\d{2})?$/.test(value)) {
            callback();
          } else {
            callback(new Error('金额请保留两位小数'));
          }
        }
      };
      const checkMaxSph = (rule, value, callback) => {
        if (this.detailForm.min_sph > this.detailForm.max_sph) {
          callback(new Error('最小度数不能大于最大度数！'));
        }
        callback();
      };
      const checkMaxCyl = (rule, value, callback) => {
        if (this.detailForm.min_cyl > this.detailForm.max_cyl) {
          callback(new Error('最小散光不能大于最大散光！'));
        }
        callback();
      };
      const checkMaxJoint = (rule, value, callback) => {
        if (this.detailForm.joint_min > this.detailForm.joint_max) {
          callback(new Error('joint_min不能大于joint_max！'));
        }
        callback();
      };
      const checkMaxNvadd = (rule, value, callback) => {
        if (this.detailForm.min_nvadd > this.detailForm.max_nvadd) {
          callback(new Error('min_nvadd不能大于max_nvadd！'));
        }
        callback();
      };
      return {
        originData: {},
        btnLoading: false,
        prescriptionTypeIdOptions: [],
        lensTypeOptions: [],
        detailForm: {
          id: 0,
          sku: '',
          name: '', // 产品名称
          price: 0,
          status: '2',
          weight: 0,
          category_ids: [],
          attribute_set_id: 11,
          prescription_type_id: '',
          lens_type: '',
          visibility: 4,
          type_id: 'simple',
          lens_index: '',
          min_sph: '',
          max_sph: '',
          joint_min: '',
          joint_max: '',
          min_cyl: '',
          max_cyl: '',
          min_nvadd: '',
          max_nvadd: '',
          external_reference_id: '',
          tint_ext_id: '',
          coating_ext_id: '',
          lens_usage: [],
          lens_color: '',
          package_type: [],
          url_key: '',
        },
        isNew: true, // 是否为'新建'页面
        buttonText: '取消',
        // 表单验证
        rules: {
          sku: [
            { required: true, message: '请输入SKU', trigger: 'blur' },
            { min: 3, max: 50, message: '长度在 3 到 20 个字符', trigger: 'blur' },
          ],
          name: [
            { required: true, message: '请输入产品名称', trigger: 'blur' },
            { min: 3, max: 50, message: '长度在 3 到 20 个字符', trigger: 'blur' },
          ],
          price: [{ required: true, validator: checkPrice, trigger: 'blur' }],
          prescription_type_id: [{ required: true, message: '请输入处方类型', trigger: 'blur' }],
          lens_type: [{ required: true, message: '请输入镜片类型', trigger: 'blur' }],
          lens_index: [{ required: true, message: '请输入镜片折射率', trigger: 'blur' }],
          max_sph: [{ validator: checkMaxSph, trigger: 'blur' }],
          max_cyl: [{ validator: checkMaxCyl, trigger: 'blur' }],
          max_nvadd: [{ validator: checkMaxNvadd, trigger: 'blur' }],
          joint_max: [{ validator: checkMaxJoint, trigger: 'blur' }],
        },
      };
    },
    methods: {
      ...mapActions('loading', ['setLoading', 'setLoadingComplete']),
      async create(formName) {
        this.btnLoading = true;
        let valid = true;
        await this.$refs[formName].validate().catch((e) => {
          valid = false;
        });
        if (valid) {
          this.detailForm.url_key = this.detailForm.sku; // 指定url_key
          await productApi.createLens(this.detailForm);
          Message.success({
            message: '创建成功！',
            duration: 2000,
          });
          this.btnLoading = false;
          this.back();
        }
      },
      async update(formName) {
        let valid = true;
        await this.$refs[formName].validate().catch((e) => {
          valid = false;
        });
        if (valid) {
          await productApi.updateLens(this.detailForm, this.originData);
          Message.success({
            message: '更新成功！',
            duration: 2000,
          });
          this.back();
        }
      },
      async initData(sku) {
        this.setLoading();
        // 获取magento
        const { data } = await productApi.getLensItem(sku);
        this.originData = data;
        // 遍历detailForm赋值
        for (let key in this.detailForm) {
          this.detailForm[key] = data[key] || data.attributes[key];
        }
        this.setLoadingComplete();
      },
      back() {
        this.$router.back();
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
