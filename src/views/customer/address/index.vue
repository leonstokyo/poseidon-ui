<template>
  <div>
    <div v-show="addresses.length > 0">
      <div
        style="margin-left: 50px; margin-bottom: 70px"
        v-for="item in addresses"
        :key="item.prescription_id"
      >
        <div style="width: 500px; height: 50px; display: flex; justify-content: space-between">
          <div style="display: flex; justify-content: left; line-height: 50px">
            <span>收件人：</span>
            <p style="margin: auto; color: #676c77">{{ item.firstname }}</p>
          </div>
          <div style="line-height: 50px">
            <el-button @click="edit(item.id)">查看</el-button>
          </div>
        </div>
        <div style="height: 40px">
          <div style="display: flex; justify-content: left; line-height: 40px">
            <span>手机号：</span>
            <p style="margin: auto 0; color: #676c77">{{ item.telephone }}</p>
          </div>
        </div>
        <div style="height: 40px">
          <div style="display: flex; justify-content: left; line-height: 40px">
            <span>地址：</span>
            <p style="margin: auto 0; color: #676c77">{{ item.address }}</p>
          </div>
        </div>

        <el-divider></el-divider>
      </div>
    </div>
    <div v-show="addresses.length === 0">
      暂无地址
    </div>
  </div>
</template>
<script>
  import customerApi from '@/api/customer';
  import { mapGetters } from 'vuex';
  export default {
    name: 'CustomerAddressIndex',
    created() {
      this.initData(this.$route.params.id);
    },
    computed: mapGetters('permission', {
      availableButton: 'availableButton',
      isAdmin: 'isAdmin',
    }),
    data() {
      return {
        addresses: [],
      };
    },
    methods: {
      edit(id) {
        this.$router.push({ path: `/customer/address/edit/${id}` });
      },
      async initData(id) {
        const { data } = await customerApi.getAllAddressList({
          currentPage: 1,
          pageSize: 20,
          filter: {
            customer_id: id,
          },
        });
        const addresses = data[0]['items'];
        for (const item of addresses) {
          if (item) {
            const temp = item.region === item.city ? item.region : `${item.region}${item.city}`;
            const add = `${temp}${item['street']}`;
            this.addresses.push({
              id: item.address_id,
              firstname: item.firstname,
              telephone: item.telephone,
              address: add,
            });
          }
        }
      },
    },
  };
</script>
