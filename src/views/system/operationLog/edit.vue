<template>
  <div>
    <el-form ref="form" :model="detailForm" label-width="120px" style="width: 800px">
      <el-form-item label="原始数据" style="width: 800px" v-show="detailForm.origin_data">
        <el-input
          type="textarea"
          :rows="15"
          :value="detailForm.origin_data"
          readonly
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="请求数据" style="width: 500px">
        <el-input
          type="textarea"
          :rows="15"
          v-model="detailForm.request"
          readonly
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="响应数据" style="width: 500px">
        <el-input
          type="textarea"
          :rows="5"
          v-model="detailForm.response"
          readonly
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item style="width: 500px">
        <div style="display: flex;">
          <!--justify-content: space-between-->
          <el-button type="primary" :loading="btnLoading" @click="back()" v-show="isNew">
            返回
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import operationLogApi from '@/api/operation';
  import { mapActions, mapGetters } from 'vuex';
  export default {
    name: 'OperationLogEdit',
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
        btnLoading: false,
        tmp_password: '',
        detailForm: {
          id: '',
          origin_data: '',
          request: '',
          response: '',
        },
        roleOptions: [],
        isNew: true, // 是否为'新建'页面
        buttonText: '取消',
      };
    },
    methods: {
      ...mapActions('loading', ['setLoading', 'setLoadingComplete']),
      async initData(id) {
        this.setLoading();
        const { data } = await operationLogApi.getOperationLogItem(id);
        // 遍历detailForm赋值
        for (let key in this.detailForm) {
          this.detailForm[key] = data[key];
        }
        this.detailForm.origin_data = this.detailForm.origin_data
          ? JSON.stringify(JSON.parse(this.detailForm.origin_data), null, 2)
          : '';
        this.detailForm.request = JSON.stringify(JSON.parse(this.detailForm.request), null, 2);
        this.detailForm.response = JSON.stringify(JSON.parse(this.detailForm.response), null, 2);
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
    width: 550px;
  }
  .select-style {
    width: 250px;
  }
</style>
