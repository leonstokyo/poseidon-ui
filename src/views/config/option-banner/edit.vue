<template>
  <div>
    <el-form ref="form" :rules="rules" :model="detailForm" label-width="150px" style="width: 500px">
      <el-form-item label="编号" style="width: 500px" v-show="!isNew">
        <el-input v-model="detailForm.mapping_id" class="input-style" disabled></el-input>
      </el-form-item>
      <el-form-item label="父ID" style="width: 500px" prop="parent_id">
        <el-input v-model="detailForm.parent_id" class="input-style" disabled></el-input>
      </el-form-item>
      <el-form-item label="层级" style="width: 500px" prop="level">
        <el-select
          v-model="detailForm.level"
          placeholder="请选择"
          style="width: 160px"
          clearable
          disabled
        >
          <el-option
            v-for="item in levelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分组" style="width: 500px" v-show="detailForm.parent_id != 0">
        <el-input v-model="detailForm.group" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="字段" style="width: 500px" v-show="detailForm.parent_id == 0">
        <el-select v-model="detailForm.field" placeholder="请选择" style="width: 160px" clearable>
          <el-option
            v-for="item in fieldOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字段名称" style="width: 500px" v-show="detailForm.parent_id == 0">
        <el-input v-model="detailForm.attribute_name" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="显示名称" style="width: 500px" v-show="detailForm.parent_id != 0">
        <el-input v-model="detailForm.option" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="筛选字段" style="width: 500px" v-show="detailForm.parent_id != 0">
        <el-input v-model="parent_field" class="input-style" disabled></el-input>
      </el-form-item>
      <el-form-item label="父级名称" style="width: 500px" v-show="detailForm.parent_id != 0">
        <el-input v-model="parent_attribute_name" class="input-style" disabled></el-input>
      </el-form-item>
      <el-form-item label="banner" style="width: 500px" v-show="detailForm.parent_id != 0">
        <upload-image
          :imageSrc="detailForm.banner"
          @upload-success="handleSuccessBanner"
        ></upload-image>
      </el-form-item>
      <el-form-item label="icon" style="width: 500px" v-show="detailForm.parent_id != 0">
        <upload-image
          :imageSrc="detailForm.icon"
          @upload-success="handleSuccessIcon"
        ></upload-image>
      </el-form-item>
      <el-form-item label="pc-banner" style="width: 500px" v-show="detailForm.parent_id != 0">
        <upload-image
          :imageSrc="detailForm.banner_pc"
          @upload-success="handleSuccessPcBanner"
        ></upload-image>
      </el-form-item>
      <el-form-item label="pc-icon" style="width: 500px" v-show="detailForm.parent_id != 0">
        <upload-image
          :imageSrc="detailForm.icon_pc"
          @upload-success="handleSuccessPcIcon"
        ></upload-image>
      </el-form-item>
      <el-form-item label="取值类型" style="width: 500px" v-show="detailForm.parent_id != 0">
        <el-select v-model="detailForm.type" placeholder="请选择" style="width: 160px" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="值"
        style="width: 500px"
        v-show="detailForm.parent_id != 0 && detailForm.type == 'term'"
      >
        <el-select v-model="detailForm.value" style="width: 200px" clearable multiple>
          <el-option
            v-for="item in getNameOptions()"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="最小值"
        style="width: 500px"
        v-show="detailForm.parent_id != 0 && detailForm.type == 'range'"
      >
        <el-input v-model="detailForm.min" class="input-style"></el-input>
      </el-form-item>
      <el-form-item
        label="最大值"
        style="width: 500px"
        v-show="detailForm.parent_id != 0 && detailForm.type == 'range'"
      >
        <el-input v-model="detailForm.max" class="input-style"></el-input>
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
          <el-button type="primary" @click="create('form')" :loading="btnLoading" v-show="isNew">
            新建
          </el-button>
          <el-button type="primary" @click="update('form')" v-show="!isNew">保存</el-button>
          <el-button style="margin-left:70px;" @click="back">{{ buttonText }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { Message } from 'element-ui';
  import configurationV1Api from '@/api/V1/configuration';
  import options from '@/components/mixins/common/options';
  import UploadImage from '@/components/upload-image/UploadImage';
  import { toHump } from '@/utils/tools';
  import { mapActions } from 'vuex';
  export default {
    name: 'OptionBannerEdit',
    mixins: [options],
    components: {
      UploadImage,
    },
    created() {
      this.getAttributesByName();
      if (this.$route.params.id) {
        this.isNew = false;
        this.initData(this.$route.params.id);
      } else if (this.$route.params.parent_id) {
        this.initAddSubitemData(this.$route.params.parent_id);
      }
    },
    data() {
      return {
        btnLoading: false,
        originData: {},
        detailForm: {
          mapping_id: '',
          parent_id: 0,
          level: '1',
          group: '',
          field: '',
          attribute_name: '',
          option: '',
          banner: '',
          banner_pc: '',
          icon: '',
          icon_pc: '',
          type: 'term',
          value: '',
          min: '',
          max: '',
          position: '',
          status: '1',
        },
        parent_field: '',
        parent_attribute_name: '',
        typeOptions: [
          {
            label: '相等',
            value: 'term',
          },
          {
            label: '范围',
            value: 'range',
          },
        ],
        levelOptions: [
          {
            label: '一级',
            value: '1',
          },
          {
            label: '二级',
            value: '2',
          },
        ],
        fieldOptions: [
          {
            value: 'occasion',
          },
          {
            value: 'frame_shape_type',
          },
          {
            value: 'material',
          },
          {
            value: 'color',
          },
          {
            value: 'price',
          },
          {
            value: 'frame_width',
          },
          {
            value: 'temple_length',
          },
          {
            value: 'lens_width',
          },
          {
            value: 'population',
          },
          {
            value: 'frame_type',
          },
          {
            value: 'feature',
          },
          {
            value: 'rim_type',
          },
        ],
        rules: {
          parent_id: [
            {
              required: true,
              message: '父级ID不可为空！',
            },
          ],
          level: [
            {
              required: true,
              message: '请选择层级！',
            },
          ],
        },
        isNew: true, // 是否为'新建'页面
        buttonText: '取消',
      };
    },
    methods: {
      ...mapActions('loading', ['setLoading', 'setLoadingComplete']),
      async initData(id) {
        this.setLoading();
        const tmp = await configurationV1Api.getOptionBannerItem(id);
        const res = tmp.data;
        this.parent_field = res['parent_field'];
        this.parent_attribute_name = res['parent_attribute_name'];
        delete res['parent_field'];
        delete res['parent_attribute_name'];
        for (const index in res) {
          this.detailForm[index] = res[index] || this.detailForm[index];
        }
        this.detailForm.status = String(this.detailForm.status);
        this.detailForm.level = String(this.detailForm.level);
        this.originData = res;
        this.setLoadingComplete();
      },
      async initAddSubitemData(parent_id) {
        const { data } = await configurationV1Api.getOptionBannerItem(parent_id);
        this.detailForm.parent_id = parent_id;
        this.detailForm.level = '2';
        this.parent_field = data.field;
        this.parent_attribute_name = data.attribute_name;
      },
      async create(formName) {
        this.btnLoading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 过滤
            delete this.detailForm.mapping_id;
            const data = this.detailForm;
            configurationV1Api
              .createOptionBanner(data)
              .then(({ errorCode, message }) => {
                if (errorCode === 0) {
                  Message.success({
                    message: '创建成功！',
                    duration: 2000,
                  });
                  this.$router.back();
                } else {
                  Message.success({
                    message,
                    duration: 2000,
                  });
                }
              })
              .finally(() => {
                this.btnLoading = false;
              });
          }
        });
      },
      async update(formName) {
        this.btnLoading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            configurationV1Api
              .updateOptionBanner(this.detailForm.mapping_id, this.detailForm, this.originData)
              .then(({ errorCode, message }) => {
                if (errorCode === 0) {
                  Message.success({
                    message: '更新成功！',
                    duration: 2000,
                  });
                  this.back();
                } else {
                  Message.success({
                    message,
                    duration: 2000,
                  });
                }
              })
              .finally(() => {
                this.btnLoading = false;
              });
          }
        });
      },
      back() {
        this.$router.back();
      },
      getNameOptions() {
        return this[`${toHump(this.parent_field)}Options`];
      },
      handleSuccessBanner(res) {
        const data = JSON.parse(res);
        const { url } = data;
        this.detailForm.banner = url;
      },
      handleSuccessIcon(res) {
        const data = JSON.parse(res);
        const { url } = data;
        this.detailForm.icon = url;
      },
      handleSuccessPcBanner(res) {
        const data = JSON.parse(res);
        const { url } = data;
        this.detailForm.banner_pc = url;
      },
      handleSuccessPcIcon(res) {
        const data = JSON.parse(res);
        const { url } = data;
        this.detailForm.icon_pc = url;
      },
    },
  };
</script>
<style scoped>
  .input-style {
    width: 350px;
  }
</style>
