<style lang="less">
   @import './store-mgmt.less';
</style>

<template>
	 <div class="table-component-common">
        <div>
            <Button type="primary" @click="enterStoreModal = true;toStore()" icon="plus">冲红入库录</Button>
            <Button type="primary" @click="outStoreModal = true;outStore()" icon="minus">冲红出库录</Button>
        </div>
        <card class="margin-bottom-10 margin-top-10 padding-top-bottom-minish" >
            <div class="select-col">
                <div class="div">
                    <label align="middle" class="label">原料</label>
                    <Select v-model="material" class="select li-width" >
                        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">供货单位</label>
                    <Select v-model="office" class="select" >
                        <Option :value="0">全部</Option>
                        <Option v-for="item in offerCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">使用单位</label>
                    <Select v-model="user"  class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label" style="width:30px;">单号</label>
                    <Input v-model="storeA" placeholder="请输入单号" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">筛选状态</label>
                    <Select v-model="state"  class="select">
                        <Option v-for="item in statesList" :value="item.num" :key="item.num">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">起始日期</label>
                    <DatePicker :options='options' :value='dateRange.start' placement="bottom-end" placeholder="选择日期" @on-change='dateFormatStart'></DatePicker>
                </div>
                <div class="div">
                    <label class="label">截止日期</label>
                    <DatePicker :options='options' :value='dateRange.end' placement="bottom-end" placeholder="选择日期" @on-change='dateFormatEnd'></DatePicker>
                </div>
                <Button type="primary" icon="ios-search" @click="btnQuery()" >查询</Button>
                <Button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</Button>
                <Button type="primary" icon="ios-upload">导出明细账</Button>
            </div>
		</card>
        <card>
			<div class="margin-bottom-10" >
	            <Table class="fontSize" size="small" border :data="data" :columns="columns" stripe ref="table2image"></Table>
	        </div>
            <Page ref='page' :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement='top'></Page>
        </card>
        <!-- 查看界面弹出框 -->
        <Modal class="modal-table-form store-modal" width='900px' :mask-closable="false" v-model="lookModal" class-name="vertical-center-modal">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>专用原(辅)料出库单</span>
            </p>
            <div class="">
                <Form   label-position="right" :label-width="60" inline>
                    <h3 style="text-align:center;" class="margin-bottom-10">专用原(辅)料入库验收单</h3>
                    <table class="table-common table-common-top store-table" border="1" cellspacing='0'>
                        <tr>
                            <td >编码:SYC/ZJ-WL-12</td>
                            <td  colspan="3">供货单位：<span v-text="lookBillData.ybSubClass_Valu"></span></td>
                            <td colspan="3">日期:{{lookBillData.inOutDate}}</td>
                            <td colspan="1">NO.{{lookBillNumFull}}</td>
                        </tr>
                        <tr>
                            <td style="width:150px;">材料名称(钢级)</td>
                            <td style="width:100px;">规格</td>
                            <td style="width:100px;">批次(编号)</td>
                            <td style="width:100px;">单位</td>
                            <td>数量</td>
                            <td>重量</td>
                            <td>单价</td>
                            <td>金额</td>
                        </tr>
                        <tr>
                            <td v-text="lookBillData.ygWuPinMinGangji"></td>
                            <td v-text="lookBillData.ygSpecifications"></td>
                            <td></td>
                            <td v-text='lookBillData.valuationMethod'></td>
                            <td v-text='lookBillData.thisNum'></td>
                            <td v-text='lookBillData.thisWeight'></td>
                            <td v-text='lookBillData.unitPrice'></td>
                            <td v-text='lookBillData.thisAmount'></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>备注</td>
                            <td colspan="7">
                                <Input v-model="lookBillData.remarks" placeholder="" ></Input>
                            </td>
                        </tr>
                        <tr>
                            <td >采购主管：</td>
                            <td colspan="3">采购员：</td>
                            <td colspan="3">仓库主管：</td>
                            <td colspan="1">库管员：</td>
                        </tr>
                    </table>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose">取消</Button>
                <Button type="primary" @click="handleClose">保存</Button>
            </p>
        </Modal>
        <!-- 冲红入库单录入 -->
        <Modal class="modal-table-form store-modal" width='900px' :mask-closable="false" v-model="enterStoreModal" class-name="vertical-center-modal">
            <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>原料冲红入库单录入</span>
            </p>
            <div class="">
                <Form ref="toStoreForm" :model="toStoreBill" :rules="ruleStoreForm" label-position="right" :label-width="60" inline>
                    <Card class="modal-formItem">
                        <FormItem label="原料" prop='YL_TyID'>
                            <Select :transfer="true" v-model="toStoreBill.YL_TyID" :label-in-value='true' style="width:175px" @on-change='materialId'>
                                <Option v-for="item in goodsList" :value="item.id" :label="item.value" :key="item.value">{{item.value}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem style="width:235px;" label="供货" prop='Cmp_ID'>
                            <Select :transfer="true" v-model="toStoreBill.Cmp_ID" :label-in-value='true' style="width:150px" @on-change='offerCmpId'>
                                <Option v-for="item in offerCmpList" :value="item.id" :label="item.value" :key="item.value">{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="计价方式">
                            <RadioGroup v-model="toStoreBillData.radio">
                                <Radio label="吨">吨</Radio>
                                <Radio label="支">支</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem style="width:235px;" label="日期" prop='InOutDate'>
                            <DatePicker :options='options' :transfer="true" type="date" v-model="toStoreBill.InOutDate"></DatePicker>
                        </FormItem>
                        <FormItem  style="width:210px;" label="单号" prop='Bill_ID'>
                            <Input :maxlength="10" style="width:150px;" v-model="toStoreBill.Bill_ID"></Input>
                        </FormItem>
                    </Card>
                    <div class="modal-table margin-top-10">
                        <h3 style="text-align:center;" class="margin-bottom-10">专用原(辅)料入库验收单</h3>
                        <table class="table-common table-common-top table-common-bottom store-table" border="1" cellspacing='0'>
                            <tr>
                                <td colspan="1">编码：SYC/ZJ-WL-12</td>
                                <td colspan="3">供货单位：<span v-text="toStoreBillData.cupCmpName"></span></td>
                                <td colspan="3">日期：{{inDate}}</td>
                                <td colspan="1">NO.{{toStoreBillData.billNum}}</td>
                            </tr>
                            <tr>
                                <td style="width:150px;">材料名称(钢级)</td>
                                <td style="width:100px;">规格</td>
                                <td style="width:100px;">批次(编号)</td>
                                <td style="width:100px;">单位</td>
                                <td>数量</td>
                                <td>重量</td>
                                <td>单价</td>
                                <td>金额</td>
                            </tr>
                            <tr>
                                <td v-text="toStoreBillData.storeYLName"></td>
                                <td v-text="toStoreBillData.specifications"></td>
                                <td></td>
                                <td v-text='toStoreBillData.radio'></td>
                                <td>
                                    <FormItem prop="ThisNum">
                                        <Input v-model="toStoreBill.ThisNum" placeholder="" :maxlength="10"></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem prop="ThisWeight">
                                        <Input v-model="toStoreBill.ThisWeight" placeholder="" :maxlength="10"></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem prop="UnitPrice">
                                        <Input v-model="toStoreBill.UnitPrice" placeholder="" :maxlength="10"></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem prop="ThisAmount">
                                        <Input :value="inPriceTotle" v-model="toStoreBill.ThisAmount" placeholder="" :maxlength="10"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td colspan="7">
                                    <FormItem prop="Remarks">
                                        <Input v-model="toStoreBill.Remarks" placeholder="" ></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td >采购主管：</td>
                                <td  colspan="2">采购员：</td>
                                <td colspan="3">仓库主管：</td>
                                <td colspan="2">库管员：</td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose()">取消</Button>
                <Button type="primary" @click="tostoreCommit('toStoreForm')">保存</Button>
            </p>
        </Modal>
        <!-- 冲红出库单录入 -->
        <Modal class="modal-table-form store-modal" width='900px' :mask-closable="false" v-model="outStoreModal" class-name="vertical-center-modal">
            <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>原料冲红出库单录入</span>
            </p>
            <div class="">
                <Form ref="outStoreForm" :model="outStoreBill" :rules="ruleStoreForm" label-position="right" :label-width="60" inline>
                    <Card class="modal-formItem">
                        <FormItem label="原料" prop='YL_TyID'>
                            <Select :transfer="true" v-model="outStoreBill.YL_TyID" :label-in-value='true' style="width:175px" @on-change='outMaterialId'>
                                <Option v-for="item in goodsList" :value="item.id" :label="item.value" :key="item.value">{{item.value}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem style="width:236px;" label="分厂" prop='Cmp_ID'>
                            <Select :transfer="true" v-model="outStoreBill.Cmp_ID" :label-in-value='true'  style="width:150px" @on-change='outUseCmpId' >
                                <Option v-for="item in useCmpList" :value="item.id" :label="item.value" :key="item.value">{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="计价方式">
                            <RadioGroup v-model="outStoreBillData.radio">
                                <Radio label="吨">吨</Radio>
                                <Radio label="支">支</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem style="width:236px;" label="日期" prop='InOutDate'>
                            <DatePicker :options='options' :transfer="true" type="date" v-model="outStoreBill.InOutDate"></DatePicker>
                        </FormItem>
                        <FormItem  style="width:210px;" label="单号" prop='Bill_ID'>
                            <Input :maxlength="10" style="width:150px;" v-model="outStoreBill.Bill_ID"></Input>
                        </FormItem>
                        
                    </Card>
                    <div class="margin-top-10">
                        <h3 style="text-align:center;" class="margin-bottom-10">专用原(辅)料出库单</h3>
                        <table class="table-common table-common-top table-common-bottom store-table" border="1" cellspacing='0'>
                           <tr>
                                <td colspan="1">编码：SYC/ZJ-WL-12</td>
                                <td colspan="3">使用分厂：<span v-text="outStoreBillData.cupCmpName"></span></td>
                                <td colspan="3">日期：{{outDate}}</td>
                                <td colspan="1">NO.{{outBillNumFull}}</td>
                            </tr>
                            <tr>
                                <td style="width:150px;">材料名称(钢级)</td>
                                <td style="width:100px;">规格</td>
                                <td style="width:100px;">批次(编号)</td>
                                <td style="width:100px;">单位</td>
                                <td>数量</td>
                                <td>重量</td>
                                <td>单价</td>
                                <td>金额</td>
                            </tr>
                            <tr>
                                <td v-text="outStoreBillData.storeYLName"></td>
                                <td v-text="outStoreBillData.specifications"></td>
                                <td></td>
                                <td v-text='outStoreBillData.radio'></td>
                                <td>
                                    <FormItem prop='ThisNum'>
                                        <Input v-model="outStoreBill.ThisNum" placeholder="" :maxlength="10" ></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem prop='ThisWeight'>
                                        <Input v-model="outStoreBill.ThisWeight" placeholder="" :maxlength="10"></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem prop='UnitPrice'>
                                        <Input v-model="outStoreBill.UnitPrice" placeholder="" :maxlength="10"></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem prop='ThisAmount'>
                                        <Input :value="outPriceTotle" :maxlength="10" v-model="outStoreBill.ThisAmount"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td colspan="7">
                                    <FormItem prop="Remarks">
                                        <Input v-model="outStoreBill.Remarks" placeholder="" ></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td >采购主管：</td>
                                <td colspan="2">采购员：</td>
                                <td colspan="3">仓库主管：</td>
                                <td colspan="2">库管员：</td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose">取消</Button>
                <Button type="primary" @click="outStoreCommit('outStoreForm')">保存</Button>
            </p>
        </Modal>
	</div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        return {
                //冲红入库显示
                toStoreBillData:{
                    cupCmp:'',//id
                    cupCmpName:'',
                    storeYL:'',//id
                    storeYLName:'',
                    specifications:'',
                    billNum: '0',
                    branchTotle:0,
                    weightTotle:0,
                    standardWeight:0,
                    radio: '吨',
                    date: '',
                },
                //冲红出库显示
                outStoreBillData:{
                    cupCmp:'',
                    cupCmpName:'',
                    storeYL:'',
                    storeYLName:'',
                    specifications:'',
                    billNum: '0',
                    branchTotle:0,
                    weightTotle:0,
                    standardWeight:0,
                    radio: '吨',
                    date: '',
                },
                //冲红入库提交
                toStoreBill:{
                    "Bill_ID": "",
                    "YL_TyID": "",
                    "Cmp_ID": "",
                    "InOutStats": 3,
                    "InOutDate": "",
                    "ThisWeight": '',
                    "ThisNum": '',
                    "UnitPrice": '0',
                    "ThisAmount": '',
                    "ValuationMethod": '',
                    "InOutDetails": "",
                    "IsLock": "",
                    "Librarian": "",
                    "Remarks": ""
                },
                //冲红出库提交
                outStoreBill:{
                    "Bill_ID": "",
                    "YL_TyID": "",
                    "Cmp_ID": "",
                    "InOutStats": 4,
                    "InOutDate": "",
                    "ThisWeight": '',
                    "ThisNum": '',
                    "UnitPrice": '0',
                    "ThisAmount": '',
                    "ValuationMethod": '',
                    "InOutDetails": "",
                    "IsLock": "",
                    "Librarian": "",
                    "Remarks": ""
                },
                lookBillData:{
                    ybSubClass_Valu:'',
                    inOutDate:'',
                    bilL_ID:'',
                    ygWuPinMinGangji:'',
                    ygSpecifications:'',
                    valuationMethod:'',
                    thisNum:'',
                    thisWeight:'',
                    unitPrice:'0',
                    thisAmount:'',
                    remarks:'',
                    librarian:''
                },
                //表单提交总验证
                formValid:true,
                //模态框控制
                lookModal:false,//查看
                enterStoreModal:false,//入库
                outStoreModal:false,//出库
                columns: [//首页显示表格的列
                    {
                        title: '入出',
                        align:"center",
                        width: 40,
                        render: (h, params) => {
                            if( params.row.inOutStats == 1 || params.row.inOutStats == 3){
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'plus',
                                            size: '18',
                                            color: 'yellowgreen'
                                        }
                                    })
                                ])
                            }else{
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'minus',
                                            size: '18',
                                            color: 'yellowgreen'
                                        }
                                    })
                                ])
                            }
                    } 
                    },
                    {title: '单据号', key: 'bilL_ID',align:"center",width: 80,},
                    {title: '供货和使用', key: 'ybSubClass_Value',align:"center",width: 100,},
                    {title: '品名', key: 'pinMing', align:"center",width: 180},
                    {
                        title: '重量(吨)',
                        key: 'thisWeight',
                        width: 100,align:"center"
                        
                    },
                    {
                        title: '支数',
                        key: 'thisNum',
                   width: 80,align:"center"
                    },
                    {
                        title: '金额',
                        key: 'thisAmount',
                       width: 100,align:"center"
                    },
                    {
                        title: '结存重量',
                         key: 'thisBalanceWeight',
                       width: 100,align:"center"
                    },
                    {
                        title: '结存支数',
                        key: 'thisBalanceStockNum',
                       width: 80,align:"center"
                    },
                    {
                        title: '结存金额',
                        key: 'thisBalanceAmount',
                        width: 100,
                        align:"center"
                    },
                    {
                        title: '日期',
                        key: 'inOutDate',
                        align:"center",
                        width: 100,
                    },
                    {
                        title: '保管员',
                        key: 'librarian',
                        width: 80,
                        align:"center"
                    },
                    {
                        title: '绑定到(发)货记录',
                        align:"center",
                        key: 'handle',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            
                                        }
                                    }
                                }, '绑定单据')
                            ]);
                        }
                    },
                    {
                        title: '财务锁',
                        key: 'isLock',
                        width: 50,
                        align:"center",
                        render: (h, params) => {
                            if( params.row.isLock == 1){
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'unlocked',
                                            size: '18',
                                            color: 'yellowgreen'
                                        }
                                    })
                                ])
                            }else{
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'locked',
                                            size: '18',
                                            color: 'gray'
                                        }
                                    })
                                ])
                            }
                        }
                    },
                    {
                        title: '状态',
                        key: 'zInOutStatsN',
                        width: 80,
                        align:"center",
                        fixed: "right",
                    },
                    {
                        title: '操作',
                        align:"center",
                        key: 'handle',
                        width: 100,
                        fixed: "right",
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style:{
                                        marginRight: '8px'
                                    },
                                    on: {
                                        click: () => {
                                            this.lookModal = true;
                                            for(var key in this.lookBillData){
                                                this.lookBillData[key] = params.row[key];
                                            }
                                        }
                                    }
                                }, '查看'),
                                params.index == 0 && this.pageCurrent == 1 ?h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteData(params.row.id)
                                        }
                                    }
                                }, '删除'):''
                            ]);
                        }
                    } 
                ],
                ruleStoreForm:{
                    YL_TyID:[
                        { required: true,message:' '}
                    ],
                    Cmp_ID:[
                        { required: true,message:' ',trigger: 'change'}
                    ],
                    InOutDate: [
                        { required: true,type:'date',message:' '}
                    ],
                    ThisNum: [
                        {validator: base.intCheck, required: true,message:' '}
                    ],
                    ThisWeight: [
                        {validator: base.floatCheck, required: true,message:' ' }
                    ],
                    UnitPrice: [
                        {validator: base.floatCheck, required: true, message: ' '}
                    ],
                    ThisAmount: [
                        {validator: base.floatCheck, required: true, message: ' '}
                    ],
                    Bill_ID:[
                        { required: true, message: ' '}
                    ]
                },
                //查看模态表头
                data: [],//获取主页列表的数据
                total:0,//总条数
                pageCurrent: 1,//当前页码
                pageSize: 10,//页面大小
                //主页面
                today:'',
                urlOptions:'',
                options:{
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    }
                },
                state: 0,
                material:'',//选中的材料
                office:0,//选中的供货单位
                user:0,//选中的使用单位
                statesList:[//状态列表
                    {num:0,value:'全部'},
                    {num:1,value:'入库'},
                    {num:2,value:'出库'},
                    {num:3,value:'冲红入库'},
                    {num:4,value:'冲红出库'},
                ],
                state:0,//选中状态
                dateRange:{start:'',end:''},//日期范围
                storeA:'',//选中库区
                goodsList:[],//品名列表
                offerCmpList:[],//供货单位列表
                useCmpList:[],//使用单位列表
                options:{//日期选项
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    }
                },
            }
    },
    computed:{
        outDate(){
            if(typeof this.outStoreBill.InOutDate === 'object'){
                return base.dateFormat(this.outStoreBill.InOutDate)
            }
        },
        inDate(){
            if(typeof this.toStoreBill.InOutDate === 'object'){
                return base.dateFormat(this.toStoreBill.InOutDate)
            }
        },
        //单号填充
        billNumFull(){
            let str = this.toStoreBill.Bill_ID;
            str = str ? str + '' : '';
            let len = str.length;
            for(var i = len; i<6;i++){
                str = '0' + str;
            }
            return str;
        },
        outBillNumFull(){
            let str = this.outStoreBill.Bill_ID;
            str = str ? str + '' : '';
            let len = str.length;
            for(var i = len; i<6;i++){
                str = '0' + str;
            }
            return str;
        },
        lookBillNumFull(){
            let str = this.lookBillData.bilL_ID;
            str = str ? str + '' : '';
            let len = str.length;
            for(var i = len; i<6;i++){
                str = '0' + str;
            }
            return str;
        },
        //计算总价
        inPriceTotle(){
            if(this.toStoreBillData.radio == '支')this.toStoreBill.ThisAmount = (this.toStoreBill.ThisNum *this.toStoreBill.UnitPrice || 0).toFixed(3);
            if(this.toStoreBillData.radio == '吨')this.toStoreBill.ThisAmount = (this.toStoreBill.ThisWeight *this.toStoreBill.UnitPrice || 0).toFixed(3);
        },
        outPriceTotle(){
            if(this.outStoreBillData.radio == '支')this.outStoreBill.ThisAmount = (this.outStoreBill.ThisNum *this.outStoreBill.UnitPrice || 0).toFixed(3);
            if(this.outStoreBillData.radio == '吨')this.outStoreBill.ThisAmount = (this.outStoreBill.ThisWeight *this.outStoreBill.UnitPrice || 0).toFixed(3);
        }
    },
    methods: {
        //日期范围
        dateFormatStart(val){
            this.dateRange.start = val;
        },
        dateFormatEnd(val){
            this.dateRange.end = val;
        },
        //公共函数
        btnCommonFun(storeState,callback){
            if(this.selectedIds.length > 0){
                this.selectedIds.forEach( (item,index) => {
                    base.getAjaxData(base.baseURL+'WlCenter/yl_arrivalstatupd_view?ID=' + item, (data) => {
                        if(data.results[0].storeStatus === storeState){
                            callback(data,item,index);
                        }else{
                            this.$Message.error({duration: 5, content:'已选的第'+(index+1)+'条已不可进行当前操作！'});
                        }
                    });
                });
            }else{
                this.$Message.error({duration: 5, content:'至少选择一条数据！'});
            }
        },
        //删除
        deleteData(id){
            base.getAjaxData(base.baseURL+'WlCenter/Yl_InOutManage?orderBy=-ID&Take=1', (res) => {
                if(res.results[0].id === id){
                    base.getAjaxData(base.baseURL+'WlCenter/Yl_InOutManage?ID=' + id, (data) => {
                        if(data.results[0].isLock === 1){
                            this.$Modal.confirm({
                                content:'<p>确定删除数据么</p>',
                                onOk:() =>{
                                    base.deleteAjaxData(base.baseURL + 'WlCenter/Yl_InOutManage?ID='+id,() => {
                                        this.$Message.success({duration: 3, content:'数据已删除！'});
                                        this.init();
                                    });
                                }
                            })
                        }else{
                            this.$Message.warning({duration: 5, content:'已选数据已锁定！'});
                        }
                    });
                }else{
                    this.$Message.warning({duration: 5, content:'已前数据不可删除！'});
                }
            });
        },
        //冲红入库单按钮
        toStore(){
            this.$refs.toStoreForm.resetFields();
            this.toStoreBill.InOutDate = this.today;
            if(this.goodsList[0] && this.offerCmpList[0]){
                this.toStoreBill.YL_TyID = this.goodsList[0].id;
                this.toStoreBill.Cmp_ID = this.offerCmpList[0].id;
            }
        },
        //冲红出库单按钮
        outStore(){
            this.$refs.outStoreForm.resetFields();
            this.outStoreBill.InOutDate = this.today;
            if(this.goodsList[0] && this.offerCmpList[0]){
                this.outStoreBill.YL_TyID = this.goodsList[0].id;
                this.outStoreBill.Cmp_ID = this.useCmpList[0].id;
            }
        },
        //获取选中品名的id
        materialId(data){
            base.showGoodsInfo({
                'vm':this,
                'wpId':data.value,
                'pinM':'toStoreBillData.storeYLName',
                'jsSpecifications':'toStoreBillData.specifications',
            });
        },
        offerCmpId(data){
            this.toStoreBillData.cupCmpName = data.label;
        },
        outMaterialId(data){
            base.showGoodsInfo({
                'vm':this,
                'wpId':data.value,
                'pinM':'outStoreBillData.storeYLName',
                'jsSpecifications':'outStoreBillData.specifications',
            });
        },
        outUseCmpId(data){
            this.outStoreBillData.cupCmpName = data.label;
        },
        /**
         * 改变页数时的函数
         */
        changePage (index) {
            // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
            this.pageCurrent = index;
            let _size = this.pageSize;
            let _skip = (index-1)*_size;
            this.query(_skip, _size);
        },
        //改变页显示数时的函数
        changePageSize (size) {
            this.pageSize = size;
            let _current = this.pageCurrent;
            let _skip = (_current-1)*size;
            this.query(_skip, size);
        },
        //查询条件
        condition(){
            let options = '';
            let date = this.dateRange;
            options += '&yL_TyID='+this.material;
            if(this.storeA)options += '&bilL_ID='+this.storeA;
            // if(this.state)options += '&inOutStats='+this.state;

            if(date.start && date.end){
                date.start > date.end ? this.$Modal.warning({content: '<p>起始日期大于截至日期,条件无效</p>'}) : (options += '&inOutDateBetween='+date.start + ',' +date.end);
            }else if(date.start){
                options += '&>InOutDate=' + date.start;
            }else if(date.end){
                options += '&InOutDate<=' + date.end;
            }
            
            return options;
        },
        //拼接查询
        spQuery(options,skip,take){
            options += '&cmp_IDIn='+this.office+','+this.user;
            if(skip == undefined)skip = 0;
            if(take == undefined)take = this.pageSize;
            base.getAjaxData(base.baseURL+'WlCenter/Yl_Inoutmanage_view?orderBy=-ID&Skip='+skip+'&take='+take+options,(res) => {
                res.results.forEach( (item) => {
                    if(item.inOutDate)item.inOutDate = item.inOutDate.substring(0,10);
                });
                this.data = res.results;
                this.total = res.total;
            });
        },
        btnQuery() {
            this.pageCurrent = 1;
            this.query(0, this.pageSize);
        },
        //查询函数
        query(skip,take){
            let options = this.condition();
            if(this.office && this.user){
                this.spQuery(options,skip,take);
                return;
            }else if(this.office){
                options += '&cmp_ID='+this.office;
            }else if(this.user){
                options += '&cmp_ID='+this.user;
            }
            if(skip == undefined)skip = 0;
            if(take == undefined)take = this.pageSize;
            if(this.state) options += '&inOutStats='+ this.state;
            console.log(options)
            base.getAjaxData(base.baseURL+'WlCenter/Yl_Inoutmanage_view?orderBy=-ID&Skip='+skip+'&take='+take+options,(res) => {
                res.results.forEach( (item) => {
                    if(item.inOutDate)item.inOutDate = item.inOutDate.substring(0,10);
                });
                this.data = res.results;
                this.total = res.total;
            });
        },
        //清空查询条件
        clearQuery(){
                this.office=0;
                this.user= 0;
                this.state= 0;
                this.storeA='';
                this.dateRange.start = '';
                this.dateRange.end = '';
        },
        //冲红入库保存
        tostoreCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.toStoreBill.ValuationMethod = (this.toStoreBillData.radio == '吨') ? 1 : 2;
                    this.toStoreBill.Bill_ID = this.billNumFull;
                    base.postAjaxData(base.baseURL+'WlCenter/Yl_InOutManage',JSON.stringify(this.toStoreBill),() =>{
                        this.init();
                        this.enterStoreModal = false;
                        this.$refs[name].resetFields();
                    });
                }else{
                    this.$Message.warning({duration: 5, content:'请填写完整并检查是否正确！'});
                }
            })
        },
        //冲红出库库保存
        outStoreCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.outStoreBill.ValuationMethod = (this.outStoreBillData.radio == '吨') ? 1 : 2;
                    this.outStoreBill.Bill_ID = this.outBillNumFull;
                    base.postAjaxData(base.baseURL+'WlCenter/Yl_InOutManage',JSON.stringify(this.outStoreBill),() =>{
                        this.init();
                        this.outStoreModal = false;
                        this.$refs[name].resetFields();
                    });
                }else{
                    this.$Message.error({duration: 5, content:'请正确填写！'});
                }
            })
        },
        //关闭模态框
        handleClose(){
            this.outStoreModal = false;
            this.enterStoreModal = false;
            this.lookModal = false;
        },
        //初始化
        init(){
            this.today = base.dateFormat(new Date())
            this.changePage(this.pageCurrent);
        }
    },
    created(){
        //物品信息
        base.getGoodsList(this,107);
        this.offerCmpList=[];
        this.useCmpList=[];
        //公共信息类
        base.getAjaxData(base.baseURL + 'PublicApi/bs_comminfo_view',(res) =>{
            res.results.forEach((item) => {
                if(item.isEnable && item.subClass_Value && item.comm_ID){
                    let temp = item.comm_ID.substring(0,3);
                    if(temp == 100)this.offerCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                }
            })
        });
        base.ajaxData('PublicApi/Bs_commdep0_view', {}, 'GET', (e) => {
            if(e.results.length > 0){
                e.results.forEach((item) => {
                    if(item.isEnable && item.mDepName && item.mid){
                        this.useCmpList.push({id:item.mid,value:item.mDepName});
                    }
                })
            }
        });
    },
    mounted(){
    },
    watch:{
        total: function(val) {
            let num = this.pageSize*this.pageCurrent - 9;
            if(num > val && val > 0) {
                this.pageCurrent = this.pageCurrent - 1;
                let skip = this.pageCurrent*this.pageSize-10
                this.query(skip, this.pageSize)
            }
        }
    }
};
</script>
