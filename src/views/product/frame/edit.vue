<template>
  <div>
    <el-form ref="form" :model="detailForm" label-width="150px" style="width: 500px">
      <el-form-item label="产品类型" style="width: 500px">
        <el-select v-model="detailForm.type_id" placeholder="请选择" disabled>
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
      <el-form-item
        label="库存"
        style="width: 500px"
        v-show="detailForm.type_id !== 'configurable'"
      >
        <el-input v-model="detailForm.qty" class="input-style" disabled></el-input>
      </el-form-item>
      <el-form-item label="产品名称" style="width: 500px">
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
      <el-form-item label="标签" style="width: 500px" v-show="detailForm.type_id == 'simple'">
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
      <el-form-item
        label="有无全景图片"
        style="width: 500px"
        v-show="detailForm.type_id == 'simple'"
      >
        <el-radio v-model="detailForm.has_360_view" label="1">是</el-radio>
        <el-radio v-model="detailForm.has_360_view" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="全景图片" v-if="!isNew" v-show="detailForm.has_360_view == '1'">
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

      <el-form-item
        label="可染色"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-radio v-model="detailForm.tintable" label="1">是</el-radio>
        <el-radio v-model="detailForm.tintable" label="0">否</el-radio>
      </el-form-item>

      <el-form-item
        label="可偏心"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-radio v-model="detailForm.decentration_available" label="1">是</el-radio>
        <el-radio v-model="detailForm.decentration_available" label="0">否</el-radio>
      </el-form-item>
      <el-form-item
        label="可渐进"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-radio v-model="detailForm.progressive_available" label="1">是</el-radio>
        <el-radio v-model="detailForm.progressive_available" label="0">否</el-radio>
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

      <el-form-item label="价格" style="width: 500px" v-show="detailForm.type_id == 'simple'">
        <el-input-number
          v-model="detailForm.price"
          controls-position="right"
          :step="0.01"
          :precision="2"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <!--            <el-form-item label="标签" style="width: 500px" v-show="detailForm.type_id == 'configurable'">-->
      <!--                <el-select v-model="detailForm.label" multiple placeholder="请选择">-->
      <!--                    <el-option-->
      <!--                            v-for="item in labelOptions"-->
      <!--                            :key="item.value"-->
      <!--                            :label="item.label"-->
      <!--                            :value="item.value">-->
      <!--                    </el-option>-->
      <!--                </el-select>-->
      <!--            </el-form-item>-->
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
        label="镜框类型"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-select v-model="detailForm.rim_type" placeholder="请选择">
          <el-option
            v-for="item in rimTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="框架类型"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-select v-model="detailForm.frame_type" placeholder="请选择">
          <el-option
            v-for="item in frameTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="镜框形状"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-select v-model="detailForm.frame_shape_type" placeholder="请选择">
          <el-option
            v-for="item in frameShapeTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人群" style="width: 500px" v-show="detailForm.type_id == 'configurable'">
        <el-select v-model="detailForm.population" multiple placeholder="请选择">
          <el-option
            v-for="item in populationOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="风格" style="width: 500px" v-show="detailForm.type_id == 'configurable'">
        <el-select v-model="detailForm.occasion" multiple placeholder="请选择">
          <el-option
            v-for="item in occasionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="最小瞳距"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-input-number
          v-model="detailForm.min_pd"
          controls-position="right"
          :step="0.01"
          :precision="2"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="最大瞳距"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-input-number
          v-model="detailForm.max_pd"
          controls-position="right"
          :step="0.01"
          :precision="2"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="最小度数"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-input-number
          v-model="detailForm.min_sph"
          controls-position="right"
          :step="0.01"
          :precision="2"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="最大度数"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-input-number
          v-model="detailForm.max_sph"
          controls-position="right"
          :step="0.01"
          :precision="2"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="最小散光"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-input-number
          v-model="detailForm.min_cyl"
          controls-position="right"
          :step="0.01"
          :precision="2"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="最大散光"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-input-number
          v-model="detailForm.max_cyl"
          controls-position="right"
          :step="0.01"
          :precision="2"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="joint_min"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-input-number
          v-model="detailForm.joint_min"
          controls-position="right"
          :step="0.01"
          :precision="2"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="joint_max"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-input-number
          v-model="detailForm.joint_max"
          controls-position="right"
          :step="0.01"
          :precision="2"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="鼻梁" style="width: 500px" v-show="detailForm.type_id == 'configurable'">
        <el-input-number
          v-model="detailForm.bridge"
          controls-position="right"
          :step="0.1"
          :precision="1"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="框架宽度"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-input-number
          v-model="detailForm.frame_width"
          controls-position="right"
          :step="0.1"
          :precision="1"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="框架重量"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-input-number
          v-model="detailForm.frame_weight"
          controls-position="right"
          :step="0.1"
          :precision="1"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="镜脚长度"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-input-number
          v-model="detailForm.temple_length"
          controls-position="right"
          :step="0.1"
          :precision="1"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="镜片高度"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-input-number
          v-model="detailForm.lens_height"
          controls-position="right"
          :step="0.1"
          :precision="1"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="镜片宽度"
        style="width: 500px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <el-input-number
          v-model="detailForm.lens_width"
          controls-position="right"
          :step="0.1"
          :precision="1"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="产品描述"
        style="width: 800px"
        v-show="detailForm.type_id == 'configurable'"
      >
        <RichText :text="detailForm.description" v-on:update:text="getText"></RichText>
      </el-form-item>
      <!--SKU-->
      <el-form-item label="distance" style="width: 500px" v-show="detailForm.type_id == 'simple'">
        <el-input
          type="number"
          :step="0.01"
          v-model="detailForm.distance"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="external_reference_id"
        style="width: 500px"
        v-show="detailForm.type_id == 'simple'"
      >
        <el-input v-model="detailForm.external_reference_id" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="3D试戴" style="width: 500px" v-show="detailForm.type_id == 'simple'">
        <el-radio v-model="detailForm.digitized_with_ditto" label="1">是</el-radio>
        <el-radio v-model="detailForm.digitized_with_ditto" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="liy" style="width: 500px" v-show="detailForm.type_id == 'simple'">
        <el-input
          type="number"
          :step="0.01"
          v-model="detailForm.liy"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="lix" style="width: 500px" v-show="detailForm.type_id == 'simple'">
        <el-input
          type="number"
          :step="0.01"
          v-model="detailForm.lix"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="riy" style="width: 500px" v-show="detailForm.type_id == 'simple'">
        <el-input
          type="number"
          :step="0.01"
          v-model="detailForm.riy"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="rix" style="width: 500px" v-show="detailForm.type_id == 'simple'">
        <el-input
          type="number"
          :step="0.01"
          v-model="detailForm.rix"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="详细描述" style="width: 500px" v-show="detailForm.type_id == 'simple'">
        <el-input v-model="detailForm.long_description" class="input-style"></el-input>
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

      <el-form-item label="背景颜色" style="width: 500px" v-show="detailForm.type_id == 'simple'">
        <el-color-picker v-model="detailForm.frame_background_color"></el-color-picker>
      </el-form-item>

      <el-form-item label="排序" style="width: 500px" v-show="detailForm.type_id == 'configurable'">
        <el-input v-model="detailForm.z_position" class="input-style"></el-input>
      </el-form-item>
      <el-form-item style="width: 500px">
        <div style="display: flex;">
          <!--justify-content: space-between-->
          <el-button
            v-if="canDo('frames-update')"
            type="primary"
            :loading="btnLoading"
            @click="update"
            v-show="!isNew"
          >
            保存
          </el-button>
          <el-button style="margin-left:70px;" @click="back">{{ buttonText }}</el-button>
        </div>
      </el-form-item>
      <el-form-item label="是否开启定制入口" style="width: 500px">
        <el-switch
          v-model="detailForm.sale_mode"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="2"
        ></el-switch>
        <el-button
          v-if="canDo('frames-update')"
          style="margin-left: 10px"
          type="primary"
          :loading="btnLoading"
          @click="update"
          size="mini"
        >
          保存
        </el-button>
      </el-form-item>
    </el-form>
    <LensPackageTable :frameInfo="frameInfo"></LensPackageTable>
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
  import RichText from '@/components/richText/Index';
  import LensPackageTable from '@/components/lens/LensPackageTable';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'FrameEdit',
    components: { RichText, LensPackageTable },
    mixins: [options, image, label],

    created() {
      if (this.$route.params.sku) {
        this.isNew = false;
        this.initData(this.$route.params.sku);
      }
    },
    computed: {
      frameInfo: function() {
        return {
          frame_configure_sku: this.detailForm.sku,
          frame_configure_id: this.detailForm.id,
          rim_type: this.rim_type_label,
        };
      },
      ...mapGetters('permission', {
        canDo: 'canDo',
        isAdmin: 'isAdmin',
      }),
    },
    data() {
      return {
        rim_type_label: '',
        drawer: false,
        lensPackageDialogVisible: false,
        showReasonDialog: false,
        putReasonDialog: false,
        btnLoading: false,
        originData: {}, // 用于保存原始数据
        pagination: {
          pageSize: 10,
          currentPage: 1,
          total: 100,
        },
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
          // 多选
          category_ids: [],
          label: [],
          population: [],
          occasion: [],
          // 单选
          material: '',
          color: '',
          rim_type: '',
          frame_type: '',
          frame_shape_type: '',
          has_360_view: '0',
          tintable: '0',
          decentration_available: '0',
          // 文本
          description: '',
          min_pd: '',
          news_from_date: '',
          max_pd: '',
          min_sph: '',
          max_sph: '',
          min_cyl: '',
          max_cyl: '',
          joint_min: '',
          joint_max: '',
          frame_width: '',
          frame_weight: '',
          lens_height: '',
          lens_width: '',
          progressive_available: '',
          temple_length: '',
          bridge: '',
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
          frame_background_color: '#fff',
          qty: 0,
          disable_reason: '',
          sale_mode: '2',
          z_position: '',
        },
        isNew: true, // 是否为'新建'页面
        buttonText: '取消',
      };
    },
    methods: {
      ...mapActions('loading', ['setLoading', 'setLoadingComplete']),
      async initData(sku) {
        this.setLoading();
        await this.getAttributesByName();
        // 获取magento
        const params = {
          filter: {
            sku,
          },
        };
        let result = null;
        if (this.$route.params.type === 'simple') {
          const { data } = await productV1Api.getFrameSimpleList(params);
          result = data[0]['items'][0];
        } else {
          const { data } = await productApi.getFrameItem(sku);
          result = data['item'];
        }
        this.originData = result;
        // 遍历detailForm赋值
        for (let key in this.detailForm) {
          this.detailForm[key] = result[key];
        }
        this.detailForm.id = result.entity_id || result.id;
        this.detailForm.qty = parseInt(this.detailForm.qty);
        this.detailForm.tag = result.tag ? result.tag.split(',') : [];
        // 图片资源赋值
        this.front_img_src = this.detailForm.front_image || this.detailForm.image_url;
        this.side_img_src = this.detailForm.side_image;
        this.angle_img_src = this.detailForm.angle_image;
        this.tinted_img_src = this.detailForm.tinted_image;
        this.rim_type_label = this.rimTypeMapping[this.detailForm.rim_type];
        // 初始化图片列表
        this.setLoadingComplete();
        this.getImgSrc(sku);
      },
      async update() {
        this.btnLoading = true;
        productApi
          .updateFrame(this.detailForm, this.originData)
          .then(({ errorCode, message }) => {
            if (errorCode === 0) {
              Message.success({
                message: '更新成功！',
                duration: 2000,
              });
              this.initData(this.$route.params.sku);
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
      },
      getText(val) {
        this.detailForm.description = val;
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
