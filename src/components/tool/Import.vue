<template>
  <el-upload
    class="upload-demo"
    ref="upload"
    :action="action"
    :show-file-list="false"
    :with-credentials="withCredentials"
    :before-upload="beforeLoad"
    :on-success="handleSuccess"
    :on-error="handleError"
    :disabled="!usable"
    :auto-upload="true"
  >
    <el-button :disabled="!usable" slot="trigger" :loading="is_loading" size="small" type="primary">
      {{ name }}
    </el-button>
  </el-upload>
</template>
<script>
  export default {
    props: {
      route: String,
      full_route: String,
      name: {
        type: String,
        default: '选取文件',
      },
      usable: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        is_loading: false,
        withCredentials: true,
        action: this.full_route
          ? `${process.env.VUE_APP_BASE_API}${this.full_route}`
          : `${process.env.VUE_APP_BASE_API}/upload/${this.route}`,
      };
    },
    watch: {
      usable(val) {
        this.usable = val;
      },
    },
    created() {},
    methods: {
      beforeLoad() {
        this.is_loading = true;
      },
      handleError() {
        this.is_loading = false;
      },
      handleSuccess(res, file) {
        this.is_loading = false;
        this.$emit('upload-success', res);
      },
    },
  };
</script>
