import { InvoiceStatusLabel, InvoiceTypeLabel, TaxTypeLabel } from '@/constant/enums';
import { OrderStatusLabel, OrderPlaceFromLabel } from '@/constant/enums';

import {
  AfterSaleStatusLabel,
  AfterSaleTypeLabel,
  AfterSaleType,
  AfterSaleStatus,
} from '@/constant/enums';

const state = {
  InvoiceStatusLabel,
  InvoiceTypeLabel,
  TaxTypeLabel,
  OrderPlaceFromLabel,
  OrderStatusLabel,
  AfterSaleStatusLabel,
  AfterSaleTypeLabel,
  AfterSaleType,
  AfterSaleStatus,
};

const getters = {
  InvoiceStatusLabel: (state) => state.InvoiceStatusLabel,
  InvoiceTypeLabel: (state) => state.InvoiceTypeLabel,
  TaxTypeLabel: (state) => state.TaxTypeLabel,
  OrderStatusLabel: (state) => state.OrderStatusLabel,
  OrderPlaceFromLabel: (state) => state.OrderPlaceFromLabel,
  AfterSaleTypeLabel: (state) => state.AfterSaleTypeLabel,
  AfterSaleStatusLabel: (state) => state.AfterSaleStatusLabel,
  AfterSaleType: (state) => state.AfterSaleType,
  AfterSaleStatus: (state) => state.AfterSaleStatus,
};

const actions = {};

const mutations = {};

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations,
};
