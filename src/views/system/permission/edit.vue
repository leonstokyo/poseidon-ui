<template>
  <div>
    <el-form ref="form" :model="detailForm" label-width="120px" style="width: 500px">
      <el-form-item label="编号" style="width: 500px" v-if="!isNew">
        <el-input v-model="detailForm.id" class="input-style" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="名称" style="width: 500px">
        <el-input v-model="detailForm.name" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="类型" style="width: 500px">
        <el-select
          v-model="detailForm.type"
          class="select-style"
          @change="changeTypeOption"
          placeholder="请选择"
        >
          <el-option
            v-for="item in permissionTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="父级元素"
        style="width: 500px"
        v-show="detailForm.type == 2 || detailForm.type == 3"
      >
        <el-select
          v-model="detailForm.parent_id"
          class="select-style"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in parentOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="别名" style="width: 500px">
        <el-input v-model="detailForm.alias" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="跳转别名" style="width: 500px">
        <el-input v-model="detailForm.redirect_alias" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="调用接口" style="width: 500px">
        <el-input
          type="textarea"
          :rows="5"
          v-model="detailForm.api_list"
          placeholder="多个使用逗号隔开"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序" style="width: 500px">
        <el-input v-model="detailForm.position" class="input-style"></el-input>
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
  import permissionApi from '@/api/permission';
  import { mapActions, mapGetters } from 'vuex';
  export default {
    name: 'PermissionEdit',
    created() {
      if (this.$route.params.id) {
        this.isNew = false;
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
        detailForm: {
          id: '',
          name: '',
          parent_id: 0,
          alias: '',
          type: '',
          api_list: '',
          redirect_alias: '',
          position: 0,
        },
        isNew: true, // 是否为'新建'页面
        buttonText: '取消',
        parentOptions: [],
        permissionTypeOptions: [
          {
            label: '导航',
            value: 1,
          },
          {
            label: '页面',
            value: 2,
          },
          {
            label: '按钮',
            value: 3,
          },
        ],
      };
    },
    methods: {
      ...mapActions('loading', ['setLoading', 'setLoadingComplete']),
      async create(formName) {
        this.btnLoading = true;
        if (this.detailForm.api_list) {
          this.detailForm.api_list = this.detailForm.api_list.split(',');
          this.detailForm.api_list = JSON.stringify(this.detailForm.api_list);
        }
        await permissionApi.createPermission(this.detailForm);
        Message.success({
          message: '创建成功！',
          duration: 2000,
        });
        this.btnLoading = false;
        this.back();
      },
      async update(formName) {
        if (this.detailForm.api_list) {
          this.detailForm.api_list = this.detailForm.api_list.split(',');
          this.detailForm.api_list = JSON.stringify(this.detailForm.api_list);
        }
        await permissionApi.upsertPermission(this.detailForm);
        Message.success({
          message: '更新成功！',
          duration: 2000,
        });
        this.back();
      },
      async initData(id) {
        this.setLoading();
        // 获取magento
        const { data } = await permissionApi.getPermissionItem(id);
        // 遍历detailForm赋值
        for (let key in this.detailForm) {
          this.detailForm[key] = data[key];
        }
        // 处理api_list
        if (this.detailForm.api_list) {
          this.detailForm.api_list = JSON.parse(this.detailForm.api_list);
          this.detailForm.api_list = this.detailForm.api_list.join(',');
        }
        await this.getSublist();
        this.setLoadingComplete();
      },
      async getSublist() {
        if (this.detailForm.type == 2 || this.detailForm.type == 3) {
          const res = await permissionApi.getPermissionSublist(this.detailForm.type - 1);
          this.parentOptions = res.data;
        } else {
          this.parentOptions = [];
        }
      },
      async changeTypeOption() {
        await this.getSublist();
        this.detailForm.parent_id = 0;
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
