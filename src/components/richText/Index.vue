<template>
  <div>
    <el-upload
      :with-credentials="withCredentials"
      class="avatar-uploader"
      :action="serverUrl"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload"
    ></el-upload>

    <el-row v-loading="quillUpdateImg"></el-row>
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @focus="onEditorFocus($event)"
      @blur="onEditorBlur($event)"
      @change="onEditorChange($event)"
    ></quill-editor>
  </div>
</template>
<script>
  import { quillEditor } from 'vue-quill-editor'; // 调用富文本编辑器
  import Quill from 'quill'; // 富文本基于quill
  import { ImageDrop } from 'quill-image-drop-module';
  import ImageResize from 'quill-image-resize-module';
  import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module';
  Quill.register('modules/imageDrop', ImageDrop);
  Quill.register('modules/imageResize', ImageResize);
  Quill.register('modules/ImageExtend', ImageExtend);
  export default {
    name: 'RichText',
    components: {
      quillEditor,
    },
    props: ['text'],
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill;
      },
    },
    data() {
      return {
        withCredentials: true,
        quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
        serverUrl: `${process.env.VUE_APP_BASE_API}/ossUpload/putImage`, // 这里写你要上传的图片服务器地址
        detailContent: '', // 富文本内容
        content: this.text, // 富文本编辑器默认内容
        editorOption: {
          //  富文本编辑器配置
          modules: {
            imageDrop: true, //图片拖拽
            imageResize: {
              //图片放大缩小
              displaySize: true,
            },
            toolbar: {
              container: [
                ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
                ['blockquote', 'code-block'], // 引用  代码块
                [{ header: 1 }, { header: 2 }], // 1、2 级标题
                [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
                [{ script: 'sub' }, { script: 'super' }], // 上标/下标
                [{ indent: '-1' }, { indent: '+1' }], // 缩进
                // [{'direction': 'rtl'}],                         // 文本方向
                [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
                [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
                [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                [{ font: [] }], // 字体种类
                [{ align: [] }], // 对齐方式
                ['clean'], // 清除文本格式
                ['link', 'image', 'video'], // 链接、图片、视频
              ], //工具菜单栏配置
              handlers: {
                image: function(value) {
                  if (value) {
                    document.querySelector('.avatar-uploader input').click();
                  } else {
                    this.quill.format('image', false);
                  }
                },
              },
            },
          },
          theme: 'snow',
          placeholder: '请输入正文',
          readyOnly: false, //是否只读
          syntax: true, //语法检测
        },
      };
    },
    created() {},
    watch: {
      text(val) {
        this.content = val;
      },
    },
    methods: {
      onEditorReady(editor) {},
      // 富文本编辑器 失去焦点事件
      onEditorBlur(editor) {},
      // 富文本编辑器 获得焦点事件
      onEditorFocus(editor) {},
      // 富文本编辑器 内容改变事件
      onEditorChange(editor) {
        this.$emit('update:text', this.content);
      },
      beforeUpload(res, file) {},
      // 上传图片成功
      uploadSuccess(res, file) {
        let quill = this.$refs.myQuillEditor.quill;
        // 如果上传成功
        if (res.errorCode == '0') {
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片  res.info为服务器返回的图片地址
          quill.insertEmbed(length, 'image', res.data.url);
          // 调整光标到最后
          quill.setSelection(length + 1);
        } else {
          this.$message.error('图片插入失败');
        }
        // loading动画消失
        this.quillUpdateImg = false;
      },
      // 上传图片失败
      uploadError(res, file) {
        this.quillUpdateImg = false;
        this.$message.error('图片插入失败');
      },
    },
  };
</script>
