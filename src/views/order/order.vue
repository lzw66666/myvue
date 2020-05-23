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
          <el-button type="success" plain @click="addOrderDialogVisible = true;getParentType();getOrderId()">添加订单
          </el-button>
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
    <!--添加订单的对话框-->
    <el-dialog
      title="添加订单"
      :visible.sync="addOrderDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="false"
      width="50%">
      <!--主体区域-->
      <el-form ref="addFormRef" :model="addFormInfo" label-width="80px">
        <el-form-item label="订单id" prop="goodsName">
          <el-input :disabled="true" v-model="addFormInfo.orderId"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="goodsName">
          <el-input v-model="addFormInfo.customerPhone" placeholder="请填写会员手机号，不是会员请勿填写" @blur="verifyPhone"></el-input>
        </el-form-item>
        <el-form-item label="添加商品" prop="parentType">
          <el-select v-model="addFormInfo.parentType" placeholder="商品类型" @change="getGoodsNameByType">
            <el-option v-for="(item,index) in parentNames" :key="index" :label=item.type_name
                       :value="item.id"></el-option>
          </el-select>
          <el-select v-model="addFormInfo.goodsName" placeholder="商品名称" style="margin-left: 20px"
                     @blur="openNumberInput()">
            <el-option v-for="(item,index) in goodsNameList" :key="index" :label=item.goodsName
                       :value="item.id" id="nameList"></el-option>
          </el-select>
          <el-input-number v-model="addFormInfo.count" size="medium" :min="1" label="商品数量"
                           style="position: absolute;width: 120px;margin-left: 20px"
                           @blur="verifyCount(addFormInfo.count,addFormInfo.goodsName)"
                           :disabled=numberDisabled></el-input-number>
        </el-form-item>
        <!-- 动态添加输入框按钮-->
        <el-button  type="info" style="width: 90%;margin-left: 35px" @click="continueAdd">添加商品信息</el-button>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="success" style="margin-right: 40px" @click="dialogVisible = true">添加会员信息</el-button>
        <el-button type="danger" @click="addOrderDialogVisible = false;cancelOrders()">取消订单</el-button>
        <el-button type="primary" @click="addOrderDialogVisible = false;settlement()">结算订单</el-button>
      </span>
    </el-dialog>

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
          <el-input v-model="addMemberInfo.address" placeholder="会员地址"></el-input>
        </el-form-item>
        <el-form-item label="会员微信">
          <el-input v-model="addMemberInfo.wechat" placeholder="会员微信"></el-input>
        </el-form-item>
        <el-form-item label="消费次数">
          <el-input-number :min="1" v-model="addMemberInfo.times" placeholder="消费次数"></el-input-number>
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
        verifyDialogVisible: false,
        statusList: [],
        addOrderDialogVisible: false,
        addFormInfo: {
          customerPhone: '',
          parentType: '',
          goodsName: '',
          count: '',
          orderId: ''
        },
        parentNames: [],
        goodsNameByType: {
          id: '',
        },
        goodsNameList: [],
        verifyPhoneDate: {
          phone: '',
        },
        phoneSuccess: '',
        verifyCountData: {
          goodsId: '',
          number: ''
        },
        numberDisabled: true,
        addMemberInfo: {
          member_name: '',
          phone: '',
          address: '',
          wechat: '',
          times: '',
        },
        dialogVisible: false,
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
      getStatusList() {
        this.api({
          url: "/order/getStatus",
          method: "post",
        }).then(data => {
          this.statusList = data.list;
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
      showDetail(id) {
        this.$router.push({
          path: '/detail',
          query: {
            id: id
          }
        })
      },
      getParentType() {
        this.api({
          url: "/goods/getParentType",
          method: "get",
        }).then(data => {
          this.parentNames = data.list;
        })
      },
      //添加订单时根据下拉框
      getGoodsNameByType(value) {
        //将其下一级下拉框置空
        this.addFormInfo.goodsName = '';
        this.goodsNameByType.id = value
        this.api({
          url: "/goods/getGoodsNameByParentType",
          method: "get",
          params: this.goodsNameByType
        }).then(data => {
          this.goodsNameList = data;
        })
      },
      //继续添加按钮信息
      continueAdd() {
        //点击继续添加，商品信息先行进行保存，返回信息进行展示
        this.api({
          url: "/order/insert",
          method: "post",
          params: this.addFormInfo
        }).then(data => {
          if (data == 'success') {
            //插入成功，提示订单信息修改成功，将dialog中的信息清空
            this.$message.info("订单信息插入成功，请继续插入订单信息")
            this.addFormInfo.goodsName = '';
            this.addFormInfo.count = '';
            this.addFormInfo.parentType = '';
            this.numberDisabled=true;
          } else {
            this.$message.warning("订单信息更新失败，请重新更新上一条信息")
          }
        })
      },
      //获取将要插入的订单id
      getOrderId() {
        this.api({
          url: "/order/getMaxOrderId",
          method: "get",
        }).then(data => {
          this.addFormInfo.orderId = data
        })
      },
      verifyPhone() {
        this.verifyPhoneDate.phone = this.addFormInfo.customerPhone
        if (this.verifyPhoneDate.phone == '') {
          return;
        }
        this.api({
          url: "/member/verifyPhone",
          method: "post",
          params: this.verifyPhoneDate
        }).then(data => {
          //手机号验证不成功
          if (data == 'fail') {
            this.$message.info("手机号不存在，重新输入！");
            this.addFormInfo.customerPhone = '';
          }
        })
      },
      verifyCount(number, goodsId) {
        this.verifyCountData.goodsId = goodsId;
        this.verifyCountData.number = number;
        this.api({
          url: "/goods/verifyCount",
          method: "post",
          params: this.verifyCountData
        }).then(data => {
          if (data != 'success') {
            this.$message.error("库存不足，剩余库存为：" + data);
            //清空数量
            this.addFormInfo.count = 0;
          }
        })
      },
      settlement() {
        this.$router.push({
          path: '/detail',
          query: {
            id: this.addFormInfo.orderId
          }
        })
      },
      cancelOrders() {
        this.deleteInfo.id = this.addFormInfo.orderId;
        this.deleteOrders();
      },
      //输入商品信息后打开数字输入框
      openNumberInput() {
        this.numberDisabled = false;
      },
      insertMember() {
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
    }
  }
</script>
