/*
 * author kcz
 * date 2019-12-31
 * description 上传图片组件
 */
import './index.less';

export default {
  name: 'KUploadImg',
  // eslint-disable-next-line vue/require-prop-types
  props: ['record', 'value', 'parentDisabled'],
  data() {
    return {
      fileList: [],
      previewVisible: false,
      previewImageUrl: '',
    };
  },
  computed: {
    optionsData() {
      try {
        return JSON.parse(this.record.options.data);
      } catch (e) {
        return {};
      }
    },
  },
  watch: {
    value: {
      // value 需要深度监听及默认先执行handler函数
      handler(val) {
        if (val) {
          this.setFileList();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    setFileList() {
      // 当传入value改变时，fileList也要改变
      // 如果传入的值为字符串，则转成json
      if (typeof this.value === 'string') {
        this.fileList = JSON.parse(this.value);
        // 将转好的json覆盖组件默认值的字符串
        this.handleSelectChange();
      } else {
        this.fileList = this.value;
      }
    },
    handleSelectChange() {
      setTimeout(() => {
        const arr = this.fileList.map(item => {
          if (typeof item.response !== 'undefined') {
            const res = item.response;
            return {
              type: 'img',
              name: item.name,
              status: item.status,
              uid: item.uid,
              url: res.data.url || '',
            };
          } else {
            return {
              type: 'img',
              name: item.name,
              status: item.status,
              uid: item.uid,
              url: item.url || '',
            };
          }
        });

        this.$emit('change', arr);
        this.$emit('input', arr);
      }, 10);
    },
    handlePreview(file) {
      // 预览图片
      this.previewImageUrl = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    handleCancel() {
      // 取消操作
      this.previewVisible = false;
    },
    remove() {
      this.handleSelectChange();
    },
    beforeUpload(e, files) {
      if (files.length + this.fileList.length > this.record.options.limit) {
        this.$message.warning(`最大上传数量为${this.record.options.limit}`);
        files.splice(this.record.options.limit - this.fileList.length);
      }
    },
    handleChange(info) {
      // 上传数据改变时
      this.fileList = info.fileList;
      if (info.file.status === 'done') {
        const res = info.file.response;
        if (res.code === 0) {
          this.handleSelectChange();
        } else {
          this.fileList.pop();
          this.$message.error(`图片上传失败`);
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`图片上传失败`);
      }
    },
  },

  /*
   * @Description: 对上传图片组件进行封装
   * @Author: kcz
   * @Date: 2020-03-17 12:53:50
   * @LastEditors: kcz
   * @LastEditTime: 2020-03-29 22:03:12
   */

  render() {
    return (
      <div style={{ width: this.record.options.width }} class="upload-img-box-9136076486841527">
        <a-upload
          name={this.record.model}
          multiple={this.record.options.multiple}
          list-type={this.record.options.listType}
          disabled={this.record.options.disabled || this.parentDisabled}
          data={this.optionsData}
          file-list={this.fileList}
          action={this.record.options.action}
          accept="image/gif, image/jpeg, image/png"
          remove={this.remove}
          before-upload={this.beforeUpload}
          onChange={this.handleChange}
          onPreview={this.handlePreview}
        >
          {this.record.options.listType !== 'picture-card' &&
          this.fileList.length < this.record.options.limit ? (
            <a-button disabled={this.record.options.disabled || this.parentDisabled}>
              <a-icon type="upload" /> {this.record.options.placeholder}
            </a-button>
          ) : (
            undefined
          )}
          {this.record.options.listType === 'picture-card' &&
          this.fileList.length < this.record.options.limit ? (
            <div disabled={this.record.options.disabled || this.parentDisabled}>
              <a-icon type="plus" />
              <div class="ant-upload-text">{this.record.options.placeholder}</div>
            </div>
          ) : (
            undefined
          )}
        </a-upload>
        <a-modal visible={this.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style="width: 100%" src={this.previewImageUrl} />
        </a-modal>
      </div>
    );
  },
};
