<style lang="less" scoped>
    @import './stuff-mgmt-common.less';
</style>

<template>
    <div class="stuff-common-mgmt">
        <Button type="primary" icon="plus" @click="add()">新增</Button>
        <Button type="primary" icon="edit" :disabled = '!isToUpdate' @click="update()">修改</Button>
        <Button type="primary" icon="trash-a" :disabled = '!isToDelete'  @click="toDelete()">删除</Button>
        <Button type="primary" icon="ios-upload">导出信息</Button>
        <Card class="margin-bottom-10 margin-top-10">
            <div class="div">
                <Input v-model="queryCdt.zPinYin" placeholder="拼音检索" style="width: 175px" @on-change="btnCheck()" ></Input>
                <span style="color:#ccc;font-size:12px;"> * 只允许输入“品名”拼音首字母，如:yg 油管</span>
            </div>
        </Card>
        <Row>
            <Col :span="colLeft">
                <Card class="layout" style="overflow-y: scroll; overflow-x: hidden; ">
                    <div slot="title">
                        <div v-if="buttonStatus == 'none'">
                           <div class="margin-bottom-10">
                                <Button type="ghost" shape="circle" size="small" @click="editShow"><Icon type="ios-compose-outline"></Icon> 编辑</Button>
                                <Input v-model="pinYin" placeholder="拼音检索" style="width: 120px" @on-change="search(pinYin)"></Input>
                           </div>
                            <span style="color:#ccc;font-size:12px;"> 请输入下方材料的首字母，如:wj 五金</span>
                        </div>
                        <div v-else-if="buttonStatus == ''">
                            <Button type="primary" shape="circle" size="small" @click="editClose"><Icon type="ios-download-outline"></Icon> 保存</Button>
                        </div>
                    </div>
                    <Tree style="width: 100%;" :data="data" :render="renderContent"></Tree>
                </Card>
            </Col>
            <Col :span="colRight">
                <card class="layout" style="">
                    <div class="margin-bottom-10" >
                        <Table class="table-head-center" border :columns="detailColumns" :data="deptmDetail" size="small" :highlight-row='true' @on-row-click='selectRow'></Table>
                    </div>
                    <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement='top'></Page>
                </card>
            </Col>
        </Row>
        <Modal v-model="modal" :title="modalTitle" @on-ok="ok(modalTitle)" class-name="vertical-center-modal">
            <Input v-model="deptmName" placeholder="材料类别" value="" :maxlength="5"></Input>
        </Modal>
        <!-- 品种添加，修改模态 -->
        <Modal class="modal-table-form stuff-variety-modal" width='900px' :mask-closable="false" v-model="addModal" class-name="vertical-center-modal">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>物资品种录入</span>
            </p>
            <div class="">
                <Form ref="addForm" :model="addData" :rules="addValidate">
                    <div class="modal-table margin-top-10">
                        <table class="table-common" border="1" cellspacing='0'>
                            <tr>
                                <td>品名</td>
                                <td>
                                    <FormItem prop=''>
                                        <Input v-model="addData.SubClass_Value" placeholder="请输入品名" :maxlength="10"></Input>
                                    </FormItem>
                                </td>
                                <td colspan="2">
                                    <Checkbox>
                                        <span>大宗</span>
                                    </Checkbox>
                                    <Checkbox>
                                        <span>有机物消耗</span>
                                    </Checkbox>
                                </td>
                            </tr>
                            <tr>
                                <td class="width-150">含税单价（元）</td>
                                <td>
                                    <FormItem prop='UnitPrice'>
                                        <Input v-model="addData.UnitPrice" placeholder="请输入单价" :maxlength="11"></Input>
                                    </FormItem>
                                </td>
                                <td class="width-150">规格</td>
                                <td>
                                    <FormItem prop='Specifications'>
                                        <Input v-model="addData.Specifications" placeholder="请输入规格" :maxlength="60"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>单位</td>
                                <td>
                                    <FormItem prop='Unit'>
                                        <Input v-model="addData.Unit" placeholder="请输入单位" :maxlength="16"></Input>
                                    </FormItem>
                                </td>
                                <td>权重</td>
                                <td>
                                    <FormItem prop='qz'>
                                        <Input v-model="addData.qz" placeholder="请输入权重" :maxlength="5"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('addModal')">取消</Button>
                <Button type="primary" @click="toLogSubmit('addForm')">保存</Button>
            </p>
        </Modal>
    </div>
</template>

<script>
import base from '@/libs/base';

export default {
    props:{
        maxlength: 5
    },
    data () {
        return {
            pinYin:'',
            queryWay:'tree',//查询方式
            // 按钮状态
            isToUpdate:false,
            isToDelete:false,
            postStatus:'',//提交状态
            addData:{},//添加的数据
            addValidate:{//数据校验
                SubClass_Value: [
                    { required: true,message:' '}
                ],
                UnitPrice: [
                    { required: true,message:' '}
                ],
                Unit: [
                    { required: true,message:' '}
                ],
                QZ: [
                    { required: true,message:' '}
                ],
            },
            queryCdt:{},//查询条件
            // 表格及分页数据
            data: [],
            total: 100,
            pageCurrent: 1,
            pageSize: 10,
            skip: 0,
            screenHeight: document.body.clientHeight - 200,
            data: [],
            buttonProps: {          // 树按钮属性
                type: 'ghost',
                size: 'small',
            },
            buttonStatus: 'none',   // 按钮是否显示
            modal: false,           // modal状态
            addModal: false,
            modalTitle: '',         // modal标题
            deptmName: '',          // 输入框部门名称
            nodeInfo: {},           // 选中node信息
            colLeft: 5,
            colRight: 19,
            deptmDetail: [],
            detailColumns: [
                { title: '分类编码', key: 'zSubClass_ID' },
                { title: '编码', key: 'zid' },
                { title: '品名', key: 'zSubClass_Value' },
                { title: '型号/规格', key: 'zSpecifications' },
                { title: '单位', key: 'zUnit' },
                { title: '含税单价（元）', key: 'zUnitPrice' },
                { title: '简码', key: 'zPinYin' },
                { title: '权重', key: 'zqz' }
            ]
        }
    },
    methods: {
        search(val){
            let para = {};
            let spells = [];
            para['zPinYinContains'] = val;
            val && base.ajaxData('PublicApi/Bs_ClCateGory_view', para, 'GET', (e) => {
                const arr = e.results;
                if(arr.length > 0) {
                    arr.forEach( (item) =>{
                        spells.push(item.zid);
                    })
                    this.getDepartmentTree(0,spells);
                }
            })
        },
        toDelete(){
            base.deleteAjaxData(base.baseURL+'PublicApi/Bs_ClcateGoryRec?id='+this.rowData.zid,() =>{
                this.init();
            });
        },
        add(){
            this.addModal=true;
            this.postStatus = 'add';
            this.$refs.addForm.resetFields();
        },
        update(){
            this.addModal=true;
            this.postStatus = 'update';
            Object.keys(this.rowData).forEach( (item)=>{
                const key = item.replace(/^z/,'');
                this.addData[key] = this.rowData[item];
            });
            
        },
        toLogSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.postStatus === 'add'){
                        this.addData.SubClass_ID = this.clickNodeId || 0;
                        base.postAjaxData(base.baseURL+'PublicApi/Bs_ClcateGoryRec',JSON.stringify(this.addData),(e) =>{
                            this.init();
                            this.addModal = false;
                        });
                    }else if(this.postStatus === 'update'){
                        base.putAjaxData(base.baseURL+'PublicApi/Bs_ClcateGoryRec',JSON.stringify(this.addData),(e) =>{
                            this.init();
                            this.addModal = false;
                        });
                    }
                    
                }else {
                    this.$Message.error({duration: 5, content:'请将上半部分输入完整！'});
                };
            })
        },
        // 分页获取数据
        changePage (index) {
            this.pageCurrent = index;
            let _size = this.pageSize;
            this.skip = (index - 1) * _size;
            this.check(this.skip, _size);
        },
        // 改变每页显示条数获取数据
        changePageSize (size) {
            this.pageSize = size;
            this.check(this.skip, size);
        },
        // 表格选行
        selectRow (val) {
            this.rowData = val;
            this.isToUpdate = true;
            this.isToDelete = true;
        },
        getDepartmentTree (isEnable,spells) {
            base.getAjaxData(base.baseURL + 'PublicApi/Bs_ClCateGory_view', (e) => {
                let data = e.results;
                let nodes = [];
                data.forEach(item => {
                    let node = {};
                    node.id = item.zid;
                    node.title = item.zClass_Value;
                    node.parentID = item.zParentId;
                    node.childIDs = item.zChildID;
                    if(spells){
                        const id = node.childIDs.split(',').find((element) => {
                            for (let i = 0; i < spells.length; i++) {
                                const exp = spells[i];
                                if(element == exp)return true;
                            }
                        });
                        node.expand = id !== undefined ;
                    }else{
                        node.expand = isEnable;
                    }
                    nodes.push(node);
                });
                // let parseData = base.convert(nodes);
                
                let parseData = base.formatDataToTree(nodes);

                this.data = [{
                    title: '全部材料',
                    expand: true,
                    id: 1,
                    render: (h, { root, node, data }) => {
                        return h('span', {
                            style: {
                                display: 'inline-block',
                                width: '100%'
                            }
                        }, [
                            h('span', [
                                h('Icon', {
                                    props: {
                                        type: 'ios-folder-outline'
                                    },
                                    style: {
                                        marginRight: '4px'
                                    }
                                }),
                                h('span', {
                                    class: 'ivu-tree-title',
                                    on: {
                                        click: () => { this.selectNode(data); }
                                    }
                                }, data.title)
                            ]),
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    float: 'right',
                                    marginRight: '32px'
                                }
                            }, [
                                h('Button', {
                                    props: Object.assign({}, this.buttonProps, {
                                        icon: 'ios-plus-empty',
                                        type: 'primary'
                                    }),
                                    style: {
                                        display: this.buttonStatus,
                                        width: '75px'
                                    },
                                    on: {
                                        click: () => { console.log(data);this.append(data) }
                                    }
                                })
                            ])
                        ]);
                    },
                    children: parseData
                }];
            });
        },
        renderContent (h, { root, node, data }) {
            return h('span', {
                style: {
                    display: 'inline-block',
                    width: '100%'
                }
            }, [
                h('span', [
                    h('Icon', {
                        props: {
                            type: 'ios-paper-outline'
                        },
                        style: {
                            marginRight: '4px'
                        }
                    }),
                    h('span', {
                        class: 'ivu-tree-title',
                        on: {
                            click: () => { this.selectNode(data); }
                        }
                    }, data.title)
                ]),
                h('span', {
                    style: {
                        display: 'inline-block',
                        float: 'right',
                        marginRight: '32px'
                    }
                }, [
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-plus-empty'
                        }),
                        style: {
                            display: this.buttonStatus,
                            marginRight: '3px'
                        },
                        on: {
                            click: () => { this.append(data) }
                        }
                    }),
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-minus-empty'
                        }),
                        style: {
                            display: this.buttonStatus,
                            marginRight: '3px'
                        },
                        on: {
                            click: () => { this.remove(root, node, data) }
                        }
                    }),
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-compose-outline'
                        }),
                        style: {
                            display: this.buttonStatus
                        },
                        on: {
                            click: () => { this.edit(root, node, data) }
                        }
                    })
                ])
            ]);
        },
        append (data) {
            this.modalTitle = '添加子类';
            this.modal = true;
            this.nodeInfo = data;
        },
        remove (root, node, data) {
            let _self = this;
            if(data.children.length > 0) {
                this.$Modal.error({
                    content: '当前类下含有子类，无法删除！'
                });
            } else {
                base.ajaxData('PublicApi/Bs_ClcateGoryRec?SubClass_ID=' + data.id, {}, 'GET', (e) => {
                    if(e.total === 0){
                        this.$Modal.confirm({
                            content: '确定删除 【' + data.title + '】 ？',
                            onOk: function() {
                                base.ajaxData('PublicApi/Bs_Clcategory?id=' + data.id, {}, 'DELETE', (e) => {
                                    switch (e.errMsg) {
                                        case 'ok':
                                            this.$Message.info('删除成功！');
                                            _self.getDepartmentTree(1);
                                            break;
                                        default:
                                            break;
                                    }
                                })
                            }
                        });
                    }else{
                        this.$Modal.error({
                            content: '当前类下含有子类，无法删除！'
                        });
                    }
                });
                
            }
        },
        edit (root, node, data) {
            this.deptmName = data.title;
            this.modalTitle = '修改类别';
            this.modal = true;
            this.nodeInfo = data;
        },
        ok (e) {
            let _self = this;
            let para = {}
            switch (e) {
                case '添加子类':
                    let data = this.nodeInfo;
                    let children = data.children || [];
                    children.push({
                        title: this.deptmName,
                        expand: true,
                        parentID: data.id
                    });
                    para = {
                        ParentId: data.id,
                        Class_Value: this.deptmName,
                    }
                    base.postAjaxData(base.baseURL + 'PublicApi/Bs_Clcategory', JSON.stringify(para), (e) => {
                        switch (e.errMsg) {
                            case 'ok':
                                // this.$set(data, 'children', children);
                                this.$Message.info('添加成功！');
                                _self.getDepartmentTree(1);
                                break;
                        
                            default:
                                break;
                        }
                    });
                    this.nodeInfo = {};
                    this.deptmName = '';
                    break;
                case '修改类别':
                    this.nodeInfo.title = this.deptmName;
                    // this.$set(this.nodeInfo);
                    para = {
                        id: this.nodeInfo.id,
                        ParentID: this.nodeInfo.parentID,
                        Class_Value: this.deptmName,
                    }
                    base.ajaxData('PublicApi/Bs_Clcategory', para, 'PUt', (e) => {
                        switch (e.errMsg) {
                            case 'ok':
                                this.$Message.info('修改成功！');
                                _self.getDepartmentTree(1);
                                break;
                        
                            default:
                                break;
                        }
                    })
                    break;
                default:
                    break;
            }
        },
        selectNode (e) {
            this.nodeChilds = e.childIDs;
            this.clickNodeId = e.id;
            this.nodeInfo = e;
            this.btnCheck();
        },
        // 显示编辑
        editShow () {
            this.colLeft = 8;
            this.colRight = 16;
            this.buttonStatus = '';
            this.getDepartmentTree(1);
        },
        // 关闭编辑
        editClose () {
            this.colLeft = 5;
            this.colRight = 19;
            this.buttonStatus = 'none';
            this.getDepartmentTree(0);
        },
        //关闭模态框
        handleClose(modal){
            this[modal] = false;
        },
        check(skip, take) {
            let para = {};
            para.Skip = skip;
            para.Take = take;
            if(this.nodeChilds)para['ZSubClass_IDIn'] = this.nodeChilds;
            const condition = this.queryCdt;
            Object.keys(condition).forEach( (item)=>{
                if( item && condition[item] ){
                    if(item == 'zPinYin') {
                        para[item+'Contains'] = condition[item];
                    }else{
                        para[item] = condition[item];
                    }
                }
            });
            base.ajaxData('PublicApi/Bs_ClCateGoryRec_view', para, 'GET', (e) => {
                console.log(e);
                this.deptmDetail = e.results;
                this.total = e.total;
            })
        },
        // 点击查询
        btnCheck() {
            this.pageCurrent = 1;
            this.check(0, this.pageSize);
        },
        // btnClearCheck(){
        //     this.queryCdt = {};
        // },
        init(){
            this.changePage(this.pageCurrent);
            this.isToUpdate = false;
            this.isToDelete = false;
        }
    },
    mounted () {
        // 页面布局初始化
        let dom = document.querySelectorAll('.layout');
        dom[0].style.height = this.screenHeight + "px";
        dom[1].style.minHeight = this.screenHeight + "px";
        window.onresize = () => {
            return (() => {
                this.screenHeight = document.body.clientHeight -200;
            })()
        }
        // 获取类别数据
        this.getDepartmentTree(0);
        this.btnCheck();
    },
    destroyed(){
        window.onresize = null;
    },
    watch: {
        total: function(val){
            base.watchTotal(val, this);
        },
        screenHeight: function (val) {
            let dom = document.querySelectorAll('.layout');
            dom[0].style.height = val + "px";
            dom[1].style.height = val + "px";
        }
    }
}

</script>
