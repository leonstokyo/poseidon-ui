<template>
  <div>
    <el-form ref="form" :model="detailForm" label-width="150px" style="width: 500px">
      <el-form-item label="地址备注" style="width: 500px">
        <el-input v-model="detailForm.lastname" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="收件人姓名" style="width: 500px">
        <el-input v-model="detailForm.firstname" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="手机号" style="width: 500px">
        <el-input v-model="detailForm.telephone" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="省" style="width: 500px">
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
      <el-form-item label="市" style="width: 500px">
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

      <el-form-item label="区" style="width: 500px">
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
      <el-form-item label="地址" style="width: 500px">
        <el-input v-model="detailForm.detail" class="input-style" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="默认地址" style="width: 500px">
        <el-radio v-model="detailForm.default_billing" label="1">是</el-radio>
        <el-radio v-model="detailForm.default_billing" label="0">否</el-radio>
      </el-form-item>
      <el-form-item style="width: 500px">
        <div style="display: flex">
          <!--justify-content: space-between-->
          <!--          <el-button type="primary" disabled @click="update">保存</el-button>-->
          <el-button style="margin-left:70px" @click="back">{{ buttonText }}</el-button>
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
    name: 'CustomerAddressEdit',
    created() {
      if (this.$route.params.id) {
        this.initData(this.$route.params.id);
      }
    },
    computed: mapGetters('permission', {
      availableButton: 'availableButton',
      isAdmin: 'isAdmin',
    }),
    data() {
      return {
        detailForm: {
          address_id: '',
          customer_id: '',
          firstname: '',
          lastname: '',
          telephone: '',
          grandfather_code: '',
          parent_code: '',
          area_code: '',
          detail: '',
          default_billing: false,
        },
        buttonText: '取消',
        magentoDataOrigin: {},
        provinceOptions: [],
        cityOptions: [],
        districtOptions: [],
      };
    },
    methods: {
      ...mapActions('loading', ['setLoading', 'setLoadingComplete']),
      async initData(id) {
        this.setLoading();
        // 准备回显表单
        this.provinceOptions = (await customerApi.getAddressCode('0'))['data']['items'];
        const res = await customerApi.getAddressItem(id);
        const data = res['data'][0];
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
        this.setLoadingComplete();
      },
      async update() {
        await customerApi.updateAddress(this.detailForm);
        Message.success({
          message: '更新成功！',
          duration: 2000,
        });
        this.back();
      },
      fixData() {
        // 组装数据
        const address = {
          customer_id: this.detailForm.customer_id,
          telephone: this.detailForm.telephone,
          firstname: this.detailForm.firstname,
          lastname: this.detailForm.lastname,
        };
        if (this.detailForm.default_billing == '1') {
          address.default_billing = true;
        } else {
          address.default_billing = false;
        }
        const data = {
          address,
          area_code: this.detailForm.area_code,
          detailed_address: this.detailForm.detail,
        };
        return data;
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
</style>
