<template>
  <div>
    <!-- 卡片视图区 -->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="40">
        <el-col :span="8">
          <el-input type="text" size="medium" placeholder="操作者" v-model="queryInfo.operateId"></el-input>
        </el-col>
        <el-col :span="8">
          <el-select v-model="queryInfo.resultType" placeholder="结果类型" clearable style="width: 350px">
            <el-option v-for="(item,index) in resultTypeList" :key="index" :label=item.result_type
                       :value="item.result_type"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="timeValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="8">
          <el-input type="text" size="medium" placeholder="ip" v-model="queryInfo.ip"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="success" @click="getLoginLogList()">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="clear()">重置</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="warning" @click="exportData()">导出</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="list" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="user_id" label="操作者"></el-table-column>
        <el-table-column prop="result_type" label="结果类型"></el-table-column>
        <el-table-column prop="fail_reason" label="失败原因"></el-table-column>
        <el-table-column prop="operate_time" label="操作时间"></el-table-column>
        <el-table-column prop="login_ip" label="操作ip"></el-table-column>
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
          resultType: '',
          ip: '',
          startTime: '',
          endTime: ''
        },
        list: [],
        timeValue: '',
        resultTypeList:[],
      }
    },
    created() {
      this.getLoginLogList();
      this.getResultType();
    },
    methods: {
      getLoginLogList() {
        //赋值
        this.queryInfo.startTime = this.timeValue[0];
        this.queryInfo.endTime = this.timeValue[1];
        this.api({
          url: "/loginLog/getPage",
          method: "get",
          params: this.queryInfo
        }).then(data => {
          this.totalCount = data.totalCount;
          this.list = data.list;
          this.listLoading = false;
        })
      },
      //监听pageSize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageRow = newSize;
        this.getLoginLogList();
      },
      //监听当前页的变化
      handleCurrentChange(newPage) {
        //向pageNum赋值
        this.queryInfo.pageNum = newPage;
        //再次调用查询方法
        this.getLoginLogList();
      },
      clear(){
        this.queryInfo.operateId='';
        this.queryInfo.resultType='';
        this.queryInfo.ip='';
        this.timeValue='';
      },
      getResultType(){
        this.api({
          url: "/loginLog/getResultType",
          method: "get",
        }).then(data => {
          this.resultTypeList=data;
          console.log(data)
        })
      },
      exportData(){
        this.api({
          url: "/loginLog/export",
          method: "post",
          params: this.queryInfo
        }).then(data => {
          if (data != 'success') {
            this.$message.error('导出数据失败！');
          } else {
            this.$message.info("数据导出成功！")
          }
        })
      }
    }
  }
</script>
