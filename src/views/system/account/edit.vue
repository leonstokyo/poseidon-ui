<template>
  <div>
    <el-form ref="form" :model="detailForm" :rules="rules" label-width="120px" style="width: 500px">
      <el-form-item label="编号" v-if="!isNew">
        <el-input v-model="detailForm.id" class="input-style" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="detailForm.username" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="detailForm.email" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="detailForm.phone" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="update_new_password" v-if="!isNew">
        <el-input
          type="password"
          v-model="detailForm.update_new_password"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="update_tmp_password" v-if="!isNew">
        <el-input
          type="password"
          v-model="detailForm.update_tmp_password"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_password" v-if="isNew">
        <el-input type="password" v-model="detailForm.new_password" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="tmp_password" v-if="isNew">
        <el-input type="password" v-model="detailForm.tmp_password" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="detailForm.role_id" class="select-style" placeholder="请选择">
          <el-option
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio v-model="detailForm.status" :label="1">启用中</el-radio>
        <el-radio v-model="detailForm.status" :label="0">已禁用</el-radio>
      </el-form-item>
      <el-form-item style="width: 500px">
        <div style="display: flex">
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
  import accountApi from '@/api/V1/account';
  import permissionApi from '@/api/permission';
  import { mapActions, mapGetters } from 'vuex';
  import { validatePhone } from '@/utils/tools';
  export default {
    name: 'AccountEdit',
    created() {
      this.getRoleList();
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
      const checkPhone = (rule, value, callback) => {
        if (!validatePhone(value)) {
          return callback(new Error('请输入正确的手机号！'));
        }
        callback();
      };
      const checkRole = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请选择用户的角色！'));
        }
        callback();
      };
      const checkTmpPassword = (rule, value, callback) => {
        if (value !== this.detailForm.new_password) {
          return callback(new Error('两次密码输入不一致！'));
        }
        callback();
      };
      const checkUpdateNewPassword = (rule, value, callback) => {
        if (value) {
          if (value.length < 6 || value.length > 32) {
            return callback(new Error('长度在 6 到 32 个字符！'));
          }
          callback();
        }
        callback();
      };
      const checkUpdateTmpPassword = (rule, value, callback) => {
        if (this.detailForm.update_new_password) {
          if (value !== this.detailForm.update_new_password) {
            return callback(new Error('两次密码输入不一致！'));
          }
          callback();
        }
        callback();
      };
      return {
        originData: {},
        btnLoading: false,
        detailForm: {
          id: '',
          username: '',
          email: '',
          phone: '',
          role_id: '',
          new_password: '',
          tmp_password: '',
          update_new_password: '',
          update_tmp_password: '',
          status: 1,
        },
        rules: {
          username: [{ required: true, message: '请输入用户名！' }],
          email: [
            { required: true, message: '邮箱不能为空！', trigger: 'blur' },
            { type: 'email', message: '请填写正确的邮箱格式！', trigger: 'blur' },
          ],
          new_password: [
            { required: true, message: '请输入密码！', trigger: 'blur' },
            { min: 6, max: 32, message: '长度在 6 到 32 个字符！', trigger: 'blur' },
          ],
          tmp_password: [{ required: true, validator: checkTmpPassword, trigger: 'blur' }],
          update_new_password: [
            { required: true, validator: checkUpdateNewPassword, trigger: 'blur' },
          ],
          update_tmp_password: [
            { required: true, validator: checkUpdateTmpPassword, trigger: 'blur' },
          ],
          phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
          role_id: [{ required: true, validator: checkRole, trigger: 'blur' }],
        },
        roleOptions: [],
        isNew: true, // 是否为'新建'页面
        buttonText: '取消',
      };
    },
    methods: {
      ...mapActions('loading', ['setLoading', 'setLoadingComplete']),
      async create(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.btnLoading = true;
            const createData = {
              username: this.detailForm.username,
              email: this.detailForm.email,
              phone: this.detailForm.phone,
              role_id: this.detailForm.role_id,
              password: this.detailForm.new_password,
              status: this.detailForm.status,
            };
            await accountApi
              .create(createData)
              .then((res) => {
                if (res.errorCode === 0) {
                  Message.success({
                    message: '创建成功！',
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
            return false;
          }
        });
      },
      async update(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.btnLoading = true;
            const updateData = {
              id: this.detailForm.id,
              username: this.detailForm.username,
              email: this.detailForm.email,
              phone: this.detailForm.phone,
              role_id: this.detailForm.role_id,
              password: this.detailForm.update_new_password,
              status: this.detailForm.status,
            };
            await accountApi
              .update(this.detailForm.id, updateData)
              .then((res) => {
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
              })
              .finally(() => {
                this.btnLoading = false;
              });
          } else {
            return false;
          }
        });
      },
      async initData(id) {
        this.setLoading();
        const { data } = await accountApi.getItem(id);
        // 遍历detailForm赋值
        for (let key in this.detailForm) {
          this.detailForm[key] = data[key];
        }
        this.originData = data;
        this.setLoadingComplete();
      },
      async getRoleList() {
        const { data } = await permissionApi.getRoleSublist();
        this.roleOptions = data;
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
