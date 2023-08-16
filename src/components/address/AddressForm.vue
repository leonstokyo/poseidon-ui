<template>
  <div>
    <el-form ref="form" :model="detailForm" class="zenni-form" label-width="100px">
      <el-row type="flex">
        <el-col :span="12">
          <el-form-item label="收件人姓名">
            <el-input v-model="detailForm.firstname" class=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号">
            <el-input v-model="detailForm.telephone" class=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :xl="4">
          <el-form-item label="省">
            <el-select
              v-model="detailForm.grandfather_code"
              placeholder="请选择"
              @change="provinceChange"
              clearable
            >
              <el-option
                v-for="item in provinceOptions"
                :key="item.area_code"
                :label="item.name"
                :value="item.area_code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :xl="4">
          <el-form-item label="市">
            <el-select
              v-model="detailForm.parent_code"
              placeholder="请选择"
              @change="cityChange"
              clearable
            >
              <el-option
                v-for="item in cityOptions"
                :key="item.area_code"
                :label="item.name"
                :value="item.area_code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :xl="4">
          <el-form-item label="区">
            <el-select
              v-model="detailForm.area_code"
              placeholder="请选择"
              @change="areaChange"
              clearable
            >
              <el-option
                v-for="item in districtOptions"
                :key="item.area_code"
                :label="item.name"
                :value="item.area_code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="地址">
        <el-input v-model="detailForm.detail" class="" type="textarea"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import customerApi from '@/api/customer';
  import field from '@/components/mixins/customer/field';
  import label from '@/components/mixins/common/label';
  import { Message } from 'element-ui';
  export default {
    mixins: [field, label],
    name: 'AddressForm',
    props: {
      addressInfo: {
        type: Object,
        required: true,
      },
    },
    created() {
      this.initData();
    },
    data() {
      return {
        detailForm: {
          address_id: '',
          firstname: '',
          lastname: '',
          telephone: '',
          grandfather_code: '',
          parent_code: '',
          area_code: '',
          detail: '',
        },
        buttonText: '取消',
        magentoDataOrigin: {},
        provinceOptions: [],
        cityOptions: [],
        districtOptions: [],
      };
    },
    methods: {
      async initData() {
        // 准备回显表单
        this.provinceOptions = (await customerApi.getAddressCode('0'))['data']['items'];
        const data = this.addressInfo;
        for (const e in this.detailForm) {
          this.detailForm[e] = data[e];
        }
        this.cityOptions = (await customerApi.getAddressCode(this.detailForm.grandfather_code))[
          'data'
        ]['items'];
        this.districtOptions = (await customerApi.getAddressCode(this.detailForm.parent_code))[
          'data'
        ]['items'];
        this.detailForm.detail = `${data['street']}`;
        this.detailForm.default_billing = data.default_billing == '1' ? '1' : '0';
      },
      async update() {
        await customerApi.updateAddress(this.detailForm);
        Message.success({
          message: '更新成功！',
          duration: 2000,
        });
        this.back();
      },
      async provinceChange(value) {
        this.cityOptions = (await customerApi.getAddressCode(value))['data']['items'];
        this.detailForm.parent_code = '';
        this.detailForm.area_code = '';
        this.detailForm.detail = '';
      },
      async cityChange(value) {
        this.districtOptions = (await customerApi.getAddressCode(value))['data']['items'];
        this.detailForm.area_code = '';
        this.detailForm.detail = '';
      },
      async areaChange() {
        this.detailForm.detail = '';
      },
      sendData() {
        return this.detailForm;
      },
    },
  };
</script>
<style scoped></style>
