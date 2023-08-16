<template>
  <div>
    <el-form ref="form" :model="detailForm" label-width="150px" style="width: 500px">
      <el-form-item label="产品类型" style="width: 500px">
        <el-select v-model="detailForm.type_id" placeholder="请选择" :disabled="!isNew">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编号" style="width: 500px">
        <el-input v-model="detailForm.id" class="input-style" disabled></el-input>
      </el-form-item>
      <el-form-item label="SKU" style="width: 500px">
        <el-input v-model="detailForm.sku" class="input-style" disabled></el-input>
      </el-form-item>
      <el-form-item label="产品名称" style="width: 500px">
        <el-input v-model="detailForm.name" class="input-style"></el-input>
      </el-form-item>
      <el-form-item
        label="图片"
        style="width: 500px"
        v-if="image_src"
        v-show="detailForm.type_id == 'simple'"
      >
        <el-image :src="image_src" style="width: 250px"></el-image>
      </el-form-item>
      <el-form-item label="状态" style="width: 500px">
        <el-radio v-model="detailForm.status" label="1">使用中</el-radio>
        <el-radio v-model="detailForm.status" label="2">已下架</el-radio>
      </el-form-item>
      <el-form-item label="可见性" style="width: 500px">
        <el-select v-model="detailForm.visibility" placeholder="请选择">
          <el-option
            v-for="item in visibilityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="价格" style="width: 500px" v-show="detailForm.type_id == 'simple'">
        <el-input-number
          v-model="detailForm.price"
          controls-position="right"
          :step="0.01"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="材质" style="width: 500px" v-show="detailForm.type_id == 'configurable'">
        <el-select v-model="detailForm.material" placeholder="请选择">
          <el-option
            v-for="item in materialOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="保养说明"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-input
          type="textarea"
          :rows="7"
          v-model="detailForm.care_instructions"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="框类型"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-input v-model="detailForm.acc_frame_type_code" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="高度" style="width: 500px" v-show="detailForm.type_id == 'configurable'">
        <el-input-number
          v-model="detailForm.acc_height"
          controls-position="right"
          :step="0.01"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="宽度" style="width: 500px" v-show="detailForm.type_id == 'configurable'">
        <el-input-number
          v-model="detailForm.acc_width"
          controls-position="right"
          :step="0.01"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="长度" style="width: 500px" v-show="detailForm.type_id == 'configurable'">
        <el-input-number
          v-model="detailForm.acc_length"
          controls-position="right"
          :step="0.01"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="说明" style="width: 500px" v-show="detailForm.type_id == 'configurable'">
        <el-input
          type="textarea"
          rows="3"
          v-model="detailForm.specification"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="颜色" style="width: 500px" v-show="detailForm.type_id == 'simple'">
        <el-select v-model="detailForm.color" placeholder="请选择">
          <el-option
            v-for="item in colorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="引用ID" style="width: 500px" v-show="detailForm.type_id == 'simple'">
        <el-input v-model="detailForm.external_reference_id" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="展示颜色" style="width: 500px" v-show="detailForm.type_id == 'simple'">
        <el-input v-model="detailForm.display_color" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="详细描述" style="width: 500px" v-show="detailForm.type_id == 'simple'">
        <el-input v-model="detailForm.long_description" class="input-style"></el-input>
      </el-form-item>
      <el-form-item style="width: 500px">
        <div style="display: flex;">
          <!--justify-content: space-between-->
          <el-button type="primary" @click="create" v-show="isNew">新建</el-button>
          <el-button type="primary" @click="update" v-show="!isNew">保存</el-button>
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
  import field from '@/components/mixins/product/accessory/field';
  import { mapActions, mapGetters } from 'vuex';
  export default {
    name: 'AccessoryEdit',
    mixins: [options, label, field],
    created() {
      if (this.$route.params.sku) {
        this.isNew = false;
        this.initData(this.$route.params.sku);
      }
    },
    computed: mapGetters('permission', {
      availableButton: 'availableButton',
      isAdmin: 'isAdmin',
    }),
    data() {
      return {
        originData: {},
        // 表单数据模型
        detailForm: {
          // magento标准字段
          id: '',
          sku: '',
          name: '', // 产品名称
          attribute_set_id: '',
          price: '',
          status: '',
          visibility: '',
          type_id: '', // 标记产品类型
          // magento用户自定义字段
          // 多选
          category_ids: [],
          // 单选
          material: '',
          accessory_type_code: '',
          // 文本
          care_instructions: '',
          acc_frame_type_code: '',
          acc_height: '',
          acc_length: '',
          acc_width: '',
          specification: '',
          // simple的额外字段
          // 选择类型
          //zn_visibility: '',
          swatch_color_type_code: '',
          front_color_type_code: '',
          color: '',
          // 文本
          external_reference_id: '',
          friendly_name: '',
          display_color: '',
          //up_sell_text: '',
          long_description: '',
          front_image: '',
          //personal_media_id: '',
        },
        image_src: '',
        isNew: true, // 是否为'新建'页面
        buttonText: '取消',
      };
    },
    methods: {
      ...mapActions('loading', ['setLoading', 'setLoadingComplete']),
      async initData(sku) {
        this.setLoading();
        // 获取magento
        await this.getAttributesByName();
        // 获取magento
        const { data } = await productApi.getAccessoryItem(sku);
        this.originData = data;
        // 遍历detailForm赋值
        for (let key in this.detailForm) {
          this.detailForm[key] = data[key] || data.attributes[key];
        }
        this.setLoadingComplete();
      },
      // TODO：创建
      create() {
        const { mg, ext } = this.fixData();
        console.log(mg, ext);
      },
      async update() {
        const { errorCode } = await productApi.updateAccessory(this.detailForm, this.originData);
        if (errorCode === 0) {
          Message.success({
            message: '更新成功！',
            duration: 2000,
          });
        } else {
          Message.error({
            message: '更新失败！',
            duration: 2000,
          });
        }
        this.back();
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
