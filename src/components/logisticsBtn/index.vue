<template>
  <div class="logistics-container">
    <el-button :disabled="disabled" size="mini" type="primary" @click="getOrderRoutes(waybill)">
      {{ btnText }}
    </el-button>
    <el-dialog
      :title="btnText"
      :visible.sync="showDialog"
      width="40%"
      center
      append-to-body
      modal-append-to-body
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          reverse
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import expressApi from '@/api/express';
  export default {
    props: {
      waybill: {
        type: String,
        default: '',
      },
      company: {
        type: String,
        default: 'sf',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      btnText: {
        type: String,
        default: '物流信息',
      },
    },

    data() {
      return {
        activities: [],
        showDialog: false,
      };
    },

    computed: {},

    created() {},

    methods: {
      async getOrderRoutes(waybill) {
        this.showDialog = true;
        const { data } = await expressApi.getSFOrderRoutes(waybill);
        const res = data[0];
        let result = [];
        for (const item of res) {
          result.unshift({
            content: item['content'],
            timestamp: item['time'],
          });
        }
        this.activities = result;
      },
    },
    watch: {},
  };
</script>

<style lang="scss" scoped>
  .logistics-container {
    display: inline-block;
  }
</style>
