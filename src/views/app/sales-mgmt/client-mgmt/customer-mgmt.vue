<style lang="less" scoped>

</style>
<template>
    <div>
        <Card class="margin-bottom-10 padding-top-bottom-minish">
            <div class="select-col" >
                <div class="div">
                    <label class="label" for="for">单位分类</label>
                    <Select  v-model="formValidate.Class_ID" class="select" :transfer="true">
                        <Option  v-for="item in classSelectData" :value="item.class_ID" :key="item.class_ID">{{ item.subClass_Value }}</Option>
                    </Select>
                </div>
                <Button type="primary" icon="ios-search" @click="btnCheck" >查询</Button>
                <Button type="primary"  @click="addModal = true;handleReset ('formValidate') " icon="plus">新增</Button>
            </div>
        </Card>
        <Card class="margin-bottom-10">
            <Table class="margin-bottom-10" size="small" border  style="min-height:400px;" :columns="columns" :data="data1"></Table>
            <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement="top" :transfer="true"></Page>
        </Card>
        <!-- 新增模态框 -->
        <Modal class="modal-common" v-model="addModal" icon="clipboard" :mask-closable="false" class-name="vertical-center-modal" >
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>新增产品信息</span>
            </p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" :show-message="false">
                <FormItem label="分类" prop="class_ID">
                    <Select  v-model="formValidate.class_ID" class="select" style="width: 300px" :transfer="true">
                        <Option  v-for="item in classSelectData" :value="item.class_ID" :key="item.class_ID">{{ item.subClass_Value }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="单位名称" prop="subClass_Value">
                    <Input  class="select" v-model="formValidate.subClass_Value" placeholder="请输入单位名称" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="联系人" prop="cmp_Contact">
                    <Input  class="select" v-model="formValidate.cmp_Contact" placeholder="请输入联系人" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="电话" prop="cmp_Phone">
                    <Input  class="select" v-model="formValidate.cmp_Phone" placeholder="请输入电话" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="地址" prop="cmp_Adress">
                    <Input  class="select" v-model="formValidate.cmp_Adress" placeholder="请输入地址" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="备注" prop="remarks">
                    <Input  class="select" v-model="formValidate.remarks" placeholder="请输入备注" style="width: 300px"></Input>
                </FormItem>
            </Form>
             <div slot="footer">
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
            </div>
        </Modal>
        <!-- 修改模态框 -->
        <Modal class="modal-common" v-model="editModal" :mask-closable="false" class-name="vertical-center-modal">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>修改产品信息</span>
            </p>
            <Form ref="indexData" :model="indexData" :rules="ruleValidate" :label-width="120" :show-message="false">
                <FormItem label="分类" prop="class_ID">
                    <Select  v-model="indexData.class_ID" class="select" style="width: 300px" :transfer="true">
                        <Option  v-for="item in classSelectData" :value="item.class_ID" :key="item.class_ID" >{{ item.subClass_Value }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="单位名称" prop="subClass_Value">
                    <Input  class="select" v-model="indexData.subClass_Value" placeholder="请输入单位名称" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="联系人" prop="cmp_Contact">
                    <Input  class="select" v-model="indexData.cmp_Contact" placeholder="请输入联系人" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="电话" prop="cmp_Phone">
                    <Input  class="select" v-model="indexData.cmp_Phone" placeholder="请输入电话" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="地址" prop="cmp_Adress">
                    <Input  class="select" v-model="indexData.cmp_Adress" placeholder="请输入地址" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="备注" prop="remarks">
                    <Input  class="select" v-model="indexData.remarks" placeholder="请输入备注" style="width: 300px"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="cancel" style="margin-left: 8px">取消</Button>
                <Button type="primary" @click="amend('indexData')">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import base from '@/libs/base';

 export default {
        data () {
            return {
                orderDate:'',
                reciveDate:'',
                order:'',                       // 订货单位
                recive:'',                      // 收货单位
                addModal: false,                // 新增按钮--模态框
                editModal: false,              // 修改按钮--模态框
                options: '',                    // 用来存储查询函数的帅选字段
                classSelectData: [
                    {class_ID:'102',subClass_Value:'产品订购单位'},
                    {class_ID:'114',subClass_Value:'产品收货单位'},
                ],                       // 第一个select下拉列表数据
                data1: [],                      // 表格数据
                total: 100,                    // 数据总条数
                pageCurrent: 1,                // 当前页码
                pageSize: 10,                  // 每页显示条数
                skip: 0,                       // 当前获取索引
                value: '',                      // 拼音检索input的值   
                indexData: {},                  // 删除模态框所用的表格行数据
                columns: [                      // 表格表头/列信息
                    {key: "subClass_Value", title: "单位名称",align: 'center',},
                    {key: "cmp_Contact", title: "联系人",align: 'center',},
                    {key: "cmp_Phone", title: "电话",align: 'center', },
                    {key: "cmp_Adress", title: "地址",align: 'center',width:300 },
                    {key: "isEnableN", title: "启用状态",align: 'center',},
                    {title: '操作',align: 'center',key: 'handle',width: 210,
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                    props:  { type: 'default',size: 'small'},
                                    style: {marginRight: '5px' },
                                    on: {click: () => {this.lock(params.index)}
                                    }}, '解锁 / 锁定'),
                                    h('Button', {props: {
                                        type: 'success',size: 'small'},
                                        style: {marginRight: '5px' },
                                        on: {click: () => {this.modify(params.index)}
                                        }}, '修改'),
                                    h('Button', {props: {
                                        type: 'warning',size: 'small'},
                                        on: {click: () => { this.remove(params.index) }}}, '删除') ]);}
                        }
                ],
               // 提交的数据  也是验证表单绑定的数据
                formValidate: {
                    "ID": "int",
                    "Class_ID": '102',
                    "SubClass_ID": "",
                    "SubClass_Value": "",
                    "Cmp_FName": "",
                    "Cmp_Contact": "",
                    "Cmp_Phone": "",
                    "Cmp_Adress": "",
                    "Cmp_DepositBank": "",
                    "Cmp_Account": "",
                    "Cmp_Tax": "",
                    "Zip_Code": "",
                    "IsEnable": "1",
                    "PinYin": "",
                    "Remarks": ""
                },
                // 表单验证的规则
                ruleValidate: {
                    class_ID: [
                        { required: true,trigger: 'change' }
                    ],
                    subClass_Value: [
                        { required: true, message: '公司简称不能为空', trigger: 'blur' },
                    ],
                    cmp_Contact: [
                        { required: true, message: '产品规格不能为空', trigger: 'blur' },
                    ],
                    cmp_Phone: [
                        { required: true, message: '产品钢级不能为空', trigger: 'blur' },
                    ],
                    cmp_Adress: [
                        { required: true,trigger: 'blur' },
                    ]
                }
            }
        },
        methods: {
            add(){
               addModal = true;
            },
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
                base.ajaxData('/PublicApi/Bs_commisEableupd_view?', para, 'PUT', (e) => {
                    this.changePage(this.pageCurrent);
                    this.$Message.success({duration: 3, content: '更新成功'});
                });
            },
            // 修改数据模态框---确认
            amend (name) {
                this.$refs[name].validate((valid) => {
                    let _self = this;
                    if (valid) {
                        this.indexData.SubClass_ID = this.indexData.comm_ID.substring(3,8);
                        base.putAjaxData(base.baseURL + '/PublicApi/Bs_CommInfo',JSON.stringify(this.indexData), (e) => {
                            _self.$Message.success({duration: 3, content: '更新成功！'});
                            _self.changePage(_self.pageCurrent);
                            _self.editModal = false;
                            _self.$refs[name].resetFields();
                        });
                    } else {
                        this.$Message.error({duration: 5, content: '带*为必填项'});
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
                let _self = this;
                this.$Modal.confirm({
                    title: '提醒消息',
                    content: '<p>确定删除这条吗？</p>',
                    onOk: () => {
                        base.deleteAjaxData(base.baseURL + '/PublicApi/Bs_CommInfo?ID=' + this.data1[index].id, (e) => {
                            switch (e.errMsg) {
                                case 'ok':
                                    _self.$Message.success({duration: 3, content: '删除成功！'});
                                    _self.changePage(_self.pageCurrent)
                                    break;
                                default:
                                    break;
                            }
                        });
                    },
                    onCancel: () => {
                        this.$Message.info({duration: 5, content: '取消删除！'});
                    }
                });  
            },
            btnCheck(skip, take) {
                this.pageCurrent = 1;
                this.check(0, this.pageSize);
            },
            check(skip, take){
                let _self = this;
                let para = {};
                
                para.Skip = skip;
                para.Take = this.pageSize;

                para.Comm_IDStartsWith =  this.formValidate.Class_ID;
              
                if(this.formValidate.Class_ID){
                    para.Comm_IDStartsWith =  this.formValidate.Class_ID;
                }

                base.ajaxData('PublicApi/Bs_comminfo_view', para, 'GET', (e) => {
                   
                    e.results.forEach( (item) => {
                    if(item.comm_ID ) item.comm_ID = item.comm_ID.substring(0,3);
                    });
                    _self.data1 = e.results;
                    _self.total = e.total;
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
                let _self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        base.postAjaxData(base.baseURL + '/PublicApi/Bs_CommInfo',JSON.stringify(this.formValidate),(e) =>{
                            _self.$Message.success({duration: 3, content: '登记保存成功！'});
                            _self.changePage(_self.pageCurrent)
                            _self.addModal = false;
                            _self.$refs[name].resetFields();
                        });
                    } else {
                        this.$Message.error({duration: 5, content: '带*为必填项'});
                    }
                })
            },
            // 表单重置
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        },
        // 获取数据
        mounted () {
            // 表格获取的全部数据
            this.check(this.skip, this.pageSize);
            let _self = this;
        },
        watch: {
            total: function(val) {
                base.watchTotal(val, this);
            }
        }
    }
</script>