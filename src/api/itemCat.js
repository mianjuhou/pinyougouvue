import request from '@/utils/request'

const group_name = 'itemCat'
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
  findById(id) {
    return request({
      url: `/${group_name}/${id}`,
      method: 'get'
    })
  },
  findAll() {
    return request({
      url: `/${group_name}`,
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
  },//级联删除多ID
  deleteCascadeByIds(ids) {
    return request({
      url: `/${group_name}/ids/cascade`,
      method: 'delete',
      data: ids
    })
  },
}
