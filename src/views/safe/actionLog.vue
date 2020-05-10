<template>
  <div>
    <!-- 卡片视图区 -->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="40">
        <el-col :span="8">
          <el-input type="text" size="medium" placeholder="操作者名称" v-model="queryInfo.operateId"></el-input>
        </el-col>
        <el-col :span="8">
          <el-select v-model="queryInfo.operateType" placeholder="操作类型" clearable style="width: 350px">
            <el-option v-for="(item,index) in optionList" :key="index" :label=item.operate_type
                       :value="item.operate_type"></el-option>
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
          <el-button type="success" @click="getActionLogList()">搜索</el-button>
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
        <el-table-column prop="user_id" label="操作者"></el-table-column>
        <el-table-column prop="operate_type" label="操作类型"></el-table-column>
        <el-table-column prop="operate_time" label="操作时间"></el-table-column>
        <el-table-column prop="login_ip" label="操作ip"></el-table-column>
      </el-table>
      <!--      分页区域-->
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
          operateType: '',
          ip: '',
          startTime: '',
          endTime: ''
        },
        list: [],
        timeValue: '',
        optionList: [],
      }
    },
    created() {
      this.getActionLogList();
      this.getOptionType();
    },
    methods: {
      getActionLogList() {
        this.queryInfo.startTime = this.timeValue[0];
        this.queryInfo.endTime = this.timeValue[1];
        this.api({
          url: "/actionLog/getPage",
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
        this.getActionLogList();
      },
      //监听当前页的变化
      handleCurrentChange(newPage) {
        //向pageNum赋值
        this.queryInfo.pageNum = newPage;
        //再次调用查询方法
        this.getActionLogList();
      },
      getOptionType() {
        //获取操作类型
        this.api({
          url: "/actionLog/getOptionType",
          method: "get",
        }).then(data => {
          this.optionList = data;
        })
      },
      clearAll() {
        this.queryInfo.operateId = '';
        this.queryInfo.operateType = '';
        this.queryInfo.ip = '';
        this.timeValue = '';
      },
      exportData() {
        this.api({
          url: "/actionLog/export",
          method: "post",
          params: this.queryInfo
        }).then(data => {
          if (data != 'success') {
            this.$message.error('导出数据失败！');
          } else {
            this.$message.info("数据导出成功！")
          }
        })
      },
    }
  }
</script>
