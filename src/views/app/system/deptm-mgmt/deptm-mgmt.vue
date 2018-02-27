<style lang="less" scoped>
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
</style>

<template>
    <div>
        <Row>
            <Col :span="colLeft">
                <Card class="layout" style="overflow-y: scroll; overflow-x: hidden; ">
                    <div slot="title">
                        <div v-if="buttonStatus == 'none'">
                            <Button type="ghost" shape="circle" size="small" @click="editShow"><Icon type="ios-compose-outline"></Icon> 编辑</Button>
                        </div>
                        <div v-else-if="buttonStatus == ''">
                            <Button type="primary" shape="circle" size="small" @click="editClose"><Icon type="ios-download-outline"></Icon> 保存</Button>
                        </div>
                    </div>
                    <Tree style="width: 100%;" :data="data" :render="renderContent"></Tree>
                </Card>
            </Col>
            <Col :span="colRight">
                <Card class="layout" style="">
                    <!-- <h1>title: {{ nodeInfo.title }}</h1>
                    <h2>nodeKey: {{ nodeInfo.nodeKey }}</h2> -->
                    <div class="margin-bottom-10" style="text-align: right;">
                        <Button type="primary" @click="tabEdit" icon="compose" :disabled="statusEdit">编辑</Button>
                        <Button type="primary" @click="tabDelete" icon="trash-a" :disabled="statusDelete">删除</Button>
                        <Button type="primary" @click="tabNew" icon="plus-round">新增</Button>
                    </div>
                    <Table ref="currentRowTable" :columns="deptmDetailColumns" :data="deptmDetailList" @on-current-change="selectRow" highlight-row size="small" class="margin-bottom-10" border style="min-height:400px;"></Table>
                    <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement="top"></Page>
                </Card>
            </Col>
        </Row>
        <!-- 编辑树 -->
        <Modal v-model="modal" :title="modalTitle" @on-ok="ok(modalTitle)" class-name="vertical-center-modal">
            <Input v-model="deptmName" placeholder="部门名称" value="" :maxlength="5"></Input>
        </Modal>
        <!-- 修改模态框 -->
        <Modal class="modal-common" v-model="editModal" :mask-closable="false" class-name="vertical-center-modal">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>修改部门单位信息</span>
            </p>
            <Form ref="rowData" :model="rowData" :rules="ruleValidate" :label-width="120" :show-message="false">
                <FormItem label="部门" prop="mDepName">
                    <Input v-model="rowData.mDepName" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="部门电话" prop="cDepPhone">
                    <Input v-model="rowData.cDepPhone" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="姓名" prop="cDepHeadName">
                    <Input v-model="rowData.cDepHeadName" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="负责人电话" prop="cDepHeadPhone">
                    <Input v-model="rowData.cDepHeadPhone" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="办公地址" prop="cDepWorkAddress">
                    <Input v-model="rowData.cDepWorkAddress" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="办公地址" prop="cDepEmail">
                    <Input v-model="rowData.cDepEmail" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="备注" prop="cRemarks">
                    <Input v-model="rowData.cRemarks" style="width: 300px"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="tabEditCancel">取消</Button>
                <Button type="primary" @click="tabEditSave" style="margin-left: 8px">保存</Button>
            </div>
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
            screenHeight: document.body.clientHeight - 120,
            data: [],               // 部门数数据
            buttonProps: {          // 树按钮属性
                type: 'ghost',
                size: 'small',
            },
            buttonStatus: 'none',   // 按钮是否显示
            modal: false,           // modal状态
            modalTitle: '',         // modal标题
            deptmName: '',          // 输入框部门名称
            nodeInfo: {},           // 选中node信息
            colLeft: 5,
            colRight: 19,
            deptmDetail: [],
            deptmDetailList: [],
            deptmDetailColumns: [
                // { type: 'index', width: 60, align: 'center' },
                // { title: '编码', key: 'cRecord_ID' },
                // { title: 'cid', key: 'cid' },
                { title: '部门', key: 'mDepName' },
                { title: '部门电话', key: 'cDepPhone' },
                { title: '姓名', key: 'cDepHeadName' },
                { title: '负责人电话', key: 'cDepHeadPhone' },
                { title: '办公地址', key: 'cDepWorkAddress' },
                { title: '部门邮箱', key: 'cDepEmail' },
                { title: '备注', key: 'cRemarks'}
            ],
            total: 100,
            pageCurrent: 1,
            pageSize: 10,
            skip: 0,
            statusEdit: true,
            statusDelete: true,
            rowData: {},
            editModal: false,
            // 表单验证的规则
            ruleValidate: {
                mDepName: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                cDepPhone: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                cDepHeadName: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                cDepHeadPhone: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                cDepWorkAddress: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                cDepEmail: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                cRemarks: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
            }
        }
    },
    mounted () {
        // 页面布局初始化
        let dom = document.querySelectorAll('.layout');
        dom[0].style.height = this.screenHeight + "px";
        dom[1].style.height = this.screenHeight + "px";
        window.onresize = () => {
            return (() => {
                this.screenHeight = document.body.clientHeight;
            })()
        }
        // 获取部门数据
        this.getDepartmentTree(0);

        let _self = this;
        base.ajaxData('PublicApi/Bs_depdepdetail_view', {}, 'GET', (e) => {
            _self.deptmDetail = e.results;
            _self.total = e.total;
            _self.deptmDetailList = e.results.slice(0, 10);
        })
    },
    methods: {
        getDepartmentTree (isEnable) {
            base.getAjaxData(base.baseURL + 'PublicApi/Sys_Deparment', (e) => {
                // console.log(e)
                let data = e.results;
                let nodes = [];
                data.forEach(item => {
                    let node = {};
                    node.id = item.departmentId;
                    node.title = item.name;
                    node.parentID = item.parentId;
                    node.expand = isEnable;
                    nodes.push(node)
                });
                // let parseData = base.convert(nodes);
                let parseData = formatDataToTree(nodes);

                this.data = [{
                    title: '材料厂',
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
                                        click: () => { this.append(data) }
                                    }
                                })
                            ])
                        ]);
                    },
                    children: parseData[0].children
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
            this.modalTitle = '添加部门';
            this.modal = true;
            this.nodeInfo = data;
        },
        remove (root, node, data) {
            let _self = this;
            if(data.children.length > 0) {
                this.$Modal.error({
                    content: '当前部门下含有子部门，无法删除！'
                });
            } else {
                this.$Modal.confirm({
                    content: '确定删除 【' + data.title + '】 ？',
                    onOk: function() {
                        base.ajaxData('PublicApi/Bs_dep?id=' + data.id, {}, 'DELETE', (e) => {
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
            }
            
            // const parentKey = root.find(el => el === node).parent;
            // const parent = root.find(el => el.nodeKey === parentKey).node;
            // const index = parent.children.indexOf(data);
            // parent.children.splice(index, 1);
        },
        edit (root, node, data) {
            this.deptmName = data.title;
            this.modalTitle = '修改部门';
            this.modal = true;
            this.nodeInfo = data;
        },
        ok (e) {
            let _self = this;
            let para = {}
            switch (e) {
                case '添加部门':
                    let data = this.nodeInfo;
                    let children = data.children || [];
                    children.push({
                        title: this.deptmName,
                        expand: true,
                        parentID: data.id
                    });
                    para = {
                        ParentID: data.id,
                        DepName: this.deptmName,
                        isEnable: 1
                    }
                    base.postAjaxData(base.baseURL + 'PublicApi/Sys_Deparment', para, (e) => {
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
                case '修改部门':
                    this.nodeInfo.title = this.deptmName;
                    // this.$set(this.nodeInfo);
                    para = {
                        id: this.nodeInfo.id,
                        ParentID: this.nodeInfo.parentID,
                        DepName: this.deptmName,
                        isEnable: 1
                    }
                    base.ajaxData('PublicApi/Sys_Deparment', para, 'PUt', (e) => {
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
                // case '删除部门':
                    
                //     break;
                default:
                    break;
            }
        },
        selectNode (node) {
            console.log(node);
            
            let _self = this;
            this.nodeInfo = node;
            // console.log(node);
            base.ajaxData('PublicApi/Bs_depdepdetail_view', {'MID': node.id}, 'GET', (e) => {
                if (e.total == 1) {
                    base.ajaxData('PublicApi/Bs_depdepdetail_view', {'MIDIn': e.results[0].mChildDepID}, 'GET', (g) => {
                        _self.deptmDetail = g.results;
                        _self.total = g.total;
                        _self.deptmDetailList = g.results.slice(_self.skip, _self.skip + _self.pageSize);
                    });
                } else {
                    this.$Message.error('数据不存在');
                }
                
            });
        },
        changePage (index) {
            this.pageCurrent = index;
            this.skip = (index - 1) * this.pageSize;
            this.deptmDetailList = this.deptmDetail.slice(this.skip, this.skip + this.pageSize);
        },
        changePageSize (size) {
            this.pageSize = size;
            this.deptmDetailList = this.deptmDetail.slice(this.skip, this.skip + this.pageSize);
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
            this.colLeft = 6;
            this.colRight = 18;
            this.buttonStatus = 'none';
            this.getDepartmentTree(0);
        },
        selectRow (val) {
            if (val) {
                this.rowData = val;
            }
        },
        tabEdit () {
            this.editModal = true;
        },
        tabDelete () {

        },
        tabNew () {
            this.editModal = true;
            this.rowData = {};
        },
        tabEditCancel () {
            this.editModal = false;
            this.rowData = {};
            this.$refs.currentRowTable.clearCurrentRow();
        },
        tabEditSave () {
            let postData = {};
            postData.DepHeadName = this.rowData.cDepHeadName;
            postData.DepPhone = this.rowData.cDepPhone;
            postData.DepHeadPhone = this.rowData.cDepHeadPhone;
            postData.DepWorkAddress = this.rowData.cDepWorkAddress;
            postData.DepEmail = this.rowData.cDepEmail;
            postData.IsEnable = '1';
            postData.Remarks = this.rowData.cRemarks;
            console.log(postData);
        }
    },
    destroyed(){
        window.onresize = null;
    },
    watch: {
        screenHeight: function (val) {
            let dom = document.querySelectorAll('.layout');
            dom[0].style.height = val-120 + "px";
            dom[1].style.height = val-120 + "px";
        },
        rowData: function (val) {
            if (val.mDepName) {
                this.statusEdit = false;
                this.statusDelete = false;
            } else {
                this.statusEdit = true;
                this.statusDelete = true;
            }
        }
    }
}

function reverser(obj){
    var arr = [];
    function son(parent) {
        arr.push(parent.id);
        if(parent.children.length){
            parent.children.forEach( (item) =>{
                if(item.children.length>0){
                    var c = son(item);
                    arr.concat(c);
                }else{
                    arr.push(item.id);
                }
            })
        }
    }
    son(obj);
    return arr.toString();
}
// json数据转树结构
function formatDataToTree(arr) {
    var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem;
    // First map the nodes of the array to an object -> create a hash table.
    for(var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.id] = arrElem;
        mappedArr[arrElem.id]['children'] = [];
    }
    for (var id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
            mappedElem = mappedArr[id];
            // If the element is not at the root level, add it to its parent array of children.
            if (mappedElem.parentID) {
                mappedArr[mappedElem['parentID']]['children'].push(mappedElem);
            }
            // If the element is at the root level, add it to first level elements array.
            else {
                tree.push(mappedElem);
            }
        }
    }
    return tree;
}
</script>
