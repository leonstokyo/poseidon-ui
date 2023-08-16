<template>
  <div>
    <el-form ref="form" :rules="rules" :model="detailForm" label-width="150px" style="width: 500px">
      <el-form-item label="产品类型" prop="type_id" style="width: 500px">
        <el-select v-model="detailForm.type_id" disabled placeholder="请选择">
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
      <el-form-item label="SKU" prop="sku" style="width: 500px">
        <el-input v-model="detailForm.sku" class="input-style" disabled></el-input>
      </el-form-item>
      <el-form-item label="库存" style="width: 500px">
        <el-input v-model="detailForm.qty" class="input-style" disabled></el-input>
      </el-form-item>
      <el-form-item label="产品名称" prop="name" style="width: 500px">
        <el-input v-model="detailForm.name" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="图片" v-if="!isNew && imgList.length > 0">
        <el-carousel
          height="160px"
          indicator-position="outside"
          style="margin-left: -10px; width: 420px"
        >
          <el-carousel-item v-for="item in imgList" :key="item.name">
            <div style="width: 350px; text-align: center; margin-left: 34px">
              <div
                style="width: 350px; height:120px; display: flex; align-items: center; margin-left: 25px"
              >
                <el-image
                  :src="item.src"
                  style="max-width: 300px"
                  @error="imgError(item.name)"
                ></el-image>
              </div>
              <div style="width: 100%; align-content: center; height: 40px">
                <span style="margin-top: 5px">{{ item.name }}</span>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-form-item>
      <el-form-item label="标签" style="width: 500px">
        <el-select
          v-model="detailForm.tag"
          style="width: 300px"
          placeholder="请选择"
          filterable
          clearable
          multiple
        >
          <el-option
            v-for="item in tagOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有无全景图片" style="width: 500px">
        <el-radio v-model="detailForm.has_360_view" label="1">是</el-radio>
        <el-radio v-model="detailForm.has_360_view" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="全景图" v-if="!isNew" v-show="detailForm.has_360_view == '1'">
        <el-button type="text" @click="dialogVisible = true">查看360</el-button>
        <div @mousemove="move" ref="dialog" @mouseenter="enter" style="text-align: center">
          <el-dialog :visible.sync="dialogVisible" width="80%">
            <el-image
              style="max-width: 800px"
              v-for="(item, index) in img360List"
              :src="item"
              v-show="isShow360(index)"
            ></el-image>
          </el-dialog>
        </div>
      </el-form-item>
      <el-form-item label="上新日期" style="width: 500px">
        <el-date-picker
          v-model="detailForm.news_from_date"
          type="datetime"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" style="width: 500px">
        <el-radio v-model="detailForm.status" label="1" @change="changeRadio">使用中</el-radio>
        <el-radio v-model="detailForm.status" label="2" @change="changeRadio">已下架</el-radio>
      </el-form-item>

      <el-form-item label="可见性" style="width: 500px">
        <el-select v-model="detailForm.visibility" placeholder="请选择">
          <el-option
            v-for="item in visibilityOptions"
            :key="item.value"
            :label="item.label"
            :value="String(item.value)"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="价格" prop="price" style="width: 500px">
        <el-input-number
          v-model="detailForm.price"
          controls-position="right"
          :step="0.01"
          :precision="2"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <!--SKU-->
      <el-form-item label="distance" style="width: 500px">
        <el-input
          type="number"
          :step="0.01"
          v-model="detailForm.distance"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="3D试戴" style="width: 500px">
        <el-radio v-model="detailForm.digitized_with_ditto" label="1">是</el-radio>
        <el-radio v-model="detailForm.digitized_with_ditto" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="liy" style="width: 500px">
        <el-input
          type="number"
          :step="0.01"
          v-model="detailForm.liy"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="lix" style="width: 500px">
        <el-input
          type="number"
          :step="0.01"
          v-model="detailForm.lix"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="riy" style="width: 500px">
        <el-input
          type="number"
          :step="0.01"
          v-model="detailForm.riy"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="rix" style="width: 500px">
        <el-input
          type="number"
          :step="0.01"
          v-model="detailForm.rix"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="详细描述" style="width: 500px">
        <el-input v-model="detailForm.long_description" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="颜色" style="width: 500px">
        <el-select v-model="detailForm.color" placeholder="请选择">
          <el-option
            v-for="item in colorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="背景颜色" style="width: 500px" v-show="detailForm.type_id == 'simple'">
        <el-color-picker v-model="detailForm.frame_background_color"></el-color-picker>
      </el-form-item>

      <el-form-item style="width: 500px">
        <div style="display: flex;">
          <!--justify-content: space-between-->
          <el-button type="primary" :loading="btnLoading" @click="update('form')" v-show="!isNew">
            保存
          </el-button>
          <el-button style="margin-left:70px;" @click="back">{{ buttonText }}</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog title="提示-下架原因" :visible.sync="showReasonDialog" width="300px">
      <span>{{ detailForm.disable_reason }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showReasonDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="填写下架原因" :visible.sync="putReasonDialog" width="300px">
      <span slot="footer" class="dialog-footer">
        <el-input type="textarea" :rows="3" v-model="detailForm.disable_reason"></el-input>
        <el-button @click="cancelPutReason">取 消</el-button>
        <el-button type="primary" @click="putReasonDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { Message } from 'element-ui';
  import productApi from '@/api/product';
  import productV1Api from '@/api/V1/product';
  import options from '@/components/mixins/common/options';
  import image from '@/components/mixins/product/frame/image';
  import label from '@/components/mixins/common/label';
  import { mapActions } from 'vuex';
  export default {
    name: 'FrameEdit',
    mixins: [options, image, label],

    created() {
      if (this.$route.params.id) {
        this.isNew = false;
        this.initData(this.$route.params.id);
      }
    },
    data() {
      return {
        showReasonDialog: false,
        putReasonDialog: false,
        btnLoading: false,
        originData: {}, // 用于保存原始数据
        // 表单数据模型
        detailForm: {
          // magento标准字段
          id: '',
          sku: '',
          name: '', // 产品名称
          price: '',
          status: '',
          visibility: '',
          type_id: '', // 标记产品类型
          // magento用户自定义字段
          // 单选
          color: '',
          has_360_view: '0',
          // 文本
          description: '',
          news_from_date: '',
          front_image: '',
          side_image: '',
          angle_image: '',
          tinted_image: '',
          image_url: '',
          // simple 字段
          // 文本
          distance: '',
          external_reference_id: '',
          liy: '',
          lix: '',
          riy: '',
          rix: '',
          long_description: '',
          // 单选
          digitized_with_ditto: '0',
          qty: 0,
          disable_reason: '',
        },
        isNew: true, // 是否为'新建'页面
        buttonText: '取消',
        rules: {
          type_id: [{ required: true, message: '请选择产品类型！' }],
          sku: [{ required: true, message: '请输入sku！' }],
          name: [{ required: true, message: '请输入产品名称！' }],
          status: [{ required: true, message: '请选择产品状态！' }],
          price: [
            { required: true, message: '请填写产品价格！' },
            { type: 'number', min: 0 },
          ],
        },
      };
    },
    methods: {
      ...mapActions('loading', ['setLoading', 'setLoadingComplete']),
      async initData(id) {
        this.setLoading();
        await this.getAttributesByName();
        // 获取magento
        const { data } = await productV1Api.getFrameSimpleItem(id);
        this.originData = data;
        // 遍历detailForm赋值
        for (let key in this.detailForm) {
          this.detailForm[key] = data[key];
        }
        this.detailForm.id = data.entity_id;
        this.detailForm.qty = parseInt(this.detailForm.qty);
        this.detailForm.tag = data.tag ? data.tag.split(',') : [];
        // 图片资源赋值
        this.front_img_src = this.detailForm.front_image || this.detailForm.image_url;
        this.side_img_src = this.detailForm.side_image;
        this.angle_img_src = this.detailForm.angle_image;
        this.tinted_img_src = this.detailForm.tinted_image;
        this.setLoadingComplete();
        // 初始化图片列表
        this.getImgSrc(this.detailForm.sku);
      },
      async update(formName) {
        this.btnLoading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            productApi
              .updateFrame(this.detailForm, this.originData)
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
          }
        });
      },
      back() {
        this.$router.back();
      },
      changeRadio(value) {
        if (value == 1) {
          if (this.detailForm.disable_reason) {
            this.showReasonDialog = true;
          }
        } else {
          this.detailForm.disable_reason = '';
          this.putReasonDialog = true;
        }
      },
      cancelPutReason() {
        this.detailForm.disable_reason = '';
        this.detailForm.status = '1';
        this.putReasonDialog = false;
      },
    },
  };
</script>
<style scoped>
  .input-style {
    width: 350px;
  }
</style>
