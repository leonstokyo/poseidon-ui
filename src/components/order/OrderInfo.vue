<template>
  <div>
    <el-divider content-position="left">订单item信息</el-divider>
    <el-form
      :inline="true"
      ref="form"
      :model="detailForm"
      label-width="150px"
      style="width: 1200px"
      :rules="rules"
    >
      <el-form-item label="item编号" style="width: 500px">
        <div style="font-size:24px;font-weight:600;color: #ec0909">
          {{ sequenceNumber || commerceitemId }}
        </div>
      </el-form-item>

      <el-form-item label="镜框主图" style="width: 500px">
        <el-image :src="detailForm.frame_url"></el-image>
      </el-form-item>

      <el-form-item label="镜框名称" style="width: 500px">
        <el-input v-model="detailForm.frame_name" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="镜框价格" style="width: 500px">
        <el-input v-model="detailForm.frame_price" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="镜框PD" style="width: 500px">
        <el-input v-model="detailForm.frame_pd" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="鼻梁宽度" style="width: 500px">
        <el-input v-model="detailForm.frame_bridge" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="镜脚长度" style="width: 500px">
        <el-input v-model="detailForm.frame_temple_length" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="镜框宽度" style="width: 500px">
        <el-input v-model="detailForm.frame_width" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="镜片名称" style="width: 500px">
        <el-input v-model="detailForm.lens_name" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="镜片价格" style="width: 500px">
        <el-input v-model="detailForm.lens_price" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="镜片code" style="width: 500px">
        <el-input
          v-model="detailForm.external_reference_id"
          class="input-style"
          readonly
        ></el-input>
      </el-form-item>

      <el-form-item label="片形code" style="width: 500px">
        <el-input v-model="detailForm.lens_shape_sku" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="镜片高度" style="width: 500px">
        <el-input v-model="detailForm.lens_height" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="镜片宽度" style="width: 500px">
        <el-input v-model="detailForm.lens_width" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="镜片染色code" style="width: 500px">
        <el-input v-model="detailForm.tint_ext_id" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="镜片镀膜code" style="width: 500px">
        <el-input v-model="detailForm.coating_ext_id" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="item数量" style="width: 500px">
        <el-input v-model="detailForm.item_qty" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="item总金额" style="width: 500px">
        <el-input v-model="detailForm.origin_total_money" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="item优惠金额" style="width: 500px">
        <el-input v-model="detailForm.total_discount_money" class="input-style" readonly></el-input>
      </el-form-item>

      <el-form-item label="item实付金额" style="width: 500px">
        <el-input v-model="detailForm.total_money" class="input-style" readonly></el-input>
      </el-form-item>

      <div style="padding: 0 50px">
        <el-divider content-position="center">验光单信息</el-divider>
      </div>

      <div v-if="detailForm.pd_type">
        <div v-show="has_prescription">
          <!-- <el-form-item label="处方名" prop="prescription_name" style="width: 500px">
            <el-input
              :disabled="editAvailable"
              v-model="detailForm.prescription_name"
              class="input-style"
            ></el-input>
          </el-form-item>
          <el-form-item label="处方来源" style="width: 500px">
            <el-input
              v-model="detailForm.source"
              class="input-style"
              :disabled="editAvailable"
            ></el-input>
          </el-form-item>
          <el-form-item label="处方日期" style="width: 500px">
            <el-date-picker
              :disabled="editAvailable"
              readonly
              v-model="detailForm.date_of_prescription"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item> -->

          <el-form-item label="处方类型" prop="prescription_type_id" style="width: 1200px">
            <el-select
              v-model="detailForm.prescription_type_id"
              @change="prescriptionTypeChange"
              placeholder="请选择"
              class="input-style"
              disabled
              style="width: 860px"
            >
              <el-option
                v-for="item in prescriptionTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="瞳距类型" prop="pd_type" style="width: 1200px">
            <el-select
              v-model="detailForm.pd_type"
              style="width: 860px"
              class="input-style"
              placeholder="请选择"
              :disabled="editAvailable"
            >
              <el-option
                v-for="item in pdTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            required
            label="瞳距数"
            style="width: 1200px"
            v-show="detailForm.pd_type == '0'"
          >
            <el-select
              v-model="detailForm.pd"
              class="input-style"
              placeholder="请选择"
              style="width: 860px"
              clearable
              :disabled="editAvailable"
            >
              <el-option
                v-for="item in pdOptions"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            required
            label="右眼瞳距数"
            style="width: 500px"
            v-show="detailForm.pd_type == '1'"
          >
            <el-select
              v-model="detailForm.right_pd"
              class="input-style"
              placeholder="请选择"
              clearable
              :disabled="editAvailable"
            >
              <el-option
                v-for="item in singlePdOptions"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            required
            label="左眼瞳距数"
            class="input-style"
            style="width: 500px"
            v-show="detailForm.pd_type == '1'"
          >
            <el-select
              v-model="detailForm.left_pd"
              placeholder="请选择"
              style="width: 350px"
              clearable
              :disabled="editAvailable"
            >
              <el-option
                v-for="item in singlePdOptions"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="od_sph" label="右眼球镜" style="width: 345px">
            <el-select
              v-model="detailForm.od_sph"
              placeholder="请选择"
              class="input-style"
              :disabled="editAvailable"
              style="width: 150px"
            >
              <el-option
                v-for="item in sphOptions"
                :key="item"
                :label="item > 0 ? `+${item}` : item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="od_sph" label="右眼柱镜" style="width: 345px">
            <el-select
              v-model="detailForm.od_cyl"
              placeholder="请选择"
              :disabled="editAvailable"
              class="input-style"
              style="width: 150px"
            >
              <el-option
                v-for="item in cylOptions"
                :key="item"
                :label="item > 0 ? `+${item}` : item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="od_sph" label="右眼轴位" style="width: 345px">
            <el-select
              v-model="detailForm.od_axis"
              placeholder="请选择"
              :disabled="editAvailable"
              class="input-style"
              style="width: 150px"
            >
              <el-option
                v-for="item in axisOptions"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="od_sph" label="左眼球镜" style="width: 345px">
            <el-select
              v-model="detailForm.os_sph"
              placeholder="请选择"
              :disabled="editAvailable"
              class="input-style"
              style="width: 150px"
            >
              <el-option
                v-for="item in sphOptions"
                :key="item"
                :label="item > 0 ? `+${item}` : item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="od_sph" label="左眼柱镜" style="width: 345px">
            <el-select
              v-model="detailForm.os_cyl"
              placeholder="请选择"
              :disabled="editAvailable"
              class="input-style"
              style="width: 150px"
            >
              <el-option
                v-for="item in cylOptions"
                :key="item"
                :label="item > 0 ? `+${item}` : item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="od_sph" label="左眼轴位" style="width: 345px">
            <el-select
              v-model="detailForm.os_axis"
              placeholder="请选择"
              :disabled="editAvailable"
              class="input-style"
              style="width: 150px"
            >
              <el-option
                v-for="item in axisOptions"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            required
            label="下加光ADD"
            style="width: 1200px"
            v-show="detailForm.prescription_type_id == 'Progressive'"
          >
            <el-select
              style="width: 150px"
              v-model="detailForm.nv_add"
              placeholder="请选择"
              :disabled="editAvailable"
            >
              <el-option
                v-for="item in nvaddOptions"
                :key="item"
                :label="item > 0 ? `+${item}` : item"
                :value="item"
                class="input-style"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- //TODO 确认完整验光单参数枚举值，现在看起来不对  -->
          <el-form-item label="完整验光单" style="width: 1000px">
            <el-radio v-model="detailForm.import_type" label="2" :disabled="editAvailable">
              是
            </el-radio>
            <el-radio v-model="detailForm.import_type" label="1" :disabled="editAvailable">
              否
            </el-radio>
          </el-form-item>
          <el-form-item
            label="验光单图片"
            style="width: 500px"
            v-show="detailForm.customer_prescription_image"
          >
            <el-image
              :src="IMAGE_URL + detailForm.customer_prescription_image"
              :preview-src-list="[IMAGE_URL + detailForm.customer_prescription_image]"
              style="width: 100px"
            ></el-image>
          </el-form-item>
        </div>

        <div style="margin-left: 80px; margin-bottom: 10px; display: flex; justify-content: center">
          <div style="width: 500px" v-if="editItem">
            <div style="width: 700px">
              <el-button v-show="detailForm.import_type == '1'" type="primary" @click="edit">
                {{ buttonText }}
              </el-button>
              <el-button v-show="!editAvailable" type="primary" @click="update('form')">
                保存
              </el-button>
              <el-button v-show="!editAvailable" type="primary" @click="importPrescription()">
                {{ buttonImport }}
              </el-button>
              <el-select
                v-model="selectPrescriptionId"
                placeholder="请选择"
                style="margin-left: 20px"
                @change="selectPrescription"
                clearable
                v-show="isImport"
              >
                <el-option
                  v-for="item in prescriptionOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>

      <div v-if="detailForm.prescription_type_id === 'FrameOnly'">
        <div style="text-align: center;color:#ec0909">仅框架，没有验光单信息</div>
      </div>
      <div v-if="detailForm.prescription_type_id === 'nonPrescription'">
        <div style="text-align: center;color:#ec0909">平光镜片，没有验光单信息</div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import field from '@/components/mixins/customer/field';
  import label from '@/components/mixins/common/label';
  import orderApi from '@/api/order';
  import customerApi from '@/api/customer';
  import { Message } from 'element-ui';
  import { handlePd } from '@/utils/tools';
  export default {
    mixins: [field, label],
    name: 'OrderInfo',
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
    },
    created() {
      this.initData();
    },
    data() {
      const checkPd = (rule, value, callback) => {
        if (this.detailForm.prescription_type_id === 'nonPrescription') {
          if (
            this.detailForm.pd > 0 ||
            this.detailForm.left_pd > 0 ||
            this.detailForm.right_pd > 0
          ) {
            callback(new Error('无处方不可填写瞳距！'));
          } else {
            callback();
          }
        } else {
          if (value == '0') {
            if (this.detailForm.pd > 0) {
              callback();
            } else {
              callback(new Error('请填写瞳距！'));
            }
          } else {
            if (this.detailForm.left_pd > 0 && this.detailForm.right_pd > 0) {
              callback();
            } else {
              callback(new Error('请填写左、右眼瞳距！'));
            }
          }
        }
      };
      const checkPrescription = (rule, value, callback) => {
        if (value !== 'Progressive' && value !== 'SingleVision' && value !== 'nonPrescription') {
          callback(new Error('请填验光单类型！'));
        } else if (value === 'Progressive') {
          if (this.detailForm.nv_add > 0) {
            callback();
          } else {
            callback(new Error('请填写下加光ADD！'));
          }
        }
        callback();
      };
      const checkData = (rule, value, callback) => {
        if (this.detailForm.prescription_type_id === 'nonPrescription') {
          if (
            Number(this.detailForm.od_axis) !== 0 ||
            Number(this.detailForm.od_cyl) !== 0 ||
            Number(this.detailForm.od_sph) !== 0 ||
            Number(this.detailForm.os_axis) !== 0 ||
            Number(this.detailForm.os_cyl) !== 0 ||
            Number(this.detailForm.os_sph) !== 0 ||
            Number(this.detailForm.nv_add) !== 0
          ) {
            callback(new Error('无处方眼镜不可填处方相关参数！'));
          }
          callback();
        } else {
          if (
            Number(this.detailForm.od_axis) === 0 &&
            Number(this.detailForm.od_cyl) === 0 &&
            Number(this.detailForm.od_sph) === 0 &&
            Number(this.detailForm.os_axis) === 0 &&
            Number(this.detailForm.os_cyl) === 0 &&
            Number(this.detailForm.os_sph) === 0
          ) {
            callback(new Error('请填写眼镜参数'));
          } else {
            if (
              Number(this.detailForm.os_axis) * Number(this.detailForm.os_cyl) === 0 &&
              Number(this.detailForm.os_axis) + Number(this.detailForm.os_cyl) !== 0
            ) {
              callback(new Error('左眼柱镜、轴位需要同时填写！'));
            }
            if (
              Number(this.detailForm.od_axis) * Number(this.detailForm.od_cyl) === 0 &&
              Number(this.detailForm.od_axis) + Number(this.detailForm.od_cyl) !== 0
            ) {
              callback(new Error('右眼柱镜、轴位需要同时填写！'));
            }
          }
          callback();
        }
      };
      return {
        IMAGE_URL: process.env.VUE_APP_IMG_URL,
        buttonText: '编辑验光单',
        has_prescription: false,
        editDialog: false,
        editAvailable: true,
        isImport: false,
        buttonImport: '导入',
        commerceitemId: '',
        selectPrescriptionId: '',
        prescriptionOptions: [],
        originForm: {},
        originData: {}, // 修改之前的数据，日志记录用
        detailForm: {
          source: '',
          prescription_name: '',
          date_of_prescription: '',
          pd_type: '',
          prescription_type_id: '',
          left_pd: '',
          right_pd: '',
          pd: '',
          od_sph: '0.00',
          od_cyl: '0.00',
          od_axis: '0',
          os_sph: '0.00',
          os_cyl: '0.00',
          os_axis: '0',
          nv_add: '',
          frame_name: '',
          frame_url: '',
          price: '',
          frame_price: '',
          lens_name: '',
          lens_price: '',
          addons: [],
          item_qty: '',
          import_type: '',
          lens_shape_sku: '',
          origin_total_money: '',
          total_discount_money: '',
          customer_prescription_image: '',
          frame_pd: '',
          frame_bridge: '',
          frame_temple_length: '',
          lens_height: '',
          lens_width: '',
        },
        sequenceNumber: '',
        rules: {
          pd_type: [{ required: true, validator: checkPd, trigger: 'none' }],
          prescription_type_id: [{ required: true, validator: checkPrescription, trigger: 'none' }],
          od_sph: [{ required: true, validator: checkData, trigger: 'none' }],
        },
        // orderItem: {},
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
      initData() {
        this.sequenceNumber = this.orderItem.sequenceNumber;
        this.orderItemData = this.orderItem;
        const prescription = this.orderItemData.prescription;
        const subitems = this.orderItemData.subitems;
        const frame = subitems.frame;
        const lens = subitems.len;
        this.commerceitemId = frame.commerceitem_id;
        this.detailForm.origin_total_money = this.orderItemData.origin_total_money; //item原价
        this.detailForm.total_money = this.orderItemData.total_money; //item实付金额
        this.detailForm.total_discount_money = `-${(
          parseFloat(this.orderItemData.origin_total_money) -
          parseFloat(this.orderItemData.total_money)
        ).toFixed(2)}`; //item优惠金额
        this.detailForm.item_qty = this.orderItemData.qty;
        this.detailForm.addons = subitems.addons;
        if (prescription && JSON.stringify(prescription) !== '{}') {
          this.has_prescription = true;
          this.detailForm.source = this.originData.source = prescription.source;
          this.detailForm.prescription_name = this.originData.prescription_name =
            prescription.prescription_name;
          this.detailForm.date_of_prescription = this.originData.date_of_prescription =
            prescription.date_of_prescription;
          this.detailForm.pd_type = this.originData.pd_type = prescription.pd_type;
          this.detailForm.prescription_type_id = this.originData.prescription_type_id =
            prescription.prescription_type_id;
          this.detailForm.left_pd = this.originData.left_pd = prescription.left_pd;
          this.detailForm.left_pd = handlePd(this.detailForm.left_pd);
          this.detailForm.right_pd = this.originData.right_pd = prescription.right_pd;
          this.detailForm.right_pd = handlePd(this.detailForm.right_pd);
          this.detailForm.pd = this.originData.pd = prescription.pd;
          // 瞳距数取整
          this.detailForm.pd = handlePd(this.detailForm.pd);
          this.detailForm.od_sph = this.originData.od_sph = prescription.od_sph;
          this.detailForm.od_cyl = this.originData.od_cyl = prescription.od_cyl;
          this.detailForm.od_axis = this.originData.od_axis = prescription.od_axis;
          this.detailForm.od_axis = String(parseInt(this.detailForm.od_axis));
          this.detailForm.os_sph = this.originData.os_sph = prescription.os_sph;
          this.detailForm.os_cyl = this.originData.os_cyl = prescription.os_cyl;
          this.detailForm.os_axis = this.originData.os_axis = prescription.os_axis;
          this.detailForm.os_axis = String(parseInt(this.detailForm.os_axis));
          this.detailForm.nv_add = this.originData.nv_add =
            prescription.nv_add === '0.00' ? '' : prescription.nv_add;
          this.detailForm.import_type = this.originData.import_type = prescription.import_type;
          this.detailForm.customer_prescription_image = prescription.customer_prescription_image;
          // 处理 '0' 和 '2' 均为完整验光单的情况
          this.detailForm.import_type === '1'
            ? (this.detailForm.import_type = '1')
            : (this.detailForm.import_type = '2');
        }
        this.detailForm.frame_name = frame.name;
        this.detailForm.frame_url = `${process.env.VUE_APP_IMG_URL}${frame.front_image}?x-oss-process=image/resize,w_100/quality,q_50`;
        this.detailForm.frame_price = frame.price;
        this.detailForm.lens_price = lens ? lens.price : '0.00';
        this.detailForm.lens_name = lens
          ? lens.len_package_name
            ? lens.len_package_name
            : lens.lens_index +
              ' 折射率，' +
              lens.package_type +
              '，' +
              (lens.color || lens.lens_color) +
              '，' +
              lens.coating_info.name
          : '无镜片（仅框架）';

        this.detailForm.external_reference_id = lens ? lens.external_reference_id : '无';

        // 镜片染色和镀膜
        this.detailForm.tint_ext_id = lens ? lens.tint_info.tint_ext_id : '无';
        this.detailForm.coating_ext_id = lens ? lens.coating_info.coating_ext_id : '无';
        this.detailForm.lens_shape_sku = frame.len_shape_sku || '无';
        this.detailForm.frame_pd = `${frame.min_pd} - ${frame.max_pd}`;
        this.detailForm.frame_bridge = frame.bridge;
        this.detailForm.frame_width = frame.frame_width;
        this.detailForm.frame_temple_length = frame.temple_length;
        this.detailForm.lens_height = frame.lens_height ? frame.lens_height : '无';
        this.detailForm.lens_width = frame.lens_width ? frame.lens_width : '无';
        this.detailForm.frame_temple_length = frame.temple_length;
        for (let item in this.detailForm) {
          this.originForm[item] = this.detailForm[item];
        }
      },
      edit() {
        this.editAvailable = !this.editAvailable;
        if (this.buttonText === '编辑验光单') {
          this.buttonText = '取消编辑';
        } else {
          this.buttonText = '编辑验光单';
          for (let item in this.detailForm) {
            this.detailForm[item] = this.originForm[item];
          }
          this.isImport = false;
          this.buttonImport = '导入';
          this.selectPrescriptionId = '';
        }
      },

      async update(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const sendData = {
              pd_type: this.detailForm.pd_type,
              prescription_type_id: this.detailForm.prescription_type_id,
              pd: this.detailForm.pd,
              od_sph: this.detailForm.od_sph,
              os_sph: this.detailForm.os_sph,
              od_cyl: this.detailForm.od_cyl,
              os_cyl: this.detailForm.os_cyl,
              od_axis: this.detailForm.od_axis,
              os_axis: this.detailForm.os_axis,
              import_type: this.detailForm.import_type,
              prescription_name: this.detailForm.prescription_name,
              source: this.detailForm.source,
              date_of_prescription: this.detailForm.date_of_prescription,
              left_pd: this.detailForm.left_pd,
              right_pd: this.detailForm.right_pd,
              nv_add: this.detailForm.nv_add,
            };
            if (this.detailForm.prescription_type_id === 'SingleVision') {
              delete sendData.nv_add;
            }
            const res = await orderApi.updateCommerceitemPrescription(
              sendData,
              this.commerceitemId,
              this.originData
            );
            if (res.errorCode === 0) {
              this.editAvailable = !this.editAvailable;
              this.buttonText = '编辑验光单';
              this.isImport = false;
              this.buttonImport = '导入';
              Message.success({
                message: '更新成功！',
                duration: 2000,
              });
              this.$emit('save-success', true);
            } else {
              Message.error({
                message: res.message,
                duration: 2000,
              });
            }
          } else {
            return false;
          }
        });
      },
      prescriptionTypeChange(type) {
        if (type === 'SingleVision') {
          this.detailForm.nv_add = '';
        } else if (type === 'FrameOnly') {
          const empty = {
            source: '',
            prescription_name: '',
            date_of_prescription: '',
            pd_type: '',
            left_pd: '',
            right_pd: '',
            pd: '',
            od_sph: '0.00',
            od_cyl: '0.00',
            od_axis: '0',
            os_sph: '0.00',
            os_cyl: '0.00',
            os_axis: '0',
            nv_add: '',
          };
          for (let item in empty) {
            this.detailForm[item] = empty[item];
          }
        }
      },
      importPrescription() {
        if (!this.isImport) {
          this.isImport = true;
          this.buttonImport = '取消导入';
          this.getCustomerPrescriptionList();
        } else {
          this.isImport = false;
          this.buttonImport = '导入';
          this.selectPrescriptionId = '';
        }
      },

      // 获取用户验光单
      async getCustomerPrescriptionList() {
        const res = await customerApi.getAllPrescriptionList({
          filter: { customer_id: this.customerId },
        });
        const result = res['data'][0]['items'];
        this.prescriptionOptions = [];
        for (const item of result) {
          if (this.detailForm.prescription_type_id === item.prescription_type_id) {
            this.prescriptionOptions.push({
              label: item.prescription_name,
              id: item.prescription_id,
              value: JSON.stringify({
                date_of_prescription: item.date_of_prescription,
                import_type: item.import_type,
                left_pd: item.left_pd,
                nv_add: item.nv_add,
                od_axis: item.od_axis,
                od_cyl: item.od_cyl,
                od_sph: item.od_sph,
                os_axis: item.os_axis,
                os_cyl: item.os_cyl,
                os_sph: item.os_sph,
                pd: item.pd,
                pd_type: item.pd_type,
                prescription_id: item.prescription_id,
                prescription_name: item.prescription_name,
                prescription_type_id: item.prescription_type_id,
                right_pd: item.right_pd,
                source: item.source,
              }),
            });
          }
        }
      },
      selectPrescription(data) {
        const tmp = JSON.parse(data);
        for (let item in tmp) {
          this.detailForm[item] = tmp[item];
        }
      },
    },
  };
</script>

<style>
  .input-style {
    width: 350px;
  }
</style>
