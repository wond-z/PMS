<template>
    <div>
        <Card class="margin-bottom-10">
            <Button type="primary" @click="add()" icon="plus">新增</Button>
            <Input v-model="value" placeholder="拼音检索" style="width: 175px" @on-change="btnCheck"></Input>
            <span style="color:#ccc;font-size:12px;"> * 只允许输入“品名”拼音首字母，如:yg 油管</span>
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
                        <Option  v-for="item in classSelectData" :value="item.class_ID" :key="item.class_ID">{{ item.class_Value }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品品名" prop="subClass_Value">
                    <Input  class="select" v-model="formValidate.subClass_Value" placeholder="请输入产品品名" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="产品规格" prop="specifications">
                    <Input  class="select" v-model="formValidate.specifications" placeholder="请输入产品规格" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="钢级" prop="steelGrade">
                    <Input  class="select" v-model="formValidate.steelGrade" placeholder="请输入产品钢级" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="单位" prop="unit">
                    <Input  class="select" v-model="formValidate.unit" placeholder="请输入产品单位" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="螺纹类型" prop="luoWenType">
                    <Input class="select" v-model="formValidate.luoWenType" placeholder="请输入产品螺纹类型" style="width: 300px"></Input>
                </FormItem>
                <!-- <FormItem label="长度范围" prop="lengthRange">
                    <Input class="select" v-model="formValidate.lengthRange" placeholder="请输入长度范围" style="width: 300px"></Input>
                </FormItem> -->
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
                        <Option  v-for="item in classSelectData" :value="item.class_ID" :key="item.class_ID" >{{ item.class_Value }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品品名" prop="subClass_Value">
                    <Input  class="select" v-model="indexData.subClass_Value" placeholder="请输入产品品名" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="产品规格" prop="specifications">
                    <Input  class="select" v-model="indexData.specifications" placeholder="请输入产品规格" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="钢级" prop="steelGrade">
                    <Input  class="select" v-model="indexData.steelGrade" placeholder="请输入产品钢级" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="单位" prop="unit">
                    <Input  class="select" v-model="indexData.unit" placeholder="请输入产品单位" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="螺纹类型" prop="luoWenType">
                    <Input class="select" v-model="indexData.luoWenType" placeholder="请输入产品螺纹类型" style="width: 300px"></Input>
                </FormItem>
                <!-- <FormItem label="长度范围" prop="lengthRange">
                    <Input class="select" v-model="indexData.lengthRange" placeholder="请输入长度范围" style="width: 300px"></Input>
                </FormItem> -->
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
                addModal: false,                // 新增按钮--模态框
                editModal: false,              // 修改按钮--模态框
                options: '',                    // 用来存储查询函数的帅选字段
                classSelectData: [],                       // 第一个select下拉列表数据
                data1: [],                      // 表格数据
                total: 100,                    // 数据总条数
                pageCurrent: 1,                // 当前页码
                pageSize: 10,                  // 每页显示条数
                skip: 0,                       // 当前获取索引
                value: '',                      // 拼音检索input的值   
                indexData: {},                  // 删除模态框所用的表格行数据
                columns: [                      // 表格表头/列信息
                    {key: "subClass_Value", title: "品名",align: 'center',width: 150},
                    {key: "jsSpecifications", title: "规格",align: 'center',width: 200 },
                    {key: "steelGrade", title: "钢级",align: 'center'},
                    {key: "luoWenType", title: "螺纹类型",align: 'center'},
                    {key: "unit", title: "单位",align: 'center'},
                    // {key: "lengthRange", title: "长度范围",align: 'center'},
                    {key: "isEnableN", title: "启用状态",align: 'center'},
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
                    "class_ID": '',
                    "subClass_ID": "",
                    "subClass_Value": "",
                    "subSubClass_ID": "",
                    "steelGrade": "",
                    "specifications": "",
                    "unit": "",
                    "unitPrice": 0,
                    "stockNum": "int",
                    "stockWeight": 0,
                    "yJ_UpLimit": 0,
                    "yJ_DownLimit": 0,
                    "tecSpecifications": "",
                    "physicalPara": "",
                    "chemicalPara": "",
                    "testMethod": "",
                    "standardRequire": "",
                    "luoWenType": "",
                    "lengthRange": "",
                    "isEnable": "1",
                    "upDateTime": "int",
                    "remark": ""
                },
                // 表单验证的规则
                ruleValidate: {
                    class_ID: [
                        { required: true, message: '分类不能为空', trigger: 'change' }
                    ],
                    subClass_Value: [
                        { required: true, message: '公司简称不能为空', trigger: 'blur' },
                    ],
                    specifications: [
                        { required: true, message: '产品规格不能为空', trigger: 'blur' },
                    ],
                    steelGrade: [
                        { required: true, message: '产品钢级不能为空', trigger: 'blur' },
                    ],
                    isEnable: [
                        { type: 'boolean', required: true,  trigger: 'blur' },
                    ]
                }
            }
        },
        methods: {
            add(){
                this.addModal = true;
                this.$refs.formValidate.resetFields();
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
                base.ajaxData('PublicApi/Bs_gdsinfoisEableupd_view', para, 'PUT', (e) => {
                    this.changePage(this.pageCurrent);
                    this.$Message.success({duration: 3, content: '更新成功'});
                });
            },
            // 修改数据模态框---确认
            amend (name) {
                this.$refs[name].validate((valid) => {
                    let _self = this;
                    if (valid) {
                        base.putAjaxData(base.baseURL + 'PublicApi/Bs_GoodsInfo',JSON.stringify(this.indexData), (e) => {
                            _self.$Message.success({duration: 3, content: '更新成功！'});
                            _self.changePage(_self.pageCurrent);
                            _self.editModal = false;
                            _self.$refs[name].resetFields();
                        });
                    } else {
                        this.$Message.error({duration: 5, content: '保存失败！'});
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
            },
            // 表格里面单行删除
            remove (index) {
                let _self = this;
                this.$Modal.confirm({
                    title: '提醒消息',
                    content: '<p>确定删除这条吗？</p>',
                    onOk: () => {
                        base.deleteAjaxData(base.baseURL + '/PublicApi/bs_goodsinfo?ID=' + this.data1[index].id, (e) => {
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
                        this.$Message.info({duration: 5, content: '取消修改！'});
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
              
                if(this.value){
                    para.pinyinContains =  _self.value;
                }

                base.ajaxData('/PublicApi/Bs_goodsinfo_view?Wp_IDStartsWith=108', para, 'GET', (e) => {
                    console.log(e);
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
                        base.postAjaxData(base.baseURL + '/PublicApi/bs_goodsinfo',JSON.stringify(this.formValidate),(e) =>{
                            base.postAjaxData(base.baseURL + '/PublicApi/Bs_CommInfo',JSON.stringify(this.formValidate),(e) =>{
                                _self.$Message.success({duration: 3, content: '登记保存成功！'});
                                _self.changePage(_self.pageCurrent)
                                _self.addModal = false;
                                _self.$refs[name].resetFields();
                            });
                        });
                    } else {
                        this.$Message.error({duration: 5, content: '保存失败！'});
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
            // 模态框下拉列表数据
            base.getAjaxData(base.baseURL+'/PublicApi/Bs_ClassSet?Class_ID=108',(e)=>{
                _self.classSelectData = e.results;
            });
        },
        watch:{
            total: function(val) {
                base.watchTotal(val, this);
            }
        }
    }
</script>