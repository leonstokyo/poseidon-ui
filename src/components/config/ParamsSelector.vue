<template>
  <div>
    <div
      v-for="(item, index) in paramsList"
      :key="index"
      style="display: flex; justify-content: space-between; width: 600px;margin-bottom: 5px"
    >
      <div style="width: 470px; display: flex; justify-content: flex-start">
        <div>
          <el-select
            :size="size"
            v-model="item.name"
            placeholder="请选择"
            @change="changeFirst(item)"
            style="width: 150px"
            clearable
          >
            <el-option
              v-for="item in nameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <div>
          <el-select
            :size="size"
            v-model="item.operator"
            placeholder=" "
            @change="changeOperator(item)"
            style="width: 150px"
            clearable
            :disabled="item.disabled"
          >
            <el-option
              v-for="item in operatorOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <div style="width: 200px" v-if="rangeNames.indexOf(item.name) === -1">
          <div>
            <el-select
              :size="size"
              v-model="item.value"
              placeholder="请选择"
              multiple
              @change="changeSecond"
              style="width: 200px"
              clearable
            >
              <el-option
                v-for="item in getNameOptions(item.name)"
                :key="item.value"
                :label="item.label"
                :value="String(item.value)"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div style="width: 200px" v-else>
          <div>
            <el-input
              :size="size"
              type="text"
              v-model="item.value"
              style="width: 200px"
              placeholder="范围以逗号分隔"
              @blur="changeSecond"
            ></el-input>
          </div>
        </div>
      </div>
      <div>
        <div style="margin-left: -40px">
          <el-button
            :size="size"
            type="primary"
            icon="el-icon-plus"
            @click="addItem"
            circle
            v-show="index === paramsList.length - 1"
          ></el-button>
          <el-button
            :size="size"
            type="danger"
            icon="el-icon-delete"
            @click="removeItem(index)"
            circle
            v-show="paramsList.length > 1 && index !== 0"
          ></el-button>
        </div>
      </div>
    </div>
    <span v-show="!dataValid" style="color: #ec0909">参数填写有误，将不会被保存！</span>
  </div>
</template>
<script>
  import options from '@/components/mixins/common/options';
  import { toHump } from '@/utils/tools';
  export default {
    name: 'ParamsSelector',
    mixins: [options],
    props: {
      params: {
        type: Array,
      },
      size: {
        type: String,
        default: 'medium',
      },
    },
    created() {
      this.initData();
    },
    data() {
      return {
        dataValid: true,
        paramsList: [
          {
            name: '',
            value: '',
            operator: '',
          },
        ],
        operatorOptions: [
          {
            label: '等于',
            value: 'eq',
          },
          {
            label: '范围',
            value: 'range',
          },
        ],
        rangeNames: ['price', 'news_from_date'],
        nameOptions: [
          {
            label: '人群',
            value: 'population',
          },
          {
            label: '价格',
            value: 'price',
          },
          {
            label: '颜色',
            value: 'color',
          },
          {
            label: '风格',
            value: 'occasion',
          },
          {
            label: '镜框形状',
            value: 'frame_shape_type',
          },
          {
            label: '框架类型',
            value: 'frame_type',
          },
          {
            label: '材质',
            value: 'material',
          },
          {
            label: '镜框类型',
            value: 'rim_type',
          },
          {
            label: '标签',
            value: 'tag',
          },
          {
            label: '分类',
            value: 'category_ids',
          },
          {
            label: '镜框匹配类型',
            value: 'frame_type_for_lens',
          },
        ],
      };
    },

    watch: {
      params(val) {
        this.paramsList = this.handleReceiveParams(val);
      },
    },
    methods: {
      addItem() {
        this.paramsList.push({
          name: '',
          value: '',
          operator: '',
        });
      },
      removeItem(index) {
        this.paramsList.splice(index, 1);
        // 这里需要检测，剩下的item数据是否完整
        this.dataValid = true;
        for (const item of this.paramsList) {
          if (item.name && item.value && item.operator) {
            if (Array.isArray(item.value) && item.value.length === 0) {
              this.dataValid = false;
            }
            if (item.operator === 'range') {
              const tmp2 = item.value.split(',');
              if (!tmp2[0] || !tmp2[1] || isNaN(tmp2[0]) || isNaN(tmp2[1])) {
                this.dataValid = false;
              }
            }
          } else if (item.name) {
            this.dataValid = false;
          }
        }
        this.$emit('change-option', { data: this.paramsList, valid: this.dataValid });
      },
      handleReceiveParams(params) {
        if (params && params.length === 0) {
          params = [
            {
              name: '',
              value: '',
              operator: '',
            },
          ];
        }
        for (let item of params) {
          if (item.operator === 'eq' && this.rangeNames.indexOf(item.name) === -1) {
            item.disabled = true;
          } else if (item.operator === 'range') {
            item.disabled = true;
            if (typeof item.value === 'object') {
              let tmp = [];
              tmp[0] = item.value.from;
              tmp[1] = item.value.to;
              item.value = tmp.join(',');
            }
          }
        }
        return params;
      },
      handleSendParams() {
        const sendParamsList = JSON.parse(JSON.stringify(this.paramsList));
        let tmp = [];
        this.dataValid = true;
        for (const item of sendParamsList) {
          delete item.disabled;
          if (item.name && item.value && item.operator) {
            if (Array.isArray(item.value) && item.value.length === 0) {
              this.dataValid = false;
            }
            if (item.operator === 'eq') {
              tmp.push(item);
            } else if (item.operator === 'range') {
              const tmp2 = item.value.split(',');
              if (!tmp2[0] || !tmp2[1] || isNaN(tmp2[0]) || isNaN(tmp2[1])) {
                this.dataValid = false;
                tmp.push(item);
              } else {
                item.value = {
                  from: tmp2[0],
                  to: tmp2[1],
                };
                tmp.push(item);
              }
            }
          } else if (item.name) {
            tmp.push(item);
            this.dataValid = false;
          }
        }
        return tmp;
      },
      getNameOptions(name) {
        if (name === 'category_ids') {
          return this.frameCategoryOptions;
        } else {
          return this[`${toHump(name)}Options`];
        }
      },
      changeFirst(item) {
        if (this.rangeNames.indexOf(item.name) === -1) {
          item.operator = 'eq';
          item.disabled = true;
          item.value = [];
        } else {
          item.operator = 'range';
          item.disabled = true;
          item.value = '';
        }
        const data = this.handleSendParams();
        this.$emit('change-option', { data, valid: this.dataValid });
      },
      changeOperator(item) {
        item.value;
      },
      changeSecond() {
        const data = this.handleSendParams();
        this.$emit('change-option', { data, valid: this.dataValid });
      },
      // 获取标签组映射关系
      async initData() {
        this.paramsList = this.handleReceiveParams(this.params);
        await this.getAttributesByName();
      },
    },
  };
</script>
