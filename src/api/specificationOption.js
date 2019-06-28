import request from '@/utils/request'

const group_name = 'specificationOption'
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
  },//其他
  findBySpedId(specId) {
    return request({
      url: `/${group_name}/spec/${specId}`,
      method: 'get'
    })
  },
  saveAll(pojo) {
    //把spec_id设置上
    //把序号加上
    var specId = pojo.id;
    var options = pojo.option;
    var noOrderArr = [];
    var maxOrder = 0;
    for (let i = 0; i < options.length; i++) {
      options[i].specId = specId;
      var orderNo = options[i].orders;
      if (orderNo == undefined || orderNo == null || orderNo.length <= 0) {
        noOrderArr.push(options[i]);
      } else {
        if (orderNo > maxOrder) {
          maxOrder = orderNo;
        }
      }
    }
    for (let i = 0; i < noOrderArr.length; i++) {
      maxOrder++;
      noOrderArr[i].orders = maxOrder;
    }
    console.log(JSON.stringify(options));
    return request({
      url: `/${group_name}/saveAll`,
      method: 'post',
      data: options
    })
  },
}
