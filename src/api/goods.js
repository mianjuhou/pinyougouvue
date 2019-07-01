import request from '@/utils/request'
import StringUtil from '@/utils/StringUtil';

const group_name = 'goods'
export default {
  save(pojo) {
    return request({
      url: `/${group_name}`,
      method: 'post',
      data: pojo
    })
  },
  uploadImages(files) {
    return request({
      url: `/${group_name}/uploadImages`,
      method: 'post',
      data: files,
      headers: {'Content-Type': 'multipart/form-data'}
    })
  },
  deleteImage(path){
    // var json = JSON.stringify({
    //   url: path
    // });
    return request({
      url: `/${group_name}/deleteImage`,
      method: 'post',
      data: path,
      headers: {'Content-Type': 'application/json;charset=UTF-8'}
    })
  }
}
