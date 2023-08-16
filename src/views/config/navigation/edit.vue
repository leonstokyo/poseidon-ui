<template>
  <div>
    <el-form ref="form" :model="detailForm" label-width="150px" style="width: 500px">
      <el-form-item label="编号" style="width: 500px" v-show="!isNew">
        <el-input v-model="detailForm.id" class="input-style" disabled></el-input>
      </el-form-item>
      <el-form-item label="层级" style="width: 500px">
        <el-select
          v-model="detailForm.level"
          placeholder="请选择"
          style="width: 160px"
          :disabled="true"
          clearable
        >
          <el-option
            v-for="item in levelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否为option" style="width: 500px">
        <el-radio v-model="detailForm.is_option" label="1">是</el-radio>
        <el-radio v-model="detailForm.is_option" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="父级id" style="width: 500px">
        <el-input v-model="detailForm.parent_id" class="input-style" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="父级label" style="width: 500px" v-show="detailForm.parent_id != 0">
        <el-input v-model="parentLabel" class="input-style" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="主题" style="width: 500px">
        <el-input v-model="detailForm.title" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="面包屑显示" style="width: 500px">
        <el-input v-model="detailForm.label" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="跳转链接" style="width: 500px">
        <el-input v-model="detailForm.redirect_url" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="内容" style="width: 500px">
        <el-input
          type="textarea"
          :rows="5"
          v-model="detailForm.description"
          class="input-style"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属页面" style="width: 500px">
        <el-select
          v-model="detailForm.page_type"
          placeholder="请选择"
          style="width: 160px"
          clearable
        >
          <el-option
            v-for="item in pageTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="相关参数" tyle="width: 600px">
        <div
          v-for="(item, index) in paramsList"
          :key="index"
          style="display: flex; justify-content: space-between; width: 600px;margin-bottom: 5px"
        >
          <div style="width: 470px; display: flex; justify-content: space-between">
            <div>
              <el-select v-model="item.name" placeholder="请选择" style="width: 150px" clearable>
                <el-option
                  v-for="e1 in nameOptions"
                  :key="e1.value"
                  :label="e1.label"
                  :value="e1.value"
                ></el-option>
              </el-select>
            </div>
            <div>
              <el-select
                v-model="item.operator"
                placeholder="请选择"
                style="width: 150px"
                clearable
              >
                <el-option
                  v-for="e2 in operatorOptions"
                  :key="e2.value"
                  :label="e2.label"
                  :value="e2.value"
                ></el-option>
              </el-select>
            </div>
            <div style="width: 200px">
              <div v-if="singleOptionName.indexOf(item.name) > -1">
                <el-select v-model="item.value" placeholder="请选择" style="width: 200px" clearable>
                  <el-option
                    v-for="e4 in getNameOptions(item.name)"
                    :key="e4.value"
                    :label="e4.label"
                    :value="e4.value"
                  ></el-option>
                </el-select>
              </div>
              <div v-if="multiOptionName.indexOf(item.name) > -1">
                <el-select
                  v-model="item.value"
                  placeholder="请选择"
                  multiple
                  style="width: 200px"
                  clearable
                >
                  <el-option
                    v-for="e3 in getFrameCategory()"
                    :key="e3.value"
                    :label="e3.label"
                    :value="String(e3.value)"
                  ></el-option>
                </el-select>
              </div>
              <div v-if="dateTypeName.indexOf(item.name) > -1">
                <el-date-picker
                  v-if="item.name === 'news_from_date'"
                  v-model="item.value"
                  type="datetime"
                  placeholder="请选择"
                ></el-date-picker>
              </div>
              <div v-if="inputTypeName.indexOf(item.name) > -1">
                <el-input style="width: 200px" v-model="item.value"></el-input>
              </div>
            </div>
          </div>
          <div>
            <div style="margin-left: -40px">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="addItem"
                circle
                v-show="index === paramsList.length - 1"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="removeItem(index)"
                circle
                v-show="paramsList.length > 1 && index !== 0"
              ></el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="排序" style="width: 500px">
        <el-input v-model="detailForm.position" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="状态" style="width: 500px">
        <el-radio v-model="detailForm.status" label="1">使用中</el-radio>
        <el-radio v-model="detailForm.status" label="0">已下架</el-radio>
      </el-form-item>
      <el-form-item style="width: 500px">
        <div style="display: flex;">
          <!--justify-content: space-between-->
          <el-button type="primary" @click="create" v-show="isNew">新建</el-button>
          <el-button type="primary" @click="update" v-show="!isNew">保存</el-button>
          <el-button style="margin-left:70px;" @click="back">{{ buttonText }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { Message } from 'element-ui';
  import configurationV1Api from '@/api/V1/configuration';
  import options from '@/components/mixins/common/options';
  import { mapActions } from 'vuex';
  export default {
    name: 'NavigationEdit',
    mixins: [options],
    created() {
      this.getAttributesByName();
      if (this.$route.params.id) {
        this.isNew = false;
        this.initData(this.$route.params.id);
      } else if (this.$route.params.parent_id) {
        this.detailForm.parent_id = this.$route.params.parent_id;
        this.detailForm.level = String(Number(this.$route.params.level) + 1);
        this.isAddSub = true;
      }
    },
    data() {
      return {
        originData: {},
        detailForm: {
          id: '',
          title: '',
          label: '',
          description: '',
          page_type: '',
          image_url: '',
          redirect_url: '',
          position: '',
          params: '',
          status: '1',
          level: '1',
          parent_id: 0,
          is_option: '0',
          child_items: 0,
          attribute: '',
        },
        parentLabel: '',
        pageTypeOptions: [
          {
            label: '首页',
            value: '1',
          },
        ],
        levelOptions: [
          {
            label: '一级',
            value: '1',
          },
          {
            label: '二级',
            value: '2',
          },
          {
            label: '三级',
            value: '3',
          },
        ],
        paramsList: [
          {
            name: '',
            value: '',
            operator: '',
          },
        ],
        singleOptionName: ['population', 'label', 'color', 'occasion'],
        dateTypeName: ['news_from_date'],
        inputTypeName: ['', 'price'],
        multiOptionName: ['category_ids'],
        nameOptions: [
          {
            label: '人群',
            value: 'population',
          },
          {
            label: '上新日期',
            value: 'news_from_date',
          },
          {
            label: '价格',
            value: 'price',
          },
          {
            label: '隐藏标签',
            value: 'label',
          },
          {
            label: '颜色',
            value: 'color',
          },
          {
            label: '风格',
            value: 'occasion',
          },
          {
            label: '分类',
            value: 'category_ids',
          },
        ],
        operatorOptions: [
          {
            label: '等于',
            value: 'eq',
          },
          {
            label: '范围',
            value: 'range',
          },
        ],
        isFilterOptions: [
          {
            label: 'N',
            value: '0',
          },
          {
            label: 'Y',
            value: '1',
          },
        ],
        isNew: true, // 是否为'新建'页面
        isAddSub: false, // 是否为'添加子条目'页面
        buttonText: '取消',
      };
    },
    methods: {
      ...mapActions('loading', ['setLoading', 'setLoadingComplete']),
      async initData(id) {
        this.setLoading();
        const tmp = await configurationV1Api.getNavigationItem(id);
        const res = tmp.data;
        this.detailForm.title = res.title;
        this.detailForm.id = res.id;
        this.detailForm.label = res.label;
        this.detailForm.description = res.description;
        this.detailForm.page_type = res.page_type;
        this.detailForm.image_url = res.image_url;
        this.detailForm.redirect_url = res.redirect_url;
        this.detailForm.position = res.position;
        this.paramsList = res.params ? this.handleReceiveParams(res.params) : this.paramsList;
        this.detailForm.status = res.status;
        this.detailForm.level = res.level;
        this.detailForm.parent_id = res.parent_id;
        this.detailForm.is_option = String(res.is_option);
        this.detailForm.child_items = res.child_items;
        this.parentLabel = res['parent_item'] ? res['parent_item']['label'] : '';
        this.originData = res;
        this.setLoadingComplete();
      },
      // TODO：创建
      async create() {
        // 过滤
        const tmp = this.handleSendParams();
        tmp.length > 0
          ? (this.detailForm.params = JSON.stringify(tmp))
          : delete this.detailForm.params;
        delete this.detailForm.id;
        const data = {
          navigation: this.detailForm,
        };
        await configurationV1Api.createNavigation(data);
        Message.success({
          message: '创建成功！',
          duration: 2000,
        });
        this.$router.back();
      },
      async update() {
        // 过滤
        let tmp = this.handleSendParams();
        tmp.length > 0
          ? (this.detailForm.params = JSON.stringify(tmp))
          : (this.detailForm.params = '');
        const data = {
          navigation: this.detailForm,
        };
        const res = await configurationV1Api.updateNavigation(data, this.originData);
        if (res.errorCode === 0) {
          Message.success({
            message: '更新成功！',
            duration: 2000,
          });
          this.back();
        } else {
          Message.error({
            message: '更新失败！',
            duration: 2000,
          });
        }
      },
      back() {
        this.$router.back();
      },
      addItem() {
        this.paramsList.push({
          name: '',
          value: '',
          operator: '',
        });
      },
      removeItem(index) {
        this.paramsList.splice(index, 1);
      },
      handleReceiveParams(params) {
        params = JSON.parse(params);
        for (let item of params) {
          if (item.operator === 'eq') {
            if (item.name !== 'category_ids') {
              item.value = typeof item.value === 'object' ? item.value.join(',') : item.value;
            }
          } else if (item.operator === 'range') {
            let tmp = [];
            tmp[0] = item.value.from;
            tmp[1] = item.value.to;
            item.value = tmp.join(',');
          }
        }
        return params;
      },
      handleSendParams() {
        let tmp = [];
        for (const item of this.paramsList) {
          if (item.name && item.value && item.operator) {
            if (item.operator === 'eq') {
              if (item.name !== 'category_ids') {
                item.value = item.value.split(',');
              }
              tmp.push(item);
            } else if (item.operator === 'range') {
              const tmp2 = item.value.split(',');
              item.value = {
                from: tmp2[0],
                to: tmp2[1],
              };
              tmp.push(item);
            }
          }
        }
        return tmp;
      },
      getNameOptions(name) {
        return this.$session.get(`${name}_options`);
      },
      getFrameCategory() {
        const result = [];
        for (const item of this.frameCategoryOptions) {
          result.push({
            label: item.label,
            value: String(item.id),
          });
        }
        return result;
      },
    },
  };
</script>
<style scoped>
  .input-style {
    width: 350px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
