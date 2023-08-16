<template>
  <div class="login-background">
    <div class="login-wrapper">
      <h1 style="text-align:center;margin:10px 0">Selene Admin</h1>
      <!-- 用户名登录 -->
      <el-form ref="userData" :model="userData" :rules="ruleValidate">
        <el-form-item prop="mail">
          <el-input size="large" v-model="userData.username" placeholder="用户名" clearable>
            <template slot="prepend"><i class="el-icon-user"></i></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            size="large"
            v-model="userData.password"
            placeholder="密码"
            clearable
          >
            <template slot="prepend"><i class="el-icon-lock"></i></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 280px"
            v-loading="btnLoading"
            @keyup.enter.native="handleSubmit('userData')"
            @click="handleSubmit('userData')"
          >
            登录
          </el-button>
          <div class="footer" style="display: flex;justify-content: space-between">
            <span>注册/忘记密码,请联系管理员</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style scoped>
  .login-wrapper {
    position: relative;
    float: left;
    width: 280px;
    left: 40%;
    margin: 170px auto;
  }
  .login-background {
    background-color: #fffffb;
    height: 100%;
    width: 100%;
    position: absolute;
  }
  .footer {
    font-size: 13px;
    margin-top: 5px;
  }
  .footer span {
    color: #676c77;
  }
</style>
<script>
  import accountApi from '@/api/V1/account';
  import { Message } from 'element-ui';
  import { ApiSuccessCode } from '@/constant/apiCode';

  export default {
    // 进入页面前先清除一下sessionStorage
    beforeCreate() {
      this.$session.clear();
    },
    data() {
      return {
        btnLoading: false,
        userData: {
          username: '',
          password: '',
        },
        ruleValidate: {
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'blur' },
            {
              type: 'string',
              min: 6,
              message: '密码长度不能小于6位',
              trigger: 'blur',
            },
          ],
        },
      };
    },
    methods: {
      handleSubmit(name) {
        const self = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            self.btnLoading = true;
            accountApi
              .login(this.userData.username, this.userData.password)
              .then(({ code, msg }) => {
                console.log(code, msg)
                if (code === ApiSuccessCode) {
                  const millisecond = new Date().getTime();
                  const expiresTime = new Date(millisecond + 8 * 60 * 60 * 1000);
                  self.$cookie.set('is_login', 1, { expires: expiresTime }); // 设置过期时间 8h
                  let path = '/';
                  if (self.$cookie.get('path')) {
                    path = self.$cookie.get('path');
                    let cval = null;
                    const reg = new RegExp('(^| )' + 'path' + '=([^;]*)(;|$)');
                    if (document.cookie.match(reg)) {
                      const arr = document.cookie.match(reg);
                      cval = unescape(arr[2]);
                    }
                    let exp = new Date();
                    exp.setTime(exp.getTime() - 1);
                    if (cval != null) {
                      document.cookie = 'path' + '=' + cval + '; expires=' + exp.toGMTString();
                    }
                  }
                  self.$router.replace(path);
                  Message.success({
                    message: msg,
                    duration: 2000,
                  });
                  self.btnLoading = false;
                } else {
                  Message.error({
                    message: msg,
                    duration: 2000,
                  });
                  self.btnLoading = true;
                }
              })
              .finally(() => {
                self.btnLoading = false;
              });
          } else {
            return false;
          }
        });
      },
    },
  };
</script>
