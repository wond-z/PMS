<style lang="less" scoped>

</style>

<template>
    <div>
        <card class="margin-bottom-10">
            <Button type="primary" @click="add()" icon="plus">新增</Button>
            <Input v-model="value" placeholder="拼音检索" style="width: 175px" @on-change="btnCheck" ></Input>
            <span style="color:#ccc;font-size:12px;"> * 只允许输入“变量值”拼音首字母，如:gl 公路</span>
            <div class="clear-both"></div>
        </card>
        <card class="margin-bottom-10">
            <Table class="margin-bottom-10" size="small" border style="min-height:400px;" :columns="columns" :data="data1"></Table>
            <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" placement="top" show-elevator show-sizer></Page>
        </card>
        <!-- 新增模态框 -->
        <Modal class="modal-common" v-model="addModal" icon="clipboard" :mask-closable="false" class-name="vertical-center-modal">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>新增部分单位信息</span>
            </p>
            <Form ref="addForm" :model="formValidate" :rules="ruleValidate" :label-width="120" :show-message="false">
                <FormItem label="分类" prop="class_ID">
                    <Select  v-model="formValidate.class_ID" class="select" style="width: 300px" :transfer="true">
                        <Option  v-for="item in data" :value="item.class_ID" :key="item.class_ID">{{ item.class_Value }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="变量名称" prop="cmp_FName">
                    <Input   v-model="formValidate.cmp_FName" placeholder="请输入变量名称" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="变量值" prop="subClass_Value">
                    <Input   v-model="formValidate.subClass_Value" placeholder="请输入变量值" style="width: 300px"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="handleReset('addForm')" style="margin-left: 8px">重置</Button>
                <Button type="primary" @click="handleSubmit('addForm')">保存</Button>
            </div>
        </Modal>
        <!-- 修改模态框 -->
        <Modal class="modal-common" v-model="editModal" :mask-closable="false" class-name="vertical-center-modal">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>修改部门单位信息</span>
            </p>
            <Form ref="indexData" :model="indexData" :rules="ruleValidate" :label-width="120" :show-message="false">
                <FormItem label="分类" prop="class_ID">
                    <Select  v-model="indexData.class_ID" class="select" style="width: 300px" :transfer="true">
                        <Option  v-for="item in data" :value="item.class_ID" :key="item.class_ID">{{ item.class_Value }}</Option>
                    </Select>
                </FormItem> 
                <FormItem label="变量名称" prop="cmp_FName">
                    <Input   v-model="indexData.cmp_FName" placeholder="请输入变量名称" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="变量值" prop="subClass_Value">
                    <Input   v-model="indexData.subClass_Value" placeholder="请输入变量值" style="width: 300px" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="cancel" >取消</Button>
                <Button type="primary" @click="amend('indexData')" style="margin-left: 8px">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import base from '@/libs/base';

export default {
    data () {
        return {
            carValue: [],
            addModal: false,             // 新增按钮--模态框
            options: '',                 // 用来存储查询函数的帅选字段
            data: [],                    // 第一个select下拉列表数据
            data1: [],                   // 表格数据
            total: 100,                  // 数据总条数
            pageCurrent: 1,              // 当前页码
            pageSize: 10,                // 每页显示条数
            skip: 0,                     // 当前获取索引
            value:'',                    // 拼音检索input的值 
            indexData: {},               // 删除模态框所用的表格行数据
            upData:{},
            editModal: false,            // 修改按钮--模态框
            columns: [                   // 表格表头/列信息
                // {key: "id", title: "ID",align: 'center',width: 100},
                {key: "cmp_FName", title: "变量名称",align: 'center'},
                {key: "subClass_Value", title: "变量值",align: 'center'},
                {key: "isEnable", title: "启用状态",align: 'center',
                    render: (h, params) => {
                        switch (params.row.isEnable) {
                            case 1:
                                return '启用';
                                break;
                            case 2:
                                return '禁用';
                                break;
                            default:
                                break;
                        }
                    }
                },
                {title: '操作',align: 'center',width: 210,key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props:  { type: 'default',size: 'small'},
                                    style: {marginRight: '5px' },
                                    on: {click: () => { this.lock(params.index)}
                                    }}, '解锁 / 锁定'),
                                h('Button', {
                                    props:  { type: 'success',size: 'small'},
                                    style: {marginRight: '5px' },
                                    on: {click: () => { this.modify(params.index)}
                                    }}, '修改'),
                                h('Button', {props: {
                                    type: 'warning',size: 'small'},
                                    on: {click: () => { this.remove(params.index) }}}, '删除')
                                     ]);}
                    }
               ],
               // 提交的数据  也是验证表单绑定的数据
                formValidate:{
                    "ID": "",
                    "class_ID": "110",
                    "subClass_ID": "",
                    "subClass_Value": "",
                    "cmp_FName": "运输车号",
                    "cmp_Contact": "",
                    "cmp_Phone": "",
                    "cmp_Adress": "",
                    "cmp_DepositBank": "",
                    "cmp_Account": "",
                    "cmp_Tax": "",
                    "zip_Code": "",
                    "isEnable": 1,
                    "pinYin": "",
                    "remarks": ""
                },
                // 表单验证的规则
                ruleValidate: {
                    class_ID: [
                        { required: true, message: '不能为空', trigger: 'change' }
                    ],
                    subClass_Value: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    cmp_FName: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            add(){
                this.addModal = true;
                this.$refs.addForm.resetFields();
            },
            // 修改数据模态框---确认
            amend (name) {
                this.$refs[name].validate((valid) => {
                    let pass = true;
                    if (valid) {
                        base.ajaxData('PublicApi/Bs_comminfo_view?Comm_IDStartsWith=110&Comm_ID!='+ this.indexData.comm_ID, {}, 'GET', (e) => {
                            if(e.results.length > 0){
                                e.results.forEach((item) => {
                                    if(this.indexData.subClass_Value == item.subClass_Value){
                                        this.$Message.error({duration: 5, content: '此车号已存在请重新输入'});
                                        pass = false;
                                        return pass;
                                    }
                                })
                                if(pass == true){
                                    let num = this.indexData.comm_ID.substring(3,8);
                                    this.upData = this.indexData;
                                    this.upData.subClass_ID = num;
                                    base.putAjaxData(base.baseURL + '/PublicApi/Bs_CommInfo',JSON.stringify(this.upData),(e) =>{
                                        this.$Message.success({duration: 3, content: '更新成功！'});
                                        this.changePage(this.pageCurrent);
                                        this.editModal = false;
                                        this.$refs[name].resetFields();
                                    });
                                }
                            }
                        });
                    } else {
                        this.$Message.error({duration: 5, content: '数据未输入完整!'});
                    }
                })
            },
            cancel(){
                this.editModal = false;
                this.$Message.info({duration: 5, content: '取消修改！'});
                this.changePage(this.pageCurrent)
            },
            // 表格里面的单行修改模态框
            modify (index) {
                this.editModal = true;
                this.indexData = this.data1[index];
                this.indexData.class_ID = this.indexData.comm_ID.substring(0,3);
            },
            // 表格里面单行删除
            remove (index) {
                this.$Modal.confirm({
                    title: '提醒消息',
                    content: '<p>确定删除这条吗？</p>',
                    onOk: () => {
                        this.$Message.success({duration: 3, content: '删除成功！'});
                        base.deleteAjaxData(base.baseURL + 'PublicApi/Bs_CommInfo?ID=' + this.data1[index].id,(e)=>{
                        this.changePage(this.pageCurrent)
                        });
                    },
                    onCancel: () => {
                        this.$Message.info({duration: 5, content: '取消删除！'});
                    }
                });  
            },
            // 拼音检索
            btnCheck(skip, take) {
                this.pageCurrent = 1;
                this.check(0, this.pageSize);
            },
            check(skip, take){
                let para = {};
                this.carValue = [];
                para.Skip = skip;
                para.Take = this.pageSize;
                
                if(this.value){
                    para.pinyinContains =  this.value;
                }
                base.ajaxData('PublicApi/Bs_comminfo_view?Comm_IDStartsWith=110', para, 'GET', (e) => {
                    this.data1 = e.results;
                    this.total = e.total;
                });
            },
           // 改变页码时
            changePage (index) {
                this.pageCurrent = index;
                let _size = this.pageSize;
                this.skip = (index-1)*_size;
                this.check(this.skip ,_size);
            },
            // 改变每页显示条数时
            changePageSize (size) {
                this.pageSize = size;
                this.check(this.skip, size);
            },
            // 表单提交
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    let pass = true;
                    if (valid) {
                        base.ajaxData('PublicApi/Bs_comminfo_view?Comm_IDStartsWith=110', {}, 'GET', (e) => {
                            if(e.results.length > 0){
                                e.results.forEach((item) => {
                                    if(this.formValidate.subClass_Value== item.subClass_Value){
                                        this.$Message.error({duration: 5, content: '此车号已存在请重新输入'});
                                        pass = false;
                                        return pass;
                                    }
                                })
                                if(pass == true){
                                    base.postAjaxData(base.baseURL + '/PublicApi/Bs_CommInfo',JSON.stringify(this.formValidate),(e) =>{
                                        this.$Message.success({duration: 3, content: '登记保存成功！'});
                                        this.changePage(this.pageCurrent)
                                        this.addModal = false;
                                        this.$refs[name].resetFields();
                                    });
                                }
                            }
                        })
                    }else {
                        this.$Message.error({duration: 5, content: '保存失败！'});
                    }
                 })
            },
            // 表单重置
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            // 解锁
            lock(index){
                let isEnable_status = this.data1[index].isEnable;
                let para = {}
                    if(isEnable_status == 1){
                        isEnable_status = 2;
                    }else if(isEnable_status == 2){
                        isEnable_status = 1;
                    }
                para.IsEnable = isEnable_status;
                para.ID = this.data1[index].id;
                base.ajaxData('/PublicApi/Bs_commisEableupd_view', para, 'PUT', (e) => {
                    this.changePage(this.pageCurrent);
                    this.$Message.success({duration: 3, content: '更新成功'});
                });
            },
        },
        // 获取数据
        mounted () {
            // 表格获取的全部数据
            this.check(this.skip, this.pageSize);
            // 第一个下拉框获取的数据--大类
            base.getAjaxData(base.baseURL + '/PublicApi/Bs_ClassSet?Class_ID=110', (e) => {
                this.data = e.results;
                // this.formValidate.class_ID = this.data[0].class_ID
            });
        },
        watch:{
            total: function(val) {
                base.watchTotal(val, this);
            }
        }
    }
</script>