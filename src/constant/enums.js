/**
 * 订单状态
 */
const OrderStatus = (exports.OrderStatus = {
  // CART_STATUS: 1, // 购物车
  UNPAY_STATUS: 5, // 未支付
  PAY_STATUS: 10, // 已付款
  HANDLING_STATUS: 15, // 加工中
  ON_SHIPMENT: 21, // 运输中
  ORDER_COMPLETE: 31, // 已签收
  AFTER_SALE_APPLYING: 51, //售后中
  CLOSE_STATUS: 61, // 交易关闭
  CANCEL_STATUS: 76, // 已取消
  // ERROR_ORDER_STATUS: 101 // 异常订单
});

/**
 * 订单状态映射
 */
exports.OrderStatusLabel = {
  // [OrderStatus.CART_STATUS]: '购物车',
  [OrderStatus.UNPAY_STATUS]: '未支付',
  [OrderStatus.PAY_STATUS]: '已付款',
  [OrderStatus.HANDLING_STATUS]: '加工中',
  [OrderStatus.ON_SHIPMENT]: '运输中',
  [OrderStatus.ORDER_COMPLETE]: '已签收',
  [OrderStatus.CANCEL_STATUS]: '已取消',
  [OrderStatus.AFTER_SALE_APPLYING]: '售后中',
  [OrderStatus.CLOSE_STATUS]: '交易关闭',
  // [OrderStatus.ERROR_ORDER_STATUS]: '错误订单',
};

/**
 * 售后单状态
 */

const AfterSaleStatus = (exports.AfterSaleStatus = {
  APPLY_STATUS_NONEXIST: 0, // 不存在申请
  APPLY_STATUS_APPLYING: 1, // 申请中
  APPLY_STATUS_REJECTED: 30, // 被驳回 未通过
  APPLY_STATUS_BEFORE_UPLOAD_RETURN_ORDER: 5, // 上传退换货运单前
  APPLY_STATUS_AFTER_UPLOAD_RETURN_ORDER: 10, // 返货中
  APPLY_STATUS_HANDLING: 20, // 换货加工中
  APPLY_STATUS_SHIPPING: 21, // 新商品运输中
  APPLY_STATUS_REFUNDING: 71, // 退款中
  APPLY_STATUS_OK: 72, // 退换货成功
  APPLY_STATUS_CANCEL: 81, // 已撤销申请
});

/**
 * 售后单状态映射
 */

exports.AfterSaleStatusLabel = {
  [AfterSaleStatus.APPLY_STATUS_NONEXIST]: '不存在申请',
  [AfterSaleStatus.APPLY_STATUS_APPLYING]: '申请中',
  [AfterSaleStatus.APPLY_STATUS_REJECTED]: '被驳回',
  [AfterSaleStatus.APPLY_STATUS_BEFORE_UPLOAD_RETURN_ORDER]: '审核通过',
  [AfterSaleStatus.APPLY_STATUS_AFTER_UPLOAD_RETURN_ORDER]: '返货中',
  [AfterSaleStatus.APPLY_STATUS_HANDLING]: '处理中',
  [AfterSaleStatus.APPLY_STATUS_SHIPPING]: '已发件',
  [AfterSaleStatus.APPLY_STATUS_REFUNDING]: '退款中',
  [AfterSaleStatus.APPLY_STATUS_OK]: '售后成功',
  [AfterSaleStatus.APPLY_STATUS_CANCEL]: '已撤销申请',
};

/**
 * 售后单类型
 */
const AfterSaleType = (exports.AfterSaleType = {
  APPLY_TYPE_REFUND: 1, // 退款
  APPLY_TYPE_EXCHANGE: 2, // 换货
  APPLY_TYPE_REPAIR: 21, // 维修
  APPLY_TYPE_RETURN: 3, // 退货
  APPLY_TYPE_FACTORY_PLACE_REFUND: 4, // 工厂下单退款
});

/**
 * 售后单类型映射
 */

exports.AfterSaleTypeLabel = {
  [AfterSaleType.APPLY_TYPE_REFUND]: '仅退款',
  [AfterSaleType.APPLY_TYPE_EXCHANGE]: '换货',
  [AfterSaleType.APPLY_TYPE_RETURN]: '退货',
  [AfterSaleType.APPLY_TYPE_REPAIR]: '维修',
  [AfterSaleType.APPLY_TYPE_FACTORY_PLACE_REFUND]: '加工中退款',
};

/**
 * 抬头类型
 */
const TaxType = (exports.TaxType = {
  TAX_TYPE_COMPANY: 1, // 企业
  TAX_TYPE_PERSONAL: 2, // 个人
});

/**
 * 抬头类型映射
 */
exports.TaxTypeLabel = {
  [TaxType.TAX_TYPE_COMPANY]: '企业',
  [TaxType.TAX_TYPE_PERSONAL]: '个人',
};

/**
 * 发票状态
 */
const InvoiceStatus = (exports.InvoiceStatus = {
  APPLY_STATUS_NONEXIST: 0, // 不存在申请
  APPLY_STATUS_APPLYING: 1, // 申请中
  APPLY_STATUS_OK: 72, // 已开票
});

/**
 * 发票状态映射
 */
exports.InvoiceStatusLabel = {
  [InvoiceStatus.APPLY_STATUS_NONEXIST]: '不存在的申请',
  [InvoiceStatus.APPLY_STATUS_APPLYING]: '申请中',
  [InvoiceStatus.APPLY_STATUS_OK]: '已开票',
};

/**
 * 发票类型
 */
const InvoiceType = (exports.InvoiceType = {
  APPLY_TYPE_FIRST: 1, // 新开发票
  APPLY_TYPE_SECOND: 2, // 换开发票
});

/**
 * 发票类型映射
 */
exports.InvoiceTypeLabel = {
  [InvoiceType.APPLY_TYPE_FIRST]: '新开发票',
  [InvoiceType.APPLY_TYPE_SECOND]: '换开发票',
};

/**
 * 用户建议类型
 */
const SuggestionType = {
  APPLY_TYPE_USER_EXPERIENCE: 1, // 用户体验
  APPLY_TYPE_BUG: 11, // 系统异常
  APPLY_TYPE_OTHER: 71, // 其他建议
};

/**
 * 用户建议类型映射
 */
exports.SuggestionTypeLabel = {
  [SuggestionType.APPLY_TYPE_USER_EXPERIENCE]: '用户体验',
  [SuggestionType.APPLY_TYPE_BUG]: '系统异常',
  [SuggestionType.APPLY_TYPE_OTHER]: '其他建议',
};

/**
 * 用户建议状态
 */
const SuggestionStatus = (exports.SuggestionStatus = {
  APPLY_STATUS_NONEXIST: 0, // 不存在的申请
  APPLY_STATUS_APPLYING: 1, // 处理中
  APPLY_STATUS_OK: 72, // 已处理
});

/**
 * 用户建议状态映射
 */
exports.SuggestionStatusLabel = {
  [SuggestionStatus.APPLY_STATUS_NONEXIST]: '申请不存在',
  [SuggestionStatus.APPLY_STATUS_APPLYING]: '处理中',
  [SuggestionStatus.APPLY_STATUS_OK]: '已处理',
};

/**
 * 评论状态
 */
const CommentStatus = (exports.CommentStatus = {
  APPLY_STATUS_NONEXIST: 0, // 不存在的评论
  APPLY_STATUS_REVIEW_FIRST_APPLYING: 1, // 评论审核中
  APPLY_STATUS_REVIEW_FIRST_OK: 11, // 评论审核通过
  APPLY_STATUS_REVIEW_SECOND_APPLYING: 21, // 追评审核中
  APPLY_STATUS_REVIEW_SECOND_OK: 31, // 追评审核通过
  APPLY_STATUS_REVIEW_FIRST_CLOSE: 92, //评论审核未通过
  APPLY_STATUS_REVIEW_SECOND_CLOSE: 91, //追评审核未通过
});

/**
 * 评论状态映射
 */

exports.CommentStatusLabel = {
  [CommentStatus.APPLY_STATUS_NONEXIST]: '不存在的评论',
  [CommentStatus.APPLY_STATUS_REVIEW_FIRST_APPLYING]: '评论审核中',
  [CommentStatus.APPLY_STATUS_REVIEW_FIRST_OK]: '评论审核通过',
  [CommentStatus.APPLY_STATUS_REVIEW_SECOND_APPLYING]: '追评审核中',
  [CommentStatus.APPLY_STATUS_REVIEW_SECOND_OK]: '追评审核通过',
  [CommentStatus.APPLY_STATUS_REVIEW_FIRST_CLOSE]: '评论审核未通过',
  [CommentStatus.APPLY_STATUS_REVIEW_SECOND_CLOSE]: '追评审核未通过',
};

/**
 * 优惠券类型
 */
const CouponType = (exports.CouponType = {
  COUPON_TYPE_FIXED: 1, // 固定额度
  COUPON_TYPE_PERCENT: 7, // 折扣
});

/**
 * 优惠券类型映射
 */
exports.CouponTypeLabel = {
  [CouponType.COUPON_TYPE_FIXED]: '固定额度券',
  [CouponType.COUPON_TYPE_PERCENT]: '折扣券',
};

/**
 * 优惠券状态
 */
const CouponStatus = (exports.CouponStatus = {
  COUPON_STATUS_OK: 31, // 启用中
  COUPON_STATUS_DOWN: 97, // 未使用
});

/**
 * 优惠券状态映射
 */
exports.CouponStatusLabel = {
  [CouponStatus.COUPON_STATUS_OK]: '上架',
  [CouponStatus.COUPON_STATUS_DOWN]: '下架',
};

const OrderPlaceFrom = (exports.OrderPlaceFrom = {
  PLACE_FROM_PC: '1',
  PLACE_FROM_MINI: '2',
  PLACE_FROM_H5: '3',
});

exports.OrderPlaceFromLabel = {
  [OrderPlaceFrom.PLACE_FROM_PC]: 'PC',
  [OrderPlaceFrom.PLACE_FROM_MINI]: '小程序',
  [OrderPlaceFrom.PLACE_FROM_H5]: 'H5',
};

/**
 * 标签类型
 **/

const LabelType = (exports.LabelType = {
  SUNGLASSES: 1,
  FACE_FARMING: 2,
  SPECIAL_FUNCTIONS: 3,
  SPECIAL_DESIGN: 4,
  FUNCTIONAL_TEMPLE: 5,
  TOUGH: 6,
  CO_BRANDING: 7,
  MAIN_PROMOTION: 8,
  SPECIAL_COLOR: 9,
});

exports.LabelTypeLabel = {
  [LabelType.SUNGLASSES]: '太阳眼镜',
  [LabelType.FACE_FARMING]: '修饰脸型',
  [LabelType.SPECIAL_FUNCTIONS]: '镜架特殊功能',
  [LabelType.SPECIAL_DESIGN]: '特殊设计镜框',
  [LabelType.FUNCTIONAL_TEMPLE]: '功能性镜腿',
  [LabelType.TOUGH]: "'掰不断'系列",
  [LabelType.CO_BRANDING]: '联名/特殊系列',
  [LabelType.MAIN_PROMOTION]: '主推款',
  [LabelType.SPECIAL_COLOR]: '独特颜色',
};

const BannerTitle = (exports.BannerTitle = {
  one: 'position_one',
  two: 'position_two',
  three: 'position_three',
  four: 'position_four',
  five: 'position_five',
  six: 'position_six',
  seven: 'position_seven',
  eight: 'position_eight',
  nine: 'position_nine',
});

exports.BannerTitleLabel = {
  [BannerTitle.one]: '位置1',
  [BannerTitle.two]: '位置2',
  [BannerTitle.three]: '位置3',
  [BannerTitle.four]: '位置4',
  [BannerTitle.five]: '位置5',
  [BannerTitle.six]: '位置6',
  [BannerTitle.seven]: '位置7',
  [BannerTitle.eight]: '位置8',
  [BannerTitle.nine]: '位置9',
};
