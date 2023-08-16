<template>
  <div style="width: 94%; margin-left: 3%" v-if="canDo('lens_packages-index')">
    <div style="display: flex; justify-content: space-between">
      <span>镜片套餐列表</span>
      <el-button @click="addLensPackageDialog" v-if="canDo('lens_packages-create')">新增</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" border v-if="tintContent != ''">
      <el-table-column prop="package_name" label="套餐名称"></el-table-column>
      <el-table-column prop="scenario" label="镜片类别"></el-table-column>
      <el-table-column prop="package_price" label="套餐价格"></el-table-column>
      <el-table-column prop="max_sph" label="适用度数">
        <div slot-scope="{ row }">{{ row.min_sph }} ~ {{ row.max_sph }}</div>
      </el-table-column>
      <el-table-column
        min-width="120"
        prop="prescription_type_id_label"
        label="支持验光单类型"
      ></el-table-column>
      <el-table-column prop="status" label="是否上架">
        <div slot-scope="{ row }">
          {{ ['下架', '上架'][parseInt(row.status)] }}
        </div>
      </el-table-column>

      <el-table-column prop="max_sph" label="是否推荐">
        <div slot-scope="{ row }">
          {{ ['否', '是'][parseInt(row.is_commanded)] }}
        </div>
      </el-table-column>
      <el-table-column min-width="100" prop="lens_code" label="镜片code"></el-table-column>
      <el-table-column prop="lens_index" label="折射率"></el-table-column>
      <el-table-column prop="tint_ext_id">
        <template slot="header">
          染色
          <el-tooltip placement="top">
            <template slot="content">
              <div v-html="tintContent"></div>
            </template>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="coating_ext_id">
        <template slot="header">
          镀膜
          <el-tooltip placement="top">
            <template slot="content">
              <div v-html="coatingContent"></div>
            </template>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" minWidth="200">
        <div slot-scope="{ row }">
          <el-button
            v-if="canDo('lens_packages-show')"
            size="mini"
            @click="editLensPackage(row.len_package_id)"
            type="primary"
          >
            编辑/查看
          </el-button>
          <el-button
            v-if="canDo('lens_packages-delete')"
            @click="deleteLensPackage(row.len_package_id)"
            size="mini"
            type="primary"
          >
            删除
          </el-button>
        </div>
      </el-table-column>
    </el-table>

    <el-dialog width="700px" :visible.sync="lensPackageDialogVisible" :show-close="false">
      <span slot="footer" class="dialog-footer">
        <el-form
          ref="packageForm"
          size="mini"
          label-width="130px"
          style="width: 300px"
          label-suffix=":"
          :model="packageForm"
          :rules="packageRules"
        >
          <el-form-item label="选择镜片套餐">
            <div
              style="width: 800px; display: flex; justify-content: start"
              v-if="packageForm.lens_code"
            >
              {{ packageForm.title }}
              <a @click="openDrawer" style="color: #0099a8; margin-left: 10px">重新选择</a>
            </div>

            <div style="width: 250px; display: flex; justify-content: start" v-else>
              <a @click="openDrawer" style="color: #0099a8">选择镜片套餐</a>
            </div>
          </el-form-item>
          <el-form-item label="镜片code" prop="lens_code">
            <el-input v-model="packageForm.lens_code" style="width: 250px" disabled></el-input>
          </el-form-item>
          <el-form-item label="折射率" prop="lens_index">
            <el-input v-model="packageForm.lens_index" style="width: 250px" disabled></el-input>
          </el-form-item>
          <el-form-item label="颜色" prop="lens_color">
            <el-input v-model="packageForm.lens_color" style="width: 250px" disabled></el-input>
          </el-form-item>
          <el-form-item label="染色(code)" prop="tint_ext_id">
            <el-input v-model="packageForm.tint_label" style="width: 250px" disabled></el-input>
          </el-form-item>
          <el-form-item label="镀膜(code)" prop="coating_ext_id">
            <el-input v-model="packageForm.coating_label" style="width: 250px" disabled></el-input>
          </el-form-item>
          <el-form-item label="支持验光单类型" prop="prescription_type_id_label">
            <el-input
              disabled
              v-model="packageForm.prescription_type_id_label"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <el-form-item label="套餐名称" prop="package_name">
            <el-input
              placeholder="请输入套餐名称，最长30字符"
              type="textarea"
              v-model="packageForm.package_name"
              style="width: 250px"
              :autosize="{ minRows: 3, maxRows: 6 }"
              :maxlength="30"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="套餐分类" prop="scenario">
            <el-select style="width: 250px" v-model="packageForm.scenario" placeholder="请选择">
              <el-option
                v-for="item in scenarioOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="套餐价格" prop="package_price">
            <div style="display: flex; justify-content: start">
              <el-input-number
                placeholder="请输入套餐价格"
                v-model="packageForm.package_price"
                :precision="2"
                :step="1"
                :min="0"
              ></el-input-number>
            </div>
          </el-form-item>
          <el-form-item
            label="适用度数"
            prop="max_sph"
            v-if="packageForm.prescription_type_id !== 'nonPrescription'"
          >
            <div style="display: flex; justify-content: space-between; width: 250px">
              <el-input
                v-model="packageForm.min_sph"
                style="width: 100px"
                placeholder="适用度数"
              ></el-input>
              ～
              <el-input
                v-model="packageForm.max_sph"
                style="width: 100px"
                placeholder="适用度数"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item
            label="镜片形状"
            prop="lens_shape_code"
            v-if="frameInfo.rim_type === '无框'"
          >
            <el-input
              v-model="packageForm.lens_shape_code"
              disabled
              style="width: 250px"
            ></el-input>
            <div style="width: 550px; margin-left: -60px; margin-top: 5px">
              <el-row>
                <el-col :span="4" v-for="(item, index) in lensShapeImage">
                  <div
                    @click="choseImg(item, index)"
                    style="width: 84px; border: 1px solid #f4f7f9"
                  >
                    <div style="display: flex; justify-content: start; margin-bottom: -7px">
                      <span style="font-size: 3px">{{ item.name }}</span>
                    </div>
                    <el-image :src="item.lens_shape_img" style="width: 80px"></el-image>
                    <div style="display: flex; justify-content: center; margin-top: -10px">
                      <div style="width: 70%; display: flex; justify-content: space-between">
                        <span style="font-size: 3px">宽{{ item.lens_width }}</span>
                        <span style="font-size: 3px">高{{ item.lens_height }}</span>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <el-form-item label="是否作为推荐" prop="is_commanded">
            <el-select style="width: 250px" v-model="packageForm.is_commanded" placeholder="请选择">
              <el-option
                v-for="item in commandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否上架" prop="status">
            <el-select style="width: 250px" v-model="packageForm.status" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              placeholder="请输入备注，最多200字"
              v-model="packageForm.remark"
              style="width: 250px"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              :maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item>
            <div style="display: flex;">
              <!--justify-content: space-between-->
              <el-button style="margin-left:70px;" @click="cancel">取消</el-button>
              <el-button
                type="primary"
                @click="createLensPackage('packageForm')"
                v-if="isNew && canDo('lens_packages-create')"
              >
                创建
              </el-button>
              <el-button
                type="primary"
                @click="updateLensPackage('packageForm')"
                v-if="!isNew && canDo('lens_packages-update')"
              >
                保存
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </span>
    </el-dialog>
    <el-drawer size="60%" :visible.sync="drawer" direction="rtl">
      <div style="margin-left: 30px">
        <lens @lens-data="prepareFillFormData" :outer="true"></lens>
      </div>
      <div style="display: flex; justify-content: center; margin-bottom: 100px">
        <div style="width:50%; display: flex; justify-content: space-between; margin-top: 100px">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="fillForm">确定</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  import lensPackageV1Api from '@/api/V1/lens_package';
  import { Message } from 'element-ui';
  import Lens from '@/views/product/lens/index';
  import { mapGetters } from 'vuex';

  export default {
    components: {
      Lens,
    },
    props: {
      frameInfo: {
        type: Object,
        required: true,
      },
    },
    created() {
      this.getLensShapeInfo();
      this.getAttributesMap();
    },
    computed: {
      ...mapGetters('permission', {
        canDo: 'canDo',
        isAdmin: 'isAdmin',
      }),
    },
    data() {
      return {
        tintContent: '',
        isNew: true,
        lensPackageDialogVisible: false,
        pagination: {
          pageSize: 10,
          currentPage: 1,
          total: 100,
        },
        drawer: false,
        statusOptions: [
          {
            label: '是',
            value: '1',
          },
          {
            label: '否',
            value: '0',
          },
        ],
        commandOptions: [
          {
            label: '是',
            value: '1',
          },
          {
            label: '否',
            value: '0',
          },
        ],
        scenarioOptions: [
          {
            label: '高清树脂镜片',
            value: '0',
          },
          {
            label: 'Blokz®防蓝光镜片',
            value: '1',
          },
          {
            label: 'Blokz®防蓝光变色镜片',
            value: '2',
          },
          {
            label: 'Transitions®变色镜片',
            value: '3',
          },
          {
            label: '高清染色树脂镜片',
            value: '4',
          },
          {
            label: 'Blokz®防蓝光染色镜片',
            value: '5',
          },
          {
            label: '安全驾驶偏光片',
            value: '6',
          },
          {
            label: '透明镜片',
            value: '7',
          },
          {
            label: '染色镜片',
            value: '8',
          },
          {
            label: '防蓝光镜片',
            value: '9',
          },
          {
            label: '防蓝光染色镜片',
            value: '10',
          },
        ],
        scenarioMaping: {
          '0': '高清树脂镜片',
          '1': 'Blokz®防蓝光镜片',
          '2': 'Blokz®防蓝光变色镜片',
          '3': 'Transitions®变色镜片',
          '4': '高清染色树脂镜片',
          '5': 'Blokz®防蓝光染色镜片',
          '6': '安全驾驶偏光片',
          '7': '透明镜片',
          '8': '染色镜片',
          '9': '防蓝光镜片',
          '10': '防蓝光染色镜片',
        },
        prescriptionMapping: {
          nonPrescription: '平光',
          SingleVision: '单光',
          Progressive: '渐进',
        },
        packageRules: {
          lens_code: [{ required: true, message: '请输入镜片code' }],
          lens_index: [{ required: true, message: '请输入镜片折射率' }],
          lens_color: [{ required: true, message: '请输入镜片颜色' }],
          tint_ext_id: [{ required: true, message: '请输入染色code' }],
          coating_ext_id: [{ required: true, message: '请输入镜片镀膜code' }],
          prescription_type_id_label: [{ required: true, message: '请输入验光单类型' }],
          package_name: [{ required: true, message: '请输入套餐名称' }],
          scenario: [{ required: true, message: '请选择套餐分类' }],
          package_price: [{ required: true, message: '请输入套餐价格' }],
          min_sph: [{ required: true, message: '请输入适用度数' }],
          max_sph: [{ required: true, message: '请输入适用度数' }],
          is_commanded: [{ required: true, message: '请选择是否推荐' }],
          status: [{ required: true, message: '请选择是否推荐' }],
          lens_shape_code: [{ required: true, message: '请选择片形' }],
        },
        packageForm: {
          lens_code: '',
          lens_index: '',
          lens_color: '',
          tint_ext_id: '',
          coating_ext_id: '',
          prescription_type_id: '',
          prescription_type_id_label: '',
          package_name: '',
          scenario: '',
          package_price: '',
          max_sph: '',
          min_sph: '',
          lens_shape_code: '',
          is_commanded: '0',
          status: '0',
          remark: '',
        },
        lensShapeImage: [],
        tableData: [],
        tintMap: {},
        coatingMap: {},
        isActive: false,
        coatingContent: '',
        fillData: '',
      };
    },
    watch: {
      frameInfo: {
        async handler(val) {
          if (val.frame_configure_id) {
            console.log(val.frame_configure_id);
            this.initList(val.frame_configure_id);
          }
        },
        deep: true,
      },
      tintMap: {
        async handler(val) {
          for (const item in val) {
            if (item != '0') {
              this.tintContent += `${val[item]['color']}:${val[item]['tint_ext_id']}<br>`;
            }
          }
        },
        deep: true,
      },
      coatingMap: {
        async handler(val) {
          for (const item in val) {
            if (item != '0') {
              this.coatingContent += `${val[item]['name']}:${val[item]['coating_ext_id']}<br>`;
            }
          }
        },
        deep: true,
      },
    },
    methods: {
      openDrawer() {
        this.drawer = true;
      },
      prepareFillFormData(data) {
        this.fillData = data;
      },
      fillForm() {
        const data = this.fillData;
        this.$refs['packageForm'].resetFields();
        this.packageForm.min_sph = '';
        this.packageForm.lens_shape_code = '';
        this.packageForm.coating_ext_id = data.coating_ext_id;
        this.packageForm.tint_ext_id = data.tint_ext_id;
        this.packageForm.lens_code = data.external_reference_id;
        this.packageForm.lens_color = data.lens_color;
        this.packageForm.lens_index = data.lens_index;
        this.packageForm.prescription_type_id = data.prescription_type_id;
        this.packageForm.prescription_type_id_label = data.prescription_type_id_label;
        this.packageForm.package_price = data.price;
        this.packageForm.lens_simple_id = data.id;
        this.packageForm.lens_simple_sku = data.sku;
        this.drawer = false;

        this.packageForm.title = `${data.lens_index}折射率，${this.tintMap[data.tint_ext_id][
          'name'
        ] || data.lens_color}，${this.coatingMap[data.coating_ext_id]['name']}，${data.sku}`;
        this.packageForm.tint_label =
          data.tint_ext_id != '0'
            ? `${this.tintMap[data.tint_ext_id]['color']}(${data.tint_ext_id})`
            : '0';
        this.packageForm.coating_label = `${this.coatingMap[data.coating_ext_id]['name']}(${
          data.coating_ext_id
        })`;
      },
      choseImg(item, index) {
        this.isActive = index;
        this.packageForm.lens_shape_code = item.sku_id;
      },
      async getLensShapeInfo() {
        this.lensShapeImage = (await lensPackageV1Api.getLensShapeInfo())['data'];
      },
      async initList(frame_configure_id) {
        console.log(this.canDo('lens_packages-index'));
        if (this.canDo('lens_packages-index')) {
          const { data } = await lensPackageV1Api.getList(frame_configure_id);
          const res = data[0]['len_package_list'];
          this.tableData = [];
          for (const item of res) {
            this.tableData.push({
              len_package_id: item.len_package_id,
              package_name: item.name,
              scenario: this.scenarioMaping[item.scenario],
              package_price: item.price,
              min_sph: item.min_sph,
              max_sph: item.max_sph,
              prescription_type_id: item.len.prescription_type_id,
              prescription_type_id_label: this.prescriptionMapping[item.len.prescription_type_id],
              status: item.status,
              lens_code: item.len.external_reference_id,
              lens_index: item.len.lens_index,
              tint_ext_id: item.len.tint_ext_id,
              coating_ext_id: item.len.coating_ext_id,
              is_commanded: item.is_recommend,
            });
          }
        }
      },
      async createLensPackage(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.packageForm.frame_configure_id = this.frameInfo.frame_configure_id;
            this.packageForm.frame_configure_sku = this.frameInfo.frame_configure_sku;
            lensPackageV1Api
              .create(this.packageForm)
              .then((res) => {
                if (res['errorCode'] === 0) {
                  Message.success({
                    message: '更新成功！',
                    duration: 2000,
                  });
                  this.lensPackageDialogVisible = false;
                  this.initList(this.frameInfo.frame_configure_id);
                } else {
                  Message.error({
                    message: res['message'],
                    duration: 2000,
                  });
                }
              })
              .finally(() => {
                this.btnLoading = false;
              });
          } else {
            this.btnLoading = false;
            return false;
          }
        });
      },

      async updateLensPackage(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.packageForm.frame_configure_id = this.frameInfo.frame_configure_id;
            this.packageForm.frame_configure_sku = this.frameInfo.frame_configure_sku;
            lensPackageV1Api
              .update(this.packageForm, this.packageForm.len_package_id)
              .then((res) => {
                if (res['errorCode'] === 0) {
                  Message.success({
                    message: '更新成功！',
                    duration: 2000,
                  });
                  this.lensPackageDialogVisible = false;
                  this.initList(this.frameInfo.frame_configure_id);
                } else {
                  Message.error({
                    message: res['message'],
                    duration: 2000,
                  });
                }
              })
              .finally(() => {
                this.btnLoading = false;
              });
          } else {
            this.btnLoading = false;
            return false;
          }
        });
      },
      async deleteLensPackage(id) {
        lensPackageV1Api.delete(id).then(({ errorCode, message }) => {
          if (errorCode === 0) {
            Message.success({
              message: '删除成功',
              duration: 2000,
            });
            this.initList(this.frameInfo.frame_configure_id);
          } else {
            Message.error({
              message,
              duration: 2000,
            });
          }
        });
      },
      async editLensPackage(id) {
        this.isNew = false;
        this.lensPackageDialogVisible = true;
        const { data } = await lensPackageV1Api.getItem(id);
        const lensPackageItem = data['item'][0]['len_package'];
        this.packageForm.len_package_id = id;
        this.packageForm.lens_code = lensPackageItem.len.external_reference_id;
        this.packageForm.lens_index = lensPackageItem.len.lens_index;
        this.packageForm.lens_color = lensPackageItem.len.lens_color;
        this.packageForm.tint_ext_id = lensPackageItem.len.tint_ext_id;
        this.packageForm.tint_label =
          lensPackageItem.len.tint_ext_id != '0'
            ? `${this.tintMap[lensPackageItem.len.tint_ext_id]['color']}(${
                lensPackageItem.len.tint_ext_id
              })`
            : '0';
        this.packageForm.coating_ext_id = lensPackageItem.len.coating_ext_id;
        this.packageForm.coating_label = `${
          this.coatingMap[lensPackageItem.len.coating_ext_id]['name']
        }(${lensPackageItem.len.coating_ext_id})`;
        this.packageForm.prescription_type_id = lensPackageItem.len.prescription_type_id;
        this.packageForm.prescription_type_id_label = this.prescriptionMapping[
          lensPackageItem.len.prescription_type_id
        ];
        this.packageForm.package_name = lensPackageItem.name;
        this.packageForm.scenario = lensPackageItem.scenario;
        this.packageForm.package_price = lensPackageItem.price;
        this.packageForm.max_sph = lensPackageItem.max_sph;
        this.packageForm.min_sph = lensPackageItem.min_sph;
        this.packageForm.lens_shape_code = lensPackageItem.len_shape_sku;
        this.packageForm.is_commanded = lensPackageItem.is_recommend;
        this.packageForm.status = lensPackageItem.status;
        this.packageForm.remark = lensPackageItem.remark;
        this.packageForm.title = `${lensPackageItem.len.lens_index}折射率，${
          this.scenarioMaping[lensPackageItem.scenario]
        }，${this.tintMap[lensPackageItem.len.tint_ext_id]['name'] ||
          lensPackageItem.len.lens_color}，${
          this.coatingMap[lensPackageItem.len.coating_ext_id]['name']
        }，${lensPackageItem.len_simple_sku}`;
        this.packageForm.lens_simple_id = lensPackageItem.len_simple_id;
        this.packageForm.lens_simple_sku = lensPackageItem.len_simple_sku;
      },
      addLensPackageDialog() {
        this.$refs['packageForm'].resetFields();
        this.packageForm.lens_shape_code = '';
        this.lensPackageDialogVisible = true;
      },
      cancel() {
        this.lensPackageDialogVisible = false;
      },
      async getAttributesMap() {
        const { data } = await lensPackageV1Api.getAttributesMap();
        this.tintMap = data[0]['tint_map'];
        this.coatingMap = data[0]['coating_map'];
      },
    },
  };
</script>

<style>
  .active {
    border: 1px solid #0099a8;
  }
</style>
