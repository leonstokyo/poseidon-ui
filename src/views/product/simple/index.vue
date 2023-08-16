<template>
  <div v-loading="tableLoading">
    <el-form :inline="true" :model="filter" style="display: flex; justify-content: space-between">
      <div>
        <el-form-item label="SKU" label-width="50px">
          <el-input
            v-model="filter.sku"
            placeholder="SKU"
            class="input-medium"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="标签" label-width="50px">
          <el-select
            style="width: 270px"
            v-model="filter.tag"
            placeholder="请选择"
            class="input-medium"
            filterable
            multiple
            clearable
          >
            <el-option
              v-for="item in tagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" label-width="50px">
          <el-select v-model="filter.status" placeholder="请选择" class="input-medium" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      element-loading-text="加载中..."
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="id" label="编号" minWidth="160"></el-table-column>
      <el-table-column label="图片" minWidth="80">
        <template slot-scope="scope">
          <el-image :src="`${scope.row.image}?x-oss-process=image/resize,m_mfit,w_400`"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="sku" label="SKU" minWidth="120"></el-table-column>
      <el-table-column prop="name" label="产品名称" minWidth="240"></el-table-column>
      <el-table-column prop="type_id" label="产品类型" minWidth="100"></el-table-column>

      <el-table-column label="标签" minWidth="120">
        <div slot-scope="tag">
          <el-tag
            type="warning"
            v-if="tagMapping[item]"
            v-for="(item, index) in tag.row.tag"
            :key="index"
            style="margin-top: 3px; width: 80px; text-align: center"
            size="small"
          >
            {{ tagMapping[item] }}
          </el-tag>
        </div>
      </el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="qty" label="库存"></el-table-column>
      <el-table-column prop="status" label="数据状态">
        <div slot-scope="color">
          <el-tag v-if="color.row.status == 2" type="danger">已下架</el-tag>
          <el-tag v-else type="success">使用中</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="操作" fixed="right" minWidth="80">
        <div slot-scope="operation">
          <el-button
            size="mini"
            type="primary"
            :disabled="!canDo('simples-show')"
            @click="edit(operation.row)"
          >
            编辑
          </el-button>
        </div>
      </el-table-column>
    </el-table>
    <div
      style="margin-top: 20px; margin-left: -10px; display: flex; justify-content: space-between"
    >
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :current-page="pagination.currentPage"
        @current-change="change"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
  import productV1Api from '@/api/V1/product';
  import options from '@/components/mixins/common/options';
  import label from '@/components/mixins/common/label';
  import HandleIndexSession from '@/utils/HandleIndexSession';
  import { mapGetters } from 'vuex';
  export default {
    name: 'SimpleIndex',
    mixins: [options, label],
    created() {
      this.initList();
    },
    computed: mapGetters('permission', {
      canDo: 'canDo',
      isAdmin: 'isAdmin',
    }),
    data() {
      return {
        tagMapping: {},
        tableLoading: false, // 表格loading
        filter: {
          sku: '',
          status: '',
        },
        pagination: {
          pageSize: 10,
          currentPage: 1,
          total: 100,
        },
        tableData: [],
      };
    },
    methods: {
      search() {
        this.pagination.currentPage = 1;
        this.getFrameSimpleListWithPage();
      },
      change(current) {
        this.getFrameSimpleListWithPage(current);
      },
      edit(row) {
        this.$router.push({ path: `/product/simple/edit/${row.id}` });
      },
      async getFrameSimpleListWithPage(current) {
        const currentPage = current ? current : this.pagination.currentPage;
        const { data } = await productV1Api.getFrameSimpleList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter: this.filter,
        });
        const { items, total_count } = data[0];
        this.pagination.total = total_count;
        this.pagination.currentPage = currentPage;
        this.tableData = [];
        HandleIndexSession.setSession(this, 'frame_simple');
        items.forEach((e) => {
          this.tableData.push({
            id: e.entity_id,
            sku: e.sku,
            name: e.name,
            type_id: e.type_id,
            price: Number(e.price),
            status: e.status,
            image: `${process.env.VUE_APP_IMG_URL}${e.front_image}`,
            tag: e.tag ? e.tag.split(',') : [],
            qty: e.qty ? parseInt(e.qty) : 0,
          });
        });
      },
      async initList() {
        this.tableLoading = true;
        await this.getAttributesByName();
        for (const item of this.tagOptions) {
          this.tagMapping[item.value] = item.label;
        }
        if (
          HandleIndexSession.exitSession(this, 'frame_simple') &&
          this.$cookie.get('is_edit_back') == 1
        ) {
          HandleIndexSession.getSession(this, 'frame_simple');
        }
        await this.getFrameSimpleListWithPage();
        this.tableLoading = false;
      },
    },
  };
</script>
<style>
  /*表格样式*/
  .el-table td,
  .el-table th {
    text-align: center;
  }

  .input-medium {
    width: 150px;
  }
  .input-long {
    width: 150px;
  }
</style>
