<template>
  <div>
    <el-upload
      :action="action"
      list-type="picture-card"
      :on-success="handleSuccess"
      :on-preview="handlePictureCardPreview"
      :multiple="false"
      :limit="1"
      :with-credentials="withCredentials"
      :file-list="list"
      style="height: 90px; width: 90px; overflow: hidden"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" style="width: 90%; margin-left: -20%">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
  const ACTION_ORIGIN = `${process.env.VUE_APP_BASE_API}/ossUpload/putImage`;
  export default {
    props: {
      imageSrc: {
        type: String,
        default: '',
      },
      route: {
        type: String,
        default: 'admin',
      },
    },
    created() {
      this.action = ACTION_ORIGIN + `?route=${this.route}`;

      if (this.imageSrc) {
        this.list.push({
          url: process.env.VUE_APP_IMG_URL + this.imageSrc,
        });
      }
    },
    watch: {
      imageSrc(val) {
        // this.name = this.handleName(val);
        // this.action = ACTION_ORIGIN + `?name=${this.name}`
        this.action = ACTION_ORIGIN + `?route=${this.route}`;
        this.list = [];
        this.list.push({
          url: process.env.VUE_APP_IMG_URL + val,
        });
      },
    },
    data() {
      return {
        list: [],
        dialogImageUrl: '',
        name: '1',
        dialogVisible: false,
        withCredentials: true,
        action: '',
      };
    },
    methods: {
      async handleSuccess(res, file) {
        file.url = res.data.url;
        const imageUrl = res.data.url.substring(res.data.url.indexOf('com') + 4);

        const name = this.handleName(this.imageSrc);
        this.$emit(
          'upload-success',
          JSON.stringify({
            url: imageUrl,
            name,
          })
        );
      },
      handleName(url) {
        let tmp1 = url.match(/.com\/(\S*)\?/);
        let tmp2 = url.match(/.com\/(\S*)/);
        let result = '';
        if (tmp1) {
          result = tmp1[1];
        } else if (tmp2) {
          result = tmp2[1];
        }
        return result;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
    },
  };
</script>
<style>
  .el-upload-list__item.is-success {
    width: 90px;
    height: 90px;
  }
  .el-upload.el-upload--picture-card {
    width: 90px;
    height: 90px;
    line-height: 100px;
  }
  .el-upload-list--picture-card > .el-upload.el-upload--picture-card {
    display: none;
  }
  .el-dialog__wrapper {
    left: 25%;
    width: 50%;
  }
  .el-upload-list__item.is-uploading {
    width: 90px;
    height: 90px;
  }
  .el-upload-list__item-actions {
    width: 90px;
    height: 90px;
  }
</style>
