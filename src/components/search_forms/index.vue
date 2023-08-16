<template>
  <div>
    <el-form :model="formData" ref="formRef" :inline="true" class="search-form">
      <el-row type="flex">
        <el-col :span="24" :md="20">
          <el-row type="flex">
            <el-col
              v-for="(item, index) in formOptions"
              :key="newKeys[index]"
              :span="6 * (item.rowspan || 1)"
              :lg="4 * (item.rowspan || 1)"
              :xl="3 * (item.rowspan || 1)"
            >
              <el-form-item
                :prop="item.prop"
                :label="item.label ? item.label : ''"
                :rules="item.rules"
              >
                <formItem v-model="formData[item.prop]" :itemOptions="item" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4">
          <el-form-item label=" ">
            <el-button
              v-if="btnItems.includes('search')"
              type="primary"
              class="btn-search"
              @click="onSearch"
            >
              搜索
            </el-button>

            <el-button
              v-if="btnItems.includes('reset')"
              type="default"
              class="btn-reset"
              @click="onReset"
            >
              重置
            </el-button>
          </el-form-item>
          <slot name="extra-export"></slot>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import formItem from './formItem';
  import tools from '@/utils/tools';

  export default {
    props: {
      /**
       * 表单配置
       * 示例：
       * [{
       * label: '用户名', // label文字
       * prop: 'username', // 字段名
       * element: 'el-input', // 指定elementui组件
       * initValue: '阿黄', // 字段初始值
       * placeholder: '请输入用户名', // elementui组件属性
       * rules: [{ required: true, message: '必填项', trigger: 'blur' }], // elementui组件属性
       * events: { // elementui组件方法
       *  input (val) {
       *  console.log(val)
       *  },
       *  ...... // 可添加任意elementui组件支持的方法
       * }
       * ...... // 可添加任意elementui组件支持的属性
       * }]
       */
      formOptions: {
        type: Array,
        required: true,
        default() {
          return [];
        },
      },
      // 提交按钮项，多个用逗号分隔（query, export, reset）
      btnItems: {
        type: String,
        default() {
          return 'search,reset';
        },
      },
    },

    data() {
      return {
        formData: {},
        showForm: true,
      };
    },

    computed: {
      newKeys() {
        return this.formOptions.map((v) => {
          return this.createUniqueString();
        });
      },
    },

    created() {
      this.addInitValue();
    },

    methods: {
      createUniqueString() {
        const timestamp = +new Date() + '';
        const randomNum = parseInt((1 + Math.random()) * 65536) + '';
        return (+(randomNum + timestamp)).toString(32);
      },

      // 搜索
      async onSearch() {
        const valid = this.$refs.formRef.validate();
        if (valid) {
          await this.updateFilter(this.formData);
          this.$emit('onSearch', this.formData);
        }
      },
      async updateFilter(filter = {}, currentPage = 1) {
        let newQuery = {
          ...filter,
          currentPage: currentPage,
        };

        let needSearch = JSON.stringify(newQuery) != JSON.stringify(this.$route.query);
        if (needSearch) {
          await this.$router.push({ query: newQuery });
        }
      },

      onReset() {
        const obj = {};
        this.formOptions.forEach((v) => {
          if (v.initValue !== undefined) {
            obj[v.prop] = undefined;
          }
        });
        this.formData = obj;
      },
      // 添加初始值
      addInitValue() {
        const obj = {};
        this.formOptions.forEach((v) => {
          if (v.initValue !== undefined) {
            obj[v.prop] = v.initValue;
          }
        });
        this.formData = obj;
      },
      reload(newData) {
        const obj = {};
        newData.forEach((v) => {
          if (v.initValue !== undefined) {
            obj[v.prop] = v.initValue;
          }
        });
        this.formData = obj;
      },
      getFormData() {
        return this.formData;
      },
    },

    components: { formItem },
    watch: {
      $route: function() {
        this.$emit('getData');
        this.reload(this.formOptions);
      },
    },
  };
</script>

<style lang="scss" scoped></style>
