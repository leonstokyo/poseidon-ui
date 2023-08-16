<template>
  <div>
    <el-form ref="form" :model="detailForm" :rules="rules" label-width="150px" style="width: 600px">
      <el-form-item label="编号" style="width: 500px" v-show="!isNew">
        <el-input v-model="detailForm.id" class="input-style" disabled></el-input>
      </el-form-item>
      <el-form-item label="页面位置" prop="title" style="width: 500px">
        <el-select v-model="detailForm.title" placeholder="请选择" style="width: 160px" clearable>
          <el-option
            v-for="item in bannerTitleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="面包屑显示" prop="label" style="width: 500px">
        <el-input v-model="detailForm.label" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="跳转链接" style="width: 500px">
        <el-input v-model="detailForm.redirect_url" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="description" style="width: 500px">
        <el-input v-model="detailForm.description" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="所属终端" prop="endpoint" style="width: 500px">
        <el-select
          v-model="detailForm.endpoint"
          placeholder="请选择"
          style="width: 160px"
          clearable
        >
          <el-option
            v-for="item in endpointOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片" style="width: 500px">
        <upload-image
          :imageSrc="detailForm.image_url"
          @upload-success="handleSuccess"
        ></upload-image>
      </el-form-item>

      <div
        v-show="detailForm.title === 'position_eight'"
        style="margin-left: 200px; margin-bottom: 10px; width: 400px"
      >
        <span style="color: #ec0909">注意：暂不允许儿童专区配置眼镜类型、佩戴场合、风格、框形</span>
      </div>
      <el-form-item label="相关参数" tyle="width: 600px">
        <ParamsSelector
          :params="JSON.parse(JSON.stringify(detailForm.params))"
          @change-option="handleChange"
        ></ParamsSelector>
      </el-form-item>
      <el-form-item label="排序" style="width: 500px">
        <el-input v-model="detailForm.position" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="状态" style="width: 500px">
        <el-radio v-model="detailForm.status" label="1">使用中</el-radio>
        <el-radio v-model="detailForm.status" label="0">已下架</el-radio>
      </el-form-item>

      <el-form-item style="width: 500px">
        <div style="display: flex;">
          <!--justify-content: space-between-->
          <el-button type="primary" :disabled="!dataValid" @click="create('form')" v-show="isNew">
            新建
          </el-button>
          <el-button type="primary" :disabled="!dataValid" @click="update('form')" v-show="!isNew">
            保存
          </el-button>
          <el-button style="margin-left:70px;" @click="back">{{ buttonText }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import configurationApi from '@/api/V1/configuration';
  import UploadImage from '@/components/upload-image/UploadImage';
  import ParamsSelector from '@/components/config/ParamsSelector';
  import options from '@/components/mixins/configuration/options';
  import { Message } from 'element-ui';
  import { mapActions } from 'vuex';

  export default {
    name: 'BannerEdit',
    components: {
      UploadImage,
      ParamsSelector,
    },

    created() {
      if (this.$route.params.id) {
        this.isNew = false;
        this.initData(this.$route.params.id);
      }
    },
    mixins: [options],
    data() {
      return {
        dataValid: true,
        originData: {},
        detailForm: {
          id: '',
          title: '',
          label: '',
          description: '',
          page_type: '1',
          image_url: '',
          redirect_url: '',
          position: 0,
          params: [],
          status: '1',
          endpoint: '3',
        },
        rules: {
          title: [{ required: true, message: '请选择页面位置！' }],
          endpoint: [{ required: true, message: '请选择所属终端！' }],
          label: [{ required: true, message: '请填写面包屑显示文字！' }],
          description: [{ required: true, message: '请填写显示名称！' }],
        },
        endpointOptions: [
          {
            label: '多端',
            value: '1',
          },
          {
            label: 'PC',
            value: '2',
          },
          {
            label: '小程序',
            value: '3',
          },
        ],
        isNew: true, // 是否为'新建'页面
        buttonText: '取消',
      };
    },
    methods: {
      ...mapActions('loading', ['setLoading', 'setLoadingComplete']),
      async initData(id) {
        this.setLoading();
        const tmp = await configurationApi.getBannerItem(id);
        const res = tmp.data;
        this.detailForm.title = res.title;
        this.detailForm.id = res.id;
        this.detailForm.label = res.label;
        this.detailForm.description = res.description;
        this.detailForm.page_type = res.page_type;
        this.detailForm.image_url = res.image_url;
        this.detailForm.redirect_url = res.redirect_url;
        this.detailForm.position = res.position;
        this.detailForm.params = this.handleParams(res.params);
        this.detailForm.status = String(res.status);
        this.detailForm.endpoint = String(res.endpoint);
        this.originData = res;
        this.setLoadingComplete();
      },
      async create(formName) {
        this.btnLoading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 过滤
            const banner = JSON.parse(JSON.stringify(this.detailForm));
            configurationApi
              .createBanner(banner)
              .then(({ errorCode, message }) => {
                if (errorCode === 0) {
                  Message.success({
                    message: '创建成功！',
                    duration: 2000,
                  });
                  this.back();
                } else {
                  Message.error({
                    message,
                    duration: 2000,
                  });
                }
              })
              .finally(() => {
                this.btnLoading = true;
              });
          } else {
            return false;
          }
        });
      },
      async update(formName) {
        this.btnLoading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const banner = JSON.parse(JSON.stringify(this.detailForm));
            configurationApi
              .updateBanner(this.detailForm.id, banner, this.originData)
              .then(({ errorCode, message }) => {
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
              })
              .finally(() => {
                this.btnLoading = false;
              });
          } else {
            return false;
          }
        });
      },
      back() {
        this.$router.back();
      },
      handleSuccess(res) {
        const data = JSON.parse(res);
        const { url } = data;
        this.detailForm.image_url = url;
      },
      handleChange(res) {
        this.dataValid = res.valid;
        this.detailForm.params = res.data;
      },
      handleParams(params) {
        params = params ? JSON.parse(params) : [];
        if (!params) {
          return [];
        } else if (params && typeof params !== 'object') {
          return [];
        } else {
          return params;
        }
      },
    },
  };
</script>
<style scoped>
  .input-style {
    width: 350px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
