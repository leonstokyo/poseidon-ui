import productApi from '@/api/product';
import productV1Api from '@/api/V1/product';

const options = {
  data() {
    return {
      // 需要获取options的字段
      optionFields: [
        'color',
        'material',
        'rim_type',
        'frame_type',
        'frame_shape_type',
        'visibility',
        'accessory_type_code',
        'lens_usage',
        'package_type',
        'population',
        'occasion',
        'tag',
        'feature',
        'frame_type_for_lens',
      ],
      colorOptions: [],
      colorMapping: {},
      styleTypeOptions: [],
      styleTypeMapping: {},
      materialOptions: [],
      materialMapping: {},
      rimTypeOptions: [],
      rimTypeMapping: {},
      frameTypeOptions: [],
      frameTypeMapping: {},
      frameShapeTypeOptions: [],
      frameShapeTypeMapping: {},
      visibilityOptions: [],
      visibilityMapping: {},
      accessoryTypeCodeOptions: [],
      accessoryTypeCodeMapping: {},
      lensUsageOptions: [],
      lensUsageMapping: {},
      packageTypeOptions: [],
      packageTypeMapping: {},
      populationOptions: [],
      populationMapping: {},
      occasionOptions: [],
      occasionMapping: {},
      tagOptions: [],
      tagMapping: {},
      featureOptions: [],
      featureMapping: {},
      frameTypeForLensOptions: {},
      frameTypeForLensMapping: {},
      // category 是单独的字段
      categoryOptions: [],
      categoryMapping: {},
      // 镜框分类
      frameCategoryOptions: [],
      frameCategoryMapping: {},
      // 镜片分类
      lensCategoryOptions: [],
      lensCategoryMapping: {},
    };
  },
  methods: {
    async getAttributesByName() {
      const res = await productV1Api.getAttributesByNameByName(this.optionFields);
      const mappings = res['data']['attributeMapping'];
      const options = res['data']['attributesOption'];
      for (const mapping in mappings) {
        this[mapping] = mappings[mapping];
      }
      for (const option in options) {
        this[option] = options[option];
      }
      const categories = await productApi.getCategories();
      this.categoryOptions = categories['data'];
      this.frameCategoryOptions = this.categoryOptions['frame'];
      this.lensCategoryOptions = this.categoryOptions['lens'];
    },
  },
};
export default options;
