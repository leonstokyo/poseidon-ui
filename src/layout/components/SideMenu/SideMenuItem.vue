<template>
  <div v-if="!sidebarItem.children">
    <el-menu-item :index="sidebarItem.path">
      <i v-if="sidebarItem.icon" :class="sidebarItem.icon"></i>
      <span>{{ sidebarItem.title }}</span>
    </el-menu-item>
  </div>
  <el-submenu v-else ref="subMenu" :index="sidebarItem.path">
    <template slot="title">
      <i v-if="sidebarItem.icon" :class="sidebarItem.icon"></i>
      <span>{{ sidebarItem.title }}</span>
    </template>
    <sidebar-item v-for="child in sidebarItem.children" :key="child.path" :item="child" />
  </el-submenu>
</template>
<script>
  export default {
    name: 'SidebarItem',
    props: {
      // route object
      item: {
        type: Object,
        required: true,
      },
    },
    created() {
      this.sidebarItem = this.item;
    },
    data() {
      return {
        sidebarItem: [],
      };
    },
    methods: {},
  };
</script>
