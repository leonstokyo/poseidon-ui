<template>
  <div>
    <el-descriptions
      class="margin-top zenni-description-list mini-size"
      :column="5"
      size="small"
      border
    >
      <template slot="title">
        <div class="mt-20">
          item信息
        </div>
      </template>
      <el-descriptions-item>
        <template slot="label">
          编号
        </template>
        <div style="font-size:24px;font-weight:600;color: #ec0909">
          {{ orderItem.sequenceNumber || frame.commerceitem_id }}
        </div>
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          数量
        </template>
        {{ orderItem.qty }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          总金额
        </template>
        {{ orderItem.origin_total_money }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          优惠金额
        </template>
        {{ total_discount_money }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          实付金额
        </template>
        {{ orderItem.total_money }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions class="margin-top zenni-description-list" :column="2" size="medium" border>
      <template slot="title">
        <div class="mt-20">
          镜框信息
        </div>
      </template>
      <el-descriptions-item :span="2">
        <template slot="label">
          镜框主图
        </template>
        <el-image :src="frame_url"></el-image>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          镜框名称
        </template>
        {{ frame.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          镜框价格
        </template>
        {{ frame.price }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          镜框PD
        </template>
        {{ frame_pd }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          鼻梁宽度
        </template>
        {{ frame.bridge }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          镜脚长度
        </template>
        {{ frame.temple_length }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          镜框宽度
        </template>
        {{ frame.frame_width }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions class="margin-top zenni-description-list" :column="3" size="medium" border>
      <template slot="title">
        <div class="mt-20">
          镜片信息
        </div>
      </template>
      <el-descriptions-item :span="3">
        <template slot="label">
          镜片名称
        </template>
        {{ lens_name }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          镜片价格
        </template>
        {{ lens ? lens.price : '0.00' }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          镜片code
        </template>
        {{ lens ? lens.external_reference_id : '无' }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          片形code
        </template>
        {{ frame.len_shape_sku || '无' }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          镜片高度
        </template>
        {{ frame.lens_height ? frame.lens_height : '无' }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          镜片宽度
        </template>
        {{ frame.lens_width ? frame.lens_width : '无' }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          镜片染色code
        </template>
        {{ lens ? lens.tint_info.tint_ext_id : '无' }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          镜片镀膜code
        </template>
        {{ lens ? lens.coating_info.coating_ext_id : '无' }}
      </el-descriptions-item>
    </el-descriptions>
    <div>
      <PrescriptionInfo :prescription="prescription" v-if="!editMode">
        <template slot="actions">
          <div
            style="display: flex; justify-content:flex-end;"
            v-if="editAble && canEditPrescription"
          >
            <el-button type="primary" @click="editMode = true">编辑验光单</el-button>
          </div>
        </template>
      </PrescriptionInfo>

      <PrescriptionForm
        :prescription="prescription"
        :customerId="customerId"
        :commerceitem_id="frame.commerceitem_id"
        @cancel="cancelEdit"
        @save-success="onSave"
        v-else
      ></PrescriptionForm>
    </div>
  </div>
</template>

<script>
  import field from '@/components/mixins/customer/field';
  import PrescriptionInfo from '@/components/prescription/prescriptionInfo';
  import PrescriptionForm from '@/components/prescription/prescriptionForm';
  import label from '@/components/mixins/common/label';
  import { handlePd } from '@/utils/tools';
  export default {
    mixins: [field, label],
    name: 'OrderInfoNew',
    components: {
      PrescriptionInfo,
      PrescriptionForm,
    },
    props: {
      orderItem: {
        type: Object,
        required: true,
      },
      customerId: {
        type: String,
        default: '0',
      },
      editItem: {
        type: Boolean,
        default: false,
      },
      editAble: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        handlePd,
        IMAGE_URL: process.env.VUE_APP_IMG_URL,
        formPrescription: {},
        editMode: false,
        prescriptionTypeOptions: [
          {
            label: '单光',
            value: 'SingleVision',
          },
          {
            label: '渐进',
            value: 'Progressive',
          },
          // {
          //   label: '平光',
          //   value: 'nonPrescription'
          // },
          // {
          //   label: '仅镜框',
          //   value: 'FrameOnly'
          // }
        ],
        pdTypeOptions: [
          {
            label: '瞳距',
            value: '0',
          },
          {
            label: '单眼瞳距',
            value: '1',
          },
        ],
      };
    },
    methods: {
      cancelEdit() {
        this.editMode = false;
      },
      onSave() {
        this.cancelEdit();
        this.$emit('save-success', true);
      },
    },
    computed: {
      lens: function() {
        return this.orderItem.subitems.len;
      },
      lens_name: function() {
        return this.lens
          ? this.lens.len_package_name
            ? this.lens.len_package_name
            : this.lens.lens_index +
              ' 折射率，' +
              this.lens.package_type +
              '，' +
              (this.lens.color || this.lens.lens_color) +
              '，' +
              this.lens.coating_info.name
          : '无镜片（仅框架）';
      },
      total_discount_money: function() {
        return `-${(
          parseFloat(this.orderItem.origin_total_money) - parseFloat(this.orderItem.total_money)
        ).toFixed(2)}`; //item优惠金额
      },
      has_prescription: function() {
        return this.prescription && JSON.stringify(this.prescription) !== '{}';
      },
      canEditPrescription: function() {
        return (
          this.has_prescription &&
          ['FrameOnly', 'nonPrescription'].indexOf(this.prescription.prescription_type_id) === -1
        );
      },
      frame: function() {
        return this.orderItem.subitems.frame;
      },
      prescription: function() {
        return this.orderItem.prescription;
      },
      frame_pd: function() {
        return `${handlePd(this.frame.min_pd)} - ${handlePd(this.frame.max_pd)}`;
      },
      frame_url: function() {
        return `${process.env.VUE_APP_IMG_URL}${this.frame.front_image}?x-oss-process=image/resize,w_100/quality,q_50`;
      },
      current_prescription_type: function() {
        return this.prescriptionTypeOptions.find(
          (item) => item.value == this.prescription.prescription_type_id
        ).label;
      },
      current_pd_type: function() {
        return this.pdTypeOptions.find((item) => item.value == this.prescription.pd_type).label;
      },
    },
  };
</script>

<style></style>
