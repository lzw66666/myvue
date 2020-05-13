<template>
  <div>
    <!-- 卡片视图区 -->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="40">
        <el-col :span="8">
          <el-select v-model="queryInfo.operateId" placeholder="员工id" style="width:300px" clearable>
            <el-option
              v-for="(item,index) in userNameList"
              :key="index"
              :label="item.userName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <!--        <el-col :span="8">-->
        <!--          <el-input type="text" size="medium" placeholder="订单编号" v-model="queryInfo.orderId"-->
        <!--                    @blur="verifyOrderId"></el-input>-->
        <!--        </el-col>-->
        <el-col :span="8">
          <el-date-picker
            v-model="timeValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="2">
          <el-button type="success" @click="getSaleList()">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="clearAll()">重置</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="warning" @click="exportData()">导出</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="list" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="userId" label="员工id"></el-table-column>
        <el-table-column prop="nickname" label="员工姓名"></el-table-column>
        <el-table-column prop="orderId" label="订单id"></el-table-column>
        <el-table-column prop="totalCount" label="订单金额"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间"></el-table-column>
      </el-table>
      <!--分页区域-->
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
  </div>
</template>
<script>
  export default {
    data() {
      return {
        listLoading: false,//数据加载等待动画
        totalCount: 0, //分页组件--数据总条数
        queryInfo: {
          //当前的页数
          pageNum: 1,
          //每页显示多少条数据
          pageRow: 5,
          operateId: '',
          orderId: '',
          startTime: '',
          endTime: ''
        },
        timeValue: '',
        list: [],
        userNameList: [],
        verifyOrderInfo: {
          id: ''
        }
      }
    },
    created() {
      // 初始化不显示数据
      //初始化查询雇员的nickName进行展示
      this.getUserList();
    },
    methods: {
      getSaleList() {
        if (this.queryInfo.operateId == '') {
          this.$message.info("未选择用户id,默认查询admin的订单！");
          //重置operateId
          this.queryInfo.operateId = '10003';
          this.getSaleList();
          return;
        }
        //回到第一页
        // this.queryInfo.pageNum = 1;
        if (this.timeValue != '') {
          this.queryInfo.startTime = this.timeValue[0];
          this.queryInfo.endTime = this.timeValue[1];
        }
        this.api({
          url: "/sale/getPage",
          method: "get",
          params: this.queryInfo
        }).then(data => {
          this.totalCount = data.totalCount;
          this.list = data.list;
          this.listLoading = false;
        })
      },
      clearAll() {
        this.queryInfo.operateId = '';
        this.queryInfo.operateType = '';
        this.queryInfo.ip = '';
      },
      //监听pageSize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageRow = newSize;
        this.getSaleList();
      },
      //监听当前页的变化
      handleCurrentChange(newPage) {
        //向pageNum赋值
        this.queryInfo.pageNum = newPage;
        //再次调用查询方法
        this.getSaleList();
      },
      getUserList() {
        this.api({
          url: "/user/getUserName",
          method: "get",
          params: this.queryInfo
        }).then(data => {
          this.userNameList = data;
        })
      },
      verifyOrderId() {
        this.verifyOrderInfo.id = this.queryInfo.orderId;
        this.api({
          url: "/order/verifyOrderId",
          method: "post",
          params: this.verifyOrderInfo
        }).then(data => {
          if (data != 'success') {
            this.$message.error("输入订单id不存在！")
          }
        })
      },
      exportData() {
        this.api({
          url: "/sale/export",
          method: "post",
          params: this.queryInfo
        }).then(data => {
          if (data == 'success') {
            this.$message.info("导出成功！")
          }
        })
      },
    },

  }
</script>
