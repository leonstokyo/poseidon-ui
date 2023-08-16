import { toHump, getImgUrl } from '@/utils/tools';

const image = {
  data() {
    return {
      // 全景图显示标识
      dialogVisible: false,
      img1: false,
      img2: false,
      img3: false,
      img4: false,
      img5: false,
      img6: false,
      img7: false,
      img8: false,
      img9: false,
      img10: false,
      img11: false,
      img12: false,
      img13: false,
      img14: false,
      img15: false,
      img16: false,
      // 基础图片显示标识
      front_img_src: '',
      side_img_src: '',
      angle_img_src: '',
      tinted_img_src: '',
      imgList: [], // 基础图片
      img360List: [], // 360图片
      src360: '', // 图片资源
      clientWidth: 0, // 屏幕宽度
    };
  },
  methods: {
    // 鼠标移动事件
    move(e) {
      const add = this.clientWidth * 0.1;
      if (e.screenX >= add && e.screenX <= this.clientWidth - add) {
        let result = Math.ceil((e.screenX - add) / ((8 * add) / 17));
        let tmp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        if (result === 17 || result === 1) {
          result = 1;
        } else {
          result = 18 - result;
        }
        tmp.filter((e) => {
          e !== result;
        });
        for (let item of tmp) {
          this[`img${item}`] = false;
        }
        this[`img${result}`] = true;
      }
    },
    // 鼠标进入事件
    enter() {
      this.clientWidth = document.documentElement.clientWidth;
    },
    get360ImgList(sku) {
      // 获取360图片资源
      const tmpUrl = getImgUrl('360', sku);
      // 处理360返回结果
      const tmpArr = tmpUrl.split('[');
      const prefix = tmpArr[0];
      for (let i = 1; i <= 16; i++) {
        let url = prefix + (Array(2).join(0) + i).slice(-2) + '.jpg';
        this.img360List.push(url);
      }
    },
    getNormalImgList() {
      const list = ['front', 'side', 'angle', 'tinted'];
      for (const item of list) {
        if (this[`${item}_img_src`]) {
          this.imgList.push({
            name: item,
            src: process.env.VUE_APP_IMG_URL + this[`${item}_img_src`],
          });
        }
      }
    },
    getImgSrc(sku) {
      this.getNormalImgList();
      this.get360ImgList(sku);
    },
    // 图片资源加载未成功回调，用于控制错误的图片的显示
    imgError(name) {
      this[`${name}_display`] = false;
    },
    isShow360(index) {
      return this[`img${index + 1}`];
    },
  },
};
export default image;
