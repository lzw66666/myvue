<template>
  <div>
    <!-- 卡片视图区 -->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="40">
        <el-col :span="5">
          <el-input type="text" size="medium" placeholder="参数编码" v-model="queryInfo.configCode"></el-input>
        </el-col>
        <el-col :span="5">
          <el-input type="text" size="medium" placeholder="参数名称" v-model="queryInfo.configName"></el-input>
        </el-col>
        <el-col :span="5">
          <el-input type="text" size="medium" placeholder="参数描述" v-model="queryInfo.configDescription"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="success" @click="getSystemList()">搜索</el-button>
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
        <el-table-column prop="config_code" label="参数编码"></el-table-column>
        <el-table-column prop="config_name" label="参数名称"></el-table-column>
        <el-table-column prop="config_value" label="参数值"></el-table-column>
        <el-table-column prop="description" label="参数描述"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作">
          <!--作用域插槽-->
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showEditDialog(scope.row.config_code)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
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
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="60%">
      <!---主体-->
      <el-form class="demo-form-inline">
        <el-form-item label="参数编码">
          <el-input :disabled='true' v-model="updateConfigValue.configCode" placeholder="参数名编码"></el-input>
        </el-form-item>
        <el-form-item label="参数名称">
          <el-input :disabled='true' v-model="updateConfigValue.configName" placeholder="参数名称"></el-input>
        </el-form-item>
        <el-form-item label="参数值">
          <el-input v-model="updateConfigValue.configValue" placeholder="参数值"></el-input>
        </el-form-item>
        <el-form-item label="参数描述">
          <el-input :disabled='true' v-model="updateConfigValue.description" placeholder="参数描述"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false;updateValue()">更新</el-button>
  </span>
    </el-dialog>
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
          configCode: '',
          configName: '',
          configDescription: ''
        },
        list: [],
        getByIdInfo: {
          configCode: '',
          configName: ''
        },
        updateConfigValue: {
          configCode: '',
          configName: '',
          configValue: '',
          description: ''
        },
        dialogVisible: false,
      }
    },
    created() {
      this.getSystemList();
    },
    methods: {
      getSystemList() {
        this.api({
          url: "/systemConfig/getPage",
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
        this.getSystemList();
      },
      //监听当前页的变化
      handleCurrentChange(newPage) {
        //向pageNum赋值
        this.queryInfo.pageNum = newPage;
        //再次调用查询方法
        this.getSystemList();
      },
      clearAll() {
        this.queryInfo.configCode = '';
        this.queryInfo.configName = '';
        this.queryInfo.configDescription = '';
      },
      showEditDialog(data) {
        this.getByIdInfo.configCode = data;
        this.dialogVisible = true;
        //调用更新方法
        this.api({
          url: "/systemConfig/getById",
          method: "get",
          params: this.getByIdInfo
        }).then(data => {
          this.updateConfigValue.configCode = data.configCode;
          this.updateConfigValue.configName = data.configName;
          this.updateConfigValue.configValue = data.configValue;
          this.updateConfigValue.description = data.description;
        })
      },
      updateValue() {
        this.api({
          url: "/systemConfig/updateById",
          method: "post",
          params: this.updateConfigValue
        }).then(data => {
          if (data == 'success') {
            this.$message.info("更新成功！");
            this.getSystemList();
          } else {
            this.$message.error("更新失败！");
          }
        })
      },
      exportData() {

      }
    }
  }
</script>
