<template>
  <div>
    <div v-show="prescriptions.length > 0">
      <div
        style="margin-left: 50px; margin-bottom: 70px"
        v-for="item in prescriptions"
        :key="item.prescription_id"
      >
        <div style="width: 500px; height: 50px; display: flex; justify-content: space-between">
          <div style="display: flex; justify-content: left; line-height: 50px">
            <span>处方名称：</span>
            <p style="margin: auto; color: #676c77">{{ item.prescription_name }}</p>
          </div>
          <div style="line-height: 50px">
            <el-button @click="edit(item.prescription_id)">编辑</el-button>
          </div>
        </div>
        <div style="height: 40px">
          <div style="display: flex; justify-content: left; line-height: 40px">
            <span>处方生成日期：</span>
            <p style="margin: auto 0; color: #676c77">{{ item.created_at }}</p>
          </div>
        </div>
        <el-divider></el-divider>
      </div>
    </div>
    <div v-show="prescriptions.length === 0" style="margin-left: 50px">
      <span>该用户暂未上传处方！</span>
      <el-button @click="add()">添加处方</el-button>
    </div>
    <div v-show="prescriptions.length !== 0" style="margin-left: 50px">
      <el-button @click="add()">添加处方</el-button>
    </div>
  </div>
</template>
<script>
  import customerApi from '@/api/customer';
  import { mapGetters } from 'vuex';
  export default {
    created() {
      this.initData(this.$route.params.id);
      this.customerId = this.$route.params.id;
    },
    computed: mapGetters('permission', {
      availableButton: 'availableButton',
      isAdmin: 'isAdmin',
    }),
    data() {
      return {
        customerId: '',
        prescriptions: [],
      };
    },
    methods: {
      edit(id) {
        this.$router.push({ path: `/customer/prescription/edit/${id}` });
      },
      add() {
        this.$router.push({ path: `/customer/prescription/add/${this.customerId}` });
      },
      async initData(id) {
        const { data } = await customerApi.getAllPrescriptionList({ filter: { customer_id: id } });
        for (const item of data[0]['items']) {
          if (item) {
            this.prescriptions.push({
              prescription_id: item.prescription_id,
              prescription_name: item.prescription_name,
              created_at: item.created_at,
            });
          }
        }
      },
    },
  };
</script>
