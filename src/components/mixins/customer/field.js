const field = {
  data() {
    return {
      // magento标准基础数据字段
      magentoStandardFields: [
        'id',
        'email',
        'firstname',
        'lastname',
        'created_at',
        'store_id',
        'website_id',
      ],
      // magento用户自定义字段
      magentoCustomFields: ['telephone', 'zenni_email'],
      // 处方表单提交为数字的字段
      prescriptionNumberFields: [
        'left_pd',
        'right_pd',
        'pd',
        'od_sph',
        'od_cyl',
        'od_axis',
        'os_sph',
        'os_cyl',
        'os_axis',
        'nv_add',
      ],
    };
  },
};
export default field;
