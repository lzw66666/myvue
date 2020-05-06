<template>
  <div>
    <el-card>
      <!--搜索与添加区域-->
      <el-row>
        <el-col :span="3">
          <el-input placeholder="订单编号" v-model="queryInfo.orderId"></el-input>
        </el-col>
        <el-col :span="3">
          <el-select v-model="queryInfo.status" placeholder="订单状态">
            <el-option v-for="(item,index) in statusList" :key="index" :label=item.order_status
                       :value="item.order_status"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="timeValue"
            type="daterange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="getOrderList">搜索</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="reset">重置</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="success" plain @click="addDialogVisible = true">添加订单</el-button>
        </el-col>
      </el-row>
      <!-- 订单区域 -->
      <el-table :data="list" border stripe>
        <el-table-column prop="order_id" label="订单编号"></el-table-column>
        <el-table-column prop="order_status" label="订单状态"></el-table-column>
        <el-table-column prop="time" label="下单时间"></el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽-->
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="订单详情" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-location" size="mini"
                         @click="showDetail(scope.row.order_id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除订单" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="verifyDelete(scope.row.order_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pageRow"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-card>
    <!--删除提示框-->
    <el-dialog
      title="提示"
      :visible.sync="verifyDialogVisible"
      width="30%">
      <span>是否进行删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="verifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="verifyDialogVisible = false;deleteOrders()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        queryInfo: {
          query: '',
          //当前的页数
          pageNum: 1,
          //每页显示多少条数据
          pageRow: 5,
          orderId: '',
          status: '',
          startTime: '',
          entTime: '',
        },
        deleteInfo: {
          id: ''
        },
        timeValue: '',
        verifyDialogVisible:false,
        statusList:[],
      }
    },
    created() {
      this.getOrderList();
      this.getStatusList();
    },
    methods: {
      getOrderList() {
        this.queryInfo.startTime = this.timeValue[0];
        this.queryInfo.endTime = this.timeValue[1];
        this.api({
          url: "/order/getPage",
          method: "get",
          params: this.queryInfo
        }).then(data => {
          this.totalCount = data.totalCount;
          this.list = data.list;
        })
      },
      // 获取查询时状态的下拉框
      getStatusList(){
        this.api({
          url: "/order/getStatus",
          method: "post",
        }).then(data => {
          this.statusList=data.list;
        })
      },
      //删除订单
      deleteOrders() {
          this.api({
            url: "/order/deleteOrder",
            method: "post",
            params: this.deleteInfo
          }).then(data => {
            if (data == 'success') {
              this.$message.info("删除成功！")
              this.getOrderList();
            } else {
              this.$message.warning("删除失败")
            }
          })
      },
      //监听pageSize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageRow = newSize;
        this.getOrderList();
      },
      //监听当前页的变化
      handleCurrentChange(newPage) {
        //向pageNum赋值
        this.queryInfo.pageNum = newPage;
        //再次调用查询方法
        this.getOrderList();
      },
      //重置方法
      reset() {
        this.queryInfo.orderId = "";
        this.queryInfo.status = "";
        this.timeValue = "";
      },
      verifyDelete(id) {
        //提示是否进行删除
        this.verifyDialogVisible = true;
        this.deleteInfo.id = id;
      },
      showDetail(id){
          this.$route.push({
            path:'detail',
          })
      }
    }
  }
</script>
