<template>
  <div>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="40">
        <el-col :span="4">
          <el-input type="text" size="medium" placeholder="商品名称"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary">搜索</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary">重置</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="list" border stripe>
        <el-table-column type="index"></el-table-column>
      </el-table>
      <!--分页区域 -->
    </el-card>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    created() {
    },
    methods: {}
  }
</script>
