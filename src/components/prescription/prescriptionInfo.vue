<template>
  <el-descriptions :column="6" border :class="descriptionClass">
    <template slot="title">
      <div class="mt-20">
        验光单信息
      </div>
    </template>
    <template slot="extra">
      <div class="mt-20">
        <slot name="actions"></slot>
      </div>
    </template>
    <el-descriptions-item :span="6">
      <template slot="label">
        处方类型
      </template>
      <CompareText
        :origin="current_prescription_type(originData.prescription_type_id)"
        :current="current_prescription_type(prescription.prescription_type_id)"
      ></CompareText>
    </el-descriptions-item>
    <template v-if="show_prescription_info">
      <el-descriptions-item :span="2" v-if="prescription.prescription_name">
        <template slot="label">
          处方名
        </template>
        <CompareText
          :origin="originData.prescription_name"
          :current="prescription.prescription_name"
        ></CompareText>
      </el-descriptions-item>
      <el-descriptions-item :span="2" v-if="prescription.prescription_name">
        <template slot="label">
          处方来源
        </template>
        <CompareText :origin="originData.source" :current="prescription.source"></CompareText>
      </el-descriptions-item>

      <el-descriptions-item :span="2" v-if="prescription.prescription_name">
        <template slot="label">
          处方日期
        </template>
        <CompareText
          :origin="originData.date_of_prescription"
          :current="prescription.date_of_prescription"
        ></CompareText>
      </el-descriptions-item>
      <el-descriptions-item :span="prescription.pd_type == '0' ? 4 : 2">
        <template slot="label">
          瞳距类型
        </template>
        <template v-if="originData.pd_type == prescription.pd_type">
          {{ current_pd_type(prescription.pd_type) }}
        </template>
        <CompareText
          :origin="originPdText"
          :current="current_pd_type(prescription.pd_type)"
          v-else
        ></CompareText>
      </el-descriptions-item>

      <el-descriptions-item :span="2" v-if="prescription.pd_type == '0'">
        <template slot="label">
          瞳距数
        </template>
        <CompareText
          :origin="handlePd(originData.pd)"
          :current="handlePd(prescription.pd)"
        ></CompareText>
      </el-descriptions-item>

      <el-descriptions-item :span="2" v-if="prescription.pd_type == '1'">
        <template slot="label">
          右眼瞳距数
        </template>
        <CompareText
          :origin="handlePd(originData.right_pd)"
          :current="handlePd(prescription.right_pd)"
        ></CompareText>
      </el-descriptions-item>

      <el-descriptions-item :span="2" v-if="prescription.pd_type == '1'">
        <template slot="label">
          左眼瞳距数
        </template>
        <CompareText
          :origin="handlePd(originData.left_pd)"
          :current="handlePd(prescription.left_pd)"
        ></CompareText>
      </el-descriptions-item>

      <el-descriptions-item :span="2">
        <template slot="label">
          右眼球镜
        </template>
        <CompareText
          :origin="originData.od_sph > 0 ? `+${originData.od_sph}` : originData.od_sph"
          :current="prescription.od_sph > 0 ? `+${prescription.od_sph}` : prescription.od_sph"
        ></CompareText>
      </el-descriptions-item>

      <el-descriptions-item :span="2">
        <template slot="label">
          右眼柱镜
        </template>
        <CompareText
          :origin="originData.od_cyl > 0 ? `+${originData.od_cyl}` : originData.od_cyl"
          :current="prescription.od_cyl > 0 ? `+${prescription.od_cyl}` : prescription.od_cyl"
        ></CompareText>
      </el-descriptions-item>

      <el-descriptions-item :span="2">
        <template slot="label">
          右眼轴位
        </template>
        <CompareText
          :origin="handleAxis(originData.od_axis)"
          :current="handleAxis(prescription.od_axis)"
        ></CompareText>
      </el-descriptions-item>

      <el-descriptions-item :span="2">
        <template slot="label">
          左眼球镜
        </template>
        <CompareText
          :origin="originData.os_sph > 0 ? `+${originData.os_sph}` : originData.os_sph"
          :current="prescription.os_sph > 0 ? `+${prescription.os_sph}` : prescription.os_sph"
        ></CompareText>
      </el-descriptions-item>

      <el-descriptions-item :span="2">
        <template slot="label">
          左眼柱镜
        </template>
        <CompareText
          :origin="originData.os_cyl > 0 ? `+${originData.os_cyl}` : originData.os_cyl"
          :current="prescription.os_cyl > 0 ? `+${prescription.os_cyl}` : prescription.os_cyl"
        ></CompareText>
      </el-descriptions-item>

      <el-descriptions-item :span="2">
        <template slot="label">
          左眼轴位
        </template>
        <CompareText
          :origin="handleAxis(originData.os_axis)"
          :current="handleAxis(prescription.os_axis)"
        ></CompareText>
      </el-descriptions-item>

      <el-descriptions-item :span="6" v-if="prescription.prescription_type_id == 'Progressive'">
        <template slot="label">
          下加光ADD
        </template>
        <CompareText
          :origin="originData.nv_add > 0 ? `+${originData.nv_add}` : originData.nv_add"
          :current="prescription.nv_add > 0 ? `+${prescription.nv_add}` : prescription.nv_add"
        ></CompareText>
      </el-descriptions-item>

      <el-descriptions-item :span="6">
        <template slot="label">完整验光单</template>
        <CompareText :origin="showOriginImportType" :current="showCurrentImportType"></CompareText>
      </el-descriptions-item>

      <el-descriptions-item :span="6" v-if="prescription.customer_prescription_image">
        <template slot="label">
          验光单图片
        </template>
        <el-image
          :src="IMAGE_URL + prescription.customer_prescription_image"
          :preview-src-list="[IMAGE_URL + prescription.customer_prescription_image]"
          style="width: 100px"
        ></el-image>
      </el-descriptions-item>
    </template>
  </el-descriptions>
</template>

<script>
  import field from '@/components/mixins/customer/field';
  import label from '@/components/mixins/common/label';
  import orderApi from '@/api/order';
  import CompareText from '@/components/common/CompareText';
  import { handlePd, handleAxis } from '@/utils/tools';
  export default {
    components: { CompareText },
    mixins: [field, label],
    name: 'PrescriptionInfo',
    comments: {
      CompareText,
    },
    props: {
      prescription: {
        type: Object,
        required: true,
      },
      size: {
        type: String,
        default: '',
      },
    },
    created() {
      this.initData();
    },
    data() {
      return {
        handlePd,
        handleAxis,
        originData: {},
        IMAGE_URL: process.env.VUE_APP_IMG_URL,
        prescriptionTypeOptions: [
          {
            label: '单光',
            value: 'SingleVision',
          },
          {
            label: '渐进',
            value: 'Progressive',
          },
          {
            label: '平光',
            value: 'nonPrescription',
          },
          {
            label: '仅镜框',
            value: 'FrameOnly',
          },
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
      async initData() {
        const res = await orderApi.getOriginPrescription(this.prescription.prescription_id);
        let originData = res.data;

        if (!originData.prescription_id) {
          originData = JSON.parse(JSON.stringify(this.prescription));
        }
        this.originData = originData;
      },
      current_prescription_type: function(prescription_type_id) {
        return (
          this.prescriptionTypeOptions.find((item) => item.value == prescription_type_id) || {}
        ).label;
      },
      current_pd_type: function(pd_type) {
        return (this.pdTypeOptions.find((item) => item.value == pd_type) || {}).label;
      },
    },
    computed: {
      descriptionClass() {
        return `zenni-description-list ${this.size}`;
      },
      show_prescription_info() {
        return (
          ['FrameOnly', 'nonPrescription'].indexOf(this.prescription.prescription_type_id) === -1
        );
      },
      showCurrentImportType() {
        return this.prescription.import_type == '1' ? '否' : '是';
      },
      showOriginImportType() {
        if (JSON.stringify(this.originData) !== '{}') {
          if (this.originData.import_type == '1') {
            return '否';
          } else {
            return '是';
          }
        }
      },
      originPdText() {
        let text = this.current_pd_type(this.originData.pd_type);
        let addition_text = '';
        if (this.originData.pd_type == '0') {
          addition_text = `${this.handlePd(this.originData.pd)}`;
        } else {
          addition_text = `左 ${this.handlePd(this.originData.left_pd)} 右 ${this.handlePd(
            this.originData.right_pd
          )}`;
        }
        return `${text} ${addition_text}`;
      },
    },
  };
</script>

<style></style>
