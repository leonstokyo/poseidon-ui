<template>
  <div style="display: flex; flex-direction: column; align-items: center">
    <div style="display:flex; justify-content: center; margin-bottom: 50px">
      <span style="font-size: xx-large">售后申请单</span>
    </div>
    <table style="max-width: 80vw;">
      <tbody>
        <tr>
          <td style="font-size: x-large;padding-right: 20px;min-width: 180px;">
            售后单号:
          </td>
          <td style="font-size: x-large">
            {{ detailForm.print_after_sale_id }}
          </td>
        </tr>
        <tr>
          <td></td>
          <td style="font-size: x-large">
            <img style="width: 200px" id="barcode" />
          </td>
        </tr>
        <tr>
          <td style="font-size: x-large;padding-right: 20px;">
            业务订单号:
          </td>
          <td style="font-size: x-large">
            {{ detailForm.ordersn }}
          </td>
        </tr>

        <tr>
          <td style="font-size: x-large;padding-right: 20px;">
            工厂售后单号:
          </td>
          <td style="font-size: x-large">
            {{ detailForm.factory_order_number }}
          </td>
        </tr>

        <tr>
          <td style="font-size: x-large;padding-right: 20px;">
            售后类型:
          </td>
          <td style="font-size: x-large">
            {{ detailForm.apply_type_label }}
          </td>
        </tr>
        <tr>
          <td style="font-size: x-large;padding-right: 20px;" valign="top">
            详细说明:
          </td>
          <td style="font-size: x-large;word-break: break-all;">
            {{ detailForm.apply_reason }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import JsBarcode from 'jsbarcode';
  import { padPattern } from '@/utils/tools';
  export default {
    props: {
      afterSaleInfo: {
        type: Object,
        required: true,
      },
    },
    created() {
      this.initData();
    },
    watch: {
      afterSaleInfo(val) {
        this.detailForm = val;
        this.initData();
      },
    },
    data() {
      return {
        after_sale_id: 0,
        detailForm: {
          print_after_sale_id: '',
          after_sale_id: '',
          ordersn: '',
          factory_order_number: '',
          apply_type: '',
          apply_type_label: '',
          apply_reason: '',
        },
      };
    },
    methods: {
      generateBarcode() {
        JsBarcode('#barcode', this.detailForm.print_after_sale_id, {
          format: 'CODE128',
          lineColor: '#000',
          background: '#EBEEF5',
          width: 2,
          height: 80,
          displayValue: true,
        });
      },
      async initData() {
        for (const item in this.detailForm) {
          this.detailForm[item] = this.afterSaleInfo[item];
        }
        this.detailForm['print_after_sale_id'] = `Ax${padPattern(
          this.detailForm['apply_type'] || '',
          2
        )}x${padPattern(this.detailForm['after_sale_id'] || '', 12)}`;
        this.generateBarcode();
      },
    },
  };
</script>
