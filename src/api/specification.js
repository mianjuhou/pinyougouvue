import request from '@/utils/request'

const group_name = 'specification'
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
}
