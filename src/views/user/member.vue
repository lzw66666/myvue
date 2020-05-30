<template>
  <div>
    <!-- 卡片视图区 -->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="40">
        <el-col :span="5">
          <el-input type="text" size="medium" placeholder="会员名称" v-model="queryInfo.memberName" clearable></el-input>
        </el-col>
        <el-col :span="5">
          <el-input type="text" size="medium" placeholder="会员电话" v-model="queryInfo.memberNumber" clearable></el-input>
        </el-col>
        <el-col :span="5">
          <el-input type="text" size="medium" placeholder="会员微信" v-model="queryInfo.memberWechat" clearable></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="success" @click="getMemberList()">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="clearAll()">重置</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="success" @click="addMember()">新增</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="warning" @click="exportData()">导出</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="list" border stripe resetFields>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="memberName" label="会员姓名"></el-table-column>
        <el-table-column prop="memberPhone" label="会员电话"></el-table-column>
        <el-table-column prop="memberAddress" label="会员地址"></el-table-column>
        <el-table-column prop="memberWechat" label="会员微信"></el-table-column>
        <el-table-column prop="memberCount" label="消费次数"></el-table-column>
        <el-table-column label="操作">
          <!--作用域插槽-->
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="showSrueDelete(scope.row)"></el-button>
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
        <el-form-item label="会员姓名">
          <el-input v-model="addMemberInfo.member_name" placeholder="会员姓名"></el-input>
        </el-form-item>
        <el-form-item label="会员电话">
          <el-input v-model="addMemberInfo.phone" placeholder="会员电话"></el-input>
        </el-form-item>
        <el-form-item label="会员地址">
          <el-select v-model="location.province" placeholder="省份" @focus="getProvince" @change="getCity(location.province)">
            <el-option
              v-for="(item,index) in province"
              :key="index"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
          <el-select v-model="location.city" placeholder="市区"  @change="getTown(location.city)">
            <el-option
              v-for="(item,index) in city"
              :key="index"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>

          <el-select v-model="location.town" placeholder="县">
            <el-option
              v-for="(item,index) in town"
              :key="index"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员微信">
          <el-input v-model="addMemberInfo.wechat" placeholder="会员微信"></el-input>
        </el-form-item>
        <el-form-item label="消费次数">
          <el-input-number  :min="1" v-model="addMemberInfo.times" placeholder="消费次数" :disabled="countDistable"></el-input-number>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false;insertMember()">确 定</el-button>
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
          memberName: '',
          memberNumber: '',
          memberWechat: ''
        },
        list: [],
        dialogVisible: false,
        addMemberInfo: {
          member_name: '',
          phone: '',
          address: {
            province:'',
            city:'',
            town:'',
          },
          wechat: '',
          times: '',
          membertId: '',
        },
        getByIdInfo: {
          id: '',
        },
        countDistable: false,
        deleteInfo: {
          id: '',
        },
        addOrUpdateFlag: '',
        //省份数据
        province:[],
        //市区数据
        city:[],
        //县级数据
        town:[],
        location:{
          province:'',
          city:'',
          town:'',
        },
        getCityParam:{
          code:''
        },
        getTownParam:{
          name:''
        },
      }
    },
    created() {
      this.getMemberList();
    },
    methods: {
      getMemberList() {
        this.api({
          url: "/member/getPage",
          method: "get",
          params: this.queryInfo
        }).then(data => {
          this.list = data.list;
          this.totalCount = data.totalCount;
        })
      },
      //监听pageSize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageRow = newSize;
        this.getMemberList();
      },
      //监听当前页的变化
      handleCurrentChange(newPage) {
        //向pageNum赋值
        this.queryInfo.pageNum = newPage;
        //再次调用查询方法
        this.getMemberList();
      },
      clearAll() {
        this.queryInfo.memberName = '';
        this.queryInfo.memberNumber = '';
        this.queryInfo.memberWechat = '';
      },
      showEditDialog(data) {
        this.getByIdInfo.id = data.id;
        this.dialogVisible = true;
        //调用查询方法
        this.api({
          url: "/member/getById",
          method: "get",
          params: this.getByIdInfo,
        }).then(data => {
          this.addMemberInfo.membertId = data.id;
          this.addMemberInfo.member_name = data.memberName;
          this.addMemberInfo.phone = data.memberPhone;
          this.location.province = data.province;
          this.location.city = data.city;
          this.location.town = data.town;
          this.addMemberInfo.wechat = data.memberWechat;
          this.addMemberInfo.times = data.memberCount;
          //将消费次数变为不可变的
          this.countDistable = true;
        })
      },
      insertMember() {
        if (this.countDistable == true) {
          //编辑
          this.api({
            url: "/member/updateMember",
            method: "post",
            params: this.addMemberInfo,
          }).then(data => {
            if (data == 'success') {
              this.$message.info("编辑成功");
              this.getMemberList();
            } else {
              this.$message.error("编辑失败");
            }
          })
        } else {
          //新增
          this.addMemberInfo.address=this.location;
          this.api({
            url: "/member/addMember",
            method: "post",
            params: this.addMemberInfo,
          }).then(data => {
            if (data == 'success') {
              this.$message.info("添加成功");
              this.getMemberList();
            } else {
              this.$message.error("添加失败");
            }
          })
        }
      },
      addMember() {
        this.dialogVisible = true;
        this.countDistable = false;
        this.addMemberInfo.member_name='';
        this.addMemberInfo.phone='';
        this.location.province='';
        this.location.city='';
        this.location.town='';
        this.addMemberInfo.wechat='';
        this.addMemberInfo.times='';
      },
      showSrueDelete(data) {
        this.deleteInfo.id = data.id;
        this.api({
          url: "/member/deleteById",
          method: "post",
          params: this.deleteInfo,
        }).then(data => {
          if (data = 'success') {
            this.$message.info("删除成功！")
            this.getMemberList();
          } else {
            this.$message.error("删除失败！")
          }
        })
      },
      exportData() {
        this.api({
          url: "/member/export",
          method: "post",
          params: this.queryInfo,
        }).then(data => {
          if (data = 'success') {
            this.$message.info("导出成功！")
            this.getMemberList();
          } else {
            this.$message.error("导出失败！")
          }
        })
      },
      getProvince(){
        this.api({
          url: "/location/getProvince",
          method: "get",
        }).then(data => {
          this.province=data.list;
        })
      },
      getCity(code){
        this.location.city='';
        this.location.town='';
        this.city=[];
        this.town=[];
        this.getCityParam.code=code;
        this.api({
          url: "/location/getCity",
          method: "get",
          params: this.getCityParam,
        }).then(data => {
          this.city=data.list;
        })
      },
      getTown(name){
        this.location.town='';
        this.town=[];
        this.getTownParam.name=name;
        this.api({
          url: "/location/getTown",
          method: "get",
          params: this.getTownParam,
        }).then(data => {
          this.town=data.list;
        })
      }
    }
  }
</script>
