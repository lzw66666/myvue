<style>
  .c1 {
    margin-top: 70px;
    margin-left: 140px;
  }
</style>
<template>
  <div>
    <div class="c1">
      <label>订单编号:{{queryInfo.id}}</label>
      <el-button style="margin-left:900px ">导出数据</el-button>
    </div>
    <el-table :data="tableData" border show-summary style="width: 80%;margin-left: 140px;">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column prop="customerName" label="顾客姓名"></el-table-column>
      <el-table-column prop="price" label="商品单价"></el-table-column>
      <el-table-column prop="count" sortable label="商品数量"></el-table-column>
      <el-table-column prop="singlePrice" sortable label="商品总价"></el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tableData: [],
        queryInfo: {
          //传递过来的参数
          id: ''
        },
        customerName:''
      }
    },
    created() {
      this.getParams();
      this.getOrderDetail();
    },
    methods: {
      getParams() {
        this.queryInfo.id = this.$route.query.id;
      },
      getOrderDetail() {
        this.api({
          url: "/detail/getDetail",
          method: "get",
          params: this.queryInfo
        }).then(data => {
          this.tableData = data;
        })
      }
    }
  }
</script>
