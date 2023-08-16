<template>
  <div>
    <el-form ref="form" :model="detailForm" label-width="150px" style="width: 500px">
      <el-form-item label="编号" style="width: 500px">
        <el-input v-model="detailForm.id" class="input-style" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" style="width: 500px">
        <el-input v-model="detailForm.zenni_email" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="昵称" style="width: 500px">
        <el-input v-model="detailForm.firstname" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="电话" style="width: 500px">
        <el-input v-model="detailForm.telephone" class="input-style"></el-input>
      </el-form-item>
      <el-form-item style="width: 500px">
        <div style="display: flex;">
          <!--justify-content: space-between-->
          <el-button type="primary" @click="update">保存</el-button>
          <el-button style="margin-left:70px;" @click="back">{{ buttonText }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import customerApi from '@/api/customer';
  import field from '@/components/mixins/customer/field';
  import { Message } from 'element-ui';
  import { mapActions, mapGetters } from 'vuex';
  export default {
    name: 'CustomerEdit',
    mixins: [field],
    created() {
      if (this.$route.params.id) {
        this.initData(this.$route.params.id);
      }
    },
    computed: mapGetters('permission', {
      isAdmin: 'isAdmin',
    }),
    data() {
      return {
        detailForm: {
          id: '',
          email: '',
          zenni_email: '',
          telephone: '',
          firstname: '',
          lastname: '',
          website_id: '',
        },
        buttonText: '取消',
      };
    },
    methods: {
      ...mapActions('loading', ['setLoading', 'setLoadingComplete']),
      async initData(id) {
        this.setLoading();
        const { data } = await customerApi.getCustomerItem(id);
        // 遍历detailForm赋值
        for (let key in this.detailForm) {
          this.detailForm[key] = data['item'][key] || data['item']['attributes'][key];
        }
        this.setLoadingComplete();
      },
      async update() {
        const { errorCode, message } = await customerApi.updateCustomer(this.detailForm);
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
