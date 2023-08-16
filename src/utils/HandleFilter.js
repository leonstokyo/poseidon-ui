const moment = require('moment');

class HandleFilter {
  // 处理时间
  static timeFilter = ['review_at', 'place_at', 'apply_at', 'confirm_at', 'created_at', 'pay_at'];

  static handleFilter(filter) {
    let result = {};
    for (const item in filter) {
      if (filter[item]) {
        if (this.timeFilter.indexOf(item) > -1) {
          if (filter[item][0]) {
            result[item] = {
              value: {
                from: moment(filter[item][0])
                  .startOf('day')
                  .format('YYYY-MM-DD HH:mm:ss'),
                to: moment(filter[item][1])
                  .endOf('day')
                  .format('YYYY-MM-DD HH:mm:ss'),
              },
              option: 'origin',
            };
          }
        } else {
          result[item] = filter[item];
        }
      }
    }
    return result;
  }
}

module.exports = HandleFilter;
