<style lang="less">
   @import './record-mgmt.less';
</style>

<template>
	 <div class="record-mgmt">
        <card>
            <row justify="center" >
                <Col style="display:inline-block;">
                    <div style="display: inline-block; margin-right: 15px;">
		            	<i-button type="primary" @click="enterStoreModal = true;" icon="plus">冲红入库录</i-button>
                        <i-button type="primary" :disabled = '!isOutStore' @click="outStoreModal = true;" icon="minus">冲红出库录</i-button>
		            </div>
                </Col>
            </row>
        </card>
        <card class="margin-bottom-10 margin-top-10">
			<row justify="center" >
				<div class="margin-bottom-10">
			   		<div style="display: inline-block; margin-right: 15px;" justify="center">
		            	<label  for="for" align="middle" style="display:inline-block;width: 35px;text-align: right;">原料:</label>
				        <Select v-model="material" style="width:175px" >
					        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
					    </Select>
		            </div>
		            <div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">供货单位:</label>
				        <Select v-model="office"  style="width:175px">
					        <Option v-for="item in offerCmpList" :value="item.id" :key="item.vlaue">{{ item.value }}</Option>
					    </Select>
		            </div>
		        	<div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">使用单位:</label>
				        <Select v-model="user"  style="width:175px">
					        <Option v-for="item in useCmpList" :value="item.id" :key="item.vlaue">{{ item.value }}</Option>
					    </Select>
		            </div>
				</div>
				<div >
                    <div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 35px;text-align: right;">单号:</label>
                        <Input v-model="storeA" placeholder="" style="width:175px"></Input>
		            </div>
		        	<div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">起始日期:</label>
		            	<Date-picker placement="bottom-end" placeholder="选择日期" style="width:175px" @on-change='dateFormatStart'></Date-picker>
		            </div>
		            <div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">截止日期:</label>
		            	<Date-picker placement="bottom-end" placeholder="选择日期" style="width:175px" @on-change='dateFormatEnd'></Date-picker>
		            </div>
			        <div style="display: inline-block; margin-right: 15px;">
			        	<i-button type="primary" icon="ios-search" @click="query()" >查询</i-button>
		                <i-button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</i-button>
                        <i-button type="primary" icon="ios-upload">导出明细账</i-button>
			        </div>
				</div>
			</row>
		</card>
			<div class="margin-bottom-10" >
	            <Table class="fontSize" size="small" border :data="data" :columns="columns" stripe ref="table2image" @on-selection-change='haveSelected'></Table>
	        </div>
             <Page :total="total" :current="1" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
	      	<div style="clear: both;"></div>
        </card>
        <!-- 查看界面弹出框 -->
        <Modal class="record-modal" width='800px' :mask-closable="false" v-model="lookModal" ok-text="保存" cancel-text="关闭">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>专用原(辅)料出库单</span>
            </p>
            <div class="ivu-table ivu-table-border">
                <Form ref="toStoreForm" :model="toStoreBill" :rules="ruleValidate">
                    <div class="modal-table">
                        <h3 style="text-align:center;" class="margin-bottom-10">专用原(辅)料入库验收单</h3>
                        <p><span>编码:SYC/ZJ-WL-12</span><span  style='margin-left:30px;'>供货单位:<span v-text="toStoreBillData.cupCmp"></span></span><span style='margin-left:20%'>日期:{{toStoreBillData.date || today}}</span><span style="float:right;color:red;">NO.{{toStoreBillData.billNum}}</span></p>
                        <table class="tableHeade" border="1" cellspacing='0'>
                            <tr>
                                <td style="width:200px;">材料名称(钢级)</td>
                                <td>规格</td>
                                <td>批次(编号)</td>
                                <td>单位</td>
                                <td>数量</td>
                                <td>重量</td>
                                <td>单价</td>
                                <td>金额</td>
                            </tr>
                            <tr>
                                <td v-text="toStoreBillData.storeYL"></td>
                                <td></td>
                                <td></td>
                                <td v-text='toStoreBillData.radio'></td>
                                <td><InputNumber :max="9999999999" :min="0" :precision="0" v-model="toStoreBill.ThisNum"></InputNumber></td>
                                <td><InputNumber :max="999999999" :min="0" v-model="toStoreBill.ThisWeight"></InputNumber></td>
                                <td><InputNumber :max="999999999" :min="0" v-model="toStoreBill.UnitPrice"></InputNumber></td>
                                <td></td>
                                <!-- <td><InputNumber :max="999999999" :min="0" v-model="toStoreBill.ThisWeight"></InputNumber></td> -->
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
                            <tr style="display:none">
                                <td>采购主管:</td>
                                <td></td>
                                <td>采购员:</td>
                                <td></td>
                                <td>仓库主管:</td>
                                <td></td>
                                <td>库管员:</td>
                                <td></td>
                            </tr>
                        </table>
                        <p class='itable-info-4'><span>采购主管:</span><span>采购员:</span><span>仓库主管:</span><span>库管员:</span></p>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="primary" icon="android-close" @click="handleClose">关闭</Button>
                <Button type="primary" icon="android-done" @click="handleClose">保存</Button>
            </p>
        </Modal>
        <!-- 原料入库单录入 -->
        <Modal class="record-modal" width='800px' :mask-closable="false" v-model="enterStoreModal" ok-text="保存" cancel-text="关闭">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>原料入库单录入</span>
            </p>
            <div class="ivu-table ivu-table-border">
                <Form ref="postForm" :model="toStoreBillData" :rules="ruleValidate" label-position="right" :label-width="60" inline>
                    <Card class="modal-formItem">
                        <FormItem label="原料:">
                            <Select :transfer="true" v-model="toStoreBillData.storeYL" style="width:175px" @on-change='materialId'>
                                <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem style="width:235px;" label="供货:">
                            <Select :transfer="true" v-model="toStoreBillData.cupCmp"  style="width:150px" @on-change='offerCmpId'>
                                <Option v-for="item in offerCmpList" :value="item.id" :key="item.vlaue">{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="计价方式">
                            <RadioGroup v-model="toStoreBillData.radio">
                                <Radio label="吨">吨</Radio>
                                <Radio label="支">支</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem style="width:235px;" label="日期:">
                            <DatePicker :transfer="true" type="date" placeholder="Select date" :value='today' @on-change ='storeDate'></DatePicker>
                        </FormItem>
                        <FormItem  style="width:210px;" label="单号:">
                            <Input :maxlength="10" style="width:150px;" v-model="toStoreBillData.billNum"></Input>
                        </FormItem>
                        
                    </Card>
                </Form>
                <Form ref="toStoreForm" :model="toStoreBill" :rules="ruleValidate">
                    <div class="modal-table margin-top-10">
                        <h3 style="text-align:center;" class="margin-bottom-10">专用原(辅)料入库验收单</h3>
                        <p><span>编码:SYC/ZJ-WL-12</span><span style='margin-left:30px;'>供货单位:<span v-text="toStoreBillData.cupCmp"></span></span><span style='margin-left:20%'>日期:{{toStoreBillData.date || today}}</span><span style="float:right;color:red;">NO.{{billNumFull}}</span></p>
                        <table style="display:none;">
                            <tr>
                                <td>编码:SYC/ZJ-WL-12</td>
                                <td>供货单位:</td>
                                <td></td>
                                <td colspan="2">日期:{{toStoreBillData.date || today}}</td>
                                <td></td>
                                <td></td>
                                <td style="color:red;">NO.{{toStoreBillData.billNum}}</td>
                            </tr>
                        </table>
                        <table class="tableHeade" border="1" cellspacing='0'>
                            <tr>
                                <td style="width:150px;">材料名称(钢级)</td>
                                <td style="width:150px;">规格</td>
                                <td>批次(编号)</td>
                                <td>单位</td>
                                <td>数量</td>
                                <td>重量</td>
                                <td>单价</td>
                                <td>金额</td>
                            </tr>
                            <tr>
                                <td v-text="toStoreBillData.storeYL"></td>
                                <td v-text="toStoreBillData.storeYL"></td>
                                <td></td>
                                <td v-text='toStoreBillData.radio'></td>
                                <td><InputNumber :max="9999999999" :min="0" :precision="0" v-model="toStoreBill.ThisNum"></InputNumber></td>
                                <td><InputNumber :max="999999999" :min="0" v-model="toStoreBill.ThisWeight"></InputNumber></td>
                                <td><InputNumber :max="999999999" :min="0" v-model="toStoreBill.UnitPrice"></InputNumber></td>
                                <td><Input></Input></td>
                                <!-- <td><InputNumber :max="999999999" :min="0" v-model="toStoreBill.ThisWeight"></InputNumber></td> -->
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
                            <tr style="display:none">
                                <td>采购主管:</td>
                                <td></td>
                                <td>采购员:</td>
                                <td></td>
                                <td>仓库主管:</td>
                                <td></td>
                                <td>库管员:</td>
                                <td></td>
                            </tr>
                        </table>
                        <p class='itable-info-4'><span>采购主管:</span><span>采购员:</span><span>仓库主管:</span><span>库管员:</span></p>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="primary" icon="android-close" @click="handleClose">关闭</Button>
                <Button type="primary" icon="android-done" @click="tostoreCommit('toStoreForm')">保存</Button>
            </p>
        </Modal>
        <!-- 原料出库单录入 -->
        <Modal class="record-modal" width='800px' :mask-closable="false" v-model="outStoreModal" ok-text="保存" cancel-text="关闭">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>原料出库单录入</span>
            </p>
            <div class="ivu-table ivu-table-border">
                <Form :model="outStoreBillData" :rules="ruleValidate" label-position="right" :label-width="60" inline>
                    <Card class="modal-formItem">
                        <FormItem label="原料:">
                            <Select :transfer="true" v-model="outStoreBill.YL_TyID" style="width:175px" @on-change='materialId'>
                                <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem style="width:236px;" label="分厂:">
                            <Select :transfer="true" v-model="outStoreBill.Cmp_ID"  style="width:150px" @on-change='useCmpId'>
                                <Option v-for="item in useCmpList" :value="item.id" :key="item.vlaue">{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="计价方式">
                            <RadioGroup v-model="outStoreBillData.radio">
                                <Radio label="吨">吨</Radio>
                                <Radio label="支">支</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem style="width:236px;" label="日期:">
                            <DatePicker :transfer="true" type="date" placeholder="Select date" :value='today' @on-change ='outStoreDate'></DatePicker>
                        </FormItem>
                        <FormItem  style="width:160px;" label="单号:">
                            <Input :maxlength="10" style="width:90px;" v-model="outStoreBillData.billNum"></Input>
                        </FormItem>
                        
                    </Card>
                </Form>
                <Form ref="outStoreForm" :model="outStoreBill" :rules="ruleValidate">
                    <div class="modal-table margin-top-10">
                        <h3 style="text-align:center;" class="margin-bottom-10">专用原(辅)料出库单</h3>
                        <p><span>编码:SYC/ZJ-WL-12</span><span  style='margin-left:30px;'>使用分厂:<span v-text="outStoreBillData.cupCmp"></span></span><span style='margin-left:20%'>日期:{{outStoreBillData.date || today}}</span><span style="float:right;color:red;">NO.{{outBillNumFull}}</span></p>
                        <table class="tableHeade" border="1" cellspacing='0'>
                            <tr>
                                <td style="width:200px;">材料名称(钢级)</td>
                                <td>规格</td>
                                <td>批次(编号)</td>
                                <td>单位</td>
                                <td>数量</td>
                                <td>重量</td>
                                <td>单价</td>
                                <td>金额</td>
                            </tr>
                            <tr>
                                <td v-text="outStoreBillData.storeYL"></td>
                                <td></td>
                                <td></td>
                                <td v-text='outStoreBillData.radio'></td>
                                <td><InputNumber :max="9999999999" :min="0" :precision="0" v-model="outStoreBill.ThisNum"></InputNumber></td>
                                <td><InputNumber :max="999999999" :min="0" v-model="outStoreBill.ThisWeight"></InputNumber></td>
                                <td><InputNumber :max="999999999" :min="0" v-model="outStoreBill.UnitPrice"></InputNumber></td>
                                <td></td>
                                <!-- <td><InputNumber :max="999999999" :min="0" v-model="toStoreBill.ThisWeight"></InputNumber></td> -->
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
                            <tr style="display:none">
                                <td>采购主管:</td>
                                <td></td>
                                <td>采购员:</td>
                                <td></td>
                                <td>仓库主管:</td>
                                <td></td>
                                <td>库管员:</td>
                                <td></td>
                            </tr>
                        </table>
                        <p class='itable-info-4'><span>采购主管:</span><span>采购员:</span><span>仓库主管:</span><span>库管员:</span></p>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="primary" icon="android-close" @click="handleClose">关闭</Button>
                <Button type="primary" icon="android-done" @click="outStoreCommit('outStoreForm')">保存</Button>
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
                    cupCmp:'',
                    storeYL:'',
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
                    storeYL:'',
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
                    "InOutStats": 1,
                    "InOutDate": "",
                    "ThisWeight": 0,
                    "ThisNum": 0,
                    "UnitPrice": 0,
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
                    "InOutStats": 2,
                    "InOutDate": "",
                    "ThisWeight": 0,
                    "ThisNum": 0,
                    "UnitPrice": 0,
                    "ValuationMethod": '',
                    "InOutDetails": "",
                    "IsLock": "",
                    "Librarian": "",
                    "Remarks": ""
                },
                //表单提交总验证
                formValid:true,
                //按钮状态
                isOutStore:false,
                isToLook:false,
                isToCheck:false,
                isToCancelCheck:false,
                isToStore:false,
                isToDelete:false,
                //模态框控制
                lookModal:false,//查看
                enterStoreModal:false,//入库
                outStoreModal:false,//出库
                columns: [//首页显示表格的列
                    {title: ' ', width: 50,type:'index',align:"center","fixed": "left"},
                    {
                        title: '入出',
                        align:"center",
                        "width": 40,
                        render: (h, params) => {
                            if( params.row.inOutStats == 1){
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
                    {title: '单据号', key: 'bilL_ID',align:"center"},
                    {title: '供货和使用', key: 'ybSubClass_Value',align:"center"},
                    {title: '品名', key: 'ygSubClass_Value', align:"center"},
                    {
                        title: '重量(吨)',
                        key: 'thisWeight',
                        "width": 80,align:"center"
                        
                    },
                    {
                        title: '支数',
                        key: 'thisNum',
                   "width": 80,align:"center"
                    },
                     {
                        title: '金额',
                        key: 'unitPrice',
                       "width": 80,align:"center"
                    },
                    {
                        title: '结存重量',
                         key: 'thisBalanceWeight',
                       "width": 80,align:"center"
                    },
                    {
                        title: '结存支数',
                        key: 'thisBalanceStockNum',
                       "width": 80,align:"center"
                    },
                    {
                        title: '结存金额',
                        key: 'thisBalanceAmount',
                        "width": 80,
                        align:"center"
                    },
                    {
                        title: '日期',
                        key: 'inOutDate',
                        align:"center"
                    },
                    {
                        title: '保管员',
                        key: 'librarian',
                        "width": 80,
                        align:"center"
                    },
                    {
                        title: '绑定到(发)货记录',
                        align:"center",
                        key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '绑定单据')
                            ]);
                        }
                    },
                    {
                        // <Icon type="locked"></Icon>
                        // <Icon type="unlocked"></Icon>
                        title: '财务锁',
                        key: 'isLock',
                        "width": 50,
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
                        title: '操作',
                        "width": 120,align:"center",
                        key: 'handle',
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
                                            
                                        }
                                    }
                                }, '查看'),
                                params.index == 0 ?h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除'):''
                            ]);
                        }
                    } 
                ],
                //验证数据
                ruleValidate: {
                    StoreArea: [
                        { required: true,message:' ', trigger: 'blur' }
                    ],
                    PoundWeight1: [
                        { required: true,message:' ', trigger: 'blur' }
                    ],
                    YL_TyID: [
                        { required: true, message: ' ', trigger: 'change' }
                    ],
                    YLSupCmp_ID:[
                        { required: true, message: ' ', trigger: 'change' }
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
                total:0,//总条数
                pageCurrent: 1,//当前页码
                pageSize: 10,//页面大小
                //主页面
                material:'',//选中的材料
                office:'',//选中的供货单位
                user:'',//选中的使用单位
                statesList:[//状态列表
                    {num:0,value:'全部显示记录'},
                    {num:1,value:'仅显示未送检记录'},
                    {num:2,value:'仅显示待判记录'},
                    {num:3,value:'显示已合格记录'},
                    {num:4,value:'仅显示已发货记录'},
                ],
                state:'',//选中状态
                dateRange:{start:'',end:''},//日期范围
                storeA:'',//选中库区
                goodsList:[],//品名列表
                offerCmpList:[],//供货单位列表
                useCmpList:[],//使用单位列表
            }
    },
    computed:{
        //今日日期
        today:{
            get: () => {
                let inow = new Date();
                let iyear = inow.getFullYear();
                let imouth = inow.getMonth()+1;
                let iday = inow.getDate();
                let nowDay = iyear+'-'+imouth+'-'+iday;
                return nowDay;
            }
        },
        billNumFull(){
            let str = this.toStoreBillData.billNum;
            let len = this.toStoreBillData.billNum.length;
            for(var i = len; i<6;i++){
                str = '0' + str;
            }
            return str;
        },
        outBillNumFull(){
            let str = this.outStoreBillData.billNum;
            let len = this.outStoreBillData.billNum.length;
            for(var i = len; i<6;i++){
                str = '0' + str;
            }
            return str;
        }
    },
    methods: {
        //入库日期
        storeDate(value){
            this.toStoreBillData.date = value;
        },
        //出库日期
        outStoreDate(value){
            this.outStoreBillData.date = value;
        },
        //日期范围
        dateFormatStart(val){
            this.dateRange.start = val;
        },
        dateFormatEnd(val){
            this.dateRange.end = val;
        },
        //点击选中项的操作
        haveSelected(selectedData){
            this.selectedIds = [];
            this.selectedData= [];
            
            
            this.selectedData = selectedData;
            if(selectedData.length > 0){
                this.lookData = selectedData;
                this.lookHead =selectedData;

                this.isToDelete = true;
                this.isToLook = true;
                this.isToCheck = true;
                this.isToCancelCheck = true;
                this.isToStore = true,
                selectedData.forEach((item,index) => {
                    this.selectedIds.push(item.id);
                    
                })
            }else{
                this.isToDelete = false;
                this.isToLook = false;
                this.isToCheck = false;
                this.isToCancelCheck = false;
                this.isToStore = false;
                this.isToDeliver = false;
            }
            
        },
        //查看列表填充
        look(){
            
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
        deleteData(){
            // this.btnCommonFun(1, (data,id,index) => {
                this.$Modal.confirm({
                    content:'<p>确定删除数据么</p>',
                    onOk:() =>{
                        base.deleteAjaxData(base.baseURL + 'WlCenter/Yl_ArrivalRec?ID='+id,() => {
                            this.$Message.success('第'+(index+1)+'条数据已删除！');
                            this.init();
                        });
                    }
                })
            // });
        },
        //入库单按钮
        toStore(){
            this.toStoreBillData.storeYL = this.lookData[0].zylPinMing;
            this.toStoreBillData.cupCmp = this.lookData[0].zylSupCmp;
            this.toStoreBillData.branchTotle = this.lookData[0].zNumber  || 0;
            this.toStoreBillData.weightTotle = this.lookData[0].zPoundWeight || 0;
            this.toStoreBillData.standardWeight = this.lookData[0].zStandardWeight || 0;
            this.toStoreBill.ThisNum = this.toStoreBillData.branchTotle;
            this.toStoreBill.ThisWeight = this.toStoreBillData.weightTotle;
            this.toStoreBill.YL_TyID = this.lookData[0].zyL_TyID;
            this.toStoreBill.Cmp_ID = this.lookData[0].zylSupCmp_ID;
        },
        //获取选中品名的id
        materialId(id){
            this.toStoreBill.YL_TyID = id;
        },
        offerCmpId(id){
            this.toStoreBill.Cmp_ID = id;
        },
        useCmpId(){

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
        //查询函数
        query(skip,take){
            let options = '';
            let date = this.dateRange;
            options += '&yL_TyID='+this.material;
            if(this.office){
                options += '&cmp_ID='+this.office;
            };
            if(this.user){
                options += '&cmp_ID='+this.user;
            }
            if(this.storeA){
                options += '&bilL_ID='+this.storeA;
            }
            if(this.state){
                options += '&inOutStats='+this.state;
            }
            if(date.start && date.end){
                date.start > date.end ? this.$Modal.warning({content: '<p>起始日期大于截至日期,条件无效</p>'}) : (options += '&inOutDateBetween='+date.start + ',' +date.end);
            }else if(date.start){
                options += '&>InOutDate=' + date.start;
            }else if(date.end){
                options += '&InOutDate<=' + date.end;
            }
            if(skip == undefined)skip = 0;
            if(take == undefined)take = this.pageSize;
            base.getAjaxData(base.baseURL+'WlCenter/Yl_Inoutmanage_view?Skip='+skip+'&take='+take+options,(res) => {
                res.results.forEach( (item) => {
                    if(item.inOutDate){
                       item.inOutDate = item.inOutDate.substring(0,10);
                    }
                });
                this.data = res.results;
                this.total = res.total;
            });
        },
        //清空查询条件
        clearQuery(){
                this.office='';
                this.user='';
                this.state='';
                this.storeA='';
                this.carNum='';
        },
        //冲红入库保存
        tostoreCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.toStoreBill.InOutDate = this.toStoreBillData.date;
                    this.toStoreBill.ValuationMethod = (this.toStoreBillData.radio == '吨') ? 1 : 2;
                    this.toStoreBill.Bill_ID = this.billNumFull;
                    base.postAjaxData(base.baseURL+'WlCenter/Yl_InOutManage',JSON.stringify(this.toStoreBill),() =>{
                        this.init();
                        this.enterStoreModal = false;
                    });
                }else{
                    this.$Message.error('请正确填写！');
                }
            })
            
        },
        //冲红出库库保存
        outStoreCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.outStoreBill.InOutDate = this.outStoreBillData.date;
                    this.outStoreBill.ValuationMethod = (this.outStoreBillData.radio == '吨') ? 1 : 2;
                    this.outStoreBill.Bill_ID = this.outBillNumFull;
                    base.postAjaxData(base.baseURL+'WlCenter/Yl_InOutManage',JSON.stringify(this.outStoreBill),() =>{
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
        init(){
            //初始化按钮状态
            this.isOutStore = true;
            this.isToLook = false;
            this.isToCheck = false;
            this.isToCancelCheck = false;
            this.isToStore = false;
            this.isToDelete = false;

            let _self = this
            
            //物品信息
            this.goodsList=[];
            this.offerCmpList=[];
            this.useCmpList=[];
            base.getAjaxData(base.baseURL + 'PublicApi/bs_goodsinfo_view',(bsGoods) =>{
                bsGoods.results.forEach((item) => {
                    if(item.isEnable && item.pinMing){
                        this.goodsList.push({id:item.wp_ID,value:item.pinMing});
                    }
                })
                this.material = this.goodsList[0].id;
                //公共信息类
                base.getAjaxData(base.baseURL + 'PublicApi/bs_comminfo_view',(res) =>{
                    res.results.forEach((item) => {
                        let temp = item.comm_ID.substring(0,3);
                        if(temp == 100 && item.isEnable && item.subClass_Value){
                            this.offerCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                        }
                        if(temp == 104 && item.isEnable && item.subClass_Value){
                            this.useCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                        }
                    })
                    this.query();
                });
            });
        }
    },
    created(){
            this.init();
    },
    mounted(){
    },
    watch:{
        
    }
};
</script>
