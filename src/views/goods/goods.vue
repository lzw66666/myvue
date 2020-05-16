<template>
  <div>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="40">
        <el-col :span="4">
          <el-input type="text" size="medium" v-model="queryInfo.goods_name" placeholder="商品名称"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input type="text" size="medium" v-model="queryInfo.parent_type" placeholder="父级分类id"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input type="text" size="medium" v-model="queryInfo.type_name" placeholder="父级分类名称"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="getGoodsList">搜索</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="reset">重置</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="success" plain @click="addDialogVisible = true;getParentType()">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="list" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="count" label="库存"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="parent_type" label="父级分类id"></el-table-column>
        <el-table-column prop="type_name" label="父级分类名称"></el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽-->
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑商品" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除商品" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="verifyDeleteGoods(scope.row)"></el-button>
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
    <!--添加商品的对话框-->
    <el-dialog
      title="添加商品信息"
      :visible.sync="addDialogVisible"
      width="45%">
      <!--内容主题区域-->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="商品名称" prop="addName">
          <el-input v-model="addForm.addName"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="addCount">
          <el-input v-model.number="addForm.addCount"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="addPrice">
          <el-input v-model.number="addForm.addPrice"></el-input>
        </el-form-item>
        <el-form-item label="父级商品" prop="addParentType">
          <el-select v-model="addForm.addParentType" placeholder="父级商品名称">
            <el-option v-for="(item,index) in parentNames" :key="index" :label=item.type_name
                       :value="item.id"></el-option>
          </el-select>
          <el-button type="success" style="margin-left: 80px;" @click="addParentType">添加商品父类信息</el-button>
        </el-form-item>

      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
         <el-button @click="addDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="addDialogVisible = false;insertGoods()">提交</el-button>
      </span>
    </el-dialog>
    <!--修改商品的对话框-->
    <el-dialog
      title="编辑商品信息"
      :visible.sync="editDialogVisible"
      width="45%">
      <!--内容主题区域-->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="editGoodsInfo.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="goodsCount">
          <el-input v-model.number="editGoodsInfo.goodsCount"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model.number="editGoodsInfo.price"></el-input>
        </el-form-item>
        <el-form-item label="父级商品" prop="parentType">
          <el-select v-model="editGoodsInfo.parentType" placeholder="父级商品名称">
            <el-option v-for="(item,index) in parentNames" :key="index" :label=item.type_name
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
         <el-button @click="editDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="editDialogVisible = false;updateGoods()">修改</el-button>
      </span>
    </el-dialog>
    <!--删除提示框-->
    <el-dialog
      title="提示"
      :visible.sync="verifyDialogVisible"
      width="30%">
      <span>是否进行删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="verifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="verifyDialogVisible = false;deleteGoods()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="父类商品信息"
      :visible.sync="parentTypeDialogVisible"
      width="30%">
      <!--主体区域-->
      <el-input
        placeholder="请输入父类商品名称"
        v-model="addParentTyepValue.parentName"
        clearable>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="parentTypeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="parentTypeDialogVisible = false;addParentFrom()">确 定</el-button>
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
        listLoading: false,//数据加载等待动画
        queryInfo: {
          query: '',
          //当前的页数
          pageNum: 1,
          //每页显示多少条数据
          pageRow: 5,
          goods_name: '',
          parent_type: '',
          type_name: '',
        },
        // 控制添加商品的对话框的显示与隐藏
        addDialogVisible: false,
        //添加商品的表单数据
        addForm: {
          addName: '',
          addCount: '',
          addParentType: '',
          addPrice: ''
        },
        parentNames: [],//查询的父级分类信息
        addFormRules: {
          addName: [{
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }],
          addCount: [{
            required: true,
            message: '请输入库存',
            trigger: 'blur'
          }, {
            type: 'number',
            message: '库存必须为数字值',
          }],
          addParentType: [{
            required: true,
            message: '选择父级分类',
            trigger: 'blur'
          }]
        },
        //控制编辑商品信息对话框的显示与隐藏
        editDialogVisible: false,
        //编辑页面的参数
        editGoodsInfo: {
          id: '',
          goodsName: '',
          goodsCount: '',
          parentType: '',
          price: '',
        },
        deleteInfo: {
          id: '',
        },
        verifyDialogVisible: false,
        parentTypeDialogVisible:false,
        addParentTyepValue:{
          parentName:'',
        }
      }
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      getGoodsList() {
        this.listLoading = true;
        this.api({
          url: "/goods/getPage",
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
        this.getGoodsList();
      },
      //监听当前页的变化
      handleCurrentChange(newPage) {
        //向pageNum赋值
        this.queryInfo.pageNum = newPage;
        //再次调用查询方法
        this.getGoodsList();
      },
      //重置方法
      reset() {
        this.queryInfo.goods_name = "";
        this.queryInfo.parent_type = "";
        this.queryInfo.type_name = "";
      },
      getParentType() {
        this.api({
          url: "/goods/getParentType",
          method: "get",
        }).then(data => {
          this.parentNames = data.list;
        })
      },
      insertGoods() {
        //提交之前验证表单必填项
        if (this.addForm.addCount == '' || this.addForm.addCount == '' || this.addForm.addParentType == '') {
          //不通过验证则弹出框继续展示
          this.addDialogVisible = true;
          this.$message.warning("请验证表单必填项");
          return;
        }
        this.api({
          url: "/goods/insertGoods",
          method: "post",
          params: this.addForm
        }).then(data => {
          if (data == 'success') {
            this.$message.info("新增成功！")
            this.getGoodsList();
          } else {
            this.$message.warning("插入失败")
          }
        })
      },
      //编辑商品信息
      showEditDialog(goods) {
        this.editDialogVisible = true;
        this.getParentType();
        this.editGoodsInfo.id = goods.id;
        this.editGoodsInfo.price = goods.price;
        this.editGoodsInfo.goodsName = goods.goods_name;
        this.editGoodsInfo.goodsCount = goods.count;
        this.editGoodsInfo.parentType = goods.parent_type;
      },
      deleteGoods() {
        this.api({
          url: "/goods/deleteGoods",
          method: "post",
          params: this.deleteInfo
        }).then(data => {
          if (data == 'success') {
            this.$message.info("删除成功！")
            this.getGoodsList();
          } else {
            this.$message.warning("删除失败")
          }
        })
      },
      updateGoods() {
        this.api({
          url: "/goods/updateGoods",
          method: "post",
          params: this.editGoodsInfo
        }).then(data => {
          if (data == 'success') {
            this.$message.info("编辑成功！")
            this.getGoodsList();
          } else {
            this.$message.warning("编辑失败")
          }
        })
      },
      verifyDeleteGoods(goods) {
        //提示是否进行删除
        this.verifyDialogVisible = true;
        this.deleteInfo.id = goods.id;
      },
      //添加父类的商品信息
      addParentType(){
        this.parentTypeDialogVisible=true;
      },
      addParentFrom(){
        this.api({
          url: "/goods/addParentType",
          method: "post",
          params: this.addParentTyepValue
        }).then(data => {
          if(data=='success'){
            this.$message.info("添加成功");
            this.addParentTyepValue.parentName='';
            this.getParentType();
          }
        })
      }
    }
  }
</script>
