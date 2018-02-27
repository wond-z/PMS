<style lang="less">
   @import './dissent-material.less';
</style>

<template>
	 <div class="table-component-common">
        <div>
            <Button type="primary" @click="toStore()" icon="plus">异议入库单</Button>
            <Button type="primary" @click="outStore()" icon="minus">异议出库单</Button>
        </div>
        <card class="margin-bottom-10 margin-top-10 margin-bottom-10 padding-top-bottom-minish">
            <div class="select-col">
                <div class="div">
                    <label align="middle" class="label">原料</label>
                    <Select v-model="material" class="select li-width">
                        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">供货单位</label>
                    <Select v-model="office"  class="select">
                        <Option  :value="0" >全部</Option>
                        <Option v-for="item in offerCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">使用单位</label>
                    <Select v-model="user"  class="select">
                        <Option  :value="0" >全部</Option>
                        <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">显示筛选</label>
                    <Select v-model="filtStateSelect"  class="select">
                        <Option  :value="0" >全部</Option>
                        <Option  v-for="item in filtStateData" :value="item.num" :key="item.num" >{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label  class="label">起始日期</label>
                    <DatePicker :options='options' v-model="startDate" placement="bottom-end" placeholder="选择日期" class="select"></DatePicker>

                </div>
                <div class="div">
                    <label class="label">截止日期</label>
                    <DatePicker :options='options' v-model="endDate" placement="bottom-end" placeholder="选择日期" class="select"> </DatePicker>
                </div>
                <Button type="primary" icon="ios-search" @click="btnQuery" >查询</Button>
                <Button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</Button>
                <Button type="primary" icon="ios-upload">导出明细账</Button>
            </div>
		</card>
        <card>
            <Table class="margin-bottom-10" size="small" border  style="min-height:400px;" :columns="columns" :data="data" ref="table2image"></Table>
            <div>
                <Page ref='page' :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" placement="top" show-elevator show-sizer></Page>
            </div>
        </card>
        <!-- 查看界面弹出框 -->
        <Modal class="dissent-modal modal-table-form" width='900px' :mask-closable="false" v-model="lookModal" >
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>专用原(辅)料出库单</span>
            </p>
            <div class="color-red">
                <h3 style="text-align:center;" class="margin-bottom-10 ">专用原(辅)料入库验收单</h3>
                <table class="dissent-table table-common table-common-top table-common-bottom " border="1" cellspacing='0'>
                    
                    <tr>
                        <td >编码：SYC/ZJ-WL-12</td>
                        <td colspan="3">供货单位：{{lookBillData.bcGSubClass_Value}}</td>
                        <td colspan="3">日期：{{lookBillData.zDate}}</td>
                        <td colspan="1">NO.{{lookBillData.zBill_ID}}</td>
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
                        <td v-text="lookBillData.bgWuPinMinGangji"></td>
                        <td v-text="lookBillData.bgSpecifications"></td>
                        <td></td>
                        <td v-text='lookBillData.valuationMethod'></td>
                        <td v-text='lookBillData.zNum'></td>
                        <td v-text='lookBillData.zWeight'></td>
                        <td v-text='lookBillData.zPrice'></td>
                        <td v-text='lookBillData.zAmount'></td>
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
                        <td colspan="7" v-text="lookBillData.remarks"></td>
                    </tr>
                    <tr>
                        <td>采购主管：</td>
                        <td colspan="3">采购员：</td>
                        <td colspan="3">仓库主管：</td>
                        <td colspan="1">库管员：</td>
                    </tr>
                </table>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose">取消</Button>
                <Button type="primary" @click="handleClose">确认</Button>
            </p>
        </Modal>
        <!-- 原料入库单录入 -->
        <Modal class="dissent-modal modal-table-form" width='900px' :mask-closable="false" v-model="enterStoreModal">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>原料入库单录入</span>
            </p>
            <div class="">
                <Form ref="toStoreForm" :model="toStoreBill" :rules="ruleStoreForm" label-position="right" :label-width="70" inline>
                    <Card class="modal-formItem">
                        <FormItem label="原料：">
                            <Select :transfer="true" v-model="toStoreBillData.storeYL" :label-in-value='true' style="width:170px" @on-change='materialId'>
                                <Option v-for="item in goodsList" :value="item.id" :label="item.value" :key="item.value">{{item.value}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem  label="供货：">
                            <Select :transfer="true" v-model="toStoreBillData.cupCmp" :label-in-value='true' style="width:130px" @on-change='offerCmpId'>
                                <Option v-for="item in offerCmpList" :value="item.id" :label="item.value" :key="item.value">{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem  label="单号：" prop='Bill_ID'>
                            <Input :maxlength="10" style="width:130px;" v-model="toStoreBill.Bill_ID"></Input>
                        </FormItem>
                        <FormItem label="计价方式">
                            <RadioGroup v-model="toStoreBillData.radio">
                                <Radio label="吨">吨</Radio>
                                <Radio label="支">支</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem  label="日期：" prop='zDate'>
                            <DatePicker :options='options' :transfer="true" type="date" v-model="toStoreBill.zDate" style="width:170px"></DatePicker>
                        </FormItem>
                    </Card>
                    <div class="margin-top-10 color-red">
                        <h3 style="text-align:center;" class="margin-bottom-10">专用原(辅)料入库验收单</h3>
                        <table class="dissent-table table-common table-common-top table-common-bottom" border="1" cellspacing='0'>
                            <tr>
                                <td colspan="1">编码：SYC/ZJ-WL-12</td>
                                <td colspan="3">供货单位：{{toStoreBillData.cupCmpName}}</td>
                                <td colspan="3">日期: {{inDate}}</td>
                                <td colspan="1">NO.{{billNumFull}}</td>
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
                                    <FormItem prop="Num">
                                        <Input v-model="toStoreBill.Num" placeholder="" :maxlength="10" @on-keyup="numCheck('toStoreBill.Num','int')"></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem prop="Weight">
                                        <Input v-model="toStoreBill.Weight" placeholder="" :maxlength="10" @on-keyup="minNumCheck('toStoreBill.Weight')"></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem prop="Price">
                                        <Input v-model="toStoreBill.Price" placeholder="" :maxlength="10" @on-keyup="numCheck('toStoreBill.Price')"></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem prop="Amount">
                                        <Input :value="inPriceTotle" v-model="toStoreBill.Amount" placeholder="" :maxlength="10" @on-keyup="numCheck('toStoreBill.Amount')"></Input>
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
                                <td colspan="3">采购员：</td>
                                <td colspan="3">仓库主管：</td>
                                <td colspan="1">库管员：</td>
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
        <!-- 原料出库单录入 -->
        <Modal class="dissent-modal modal-table-form" width='900px' :mask-closable="false" v-model="outStoreModal">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>原料出库单录入</span>
            </p>
            <div class="">
                <Form ref="outStoreForm" :model="outStoreBill" :rules="ruleStoreForm" label-position="right" :label-width="100" inline>
                    <Card class="modal-formItem">
                        <FormItem label="原料:" class="label-50">
                            <Select :transfer="true" v-model="outStoreBill.YL_TyID" :label-in-value='true' style="width:170px" @on-change='outMaterialId'>
                                <Option v-for="item in goodsList" :value="item.id" :label="item.value" :key="item.value">{{item.value}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem  label="使用单位:" prop='YLUseCmp_ID'>
                            <Select :transfer="true" v-model="outStoreBill.YLUseCmp_ID" :label-in-value='true'  style="width:170px" @on-change='outUseCmpId'>
                                <Option v-for="item in useCmpList" :value="item.id" :label="item.value" :key="item.value">{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem  label="供货单位:" prop='YLSupCmp_ID'> 
                            <Select :transfer="true" v-model="outStoreBill.YLSupCmp_ID" :label-in-value='true'  style="width:130px">
                                <Option v-for="item in offerCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem   label="单号:" prop='Bill_ID' class="label-50">
                            <Input :maxlength="10" v-model="outStoreBill.Bill_ID" style="width:170px"></Input>
                        </FormItem>
                        <FormItem  label="日期:" prop='zDate'>
                            <DatePicker :options='options' :transfer="true" type="date" v-model="outStoreBill.zDate" style="width:170px"></DatePicker>
                        </FormItem>
                        <FormItem label="计价方式">
                            <RadioGroup v-model="outStoreBillData.radio">
                                <Radio label="吨">吨</Radio>
                                <Radio label="支">支</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Card>
                    <div class="margin-top-10 color-red">
                        <h3 style="text-align:center;" class="margin-bottom-10">专用原(辅)料出库单</h3>
                        <table class="dissent-table table-common table-common-top table-common-bottom " border="1" cellspacing='0'>
                            <tr>
                                <td >编码：SYC/ZJ-WL-12</td>
                                <td  colspan="3">使用分厂：{{outStoreBillData.cupCmpName}}</td>
                              
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
                                    <FormItem prop='Num'>
                                        <Input v-model="outStoreBill.Num" placeholder="" :maxlength="10" @on-keyup="numCheck('outStoreBill.Num')"></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem prop='Weight'>
                                        <Input v-model="outStoreBill.Weight" placeholder="" :maxlength="10" @on-keyup="minNumCheck('outStoreBill.Weight')"></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem prop='Price'>
                                        <Input v-model="outStoreBill.Price" placeholder="" :maxlength="10" @on-keyup="numCheck('outStoreBill.Price')"></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem prop='Amount'>
                                        <Input :value="outPriceTotle" :maxlength="10" v-model="outStoreBill.Amount"></Input>
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
                                <td >仓储主管：</td>
                                <td colspan="3">保管员：</td>
                                <td colspan="3">使用单位主管：</td>
                                <td colspan="1">领用人：</td>
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
                //异议入库显示
                toStoreBillData:{
                    cupCmp:'',//id
                    cupCmpName:'',
                    storeYL:'',//id
                    storeYLName:'',
                    specifications:'',
                    billNum: '0',
                    branchTotle: 0,
                    weightTotle: 0,
                    standardWeight: 0,
                    radio: '吨',
                    date: '',
                },
                //异议出库显示
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
                //异议入库提交
                toStoreBill:{
                    "ID": "",
                    "Bill_ID": "",
                    "YL_TyID": "",
                    "YLSupCmp_ID": "",
                    "YLUseCmp_ID": "",
                    "InOutStats": "5",
                    "Date": "",
                    "Weight":"",
                    "Num": "",
                    "Price": "0",
                    "Amount": "",
                    "ThisBalanceWeight": "",
                    "ThisBalanceStockNum": "",
                    "ThisBalanceAmount": "",
                    "ValuationMethod": "",
                    "Librarian": "",
                    "IsLock": "",
                    "Remarks": ""
                },
                //异议出库提交
                outStoreBill:{
                    "ID": "",
                    "Bill_ID": "",
                    "YL_TyID": "",
                    "YLSupCmp_ID": "",
                    "YLUseCmp_ID": "",
                    "InOutStats": "6",
                    "Date": "",
                    "Weight":"",
                    "Num": "",
                    "Price": "0",
                    "Amount": "",
                    "ThisBalanceWeight": "",
                    "ThisBalanceStockNum": "",
                    "ThisBalanceAmount": "",
                    "ValuationMethod": "",
                    "Librarian": "",
                    "IsLock": "",
                    "Remarks": ""
                },
                lookBillData:{
                    bcGSubClass_Value:'',
                    zAmount:'',
                    zDate:'',
                    zBill_ID:'',
                    bgPinMing:'',
                    zInOutStats:'',
                    zWeight:'',
                    bgSpecifications:'',
                    bgWuPinMinGangji:'',
                    zvaluationMethod:'',
                    zNum:'',
                    zPrice:'',
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
                    {title: '入出',key: 'zInOutStats',align:"center",width: 40,
                        render: (h, params) => {
                            if( params.row.zInOutStats == 5){
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'plus',
                                            size: '18',
                                            color: 'yellowgreen'
                                        }
                                    })
                                ])
                            }else if( params.row.zInOutStats == 6){
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
                    {title: "单据号", key:"zBill_ID",align:"center",width: 100,},
                    {title: "供货或使用", key:"supOrUseCmp",width: 110,align:"center",},
                    {title: "品名", key:"bgPinMing",width: 200,align:"center",},
                    {title: "重量(吨)", key:"zWeight",align:"center"},
                    {title: "支数",key:"zNum",align:"center"},
                    {title: "金额",key:"zAmount",align:"center"},
                    {title: "日期",key:"zDate",width:150,align:"center",},
                    {title: "保管员", key:'librarian',width: 80,align:"center"},
                    {title: "操作",align:"center",width:120,
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
                                            this.deleteData(params.row.zid)
                                        }
                                    }
                                }, '删除'):''
                            ]);
                        }
                    } 
                ],
                ruleStoreForm:{
                    YLSupCmp_ID:[
                        { required: true,message:' '}
                    ],
                    YLUseCmp_ID:[
                        { required: true,message: ''}
                    ],
                    zDate: [
                        { required: true,type:'date',message:' '}
                    ],
                    Num: [
                        { validator: base.intCheck,required: true,message:' '}
                    ],
                    Weight: [
                        { validator: base.floatCheck,required: true,message:' ' }
                    ],
                    Price: [
                        { validator: base.floatCheck,required: true, message: ' '}
                    ],
                    Amount: [
                        { validator: base.floatCheck,required: true, message: ' '}
                    ],
                    Bill_ID:[
                        { required: true, message: ' '}
                    ]
                },
                outRules: {
                    Num: [
                        { required: true,message:' ', trigger: 'blur' }
                    ],
                    Weight: [
                        { required: true,message:' ', trigger: 'blur' }
                    ],
                    Price: [
                        { validator: base.floatCheck,required: true, message: ' ', trigger: 'blur' }
                    ],
                    bilL_ID:[
                        { required: true, message: ' ', trigger: 'blur' }
                    ],
                    YLUseCmp_ID:[
                        { required: true, message: ' ', trigger: 'change' }
                    ],
                    StoreArea:[
                        { required: true, message: ' ', trigger: 'blur' },
                        { type: 'string', max: 20, message: ' ', trigger: 'blur' }
                    ],
                    Remark: [
                        { type: 'string', max: 60, message: ' ', trigger: 'blur' }
                    ]
                },
                //查看模态表头
                data: [],//获取主页列表的数据
                total: 0,//总条数
                pageCurrent: 1,//当前页码
                pageSize: 10,//页面大小
                //主页面
                options:{
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    }
                },
                material: '',//选中的材料
                office: 0,//选中的供货单位
                user: 0,//选中的使用单位
                goodsList: [],//品名列表
                offerCmpList: [],//供货单位列表
                useCmpList: [],//使用单位列表
                filtStateSelect: 0,      // 筛选状态下拉框
                filtStateData: [//状态列表
                    // {num:0,value:'全部显示记录'},
                    {num:5,value:'仅显示入库单记录'},
                    {num:6,value:'仅显示出库单记录'},
                ],
                startDate: '',
                endDate: '',
            }
    },
    computed:{
        outDate(){
            if(typeof this.outStoreBill.zDate === 'object'){
                return base.dateFormat(this.outStoreBill.zDate)
            }
        },
        inDate(){
            if(typeof this.toStoreBill.zDate === 'object'){
                return base.dateFormat(this.toStoreBill.zDate)
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
            if(this.toStoreBillData.radio == '支')this.toStoreBill.Amount = (this.toStoreBill.Num *this.toStoreBill.Price || 0).toFixed(3);
            if(this.toStoreBillData.radio == '吨')this.toStoreBill.Amount = (this.toStoreBill.Weight *this.toStoreBill.Price || 0).toFixed(3);
        },
        outPriceTotle(){
            if(this.outStoreBillData.radio == '支')this.outStoreBill.Amount = (this.outStoreBill.Num *this.outStoreBill.Price || 0).toFixed(3);
            if(this.outStoreBillData.radio == '吨')this.outStoreBill.Amount = (this.outStoreBill.Weight *this.outStoreBill.Price || 0).toFixed(3);
        }
    },
    methods: {
        //数字输入框验证
        numCheck(str,type) {
            str = str.split('.');
            let len = str.length;
            if(type == 'int'){
                switch (len) {
                    case 1:
                        this[str[0]] = this[str[0]].replace(/[^0-9]/g,'');
                        break;
                    case 2:
                        this[str[0]][str[1]] = this[str[0]][str[1]].replace(/[^0-9]/g,'');
                        break;
                    case 3:
                        this[str[0]][str[1]][str[2]] = this[str[0]][str[1]][str[2]].replace(/[^0-9]/g,'');
                        break;
                    default:
                        break;
                }
            }else{
                switch (len) {
                    case 1:
                        this[str[0]] = this[str[0]].replace(/[^0-9.]/g,'');
                        break;
                    case 2:
                        this[str[0]][str[1]] = this[str[0]][str[1]].replace(/[^0-9.]/g,'');
                        break;
                    case 3:
                        this[str[0]][str[1]][str[2]] = this[str[0]][str[1]][str[2]].replace(/[^0-9.]/g,'');
                        break;
                    default:
                        break;
                }
            }
        },
        minNumCheck(str){
            str = str.split('.');
            this[str[0]][str[1]] = String(this[str[0]][str[1]]).replace(/[^0-9.-]/g,'');
        },
        //公共函数
        btnCommonFun(storeState,callback){
            if(this.selectedIds.length > 0){
                this.selectedIds.forEach( (item,index) => {
                    base.getAjaxData(base.baseURL+'WlCenter/yl_arrivalstatupd_view?ID=' + item, (data) => {
                        if(data.results[0].storeStatus === storeState){
                            callback(data,item,index);
                        }else{
                            this.$Message.error('已选的第'+(index+1)+'条已不可进行当前操作！');
                        }
                    });
                });
            }else{
                this.$Message.error('至少选择一条数据！');
            }
        },
        //删除
        deleteData(id){
            base.getAjaxData(base.baseURL+'WlCenter/Yl_YiYiBat?orderBy=-ID&Take=1', (res) => {
                if(res.results[0].id == id){
                    this.$Modal.confirm({
                        content:'<p>确定删除数据么</p>',
                        onOk:() =>{
                            base.deleteAjaxData(base.baseURL + 'WlCenter/Yl_YiYiBat?ID='+id,() => {
                                this.$Message.success('数据已删除！');
                                this.init();
                            });
                        }
                    })
                }else{
                    this.$Message.warning('已前数据不可删除！');
                }
            });
        },
        //异议入库单按钮
        toStore(){
            this.$refs.toStoreForm.resetFields();
            this.toStoreBill.zDate = this.today;
            if(this.goodsList[0] && this.offerCmpList[0]){
                this.toStoreBillData.storeYL = this.goodsList[0].id;
                this.toStoreBillData.cupCmp = this.offerCmpList[0].id;
            }
            this.enterStoreModal = true;
        },
        //异议出库单按钮
        outStore(){
            this.$refs.outStoreForm.resetFields();
            this.outStoreBill.zDate = this.today;
            if(this.goodsList[0] && this.offerCmpList[0]){
                this.outStoreBill.YL_TyID = this.goodsList[0].id;
                this.outStoreBill.YLUseCmp_ID = this.useCmpList[0].id;
                console.log(this.outStoreBill.YLUseCmp_ID);
                this.outStoreBill.YLSupCmp_ID = this.offerCmpList[0].id;
            }
            this.outStoreModal = true;
        },
        //获取选中品名的id
        materialId(data){
            this.toStoreBill.YL_TyID = data.value;
            base.showGoodsInfo({
                'vm':this,
                'wpId':data.value,
                'pinM':'toStoreBillData.storeYLName',
                'jsSpecifications':'toStoreBillData.specifications',
            });
        },
        offerCmpId(data){
            this.toStoreBill.Cmp_ID = data.value;
            this.toStoreBillData.cupCmpName = data.label;
        },
        outMaterialId(data){
            this.outStoreBill.YL_TyID = data.value;
            base.showGoodsInfo({
                'vm':this,
                'wpId':data.value,
                'pinM':'outStoreBillData.storeYLName',
                'jsSpecifications':'outStoreBillData.specifications',
            });
        },
        outUseCmpId(data){
            this.outStoreBill.YLUseCmp_ID = data.value;
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
        btnQuery() {
            this.pageCurrent = 1;
            this.query(0, this.pageSize);
        },
        //查询函数
        query(skip,take){
                let _self = this;
                let para = {};

                para.Skip = skip;
                para.Take = this.pageSize;

                if(this.filtStateSelect){
                    para.ZInOutStats = this.filtStateSelect;
                }
                if(this.material) {
                    para.zyL_TyID = this.material;
                }

                if(this.office && this.user){
                    para['ZYLSupCmp_IDIn'] = this.user + ',' + this.office
                }else if(this.office) {
                    para.ZYLSupCmp_ID = this.office;
                }else if(this.user) {
                    para.ZYLUseCmp_ID = this.user;
                }
                if(this.startDate) para['zDate>'] = base.dateFormat(this.startDate);
                if(this.endDate) para['zDate<'] = base.dateFormat(this.endDate);
                if(this.startDate && this.endDate) para.zDateBetween = base.dateFormat(this.startDate) + ',' + base.dateFormat(this.endDate);

            console.log(para)
            base.ajaxData('WlCenter/Yl_YiYiBat_view?orderBy=-ZID', para, 'GET', (e) => {
                if(e.results)e.results.forEach( (item) => {
                    if(item.zDate)item.zDate = item.zDate.substring(0,10);
                });
                _self.data = e.results;
                _self.total = e.total;
                });
        },
        //清空查询条件
        clearQuery(){
                this.office= 0;
                this.user= 0;
                this.endDate= '';
                this.filtStateSelect= 0;
                this.startDate= '';
        },
        //异议入库保存
        tostoreCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.toStoreBill.ValuationMethod = (this.toStoreBillData.radio == '吨') ? 1 : 2;
                    this.toStoreBill.Bill_ID = this.billNumFull;
                    this.toStoreBill.Date = this.inDate;
                    this.toStoreBill.YLSupCmp_ID = this.toStoreBillData.cupCmp
                    base.postAjaxData(base.baseURL+'WlCenter/Yl_YiYiBat',JSON.stringify(this.toStoreBill),() =>{
                        this.init();
                        this.enterStoreModal = false;
                    });
                }else{
                    this.$Message.error('请填写完整！');
                }
            })
            
        },
        //异议出库库保存
        outStoreCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.outStoreBill.ValuationMethod = (this.outStoreBillData.radio == '吨') ? 1 : 2;
                    this.outStoreBill.Bill_ID = this.outBillNumFull;
                    this.outStoreBill.Date = this.outDate;
                    base.postAjaxData(base.baseURL+'WlCenter/Yl_YiYiBat',JSON.stringify(this.outStoreBill),() =>{
                        this.init();
                        this.outStoreModal = false;
                    });
                }else{
                    this.$Message.error('请正确填写！');
                }
            })
        },
        //关闭模态框
        handleClose(){
            this.outStoreModal = false;
            this.enterStoreModal = false;
            this.lookModal = false;
        },
        // 初始化
        init(){
            this.today = base.dateFormat(new Date())
            this.changePage(this.pageCurrent);
        }
    },
    created(){
        //物品信息
        base.getGoodsList(this,107);
        this.query();
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
    }
};
</script>
