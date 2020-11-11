import * as qiniu from 'qiniu-js'
import request from "@/utils/request";
import {file_url} from "@/config/api-config";
import { v4 as uuidv4 } from 'uuid';

export const iCloudCertificate = async (file: File,ob?: any) => {
  // 先获取上传凭证，再上传文件
  request.post(file_url).then((res: any) => {
    // console.log('uploadToken--------------', res)
    if (res.result) {
      const suffix=file.name.substr(file.name.lastIndexOf('.')).toLowerCase()
      // 调用sdk上传接口获得相应的observable，控制上传和暂停
      const observable = qiniu.upload(file, `${uuidv4()}_${new Date().getTime()}${suffix}`, res.result, {}, {});

      const observer = ob || {
        next(res : any){
          // console.log('next--------------', res)
        },
        error(err:any){
          // console.log('error--------------', err)
        },
        complete(res : any){
          console.log('complete--------------', res)
        }
      };
      observable.subscribe(observer) // 上传开始
    }})


};


