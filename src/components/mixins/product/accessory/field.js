const field = {
  data() {
    return {
      // magento标准基础数据字段
      magentoStandardFields: [
        'id',
        'type_id',
        'sku',
        'name',
        'attribute_set_id',
        'price',
        'status',
        'visibility',
        'weight',
      ],
      // magento用户自定义字段
      magentoCustomFields: [
        'color',
        'category_ids',
        'accessory_type_code',
        'care_instructions',
        'acc_frame_type_code',
        'acc_height',
        'acc_length',
        'acc_width',
        'material',
        'specification',
        'external_reference_id',
        'zn_visibility',
        'friendly_name',
        'swatch_color_type_code',
        'front_color_type_code',
        'display_color',
        'up_sell_text',
        'long_description',
        'front_image',
        'personal_media_id',
      ],
    };
  },
};
export default field;
