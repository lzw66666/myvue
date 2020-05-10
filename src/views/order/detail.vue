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
      <el-button style="margin-left:700px" type="primary" @click="exportData">导出数据</el-button>
      <el-button style="margin-left:60px" type="success" @click="returnOrder">返回订单列表页</el-button>
    </div>
    <el-table :data="tableData" border show-summary style="width: 80%;margin-left: 140px;">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column prop="customerName" label="顾客姓名"></el-table-column>
      <el-table-column prop="price" label="商品单价"></el-table-column>
      <el-table-column prop="count" sortable label="商品数量"></el-table-column>
      <el-table-column prop="singlePrice" sortable label="商品总价"></el-table-column>
      <el-table-column prop="time" label="下单时间"></el-table-column>
      <el-table-column label="操作">
        <!-- 作用域插槽-->
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="showEditDialog(scope.row.detailId)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="deleteGoods(scope.row.detailId)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="编辑"
      :visible.sync="editDialogVisible"
      width="45%">
      <!--内容主题区域-->
      <el-form ref="addFormRef" label-width="80px">
        <el-form-item label="商品数量" prop="count">
          <el-input-number v-model="editForm.count" size="medium" :min="1" label="商品数量"
                           ></el-input-number>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
         <el-button @click="editDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="editDialogVisible = false;updateCount()">修改</el-button>
      </span>
    </el-dialog>
    <el-button style="margin-left:1090px;margin-top: 50px" type="warning" @click="successOrder()">订单结算完毕</el-button>
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
        customerName: '',
        editForm: {
          detailId:'',
          count: ''
        },
        editDialogVisible: false,
        editInfo: {
          id: ''
        },
        deleteInfo: {
          id: ''
        },
        updateOrder:{
          id:'',
        }
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
      },
      exportData() {
        this.api({
          url: "/detail/export",
          method: "post",
          params: this.queryInfo
        }).then(data => {
          if (data == 'success') {
            this.$message.info('导出成功')
          } else {
            this.$message.error('导出失败！')
          }
        })
      },
      showEditDialog(id) {
        this.editDialogVisible = true;
        this.editInfo.id = id;
        this.editForm.detailId=id;
        this.api({
          url: "/detail/getByDetailId",
          method: "get",
          params: this.editInfo
        }).then(data => {
          this.editForm.count = data.goodsCount;
        })
      },
      //删除订单中的商品
      deleteGoods(id) {
        this.deleteInfo.id=id
        this.api({
          url: "/detail/deleteByDetailId",
          method: "post",
          params: this.deleteInfo
        }).then(data => {
            if (data == 'success') {
              this.$message.info('删除成功');
              //删除成功  刷新页面
              location.reload();
            } else {
              this.$message.error('删除失败！')
            }
        })
      },
      updateCount(){
        this.api({
          url: "/detail/updateCount",
          method: "post",
          params: this.editForm
        }).then(data => {
          if (data == 'success') {
            this.editForm.count=data.goodsCount;
            this.$message.info('更新成功')
            location.reload();
          } else {
            this.$message.error('更新失败！')
          }
        })
      },
      returnOrder(){
        this.$router.push({
          path: '/order/order',
        })
      },
      successOrder(){
       this.updateOrder.id= this.queryInfo.id
        this.api({
          url: "/order/updateStatus",
          method: "post",
          params:this.updateOrder,
        }).then(data => {
          if (data == 'success') {
            this.editForm.count=data.goodsCount;
            this.$message.info('结算成功')
            location.reload();
          } else {
            this.$message.error('结算失败！')
          }
        })
      }
    }
  }
</script>
