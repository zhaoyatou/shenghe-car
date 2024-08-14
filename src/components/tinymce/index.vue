<template>
  <!-- 富文本 -->
  <div class="myQuillEditor">
    <quill-editor ref="myQuillEditor" v-model="content" :options="editorOption" @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)" @ready="onEditorReady($event)" />
  </div>
</template>
 
 
<script>
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default:
        ""
    },
    toolbar: {
      type: [String, Array],
      default:
        ""
    }
  },
  data() {
    return {
      //初始化配置
      content: '',
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
            ['blockquote'], // 引用  代码块
            [{ header: 1 }, { header: 2 }], // 1、2 级标题
            [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
            [{ script: 'sub' }, { script: 'super' }], // 上标/下标
            [{ indent: '-1' }, { indent: '+1' }], // 缩进
            // [{ direction: 'rtl' }], // 文本方向
            // [{ size: ['12', '14', '16', '18', '20', '22', '24', '28', '32', '36'] }], // 字体大小
            // [{ header: [1, 2, 3, 4, 5, 6] }], // 标题
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
            // [{ font: ['songti'] }], // 字体种类
            [{ align: [] }], // 对齐方式
            ['clean'], // 清除文本格式
            // ['image', 'video'] // 链接、图片、视频
          ]
        },
        placeholder: '请输入正文'
      },

    };
  },
  mounted() {
    // tinymce.init({});
  },
  methods: {
    onEditorBlur(quill) {
      // console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      // console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      // console.log('editor ready!', quill)
    },
    onEditorChange({ quill, html, text }) {
      // console.log('editor change!', quill, html, text)
      this.content = html
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          this.content = newVal || '';
        } else {
          this.content = '';
        }
      },
      deep: true,
      immediate: true
    },
    content(newValue) {
      this.$emit("input", newValue);
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
};
</script>
<style lang="scss">
.myQuillEditor {
  .ql-editor {
    min-height: 100px;
    max-height: 300px;
  }

  .ql-toolbar.ql-snow {
    padding: 0px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    line-height: 21px;

    .ql-formats {
      margin-right: 0;
    }
  }
}
</style>