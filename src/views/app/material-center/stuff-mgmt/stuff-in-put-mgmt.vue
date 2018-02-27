<style lang="less" >
    @import './stuff-mgmt-common.less';
</style>

<template>
    <div class="stuff-common-mgmt">
        <div>
            <Button type="primary" icon="forward" @click="toInrew();">入库红票</Button>
            <Button type="primary" icon="reply" @click="toOutrew();">出库红票</Button>
            <Button type="primary" icon="ios-upload">导出Exccel</Button>
        </div>
        <Card class="select-col margin-bottom-10 padding-top-bottom-minish margin-top-10">
            <div class="div">
                <label class="label">供货单位</label>
                <Select v-model="office"  class="select">
                    <Option :value="0">全部</Option>
                    <Option v-for="item in offerCmpList" :value="item.comm_ID" :key="item.subClass_Value">{{ item.subClass_Value }}</Option>
                </Select>
            </div>
            <div class="div">
                <label class="label">使用单位</label>
                <Select v-model="use"  class="select">
                    <Option :value="0">全部</Option>
                    <Option v-for="item in useCmpList" :value="item.departmentId" :key="item.departmentId">{{ item.name }}</Option>
                </Select>
            </div>
            <div class="div">
                <label class="label">材料品名</label>
                <Input v-model="stuffName" placeholder="请输入材料品名" class="select"></Input>
            </div>
            <div class="div">
                <label class="label">含税单价</label>
                <Input v-model="stuffNumber" placeholder="请输入材料编号" class="select"></Input>
            </div>
            <div class="div">
                <label class="label">单号</label>
                <Input v-model="documentNumber" placeholder="请输入单据号" class="select"></Input>
            </div>
            <div class="div">
                <label class="label">起始日期</label>
                <DatePicker :options='options' :value="startDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateStrat"></DatePicker>
            </div>
            <div class="div">
                <label class="label">截止日期</label>
                <DatePicker :options='options' :value="endDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateEnd"> </DatePicker>
            </div>
            <div class="div">
                <label class="label">筛选状态</label>
                <Select v-model="state"  class="select">
                    <Option v-for="item in statesList" :value="item.num" :key="item.num">{{ item.value }}</Option>
                </Select>
            </div>
            <Button type="primary" icon="ios-search" @click="btnCheck()">查询</Button>
            <Button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</Button>
        </Card>
        <Row>
            <Col :span="colLeft" >
                <Card style="overflow-y: scroll; overflow-x: hidden;" class="layout">
                    <Tree style="width: 100%;" :data="treeData" @on-select-change='selectNode'></Tree>
                </Card>
            </Col>
            <Col :span="colRight">
                <Card class="layout">
                    <Table class="margin-bottom-10" size="small" border  style="min-height:400px;" :data="data" :columns="columns"></Table>
                    <Page :total="total"  :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
                </Card>
            </Col>
        </Row>
        <!-- 入库验收单 -->
        <Modal class="modal-table-form stuff-common-modal" width='900px' :mask-closable="false" v-model="enterStoreModal" class-name="vertical-center-modal">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>材料入库单</span>
            </p>
            <div class="">
                <Form label-position="right" ref="inStore" :model="inPostData" :rules="postRules" :label-width="50" inline :show-message="false">
                    <Card class="modal-formItem">
                        <FormItem  label="材料" prop='zSubClass_Value'>
                            <Select v-model="inPostData.CL_TyID"  placeholder='' filterable remote :remote-method="filterMethod" :loading="autoLoading" @on-change='handleAuto' size="small" style="width:130px;">
                                <Option v-for="(option,index) in allStuff" :value="option.zid" :label="option.zSubClass_Value" :key="index">
                                    <span class="auto-complete-title">{{ option.zid }}</span>
                                    <span class="auto-complete-title">{{ option.zSubClass_Value }}</span>
                                    <span class="auto-complete-title">{{ option.zSpecifications }}</span>
                                    <span class="auto-complete-title">{{ option.zUnit }}</span>
                                    <span class="auto-complete-title">{{ option.zSubClass_ID }}</span>
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem  label="单价（不含税）" prop='UnitPrice' class="label-70">
                            <Input :maxlength="10" v-model="inPostData.UnitPrice" style="width:130px;" size="small" @on-change="addprice"></Input>
                        </FormItem>
                        <FormItem  label="数量" prop='InOutGdNum'>
                            <Input :maxlength="10" v-model="inPostData.InOutGdNum" style="width:130px;" size="small" @on-change="addnum"></Input>
                        </FormItem>
                        <FormItem  label="NO." prop='InOutSgl_ID'>
                            <Input :maxlength="10" v-model="inPostData.InOutSgl_ID" style="width:130px;" size="small"></Input>
                        </FormItem>
                        <FormItem label="日期" prop='InOutDate'>
                            <DatePicker :options="options" v-model="inPostData.InOutDate" :transfer="true" type="date" style="width:130px;" size="small" @on-change="datetoday"></DatePicker>
                        </FormItem>
                        <FormItem  label="供货单位" prop='CLSupUseCmp_ID' class="label-70">
                            <Select style="width:130px;" size="small" v-model="inPostData.CLSupUseCmp_ID" :label-in-value='true' @on-change='offerCmpId'>
                                <Option v-for="item in offerCmpList" :value="item.comm_ID" :label="item.subClass_Value" :key="item.subClass_Value">{{ item.subClass_Value }}</Option>
                            </Select>
                        </FormItem>
                         
                    </Card>
                    <div class="modal-table margin-top-10">
                        <h3 class="margin-bottom-10 align-center">材料出库单</h3>
                        <table class="storage-table table-common table-common-top table-common-bottom" border="1" cellspacing='0'>
                            <tr>
                                <td>编码:SYC/ZJ-WL-12</td>
                                <td colspan="2">供货单位：{{inPostData.subClass_Value}}</td>
                                <td>日期：{{this.today}}</td>
                                <td  colspan="2">类别：{{inPostData.CL_TyID}}</td>
                                <td colspan="1">NO.{{inPostData.InOutSgl_ID}}</td>
                            </tr>
                            <tr>
                                <td rowspan="2">材料名称(钢级)</td>
                                <td rowspan="2">规格及材质</td>
                                <td rowspan="2">单位</td>
                                <td colspan="2">数量</td>
                                <td colspan="2">价格</td>
                            </tr>
                            <tr>
                                <td>应收</td>
                                <td>实收</td>
                                <td>单价（不含税）</td>
                                <td>金额</td>
                            </tr>
                            <tr>
                                <td>{{inPostData.zSubClass_Value}}</td>
                                <td>{{this.cSpecifications}}</td>
                                <td>{{this.zUnit}}</td>
                                <td>{{inPostData.InOutGdNum}}</td>
                                <td>{{inPostData.InOutGdNum}}</td>
                                <td>{{inPostData.UnitPrice}}</td>
                                <td>{{inPostData.amount}}</td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td colspan="6">
                                    <FormItem prop='InOutRemarks'>
                                        <Input v-model="inPostData.InOutRemarks"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td class="align-left">主管：</td>
                                <td colspan="2">计划员：</td>
                                <td colspan="3">保管员：</td>
                                <td class="align-right">采购：</td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('enterStoreModal')">取消</Button>
                <Button type="primary" @click="toinStoreCommit('inStore')">保存</Button>
            </p>
        </Modal>
        <!-- 入库查看单 -->
        <Modal class="modal-table-form stuff-common-modal" width='900px' :mask-closable="false" v-model="enterLookModal" class-name="vertical-center-modal">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>材料入库单</span>
            </p>
            <div class="">
                <Form label-position="right" :label-width="50" inline>
                    <div class="modal-table margin-top-10">
                        <h3 class="margin-bottom-10 align-center">材料入库单</h3>
                        <table class="storage-table table-common table-common-top table-common-bottom" border="1" cellspacing='0'>
                            <tr>
                                <td>编码:SYC/ZJ-WL-12</td>
                                <td colspan="2">供货单位：{{rowData.bcCLSupUseCmp}}</td>
                                <td>日期：{{rowData.zInOutDate}}</td>
                                <td colspan="2">类别：{{rowData.zSubClass_ID}}</td>
                                <td colspan="1">NO.{{rowData.zInOutSgl_ID}}</td>
                            </tr>
                            <tr>
                                <td rowspan="2">材料名称(钢级)</td>
                                <td rowspan="2">规格及材质</td>
                                <td rowspan="2">单位</td>
                                <td colspan="2">数量</td>
                                <td colspan="2">价格</td>
                            </tr>
                            <tr>
                                <td>应收</td>
                                <td>实收</td>
                                <td>单价（不含税）</td>
                                <td>金额</td>
                            </tr>
                            <tr>
                                <td>{{rowData.cPinMin}}</td>
                                <td>{{rowData.zSpecifications}}</td>
                                <td>{{rowData.zUnit}}</td>
                                <td>{{rowData.zInOutGdNum}}</td>
                                <td>{{rowData.zInOutGdNum}}</td>
                                <td>{{rowData.zUnitPrice}}</td>
                                <td>{{rowData.amout}}</td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td colspan="6"></td>
                            </tr>
                            <tr>
                                <td class="align-left">主管：</td>
                                <td colspan="2">计划员：</td>
                                <td colspan="3">保管员：</td>
                                <td class="align-right">采购：</td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('enterLookModal')">取消</Button>
                <Button type="primary" @click="handleClose('enterLookModal')">确认</Button>
            </p>
        </Modal>
        <!-- 出库验收单 -->
        <Modal class="modal-table-form stuff-common-modal" width='900px' :mask-closable="false" v-model="outStoreModal" class-name="vertical-center-modal">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>材料出库单</span>
            </p>
            <div class="">
                <Form label-position="right" ref="postData" :model="postData" :rules="postRules" :label-width="50" inline :show-message="false">
                    <Card class="modal-formItem">
                        <FormItem  label="材料" prop='zSubClass_Value'>
                            <Select v-model="postData.CL_TyID"  placeholder='' filterable remote :remote-method="filterMethod" :loading="autoLoading" @on-change='handleAuto' size="small" style="width:130px;">
                                <Option v-for="(option,index) in allStuff" :value="option.zid" :label="option.zSubClass_Value" :key="index">
                                    <span class="auto-complete-title">{{ option.zid }}</span>
                                    <span class="auto-complete-title">{{ option.zSubClass_Value }}</span>
                                    <span class="auto-complete-title">{{ option.zSpecifications }}</span>
                                    <span class="auto-complete-title">{{ option.zUnit }}</span>
                                    <span class="auto-complete-title">{{ option.zSubClass_ID }}</span>
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem  label="单价（不含税）" prop='UnitPrice' class="label-70">
                            <Input :maxlength="10" v-model="postData.UnitPrice" style="width:130px;" size="small" @on-change="addprice"></Input>
                        </FormItem>
                        <FormItem  label="数量" prop='InOutGdNum'>
                            <Input :maxlength="10" v-model="postData.InOutGdNum" style="width:130px;" size="small" @on-change="addnum"></Input>
                        </FormItem>
                        <FormItem  label="NO." prop='InOutSgl_ID'>
                            <Input :maxlength="10" v-model="postData.InOutSgl_ID" style="width:130px;" size="small"></Input>
                        </FormItem>
                        <FormItem label="日期" prop='InOutDate'>
                            <DatePicker :options="options" v-model="postData.InOutDate" :transfer="true" type="date" style="width:130px;" size="small" @on-change="datetoday"></DatePicker>
                        </FormItem>
                        <FormItem  label="供货单位" prop='CLSupUseCmp_ID' class="label-70">
                            <Select style="width:130px;" size="small" v-model="postData.CLSupUseCmp_ID" :label-in-value='true' @on-change='offerCmpId'>
                                <Option v-for="item in offerCmpList" :value="item.comm_ID" :label="item.subClass_Value" :key="item.subClass_Value">{{ item.subClass_Value }}</Option>
                            </Select>
                        </FormItem>
                    </Card>
                    <div class="modal-table margin-top-10">
                        <h3 class="margin-bottom-10 align-center">材料出库单</h3>
                        <table class="storage-table table-common table-common-top table-common-bottom" border="1" cellspacing='0'>
                            <tr>
                                <td>编码:SYC/ZJ-WL-12</td>
                                <td colspan="2">供货单位：{{postData.subClass_Value}}</td>
                                <td>日期：{{this.today}}</td>
                                <td  colspan="2">类别：{{postData.CL_TyID}}</td>
                                <td colspan="1">NO.{{postData.InOutSgl_ID}}</td>
                            </tr>
                            <tr>
                                <td rowspan="2">材料名称(钢级)</td>
                                <td rowspan="2">规格及材质</td>
                                <td rowspan="2">单位</td>
                                <td colspan="2">数量</td>
                                <td colspan="2">价格</td>
                            </tr>
                            <tr>
                                <td>应收</td>
                                <td>实收</td>
                                <td>单价（不含税）</td>
                                <td>金额</td>
                            </tr>
                            <tr>
                                <td>{{postData.zSubClass_Value}}</td>
                                <td>{{this.cSpecifications}}</td>
                                <td>{{this.zUnit}}</td>
                                <td>{{postData.InOutGdNum}}</td>
                                <td>{{postData.InOutGdNum}}</td>
                                <td>{{postData.UnitPrice}}</td>
                                <td>{{postData.amount}}</td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td colspan="6">
                                    <FormItem prop='InOutRemarks'>
                                        <Input v-model="postData.InOutRemarks"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td class="align-left">主管：</td>
                                <td colspan="2">计划员：</td>
                                <td colspan="3">保管员：</td>
                                <td class="align-right">采购：</td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('outStoreModal')">取消</Button>
                <Button type="primary" @click="tostoreCommit('postData')">保存</Button>
            </p>
        </Modal>
        <!-- 出库的查看单 -->
        <Modal class="modal-table-form stuff-common-modal" width='900px' :mask-closable="false" v-model="outLookModal" class-name="vertical-center-modal">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>材料出库单</span>
            </p>
            <div class="">
                <Form label-position="right" :label-width="50" inline>
                    <div class="modal-table margin-top-10">
                        <h3 class="margin-bottom-10 align-center">材料出库单</h3>
                        <table class="storage-table table-common table-common-top table-common-bottom" border="1" cellspacing='0'>
                            <tr>
                                <td>编码:SYC/ZJ-WL-12</td>
                                <td colspan="2">供货单位：{{rowData.bcCLSupUseCmp}}</td>
                                <td>日期：{{rowData.zInOutDate}}</td>
                                <td colspan="2">类别：{{rowData.zSubClass_ID}}</td>
                                <td colspan="1">NO.{{rowData.zInOutSgl_ID}}</td>
                            </tr>
                            <tr>
                                <td rowspan="2">材料名称(钢级)</td>
                                <td rowspan="2">规格及材质</td>
                                <td rowspan="2">单位</td>
                                <td colspan="2">数量</td>
                                <td colspan="2">价格</td>
                            </tr>
                            <tr>
                                <td>应收</td>
                                <td>实收</td>
                                <td>单价（不含税）</td>
                                <td>金额</td>
                            </tr>
                            <tr>
                                <td>{{rowData.cPinMin}}</td>
                                <td>{{rowData.zSpecifications}}</td>
                                <td>{{rowData.zUnit}}</td>
                                <td>{{rowData.zInOutGdNum}}</td>
                                <td>{{rowData.zInOutGdNum}}</td>
                                <td>{{rowData.zUnitPrice}}</td>
                                <td>{{rowData.amout}}</td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td colspan="6"></td>
                            </tr>
                            <tr>
                                <td class="align-left">主管：</td>
                                <td colspan="2">计划员：</td>
                                <td colspan="3">保管员：</td>
                                <td class="align-right">采购：</td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('outLookModal')">取消</Button>
                <Button type="primary" @click="handleClose('outLookModal')">确认</Button>
            </p>
        </Modal>
    </div>
</template>

<script>
import base from '@/libs/base';

export default {
    data () {
        return {
            treeData: [
                {
                    title : '全部材料',
                    expand: true,
                    children:[]
                }
            ],
            colLeft: 0,
            colRight: 0,
            amount: '',
            today: '',
            allStuff: [],
            autoLoading: false,
            enterStoreModal: false,
            outStoreModal: false,
            enterLookModal: false,
            outLookModal: false,
            isToUpdate: false,
            isToDelete: false,
            isToLook: false,
            isToStore: false,
            isToDeliver: false,
            data: [],
            total: 0,
            pageCurrent: 1,
            pageSize: 10,
            skip: 0,
            startDate: '',
            endDate: '',
            stuffName: '',
            stuffNumber: '',
            invoiceNumber: '',  // 发票号
            documentNumber: '', // 单据号
            state: 0,
            rowData: [],
            options: {
                disabledDate(date){
                    return date.valueOf() > Date.now();
                }
            },
            use: 0,
            useCmpList: [],
            offerCmpList: [],
            office: 0,
            statesList: [
                {num:0,value:'显示全部记录'},
                {num:1,value:'显示入库记录'},
                {num:2,value:'显示出库记录'},
            ], 
            screenHeight: document.body.clientHeight - 200,
            columns: [//首页显示表格的列
                {title: '入出库',key: 'zInOutFlag',align:"center",width:50,
                    render:(h,params) => {
                        if(params.row.zInOutFlag == 1){
                            return h('div',[
                                h('icon',{
                                    props:{
                                        type: 'plus-round',
                                        size: '20',
                                        color: 'yellowgreen'
                                    }
                                })
                            ])
                        }
                        if(params.row.zInOutFlag == 2){
                            return h('div',[
                                h('icon',{
                                    props:{
                                        type: 'minus-round',
                                        size: '20',
                                        color: 'orange'
                                    }
                                })
                            ])
                        }
                    }
                },
                {title: '单据号',key: 'zInOutSgl_ID',align:"center",width:50},
                {title: '物料编号',key: 'zcL_TyID',align:"center",width:60},
                {title: '品名',key: 'cPinMin',align:"center",width:80},
                {title: '规格',key: 'zSpecifications',align:"center",ellipsis: true,width:90},
                {title: '单位',key: 'zUnit',align:"center",width:60},
                {title: '数量', key: 'zInOutGdNum',align:"center",width:60},
                {title: '金额', key: 'amout',align:"center",width:60},
                {title: '结余量', key: 'zTotalBalanceNum',align:"center",width:60},
                {title: '结余金额', key: 'zTotalBalanceNumBill', align:"center",width:60},
                {title: '不含税单价（元）', key: 'zUnitPrice',align:"center",width:100},
                {title: '日期',key: 'zInOutDate',align:"center",width:100},
                {title: '供/使用单位',key: 'bcCLSupUseCmp',align:"center",width:100},
                {title: '材料库管员',key: 'zLibrarian',align:"center",width:110},
                {title: '操作',key: 'handle',align:"center",width:90,fixed:'right',
                    render:(h,params) => {
                        return h('div',[
                            h('Button',{
                                props: {
                                    size: 'small',
                                    type: 'success'
                                },
                                style:{
                                    marginRight: '8px'
                                },
                                on: {
                                    click: () => {
                                        this.look(params.row);
                                    }
                                }
                            },"查看"),
                            // params.index == 0 && this.pageCurrent == 1 ? 
                            h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.toDeleteData(params.row.zid)
                                    }
                                }
                            }, '删除')
                            // ''
                        ])
                    }
                },
            ],
            cSpecifications : '',
            zUnit: '',
            postData:{
                "ID": "int",
                "InOutFlag": "",
                "CL_TyID": "",
                "Plan_ID": "",
                "CLSupUseCmp_ID": "",
                "InOutSgl_ID": "",
                "InOutGdNum": '',
                "InOutDate": '',
                "TaxUnitPrice": '',
                "UnitPrice": '',
                "TotalBalanceNum": '',
                "BalanceNum": '',
                "InOutDetails": "",
                "InOutRemarks": "",
                "Librarian": ""
            },
            inPostData:{
                "ID": "int",
                "InOutFlag": "",
                "CL_TyID": "",
                "Plan_ID": "",
                "CLSupUseCmp_ID": "",
                "InOutSgl_ID": "",
                "InOutGdNum": '',
                "InOutDate": '',
                "TaxUnitPrice": '',
                "UnitPrice": '',
                "TotalBalanceNum": '',
                "BalanceNum": '',
                "InOutDetails": "",
                "InOutRemarks": "",
                "Librarian": ""
            },
            postRules:{
                CLSupUseCmp_ID: [
                    { required: true, message:''}
                ],
                UnitPrice:[
                    {validator: base.floatCheck,required: true, message: ''}
                ],
                InOutGdNum:[
                    {validator: base.intCheck,required: true, message: ''}
                ],
                InOutSgl_ID:[
                    {required: true, message: ''}
                ],
                InOutDate:[
                    {required: true, message: ''}
                ],
                subClass_Value:[
                    {required: true, message: ''}
                ]
            }
        }
    },
    methods: {
        offerCmpId(data){
            this.postData.CLSupUseCmp_ID = data.value;
            this.postData.subClass_Value = data.label;
            this.inPostData.CLSupUseCmp_ID = data.value;
            this.inPostData.subClass_Value = data.label;
        },
        toInrew(){
            this.$refs.inStore.resetFields();
            this.inPostData = {};
            this.enterStoreModal = true;
        },
        toOutrew(){
            this.$refs.postData.resetFields();
            this.postData = {};
            this.outStoreModal = true;
        },
        addprice(val){
            // 出库
            if(this.postData.UnitPrice && this.postData.InOutGdNum){
                this.postData.amount = (this.postData.UnitPrice * this.postData.InOutGdNum);
            }else{
                this.postData.amount = 0;
            }
            //入库
            if(this.inPostData.InOutGdNum && this.inPostData.UnitPrice){
                this.inPostData.amount = (this.inPostData.InOutGdNum * this.inPostData.UnitPrice);
            }else{
                this.inPostData.amount = 0;
            }
        },
        addnum(val){
            // 出库
            if(this.postData.InOutGdNum && this.postData.UnitPrice){
                this.postData.amount = (this.postData.InOutGdNum * this.postData.UnitPrice);
            }else{
                this.postData.amount = 0;
            }
            // 入库
            if(this.inPostData.InOutGdNum && this.inPostData.UnitPrice){
                this.inPostData.amount = (this.inPostData.InOutGdNum * this.inPostData.UnitPrice);
            }else{
                this.inPostData.amount = 0;
            }
        },
        datetoday(val){
            this.today = val;
        },
        handleAuto(id){
            if(!id || this.isUpdate) return;
            base.ajaxData('PublicApi/Bs_ClCateGoryRec_view?zid='+ id, '', 'GET', (e) => {
                let res;
                if( e.results && (res = e.results[0]) ){
                    this.cSpecifications = res.zSpecifications;
                    this.zUnit = res.zUnit;

                    this.postData.cL_TyID = res.zid;
                    this.postData.UnitPrice = res.zUnitPrice;
                    this.postData.taxUnitPrice = res.zUnitPrice;
                    this.postData.zSubClass_Value = res.zSubClass_Value

                    this.inPostData.cL_TyID = res.zid;
                    this.inPostData.taxUnitPrice = res.zUnitPrice;
                    this.inPostData.UnitPrice = res.zUnitPrice;
                    this.inPostData.zSubClass_Value = res.zSubClass_Value
                  
                    this.$forceUpdate();
                }
            });
        },
        filterMethod (query) {
            if (query) {
                let para = {};
                para.Take = 20;
                /[a-z]/i.test(query) ? para['zPinYinContains'] = query:para['zSubClass_ValueContains'] = query;
                this.autoLoading = true;
                base.ajaxData('PublicApi/Bs_ClCateGoryRec_view', para, 'GET', (e) => {
                    this.autoLoading = false;
                    this.allStuff = e.results;
                })
            } else {
                this.allStuff = [];
            }
        },
        look(val){
            this.rowData = val;
            
            if(val.zInOutFlag == 1){
                this.enterLookModal = true;
            }
            if(val.zInOutFlag == 2){
                this.outLookModal = true;
            }
        },
        tostoreCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.postData.InOutFlag = 2;
                    base.postAjaxData(base.baseURL + '/WlCenter/Cl_Inoutmange',JSON.stringify(this.postData),()=>{
                        this.outStoreModal = false;
                        this.$Message.success({duration: 3, content:'登记成功！'});
                        this.$refs[name].resetFields();
                        this.init();
                    })
                }else{
                    this.$Message.warning({duration: 5, content:'请填写完整并检查是否正确！'});
                }
            })
        },
        toinStoreCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.inPostData.InOutFlag = 1;
                    base.postAjaxData(base.baseURL + '/WlCenter/Cl_Inoutmange',JSON.stringify(this.inPostData),()=>{
                        this.enterStoreModal = false;
                        this.$Message.success({duration: 3, content:'登记成功！'});
                        this.$refs[name].resetFields();
                        this.init();
                    })
                }else{
                    this.$Message.warning({duration: 5, content:'请填写完整并检查是否正确！'});
                }
            })
        },
        toDeleteData(val){
            this.$Modal.confirm({
                title: '提醒消息',
                content: '<p>确定删除这条吗？</p>',
                onOk: () => {
                    base.ajaxData('/WlCenter/Cl_Inoutmange?ID='+ val, {}, 'DELETE', (e) => {
                        this.$Message.info({duration: 3, content:'删除成功！'});
                        this.check(this.skip,this.take);
                    });     
                },
                onCancel: () => {
                    this.$Message.info('您取消了删除');
                }
            });
        },
        dateStrat(val){
            this.startDate = val;
        },
        dateEnd(val){
            this.endDate = val;
        },
        clearQuery(){
            this.office = 0;
            this.stuffName = '';
            this.stuffNumber = '';
            this.state = 0;
            this.use = 0;
            this.documentNumber = '';
            this.nodeChilds = '';
            this.endDate = '';
            this.startDate = '';
        },
        btnCheck() {
            this.pageCurrent = 1;
            this.check(0, this.pageSize);
        },
        // 分页
        changePage (index) {
            this.pageCurrent = index;
            let _size = this.pageSize;
            this.skip = (index - 1) * _size;
            this.check(this.skip, _size);
        },
        changePageSize (size) {
            this.pageSize = size;
            this.check(this.skip, size);
        },
        check(skip,take){
            let _self = this;
            let para = {};
            
            para.Skip = skip;
            para.Take = this.pageSize;

            if(this.nodeChilds)para['zSubClass_IDIn'] = this.nodeChilds;
            if(this.office && this.use) {
                para['zclSupUseCmp_IDIn'] = this.office + ',' + this.use
            }else if(this.office){
                para.zclSupUseCmp_ID = this.office;
            }else if(this.use) {
                para.zclSupUseCmp_ID = this.use
            }
            if(this.stuffName) para.cPinMinContains = this.stuffName;
            if(this.stuffNumber) para.zTaxUnitPrice = this.stuffNumber;
            if(this.state) para.zInOutFlag = this.state;
            if(this.documentNumber) para.zInOutSgl_IDContains = this.documentNumber;
            if(this.startDate) para['>zInOutDate'] = this.startDate;
            if(this.endDate) para['zInOutDate<'] = this.endDate;
            if(this.startDate && this.endDate) para.zInOutDateBetween = this.startDate + ',' + this.endDate;
            
            base.ajaxData('/WlCenter/Cl_Inoutmange_view?orderBy=-ZID', para, 'GET', (e) => {
                if(e.results){
                    e.results.forEach((item) => {
                        if(item.zInOutDate) item.zInOutDate = item.zInOutDate.substring(0,10);
                    })
                }
                this.data = e.results;
                this.total = e.total;
            });
        },
        handleClose(modal){
            this[modal] = false;
            this.lookModal = false;
        },
        toLogSubmit(){

        },
        toDeliverSubmit(){

        },
        getDepartmentTree (isEnable) {
            base.getAjaxData(base.baseURL + 'PublicApi/Bs_ClCateGory_view', (e) => {
                let data = e.results;
                let nodes = [];
                data.forEach(item => {
                    let node = {};
                    node.id = item.zid;
                    node.title = item.zClass_Value;
                    node.parentID = item.zParentId;
                    node.childIDs = item.zChildID;
                    node.expand = isEnable;
                    nodes.push(node);
                });
                let parseData = base.formatDataToTree(nodes);
                this.treeData[0].children = parseData;
            })
        },
        selectNode (e) {
            if(e.length == 0) return;
            const ids = e[0].childIDs;
            this.nodeChilds = ids;
            this.changePage(1);
        },
        init(){
            this.check(this.skip,this.take);
        }
    },
    // 获取数据
    mounted () {
        let dom = document.querySelectorAll('.layout');
        dom[0].style.height = this.screenHeight + "px";
        dom[1].style.minHeight = this.screenHeight + "px";
        window.onresize = () => {
            return (() => {
                this.screenHeight = document.body.clientHeight -200;
            })()
        }
        
        this.today = base.dateFormat(new Date());;
        let departArray = [];
        let offerArray = [];
        this.getDepartmentTree(0);
        this.check(this.skip,this.take);
        // 使用单位
        base.ajaxData('/PublicApi/Sys_Deparment', {}, 'GET', (e) => {
            if(e.results.length > 0){
                e.results.forEach((item) => {
                    departArray.push({departmentId:item.departmentId,name:item.name})
                })
                this.useCmpList = departArray;
            }
        });
        // 供货单位
        base.ajaxData('PublicApi/Bs_comminfo_view?Comm_IDStartsWith=101', {}, 'GET', (e) => {
            if(e.results.length > 0){
                e.results.forEach((item) => {
                    this.offerCmpList.push({comm_ID:item.comm_ID,subClass_Value:item.subClass_Value});
                });
            }
        });
    },
    created(){
        let screenWidth = window.screen.width;
        if(screenWidth <= 1024){
            this.colLeft = 6;
            this.colRight = 18;
        }else if(screenWidth > 1024 && screenWidth <= 1280){
            this.colLeft = 5;
            this.colRight = 19;
        }else{
            this.colLeft = 4;
            this.colRight = 20;
        }
    },
    destroyed(){
        window.onresize = null;
    },
    watch: {
        screenHeight: function (val) {
            let dom = document.querySelectorAll('.layout');
            dom[0].style.height = val + "px";
            dom[1].style.height = val + "px";
        }
    }
}
</script>
