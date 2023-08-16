<template>
  <div>
    <el-form ref="form" :model="detailForm" label-width="120px" style="width: 500px">
      <el-form-item label="编号" style="width: 500px" v-if="!isNew">
        <el-input v-model="detailForm.id" class="input-style" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="名称" style="width: 500px">
        <el-input
          v-model="detailForm.name"
          class="input-style"
          :disabled="detailForm.name === '超级管理员'"
        ></el-input>
      </el-form-item>

      <div
        style="width: 500px; padding-left: 80px; padding-bottom: 50px"
        v-show="detailForm.name !== '超级管理员' && !isNew"
      >
        <el-divider><span>权限编辑</span></el-divider>
        <el-tree
          ref="tree"
          :data="data"
          node-key="id"
          :indent="30"
          @check="check"
          :show-checkbox="true"
          :default-checked-keys="defaultCheckedKeys"
          :default-expanded-keys="defaultCheckedKeys"
          :default-expand-all="false"
          :expand-on-click-node="true"
          :check-on-click-node="false"
          :props="defaultProps"
        ></el-tree>
      </div>
      <el-form-item style="width: 500px">
        <div style="display: flex;">
          <!--justify-content: space-between-->
          <el-button type="primary" :loading="btnLoading" @click="create('form')" v-show="isNew">
            新建
          </el-button>
          <el-button type="primary" :loading="btnLoading" @click="update('form')" v-show="!isNew">
            保存
          </el-button>
          <el-button style="margin-left:70px;" @click="back">{{ buttonText }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { Message } from 'element-ui';
  import permissionApi from '@/api/permission';
  import { mapActions, mapGetters } from 'vuex';
  export default {
    name: 'RoleEdit',
    created() {
      if (this.$route.params.id) {
        this.isNew = false;
        this.roleId = this.$route.params.id;
        this.initData(this.roleId);
      }
    },
    computed: mapGetters('permission', {
      availableButton: 'availableButton',
      isAdmin: 'isAdmin',
    }),
    data() {
      return {
        originData: {},
        btnLoading: false,
        detailForm: {
          id: '',
          name: '',
        },
        roleId: '',
        defaultCheckedKeys: [],
        isNew: true, // 是否为'新建'页面
        buttonText: '取消',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
      };
    },
    methods: {
      ...mapActions('loading', ['setLoading', 'setLoadingComplete']),
      async create(formName) {
        this.btnLoading = true;
        delete this.detailForm.id;
        await permissionApi.createRole(this.detailForm);
        Message.success({
          message: '创建成功！',
          duration: 2000,
        });
        this.btnLoading = false;
        this.back();
      },
      /**
       * 觉得的权限只能在更新的时候操作
       *
       * @param formName
       * @returns {Promise<void>}
       */
      async update(formName) {
        // 获取选中的权限keys
        const checkedKeys = this.$refs.tree.getCheckedKeys(true);
        this.detailForm.permission_json = JSON.stringify(checkedKeys);
        await permissionApi.updateRole(this.detailForm, this.originData);
        Message.success({
          message: '更新成功！',
          duration: 2000,
        });
        this.back();
      },
      async initData(id) {
        this.setLoading();
        // 获取magento
        const { data } = await permissionApi.getRoleItem(id);
        // 遍历detailForm赋值
        for (let key in this.detailForm) {
          this.detailForm[key] = data[key];
        }
        this.originData.role = data;
        this.defaultCheckedKeys = data.permission_json;
        await this.getPermissionTree();
        this.setLoadingComplete();
      },
      back() {
        this.$router.back();
      },
      async getPermissionTree() {
        const { data } = await permissionApi.getPermissionTree();
        this.data = data;
      },
      childNodesChange(node) {
        let len = node.childNodes.length;
        for (let i = 0; i < len; i++) {
          node.childNodes[i].checked = false;
          this.childNodesChange(node.childNodes[i]);
        }
      },
      parentNodesChange(node) {
        if (node.parent) {
          node['parent']['checked'] = true;
          this.parentNodesChange(node['parent']);
        }
      },
      check(data) {
        /**
         * 节点被点击时
         * 1.如果是选中，则其所有父级要被选中
         * 2.如果是取消，则其所有子级要被取消
         */
        const currentKey = data.id;
        const currentNode = this.$refs.tree.getNode(currentKey);
        if (currentNode.checked) {
          // 被选中， 需要选中其父级的元素
          this.parentNodesChange(currentNode);
        } else {
          // 被取消，需要取消其子级的元素
          this.childNodesChange(currentNode);
        }
      },
      async getRolePermissionItem(role_id) {
        let { data } = await permissionApi.getRolePermissionItem(role_id);
        if (data && data['permission_ids']) {
          this.defaultCheckedKeys = JSON.parse(data['permission_ids']);
        }
      },
    },
  };
</script>
<style scoped>
  .input-style {
    width: 350px;
  }
  .select-style {
    width: 250px;
  }
</style>
