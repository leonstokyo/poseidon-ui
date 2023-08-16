<template>
  <div class="form-item">
    <el-input v-if="isInput" v-model="currentVal" v-bind="bindProps" v-on="bindEvents"></el-input>

    <el-input-number
      v-if="isInputNumber"
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
      :controls-position="itemOptions['controls-position'] || 'right'"
    ></el-input-number>

    <el-select v-if="isSelect" v-model="currentVal" v-bind="bindProps" v-on="bindEvents" clearable>
      <el-option
        v-for="item in itemOptions.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>

    <!-- datetimerange/daterange -->
    <el-date-picker
      v-if="isDatePickerDateRange"
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
      :type="itemOptions.type || 'datetimerange'"
      clearable
      :picker-options="pickerOptionsRange"
      start-placeholder="开始日期"
      range-separator="至"
      end-placeholder="结束日期"
      :default-time="['00:00:00', '23:59:59']"
      value-format="yyyy-MM-dd HH:mm:ss"
    ></el-date-picker>

    <!-- antd range picker -->

    <a-range-picker
      v-if="isAntdDatePickerDateRange"
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
      format="YYYY-MM-DD"
      size="large"
      @calendarChange="calendarChange"
      :disabled-date="disabledDate"
      valueFormat="YYYY-MM-DD"
    />

    <!-- monthrange -->
    <el-date-picker
      v-if="isDatePickerMonthRange"
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
      type="monthrange"
      clearable
      :picker-options="pickerOptionsRangeMonth"
      start-placeholder="开始日期"
      range-separator="至"
      end-placeholder="结束日期"
      value-format="yyyy-MM"
    ></el-date-picker>

    <!-- others -->
    <el-date-picker
      v-if="isDatePickerOthers"
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
      :type="itemOptions.type"
      clearable
      placeholder="请选择日期"
    ></el-date-picker>

    <el-cascader
      v-if="isCascader"
      v-model="currentVal"
      v-bind="bindProps"
      v-on="bindEvents"
      clearable
    ></el-cascader>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    inheritAttrs: false,

    props: {
      value: {},
      itemOptions: {
        type: Object,
        default() {
          return {};
        },
      },
    },

    data() {
      return {
        changeDate: [],
        pickerOptionsRange: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                let end = moment()
                  .endOf('day')
                  .toString();
                let start = moment()
                  .startOf('day')
                  .toString();
                end = new Date(end);
                start = new Date(start);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              },
            },
          ],
        },
        pickerOptionsRangeMonth: {
          shortcuts: [
            {
              text: '今年至今',
              onClick(picker) {
                const end = new Date();
                const start = new Date(new Date().getFullYear(), 0);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近半年',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 6);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近一年',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 12);
                picker.$emit('pick', [start, end]);
              },
            },
          ],
        },
      };
    },

    computed: {
      // 双向绑定数据值
      currentVal: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        },
      },
      // 绑定属性
      bindProps() {
        let obj = { ...this.itemOptions };
        // 移除冗余属性
        delete obj.label;
        delete obj.prop;
        delete obj.element;
        delete obj.initValue;
        delete obj.rules;
        delete obj.events;
        if (obj.element === 'el-select') {
          delete obj.options;
        }
        return obj;
      },
      // 绑定方法
      bindEvents() {
        return this.itemOptions.events || {};
      },
      // el-input
      isInput() {
        return this.itemOptions.element === 'el-input';
      },
      // el-input-number
      isInputNumber() {
        return this.itemOptions.element === 'el-input-number';
      },
      // el-select
      isSelect() {
        return this.itemOptions.element === 'el-select';
      },
      // el-date-picker (type: datetimerange/daterange)
      isDatePickerDateRange() {
        const isDatePicker = this.itemOptions.element === 'el-date-picker';
        const isDateRange =
          !this.itemOptions.type ||
          this.itemOptions.type === 'datetimerange' ||
          this.itemOptions.type === 'daterange';
        return isDatePicker && isDateRange;
      },

      isAntdDatePickerDateRange() {
        const isAntdDatePicker = this.itemOptions.element === 'a-range-picker';
        return isAntdDatePicker;
      },

      // el-date-picker (type: monthrange)
      isDatePickerMonthRange() {
        const isDatePicker = this.itemOptions.element === 'el-date-picker';
        const isMonthRange = this.itemOptions.type === 'monthrange';
        return isDatePicker && isMonthRange;
      },
      // el-date-picker (type: other)
      isDatePickerOthers() {
        const isDatePicker = this.itemOptions.element === 'el-date-picker';
        return isDatePicker && !this.isDatePickerDateRange && !this.isDatePickerMonthRange;
      },
      // el-cascader
      isCascader() {
        return this.itemOptions.element === 'el-cascader';
      },
    },

    created() {},

    methods: {
      calendarChange(date) {
        this.changeDate = date;
      },
      disabledDate(current) {
        // Can not select days before today and today
        if (this.changeDate.length === 1) {
          const firstDate = this.changeDate[0];
          return (
            current < moment(firstDate).subtract(1, 'month') ||
            current > moment(firstDate).add(1, 'month')
          );
        } else {
          return false;
        }
      },
    },

    components: {},
  };
</script>

<style lang="scss" scoped>
  .form-item {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
</style>
