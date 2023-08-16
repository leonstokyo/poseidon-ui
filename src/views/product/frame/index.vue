<template>
  <div v-loading="tableLoading" element-loading-text="加载中...">
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

        <el-form-item label="风格" label-width="50px">
          <el-select
            v-model="filter.occasion"
            placeholder="请选择"
            class="input-medium"
            multiple
            clearable
          >
            <el-option
              v-for="item in occasionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人群" label-width="50px">
          <el-select
            v-model="filter.population"
            placeholder="请选择"
            class="input-medium"
            multiple
            clearable
          >
            <el-option
              v-for="item in populationOptions"
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
      <div>
        <el-form-item style="float: right">
          <Import
            :usable="canDo('frames-upload')"
            style="display:inline-block;width:60px"
            route="/v2/frames/upload"
            @upload-success="handleSuccess"
            name="上传文件"
          ></Import>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="sku" label="SKU" minWidth="120"></el-table-column>
      <el-table-column prop="name" label="产品名称" minWidth="200"></el-table-column>

      <el-table-column prop="status" label="数据状态">
        <div slot-scope="{ row }">
          <el-tag v-if="row.status == 2" type="danger">已下架</el-tag>
          <el-tag v-else type="success">使用中</el-tag>
        </div>
      </el-table-column>

      <el-table-column property="population" label="人群" minWidth="120">
        <div slot-scope="population">
          <el-tag
            type="success"
            v-if="populationMapping[item]"
            v-for="(item, index) in population.row.population"
            :key="index"
            style="margin-top: 3px; width: 80px; text-align: center"
            size="small"
          >
            {{ populationMapping[item] }}
          </el-tag>
        </div>
      </el-table-column>
      <el-table-column property="occasion" label="风格" minWidth="120">
        <div slot-scope="occasion">
          <el-tag
            type="danger"
            v-if="occasionMapping[item]"
            v-for="(item, index) in occasion.row.occasion"
            :key="index"
            style="margin-top: 3px; width: 80px; text-align: center"
            size="small"
          >
            {{ occasionMapping[item] }}
          </el-tag>
        </div>
      </el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="qty" label="库存"></el-table-column>

      <el-table-column label="操作" fixed="right" minWidth="80">
        <div slot-scope="operation">
          <el-button
            size="mini"
            type="primary"
            :disabled="!canDo('frames-show')"
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
  import productApi from '@/api/product';
  import label from '@/components/mixins/common/label';
  import options from '@/components/mixins/common/options';
  import HandleIndexSession from '@/utils/HandleIndexSession';
  import Import from '@/components/tool/Import';
  import { mapGetters } from 'vuex';
  import { Message } from 'element-ui';
  export default {
    name: 'FrameIndex',
    mixins: [label, options],
    components: {
      Import,
    },
    created() {
      this.initList();
      this.styleTypeOptions = this.attributeOptions.styleTypeOptions;
    },
    computed: {
      ...mapGetters('permission', {
        canDo: 'canDo',
        isAdmin: 'isAdmin',
      }),
      ...mapGetters('option', {
        attributeOptions: 'attributeOptions',
        attributeMappings: 'attributeMappings',
      }),
    },
    data() {
      return {
        tagOptions: [],
        tagMapping: {},
        tableLoading: false, // 表格loading

        styleTypeOptions: [],
        styleTypeMapping: {},
        populationOptions: [],
        populationMapping: {},
        occasionOptions: [],
        occasionMapping: {},
        filter: {
          sku: '',
          status: '',
          category_id: '',
          tag: '',
          population: '',
          occasion: '',
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
      add() {
        this.$router.push({ name: 'FrameAdd' });
      },
      search() {
        this.pagination.currentPage = 1;
        this.getProductListWithPage();
      },
      change(current) {
        this.getProductListWithPage(current);
      },
      edit(row) {
        this.$router.push({ path: `/product/frame/edit/configurable/${row.sku}` });
      },
      async getProductListWithPage(current) {
        const currentPage = current ? current : this.pagination.currentPage;
        const { data } = await productApi.getFrameList({
          pageSize: this.pagination.pageSize,
          currentPage,
          filter: this.filter,
        });
        const { items, total, pageSize } = data;
        this.pagination.pageSize = pageSize;
        this.pagination.total = total;
        this.pagination.currentPage = currentPage;
        this.tableData = [];
        HandleIndexSession.setSession(this, 'frame');
        items.forEach((e) => {
          this.tableData.push({
            id: parseInt(e.id),
            sku: e.sku,
            name: e.name,
            type_id: e.type_id,
            price: Number(e.price),
            status: e.status,
            image: e.image_url,
            category: e.category_ids,
            tag: e.tag,
            occasion: e.occasion,
            population: e.population,
            children: e.children ? this.handleChildren(e.children) : null,
            qty: e.qty ? e.qty : 0,
          });
        });
      },
      handleChildren(children) {
        for (const item of children) {
          item.id = parseInt(item['product_id']);
          item.image = item.front_image ? item.front_image : item.angle_image;
          item.type_id = 'simple';
          item.tag = item.tag ? item.tag.split(',') : [];
          item.qty = item.qty ? parseInt(item.qty) : 0;
        }
        return children;
      },
      async initList() {
        this.tableLoading = true;
        if (
          HandleIndexSession.exitSession(this, 'frame') &&
          this.$cookie.get('is_edit_back') == 1
        ) {
          HandleIndexSession.getSession(this, 'frame');
        }
        await this.getAttributesByName();
        await this.getProductListWithPage();
        for (const item of this.tagOptions) {
          this.tagMapping[item.value] = item.label;
        }
        this.tableLoading = false;
      },
      handleSuccess(res) {
        if (res.errorCode === 0) {
          Message.success({
            message: '导入成功！',
            duration: 2000,
          });
          this.getProductListWithPage();
        } else {
          Message.error({
            message: '导入失败！',
            duration: 2000,
          });
        }
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
