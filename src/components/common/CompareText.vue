<template>
  <div class="compare-min-height">
    <span v-if="!isDifferent">
      {{ current || '' }}
    </span>
    <el-popover
      class="compare-min-height d-block"
      v-else
      placement="top-start"
      width="200"
      trigger="hover"
      :content="String(origin) || '空'"
    >
      <span style="color: #ec0909;" class="d-block compare-min-height" slot="reference">
        {{ current || '' }}
      </span>
    </el-popover>
  </div>
</template>

<script>
  export default {
    props: {
      origin: {
        type: [Number, String],
        default: '',
      },
      current: {
        type: [Number, String],
        default: '',
      },
    },
    computed: {
      isDifferent: function() {
        return this.origin !== this.current;
      },
    },
  };
</script>

<style scoped>
  .compare-min-height {
    width: 100%;
    height: 100%;
    min-height: 20px;
  }
</style>
