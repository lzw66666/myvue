<template>
  <el-card>
    <el-row>
      <el-col :span="3">
        <el-input placeholder="连锁店id" v-model="queryInfo.orgId"></el-input>
      </el-col>
      <el-col :span="3">
        <el-input placeholder="店铺管理员id" v-model="queryInfo.adminId"></el-input>
      </el-col>
      <el-col :span="3">
        <el-select v-model="queryInfo.address" placeholder="所在位置">
          <el-option v-for="(item,index) in location" :key="index" :label=item.address
                     :value="item.address"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-input placeholder="联系方式" v-model="queryInfo.telPhone"></el-input>
      </el-col>
      <el-col :span="3" style="margin-left: 60px">
        <el-button type="primary" @click="getOrgList">搜索</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="reset">重置</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="success" plain @click="dialogVisible = true;getIdList()">添加机构</el-button>
      </el-col>
    </el-row>
    <el-table :data="list" border stripe>
      <el-table-column prop="storeId" label="连锁店id"></el-table-column>
      <el-table-column prop="adminId" label="店铺管理员id"></el-table-column>
      <el-table-column prop="address" label="店铺位置"></el-table-column>
      <el-table-column prop="telPhone" label="联系方式"></el-table-column>
      <el-table-column label="操作">
        <!-- 作用域插槽-->
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-location" size="mini"
                       @click="dialogVisible = true;getById(scope.row.storeId)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="deleteOrg(scope.row.storeId)"></el-button>
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
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="60%">
      <!---主体-->
      <el-form class="demo-form-inline">
        <el-form-item label="管理员id">
          <br/>
          <el-select v-model="addOrgInfo.adminId" placeholder="管理员id" style="width: 600px">
            <el-option
              v-for="(item,index) in idList"
              :key="index"
              :label="item.userName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="addOrgInfo.telPhone" placeholder="联系方式"></el-input>
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input v-model="addOrgInfo.address" placeholder="联系地址"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false;addOrg()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>

</template>
<script>
  export default {
    data() {
      return {
        totalCount: 0,
        list: [],
        queryInfo: {
          //当前的页数
          pageNum: 1,
          //每页显示多少条数据
          pageRow: 5,
          orgId: '',
          adminId: '',
          telPhone: '',
          address: '',
        },
        location: [],
        addOrgInfo: {
          orgId:'',
          adminId: '',
          telPhone: '',
          address: ''
        },
        dialogVisible: false,
        idList: [],
        deleteInfo:{
          id:'',
        },
        getByIdInfo:{
          id:''
        },
        flag:'',
      }
    },
    created() {
      this.getOrgList();
      this.getLocation();
    },
    methods: {
      getOrgList() {
        this.api({
          url: "/org/getPage",
          method: "get",
          params: this.queryInfo,
        }).then(data => {
          this.list = data.list;
          this.totalCount = data.totalCount
        })
      },
      //重置方法
      reset() {
        this.queryInfo.orgId = "";
        this.queryInfo.adminId = "";
        this.queryInfo.telPhone = "";
        this.queryInfo.address = "";
      },
      getLocation() {
        this.api({
          url: "/org/getLocation",
          method: "get",
        }).then(data => {
          this.location = data;
        })
      },
      //监听pageSize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageRow = newSize;
        this.getOrgList();
      },
      //监听当前页的变化
      handleCurrentChange(newPage) {
        //向pageNum赋值
        this.queryInfo.pageNum = newPage;
        //再次调用查询方法
        this.getOrgList();
      },
      addOrg() {
        if(this.flag==1){
          //编辑
          this.api({
            url: "/org/updateById",
            method: "post",
            params: this.addOrgInfo,
          }).then(data => {
            if (data == 'success') {
              this.$message.info("编辑成功！")
              this.getOrgList();
            } else {
              this.$message.warning("编辑失败")
            }
          })
        }else{
          this.api({
            url: "/org/addOrg",
            method: "post",
            params: this.addOrgInfo,
          }).then(data => {
            if (data == 'success') {
              this.$message.info("添加成功！")
              this.getOrgList();
            } else {
              this.$message.warning("添加失败")
            }
          })
        }

      },
      getIdList(){
        this.addOrgInfo.telPhone='';
        this.addOrgInfo.address='';
        this.api({
          url: "/user/getIdList",
          method: "get",
        }).then(data => {
          this.idList=data
        })
      },
      deleteOrg(id){
        this.deleteInfo.id=id;
        this.api({
          url: "/org/deleteOrg",
          method: "post",
          params:this.deleteInfo
        }).then(data => {
          if(data='success'){
            this.$message.info("删除成功")
            this.getOrgList();
          }else{
            this.$message.error("删除失败")
          }
        })
      },
      getById(id){
        this.flag=1;
        this.getByIdInfo.id=id;
        this.getIdList();
        this.api({
          url: "/org/getById",
          method: "get",
          params:this.getByIdInfo
        }).then(data => {
          this.addOrgInfo.orgId=data.storeId;
          this.addOrgInfo.adminId=data.adminId;
          this.addOrgInfo.telPhone=data.telPhone;
          this.addOrgInfo.address=data.address;
        })
      }

    }
  }
</script>

