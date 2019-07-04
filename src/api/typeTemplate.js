import request from '@/utils/request'

const group_name = 'typeTemplate';
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
  saveAll(pojo) {
    console.log(JSON.stringify(pojo));
    return request({
      url: `/${group_name}/saveAll`,
      method: 'post',
      data: pojo
    })
  },
  updateAll(id, pojo) {
    console.log(JSON.stringify(pojo));
    return request({
      url: `/${group_name}/updateAll/${id}`,
      method: 'put',
      data: pojo
    })
  },
  deleteAll(ids) {//根据多个ID删除数据
    return request({
      url: `/${group_name}/deleteAll`,
      method: 'delete',
      data: ids
    })
  },
  findSpecInfoById(id) {
    return request({
      url: `/${group_name}/findSpecInfoById/${id}`,
      method: 'get'
    })
  },
}
