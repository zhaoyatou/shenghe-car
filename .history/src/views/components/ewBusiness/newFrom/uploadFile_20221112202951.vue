<template>
  <div class="clearfix clearfixUpload">
    <div v-if="uplodaUrl.fileUrl">
      <div class="salcImg" v-if="uplodaUrl.fileUrl && types != 9">
        <img :src="uplodaUrl.fileUrl" style="width: 100%; height: 100%" />
        <div class="mask-img">
          <a-icon type="zoom-in" @click="handlePreview(uplodaUrl)" />
          <a-icon type="delete" @click="handleDelete(uplodaUrl)" style="right: 5px; top: 5px; position: absolute" />
        </div>
      </div>
      <div class="salcImg" v-if="uplodaUrl.fileUrl && types == 9">
        <video width="200" height="104" controls :src="uplodaUrl.fileUrl">
          <source src="movie.ogg" type="video/ogg" />
          <source src="movie.mp4" type="video/mp4" />
          <source src="movie.webm" type="video/webm" />
          <object data="movie.mp4" width="320" height="240">
            <embed width="320" height="240" :src="uplodaUrl.fileUrl" />
          </object>
        </video>
        <div class="mask-video">
          <a-icon type="delete" title="删除视频" @click="handleDelete(uplodaUrl)" />
        </div>
      </div>
    </div>
    <a-spin :spinning="spinning" v-else>
      <a-upload
        :disabled="isDisabled"
        list-type="picture-card"
        :file-list="fileList"
        :headers="importHeaders"
        :before-upload="onBeforeUpload"
        @preview="handlePreview"
      >
        <div v-if="fileList.length < 1">
          <!-- <img :src="uplodaUrl[type-1].fileUrl" v-if="uplodaUrl[type-1]" style="width: 100%; height: 100%" /> -->
          <a-icon type="plus" />
        </div>
      </a-upload>
    </a-spin>
    <p class="ant-upload-text">{{ uploadText }}</p>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel" width="70%">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue';
import store from '@/store';
import { uploadFiles } from '@/api/index';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
  name: 'upload',
  props: {
    uploadText: {
      type: String,
      default: ''
    },
    uplodaUrl: {
      type: Object,
      default: () => {
        return {};
      }
    },
    types: {
      type: Number,
      default: -1
    },
    isDisabled: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      importHeaders: { token: store.getters.token },
      baseUrl: process.env.VUE_APP_BASE_API + '/oss/uploadFiles',
      spinning: false
    };
  },
  methods: {
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.fileUrl) {
        return false;
      }
      if (this.types === 9) {
        this.previewImage = file.fileUrl;
        this.previewVisible = true;
      } else {
        this.$emit('previewImage', file);
      }
    },
    handleDelete(file) {
      if (!file.fileUrl) {
        return false;
      }
      this.$emit('deleteFile', file);
    },
    async handleChange(value) {
      let that = this;
      try {
        // if (value.fileList.length > 1) {
        //   //限制只上传一个文件，再次上传时则替换(覆盖)以前的文件
        //   value.fileList.splice(0, 1)
        // }
        const formData = new FormData();
        formData.append('file', value);
        that.spinning = true;
        const res = await uploadFiles(formData);
        that.spinning = false;
        if (res.code === 200) {
          // console.log(res.data)
          res.data.fileType = that.types;
          res.data.createTime = new Date();
          that.$emit('uploadSuccess', res.data);
          // that.$message.success(res.message || '上传成功')
        } else {
          that.$message.warning(res.message || '上传失败，请稍后再试');
        }
      } catch (error) {
        that.spinning = false;
      }
    },
    onBeforeUpload(file) {
      const isIMAGE =
        this.types === 9
          ? file.type === 'video/mp4'
          : file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/png';
      const isLt1M = file.size / 1024 / 1024 <= this.types === 9 ? 500 : 10;
      if (!isIMAGE) {
        this.$message.error(this.types == 9 ? '上传文件只能是视频格式!' : '上传文件只能是图片格式!');
        return false;
      }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 10M!');
        return false;
      }
      // 上传
      this.handleChange(file);
    }
  },
  async mounted() {
    if (!store.getters.token) {
      await this.$store.dispatch('user/logout');
      await this.$store.dispatch('tagsView/clearTag');
      this.$router.replace({
        path: '/login'
      });
    }
  }
};
</script>
<style lang="scss">
.clearfixUpload {
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .ant-upload.ant-upload-select-picture-card,
  .salcImg {
    min-width: 180px;
  }

  .ant-upload-list-picture-card-container,
  .salcImg {
    min-width: 180px;
    margin-bottom: 27px;
  }

  .ant-upload-list-picture-card .ant-upload-list-item,
  .salcImg {
    min-width: 180px;
  }

  .ant-upload-text {
    text-align: center;
  }

  .salcImg {
    position: relative;
    min-width: 180px;
    height: 104px;

    .mask-img {
      position: absolute;
      top: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: all 0.3s;
      content: ' ';
    }

    .mask-video {
      position: absolute;
      top: 10px;
      z-index: 1;
      left: 170px;
      // background-color: rgba(0, 0, 0, 0.3);
      opacity: 0;
      transition: all 0.3s;
      content: ' ';
    }
  }

  //  子盒子的hover移入事件
  .salcImg:hover .mask-img {
    opacity: 1; //设置为完全不透明，相当于把这个盒子显示出来
    cursor: default; //默认正常鼠标指针
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 20px;

    i {
      cursor: pointer;
      color: antiquewhite;
    }
  }

  //  子盒子的hover移入事件
  .salcImg:hover .mask-video {
    opacity: 1; //设置为完全不透明，相当于把这个盒子显示出来
    cursor: default; //默认正常鼠标指针
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 20px;

    i {
      cursor: pointer;
      color: red;
    }
  }
}
</style>
