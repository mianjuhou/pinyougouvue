export default {
  isEmpty(str) {
    if (str == undefined || str == null || str.length == 0) {
      return true;
    } else {
      return false;
    }
  },
  isNumEmpty(num) {
    if (num == undefined || num == null || num == 0) {
      return true;
    } else {
      return false;
    }
  },
  cloneObj(obj){
    var newObj = {};
    for(var key in obj){
      newObj[key] = obj[key];
    }
    return newObj;
  },
  cloneArray(arr){
    var newArr = [];
    arr.forEach(obj=>{
      var newObj = this.cloneObj(obj);
      newArr.push(newObj);
    });
    return newArr;
  },
  clone(obj){
    return JSON.parse(JSON.stringify(obj));
  }
}
