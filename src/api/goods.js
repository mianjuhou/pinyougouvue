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
  deleteById(id) {
    return request({
      url: `/${group_name}/${id}`,
      method: 'delete'
    })
  },
  update(id, pojo) {
    return request({
      url: `/${group_name}/${id}`,
      method: 'put',
      data: pojo
    })
  },
  findAll() {
    return request({
      url: `/${group_name}`,
      method: 'get'
    })
  },
  findById(id) {
    return request({
      url: `/${group_name}/${id}`,
      method: 'get'
    })
  },
  findSearch(pojo) {
    if (pojo == undefined) {
      pojo = {};
    }
    return request({
      url: `/${group_name}/search`,
      method: 'post',
      data: pojo
    })
  },
  findPage(pageSize, pageNum, pojo) {
    if (pojo == undefined) {
      pojo = {};
    }
    return request({
      url: `/${group_name}/search/${pageSize}/${pageNum}`,
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
