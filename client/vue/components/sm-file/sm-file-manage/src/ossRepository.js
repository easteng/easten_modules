// 对象存储服务 客户端封装
// 针对不同的服务类型进行方法整合

import axios from 'axios';

export default class ossRepository {
  constructor() {}

  /**
   * @description minio 服务上传
   * @author easten
   * @date 2020-07-08
   * @param {*} fileObj 文件对象，包含上传签名地址及文件全部信息
   * @memberof ossRepository
   */
  minioUpload(fileObj, progress, success, error) {
    let step = 0;
    let interval = setInterval(() => {
      step++;
      progress(step);
      if (step == 90) {
        clearInterval(interval);
      }
    }, 100);
    fetch(fileObj.presignUrl, {
      method: 'PUT',
      body: fileObj.file,
    })
      .then(() => {
        // 上传成功
        progress(100);
        success();
      })
      .catch(e => {
        // 上传失败
        clearInterval(interval);
        error(e);
      });
  }

  /**
   * @description 文件上传
   * @author easten
   * @date 2020-07-13
   * @param {*} fileObj 需要上传的文件对象
   * @param {*} progress 文件上传进度信息
   * @param {*} success 上传成功后的回调函数
   * @param {*} error 上传失败后的回调
   * @returns
   * @memberof ossRepository
   */
  upload(fileObj, progress) {
    return new Promise((res,err)=>{
      let options = {};
      options.method = 'PUT';
      (options.withCredentials = false),
        (options.onUploadProgress = function(evt) {
          let complete = ((evt.loaded / evt.total) * 100) | 0;
          progress(complete);
        });
      options.data = fileObj.file;
      options.url = fileObj.presignUrl;
      return axios(options)
        .then(response => {
          if (response.status === 200) {
            progress(100);
            res(response);
          }
        })
        .catch(e => {
          // 上传失败
          err(e);
        });
    });
  }
  /**
   * @description 存储服务为阿里云OSS 时调用此进行方法上传
   * @author easten
   * @date 2020-07-22
   * @param {*} fileObj
   * @param {*} progress
   * @memberof ossRepository
   */
  aliyunUpload(fileObj,progress){
    return new Promise((resolve,error)=>{
      // 定义一个计时器
      let step=0;
      let pInterval=setInterval(()=>{
        step++;
        if(step==90){
          clearInterval(pInterval);
        }
        progress(step);
      },200);
      // 执行文件上传
      fetch(fileObj.presignUrl, {
        method: 'PUT',
        body: fileObj.file,
      })
        .then((res) => {
          // 上传成功
          progress(100);
          clearInterval(pInterval);
          resolve(res);
        })
        .catch(e => {
          // 上传失败
          clearInterval(pInterval);
          error(e);
        });
    });
  }  


  /**
   * @description 文件下载
   * @author easten
   * @date 2020-07-13
   * @param {*} url 文件下载地址
   * @param {*} progress 文件下载进度
   * @param {*} success 文件下载成功后的回调
   * @param {*} error 文件下载失败
   * @memberof ossRepository
   */
  download(url, progress) {
    return new Promise((res, err) => {
      let step = 0;
      let interval = setInterval(() => {
        step++;
        progress(step);
        if (step == 90) {
          clearInterval(interval);
        }
      }, 100);

      fetch(url, { method: 'GET' })
        .then(data => {
          // // 上传成功
          return data.blob();
        }).then((blob)=>{
          progress(100);
          clearInterval(interval);
          res(blob);
         // debugger;
        })
        .catch(e => {
          // 上传失败
          clearInterval(interval);
          err(e);
        });
    });
  }

  // 获取目标文件地址
  /**
   * @description 根据文件url 获取blob对象
   * @author easten
   * @date 2020-07-13
   * @param {*} url 文件存储地址 云地址或者本地存储地址
   * @returns
   * @memberof ossRepository
   */
  getBlob(url) {
    return new Promise(res => {
      const xhr = new XMLHttpRequest();
      xhr.open('get', url, true);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        if (xhr.status === 200) {
          res(xhr.response);
        }
      };
      xhr.send();
    });
  }
}
