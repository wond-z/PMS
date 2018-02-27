<style lang="less">
   @import './deliver-mgmt.less';
</style>

<template>
	 <div class="table-component-common">
        <div class="margin-bottom-10">
            <Button type="primary" :disabled = '!isToDeliver' @click="toDeliver()" icon="minus">发货</Button>
            <Button type="primary" :disabled = '!isToMainLook' @click="look()" icon="ios-search">查看</Button>
            <Button type="primary" :disabled = '!isToDelete' @click="toDeleteData" icon="trash-a">删除</Button>
            <Button type="primary" :disabled = '!isToDetail' @click="detailModal = true;" icon="document-text">查看明细</Button>
            <Button type="primary" :disabled = '!isToOutStore' @click="handleOutBill()" icon="reply">出库单</Button>
        </div>
        <card class="margin-bottom-10 padding-top-bottom-minish">
				<div class="select-col" >
			   		<div class="div">
		            	<label align="middle" class="label" style="width:40px">原料</label>
				        <Select v-model="material" class="select li-width">
					        <Option v-for="item in goodsList" :value="item.id" :key="item.id">{{item.value}}</Option>
					    </Select>
		            </div>
		            <div class="div">
		            	<label class="label">供货单位</label>
				        <Select v-model="office"  class="select">
                            <Option :value="0">全部</Option>
					        <Option v-for="item in offerCmpList" :value="item.id" :key="item.id">{{ item.value }}</Option>
					    </Select>
		            </div>
		        	<div class="div">
		            	<label class="label">使用单位</label>
				        <Select v-model="user"  class="select">
                            <Option :value="0">全部</Option>
					        <Option v-for="item in useCmpList" :value="item.id" :key="item.id">{{ item.value }}</Option>
					    </Select>
		            </div>
                    <div class="div">
		            	<label class="label">筛选状态</label>
				        <Select v-model="state"  class="select">
					        <Option v-for="item in statesList" :value="item.num" :key="item.num">{{ item.value }}</Option>
					    </Select>
		            </div>
		        	<div class="div">
		            	<label class="label" style="width:40px;">库区</label>
                        <Input v-model="storeA" placeholder="请输入库区" class="select"></Input>
		            </div>
                    <div class="div">
		            	<label class="label">起始日期</label>
		            	<DatePicker :value='dateRange.start' :options='options' placement="bottom-end" placeholder="选择日期" :editable='false' class="select" @on-change='dateFormatStart'></DatePicker>
		            </div>
		            <div class="div">
		            	<label class="label">截止日期</label>
		            	<DatePicker :value='dateRange.end' :options='options' placement="bottom-end" placeholder="选择日期" :editable='false' class="select" @on-change='dateFormatEnd'></DatePicker>
		            </div>
                    <Button type="primary" icon="ios-search" @click="btnQuery()" >查询</Button>
                    <Button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</Button>
				</div>
			</row>
		</card>
        <card>
			<div class="margin-bottom-10" >
	            <Table class="fontSize" size="small" border :data="data" :columns="columns" stripe ref="table2image" @on-selection-change='mainSelected'></Table>
	        </div>
            <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement='top'></Page>
	      	<div style="clear: both;"></div>
        </card>
        <!-- 查看明细弹出框 -->
        <Modal class="deliver-modal modal-table-form" width='900px' :mask-closable="false" v-model="detailModal" :styles="{top: '0px'}">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>原料发货明细</span>
            </p>
            <div class="margin-bottom-10">
                <Button type="primary"  icon="ios-upload" size="small">导出excel</Button>
            </div>
            <div>
                <Form ref="postForm">
                    <table  class="table-common table-common-tworow table-common-top deliver-table" border="1" cellspacing='0'>
                        <tr>
                            <td colspan="9" class="table-title">管材到(发)货登记表</td>
                        </tr>
                        <tr>
                            <td>重量单位：吨</td>
                            <td></td>
                            <td colspan="4"></td>
                            <td></td>
                            <td colspan="2">编码：SYC/ZJ JZ-19</td>
                        </tr>
                        <tr>
                            <td>品名</td>
                            <td>规格</td>
                            <td>供货单位</td>
                            <td>到货日期</td>
                            <td>使用单位</td>
                            <td>存储库区</td>
                            <td>支数</td>
                            <td>质保书量</td>
                            <td>磅重</td>
                        </tr>
                        <tr>
                            <td v-text="lookDetail.bgSubClass_Value"></td>
                            <td v-text="lookDetail.bgSpecifications"></td>
                            <td v-text="lookDetail.bcSubClass_Value"></td>
                            <td v-text="lookDetail.zDeliverGoodsDate"></td>
                            <td v-text="lookDetail.bsDepName"></td>
                            <td v-text="lookDetail.zStoreArea"></td>
                            <td v-text="lookDetail.zNumber"></td>
                            <td v-text="lookDetail.zStandardWeight"></td>
                            <td v-text="lookDetail.zWeight"></td>
                        </tr>
                        <tr>
                            <td >车皮号：</td>
                            <td colspan="5" v-text="lookDetail.zCarNo"></td>
                            <td>备注：</td>
                            <td colspan="2" v-text="lookDetail.zRemarks"></td>
                        </tr>
                    </table>
                    <p class="margin-top-10">录入数据:</p>
                    <table class="table-common deliver-table" border="1" cellspacing='0'>
                        <tr>
                            <td style="width:50px;">序号</td>
                            <td>炉号</td>
                            <td>批次</td>
                            <td>支数</td>
                            <td>重量</td>
                            <td style="width:50px;">序号</td>
                            <td>炉号</td>
                            <td>批次</td>
                            <td>支数</td>
                            <td>重量</td>
                        </tr>
                        <tr v-for="(item,index) in logTwoColData" :key="index">
                            <td>{{index+1}}</td>
                            <td v-text="item.left.FurnaceNo"></td>
                            <td v-text="item.left.Batch"></td>
                            <td v-text="item.left.Number"></td>
                            <td v-text="item.left.Weight"></td>

                            <td>{{index+16}}</td>
                            <td v-text="item.right.FurnaceNo"></td>
                            <td v-text="item.right.Batch"></td>
                            <td v-text="item.right.Number"></td>
                            <td v-text="item.right.Weight"></td>
                        </tr>
                    </table>
                </Form>
            </div>    
            <div slot="footer">
                <Button type="ghost" @click="handleClose('detailModal')">取消</Button>
                <Button type="primary"  @click="handleClose('detailModal')">保存</Button>
            </div>
        </Modal>
        <!-- 发货界面弹出框 -->
        <Modal class="deliver-modal modal-table-form" width='900px' :mask-closable="false" v-model="delieverModal" >
            <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>原料发货</span>
            </p>
            <div class="">
                <Form ref="toDeliverForm" :model="logLookData" :rules="ruleLogLookBill">
                    <div class="margin-top-10">
                        <h3 class="text-center margin-bottom-10">原料发货信息</h3>
                        <table class="table-common deliver-table" border="1" cellspacing='0'>
                            <tr style="display:none">
                                <td class="text-center" colspan="4">原料发货信息</td>
                            </tr>
                            <tr>
                                <td>使用单位</td>
                                <td>
                                    <FormItem prop='ylUseCmp_ID'>
                                        <Select :transfer="true" v-model="logLookData.ylUseCmp_ID">
                                            <Option v-for="item in useCmpList" :value="item.id" :key="item.id">{{ item.value }}</Option>
                                        </Select>
                                    </FormItem>
                                </td>
                                <td>发货日期</td>
                                <td>
                                    <FormItem prop='DeliverGoodsDate'>
                                        <DatePicker :options='options' :transfer="true" type="date" placeholder="" v-model="logLookData.DeliverGoodsDate"></DatePicker>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>原料类别</td>
                                <td>
                                    <FormItem prop='yL_TyID'>
                                        <Select :disabled='true' :transfer="true" v-model="logLookData.yL_TyID">
                                            <Option v-for="item in goodsList" :value="item.id" :key="item.id">{{ item.value }}</Option>
                                        </Select>
                                    </FormItem>
                                </td>
                                <td>规格</td>
                                <td>...</td>
                            </tr>
                            <tr>
                                <td>供货单位</td>
                                <td>
                                    <FormItem prop='ylSupCmp_ID'>
                                        <Select :disabled='true' :transfer="true" v-model="logLookData.ylSupCmp_ID">
                                            <Option v-for="item in offerCmpList" :value="item.id" :key="item.id">{{ item.value }}</Option>
                                        </Select>
                                    </FormItem>
                                </td>
                                <td>库区</td>
                                <td>
                                    <FormItem prop='StoreArea'>
                                        <Input v-model="logLookData.StoreArea" placeholder="" :maxlength="60"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>重量</td>
                                <td>
                                    <FormItem prop='Weight'>
                                        <Input v-model="logLookData.Weight" placeholder=""></Input>
                                    </FormItem>
                                </td>
                                <td>支数</td>
                                <td>
                                    <FormItem prop='Number'>
                                        <Input v-model="logLookData.Number" placeholder="" :maxlength="10"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>标重</td>
                                <td>
                                    <FormItem prop='StandardWeight'>
                                        <Input v-model="logLookData.StandardWeight" placeholder="" :maxlength="10"></Input>
                                    </FormItem>
                                </td>
                                <td>质保书重量</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td colspan="3">
                                    <FormItem prop="Remarks">
                                        <Input v-model="logLookData.Remarks" placeholder="" ></Input>
                                    </FormItem>
                                </td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('delieverModal')">取消</Button>
                <Button type="primary" @click="deliverCommit('toDeliverForm')">保存</Button>
            </p>
        </Modal>
        <!-- 出库单界面弹出框 -->
        <Modal class="deliver-modal modal-table-form" width='900px' :mask-closable="false" v-model="outStoreModal" >
            <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>原料出库单录入</span>
            </p>
            <div class="">
                <Form ref="outStoreForm" :model="outStoreBill" :rules="ruleOutStoreBill" label-position="right" :label-width="60" inline>
                    <Card class="modal-formItem">
                        <FormItem label="原料:" prop=''>
                            <Input :disabled='true' v-model="outStoreBillData.storeYL"></Input>
                        </FormItem>
                        
                        <FormItem style="width:190px;" label="分厂:">
                            <Input :disabled='true' v-model="outStoreBillData.cupCmp"></Input>
                        </FormItem>
                        <FormItem label="总重量:">
                            <Input style="width:100px;" :disabled='true' v-model="outStoreBillData.weightTotle"></Input> 吨
                        </FormItem>
                        <FormItem label="计价方式" style="margin-left:20px;">
                            <RadioGroup v-model="outStoreBillData.radio">
                                <Radio label="吨">吨</Radio>
                                <Radio label="支">支</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem  style="width:230px;" label="单号:" prop='Bill_ID'>
                            <Input v-model="outStoreBill.Bill_ID" placeholder="" :maxlength="10"></Input>
                        </FormItem>
                        
                        <FormItem style="width:190px;" label="日期:" prop='InOutDate'>
                            <DatePicker :options='options' :transfer="true" type="date" v-model="outStoreBill.InOutDate"></DatePicker>
                        </FormItem>
                        
                        <FormItem label="总支数:" >
                            <Input style="width:100px;" v-model="outStoreBillData.branchTotle"  :disabled='true' placeholder=""></Input> 支
                        </FormItem>
                        <FormItem label="单价:">
                            <Input  :disabled='true' v-model="outStoreBill.UnitPrice" style="width:100px;"></Input> 元/吨
                        </FormItem>
                    </Card>
                    <div class="modal-table margin-top-10">
                        <h3 style="text-align:center;" class="margin-bottom-10">专用原(辅)料出库单</h3>
                        <!-- <p><span>编码：SYC/ZJ-WL-12</span><span  style='margin-left:30px;'>使用分厂：<span v-text="outStoreBillData.cupCmp"></span></span><span style='margin-left:20%'>日期：{{idate}}</span><span style="float:right;color:red;">NO.{{outBillNumFull}}</span></p> -->
                        <table class="table-common table-common-top table-common-bottom deliver-table" border="1" cellspacing='0'>
                            <tr>
                                <td >编码：SYC/ZJ-WL-12</td>
                                <td colspan="3">使用分厂：<span v-text="outStoreBillData.cupCmp"></span></td>
                                <td colspan="3">日期：{{idate}}</td>
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
                                <td v-text="Array(outStoreBillData.storeYL.match(/^[\u4e00-\u9fa5]+\s\w+\s/g)).join()"></td>
                                <td v-text="String(outStoreBillData.storeYL).replace(/^[\u4e00-\u9fa5]+\s\w+\s/,'')"></td>
                                <td></td>
                                <td v-text='outStoreBillData.radio'></td>
                                <td>
                                    <FormItem prop='ThisNum'>
                                        <Input v-model="outStoreBill.ThisNum" placeholder="" :maxlength="10"></Input>
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
                                <td colspan="3">采购员：</td>
                                <td colspan="3">仓库主管：</td>
                                <td colspan="1">库管员：</td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('outStoreModal')">取消</Button>
                <Button type="primary" @click="outstoreCommit('outStoreForm')">保存</Button>
            </p>
        </Modal>
        <!-- 查看界面弹出框 -->
        <Modal class="deliver-modal modal-table-form" width='900px' :mask-closable="false" v-model="mainLookModal">
            <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>原料发货</span>
            </p>
            <div class="">
                <Form>
                    <div class="margin-top-10">
                        <h3 class="text-center margin-bottom-10">原料发货信息</h3>
                        <table class="table-common deliver-table" border="1" cellspacing='0'>
                            <tr style="display:none">
                                <td class="text-center" colspan="4">原料发货信息</td>
                            </tr>
                            <tr>
                                <td>使用单位</td>
                                <td v-text="logLookData.bsDepName"></td>
                                <td>发货日期</td>
                                <td v-text="deliverDate"></td>
                            </tr>
                            <tr>
                                <td>原料类别</td>
                                <td v-text="logLookData.bgPinMin"></td>
                                <td>规格</td>
                                <td>...</td>
                            </tr>
                            <tr>
                                <td>供货单位</td>
                                <td v-text="logLookData.bcSubClass_Value"></td>
                                <td>库区</td>
                                <td v-text="logLookData.StoreArea"></td>
                            </tr>
                            <tr>
                                <td>重量</td>
                                <td v-text="logLookData.Weight"></td>
                                <td>支数</td>
                                <td v-text="logLookData.Number"></td>
                            </tr>
                            <tr>
                                <td>标重</td>
                                <td v-text="logLookData.StandardWeight"></td>
                                <td>质保书重量</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td colspan="3" v-text="logLookData.Remarks"></td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('mainLookModal')">取消</Button>
                <Button type="primary" @click="handleClose('mainLookModal')">确定</Button>
            </p>
        </Modal>
	</div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        const deliverWeightRuler = (rule, value, callback) => {
            if (!/^[1-9]\d*\.?\d*$|0\.\d*[1-9]\d*$/.test(value + '') || value >= this.maxWeight) {
                callback(new Error());
            } else {
                callback();
            }
        };
        const deliverNumRuler = (rule, value, callback) => {
            if (!/^[1-9]*[1-9][0-9]*$/.test(value + '') || value >= this.maxNum) {
                callback(new Error());
            } else {
                callback();
            }
        };
        return {
            logTwoColData:[],
                //日期限制
            options:{
                disabledDate(date){
                    return date.valueOf() > Date.now();
                }
            },
            today:'',                 
            outStoreBillData:{  // 出库单显示
                cupCmp:'',
                cupCmpName:'',
                storeYL:'',
                storeYLName:'',
                billNum: '',
                branchTotle:0,
                weightTotle:0,
                price:'',
                standardWeight:0,
                radio: '吨',
                date: '',
            },
                //出库单提交数据
            outStoreBill:{
                "Bill_ID": "",
                "YL_TyID": "",
                "Cmp_ID": "",
                "InOutStats": 2,
                "InOutDate": "",
                "ThisWeight": "",
                "ThisNum": "",
                "UnitPrice": "0",
                "ThisAmount": "",
                "ValuationMethod": "",
                "InOutDetails": "",
                "IsLock": "",
                "Librarian": "",
                "Remarks": ""
            },
            ruleLogLookBill:{
                ylUseCmp_ID: [
                    { required: true,message:' ', trigger: 'blur' }
                ],
                StoreArea: [
                    { required: true,message:' ' }
                ],
                DeliverGoodsDate: [
                    { required: true,message:' ' }
                ],
                yL_TyID: [
                    { required: true, message: ' ', trigger: 'blur' }
                ],
                ylSupCmp_ID:[
                    { required: true, message: ' ', trigger: 'blur' }
                ],
                Weight:[
                    {validator: deliverWeightRuler, required: true, message: ' '}
                ],
                Number:[
                    {validator: deliverNumRuler, required: true, message: ' ' }
                ],
                StandardWeight:[
                    {validator: base.floatCheck, required: true, message: ' ' }
                ]
            },
            ruleOutStoreBill:{
                Bill_ID: [
                    { required: true,message:' ' }
                ],
                InOutDate: [
                    { required: true,message:' ' }
                ],
                ThisWeight:[
                    {validator: base.floatCheck,required: true, message: ' '}
                ],
                ThisNum:[
                    {validator: base.intCheck, required: true, message: ' ' }
                ],
                UnitPrice:[
                    {validator: base.floatCheck, required: true, message: ' '}
                ],
                ThisAmount:[
                    {validator: base.floatCheck, required: true, message: ' ' }
                ]
            },
                //按钮状态
            isToMainLook:false,
            isToDetail:false,
            isToOutStore:false,
            isToDeliver:false,
            isToDelete:false,
                //模态框控制
            mainLookModal:false,
            delieverModal:false,
            outStoreModal:false,
            detailModal: false, //录入模态框
            columns: [ //首页显示表格的列
                {type: 'selection', width: 40, align:"center"},
                {title: '品名',key: 'bgPinMin',align:"center",width: 200},
                {title: '供货单位', key: 'bcSubClass_Value',width: 150,align:"center"},
                {title: '使用分厂', key: 'bsDepName',width: 120,align:"center"},
                {title: '库区', key: 'zStoreArea',align:"center",width: 110},
                {title: '重量',key: 'zWeight',align:"center",width: 110},
                {title: '支数',key: 'zNumber',align:"center",width: 110},
                {title: '标重',key: 'zStandardWeight',align:"center",width: 100},
                {title: '日期',key: 'zDeliverGoodsDate',align:"center",width: 120},
                {title: '出库单号',key: 'zylOutStoreSgl_ID',align:"center",width: 100},
                {title: '车号',key: 'zCarNo',align:"center",width: 120}
            ],
            lookDetail:{
                "id":'',
                "bgPinMin":'',
                "bcSubClass_Value":'',
                "zDeliverGoodsDate":'',
                "bsDepName":'',
                "zStoreArea":'',
                "zNumber":'',
                "zStandardWeight":'',
                "zWeight":'',
                "zCarNo":'',
                "zRemarks":'',
                'bgSpecifications':'',
                'bgSubClass_Value':''
            },
            data: [], //获取主页列表的数据
            total:0, //总条数
            pageCurrent: 1, //当前页码
            pageSize: 10, //页面大小
            selectedOutData:[],
            selectedOutDataIDs:[],
            logLookData:{
                Weight:''
            }, //查看提交数据
            material:'', //选中的材料
            office:0, //选中的供货单位
            user:0, //选中的使用单位
            statesList:[ //状态列表
                {num:0,value:'显示全部记录'},
                {num:1,value:'仅显示未出库记录'},
                {num:2,value:'仅显示已出库记录'},
            ],
            state:0, //选中状态
            dateRange:{start:'',end:''}, //日期范围
            storeA:'', //选中库区
                //录入界面
            goodsList:[], //品名列表
            offerCmpList:[], //供货单位列表
            useCmpList:[], //使用单位列表
            maxWeight:0,
            maxNum:0
        }
    },
    computed:{
        idate(){
            if(typeof this.outStoreBill.InOutDate === 'object'){
              return base.dateFormat(this.outStoreBill.InOutDate)
            }
        },
        outPriceTotle(){
            if(this.outStoreBillData.radio == '支')this.outStoreBill.ThisAmount = (this.outStoreBill.ThisNum *this.outStoreBill.UnitPrice || 0).toFixed(3);
            if(this.outStoreBillData.radio == '吨')this.outStoreBill.ThisAmount = (this.outStoreBill.ThisWeight *this.outStoreBill.UnitPrice || 0).toFixed(3);
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
         //总重计算
        weightTotle(){
             let sum = 0;
             this.logData.forEach((item) => {
                 if(item.Weight)
                 sum += parseFloat(item.Weight);
             });
             return sum;
        },
        deliverDate(){
            return base.dateFormat(new Date(this.logLookData.DeliverGoodsDate));
        }
    },
    methods: {
         //发货提交
        deliverCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.btnCommonFun(1,()=>{
                        let postData = this.logLookData;
                        let upData = JSON.parse(JSON.stringify(postData));
                        delete postData.id
                        base.postAjaxData(base.baseURL + 'WlCenter/Yl_DeliverGoodsRec',JSON.stringify(postData),() => {
                            upData.Weight =this.maxWeight*1 - postData.Weight*1;
                            upData.Number =this.maxNum*1 - postData.Number*1;
                            base.putAjaxData(base.baseURL + 'WlCenter/Yl_DeliverGoodsRec',JSON.stringify(upData),() => {
                                this.$Message.success({duration: 3, content:'发货成功！'});
                                this.init();
                                this.delieverModal = false;
                                this.$refs[name].resetFields();
                            });
                        });
                    })
                }else{
                    this.$Message.warning({duration: 5, content:'请填写完整并检查是否正确！'});
                }
            })
        },
         //主页复选
        mainSelected(dataArray){
            let len = dataArray.length;
            if(!len){
                this.initBtn(false);
                return;
            }
            this.selectedOutData = dataArray;
            this.selectedOutDataIDs = [];
            dataArray.forEach( (item) =>{
                this.selectedOutDataIDs.push(item.id)
            })
            for( var key in this.lookDetail){
                this.lookDetail[key] = dataArray[0][key];
            }
            this.logTwoColData = [];
            for(var i = 0;i < 15;i++){
                this.logTwoColData.push({
                    left:{},
                    right:{}
                });
            }
            base.getAjaxData(base.baseURL+'WlCenter/Yl_DeliverGoodsRec_viewParm?ID='+this.lookDetail.id,(data) =>{ //明细详情
                for(var i = 0,num = data.Results.length;i < num;i++){
                    if(i < 15)this.logTwoColData[i].left = data.Results[i];
                    if(i >= 15)this.logTwoColData[i-15].right = data.Results[i];
                }
            })
            this.isToMainLook = true;
            this.isToDeliver = true;
            this.isToOutStore = true;
            if(len == 1){
                this.isToDelete = true;
                this.isToDetail = true;
                for(var key in dataArray[0]){
                    this.$set(this.logLookData,key.replace(/^z/,''),dataArray[0][key])
                }
            }else{
                this.isToMainLook = false;
                this.isToDeliver = false;
                this.isToDetail = false;
                this.isToDelete = false;
            }
        },
         //日期范围
        dateFormatStart(val){
            this.dateRange.start = val;
        },
        dateFormatEnd(val){
            this.dateRange.end = val;
        },
         //出库单按钮
        handleOutBill(){
            this.$refs.outStoreForm.resetFields();
             //初始化数据
            this.outStoreBillData = {
                cupCmp:'',
                cupCmpName:'',
                storeYL:'',
                storeYLName:'',
                billNum: '',
                branchTotle:0,
                weightTotle:0,
                price:'',
                standardWeight:0,
                radio: '吨',
                date: ''
            };
            this.outStoreBill={
                "Bill_ID": "",
                "YL_TyID": "",
                "Cmp_ID": "",
                "InOutStats": 2,
                "InOutDate": "",
                "ThisWeight": "",
                "ThisNum": "",
                "UnitPrice": "0",
                "ThisAmount": "",
                "ValuationMethod": "",
                "InOutDetails": "",
                "IsLock": "",
                "Librarian": "",
                "Remarks": ""
            };
            this.outStoreBill.InOutDate = this.today;
            let dataArray = this.selectedOutData;
            let len = dataArray.length;
            if(!len)return;
            let showData = this.outStoreBillData;
            let postData = this.outStoreBill;
            postData.YL_TyID = dataArray[0].zyL_TyID;
            postData.Cmp_ID = dataArray[0].zylUseCmp_ID;
            let supCmpId = dataArray[0].zylSupCmp_ID;
            for(var i = 1;i < len;i++){
                if(dataArray[i].zylSupCmp_ID !== supCmpId || dataArray[i].zylUseCmp_ID !== postData.Cmp_ID){
                    this.$Message.warning({duration: 5, content:'请选择同原料，同供货商，同使用厂的数据！'});
                    return;
                }
            }
            this.outStoreModal = true;
            let ids = [];
            
            showData.storeYL = dataArray[0].bgPinMin;
            showData.cupCmp = dataArray[0].bsDepName;
            dataArray.forEach( (item) => {
                ids.push(item.id);
                showData.branchTotle += parseInt(item.zNumber || 0);
                showData.weightTotle += (1*item.zWeight || 0);
                showData.StandardWeight += (1*item.zStandardWeight || 0);
            })
            postData.ThisNum = showData.branchTotle;
            postData.ThisWeight = showData.weightTotle;
            postData.InOutDetails = ids.join(',');
            this.outStoreBillData = showData;
            this.outStoreBill = postData;
        },
         //查看列表填充
        look(){
            this.mainLookModal = true;
        },
         //公共函数
        btnCommonFun(status,callback){
            if(this.selectedOutDataIDs.length > 0){
                base.getAjaxData(base.baseURL+'WlCenter/Yl_DeliverGoodsRec?IDIn=' + this.selectedOutDataIDs.join(','), (data) => {
                    var len = data.results.length;
                    for(var i = 0;i< len;i++){
                        if(data.results[i].fFlag !== status){
                            this.$Message.error({duration: 5, content:'已选的第【'+(i+1)+'】条不可进行当前操作！'});
                            return;
                        }
                    }
                    callback(data);
                });
            }else{
                this.$Message.error({duration: 5, content:'至少选择一条数据！'});
            }
        },
         //删除
        toDeleteData(){
            if(!this.logLookData.id){
                this.$Message.warning({duration: 5, content:'请选择数据！'});
                return;
            }
            let id = this.logLookData.id;
            base.getAjaxData(base.baseURL + 'WlCenter/Yl_DeliverGoodsRec?ID='+id,(e)=>{
                if(e.results[0].fFlag == 1){
                    this.$Modal.confirm({
                        content:'<p>确定删除数据么？</p>',
                        onOk:() =>{
                            base.deleteAjaxData(base.baseURL + 'WlCenter/Yl_DeliverGoodsRec?ID='+id,()=>{
                                    this.$Message.success({duration: 3, content:'数据删除成功！'});
                                    this.init();
                            });
                        }
                    })
                }else{
                    this.$Message.warning({duration: 5, content:'已出库！'});
                }
            });
        },
         //发货按钮
        toDeliver(){
            this.delieverModal = true;
            this.maxWeight = this.logLookData.Weight;
            this.maxNum = this.logLookData.Number;
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
            let options = '';
            let date = this.dateRange;
            options += '&zyL_TyID='+this.material;
            if(this.office){
                options += '&zylSupCmp_ID='+this.office;
            };
            if(this.user){
                options += '&zylUseCmp_ID='+this.user;
            }
            if(this.storeA){
                options += '&ZStoreArea='+this.storeA;
            }
            if(this.state){
                options += '&ZFFlag='+this.state;
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
            base.getAjaxData(base.baseURL+'WlCenter/Yl_DeliverGoodsRec_view?orderBy=-ID&Skip='+skip+'&take='+take+options,(res) => {
                this.data = res.results;
                 //对一些字段进行处理
                this.data.forEach( (item) => {
                    if(item.zDeliverGoodsDate){
                       item.zDeliverGoodsDate = item.zDeliverGoodsDate.substring(0,10);
                    }
                });
                this.total = res.total;
                this.initData();
            });
        },
         //清空查询条件
        clearQuery(){
            this.office=0;
            this.user=0;
            this.state=0;
            this.storeA='';
            this.dateRange.start = '';
            this.dateRange.end = '';
        },
         //出库单保存
        outstoreCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let flag = true;
                    let idStr = this.selectedOutDataIDs.join(',');
                    base.getAjaxData(base.baseURL+'WlCenter/Yl_DeliverGoodsRec?&IDIn='+idStr,(res) =>{
                        if(res.results[0].fFlag != 1){
                            flag = false;
                            this.$Message.warning({duration: 5, content:'所选数据已填写出库单！'});
                            return;
                        }
                        if(flag){
                            this.outStoreBill.ValuationMethod = (this.outStoreBillData.radio == '吨') ? 1 : 2;
                            base.postAjaxData(base.baseURL+'WlCenter/Yl_InOutManage',JSON.stringify(this.outStoreBill),()=>{
                                this.init();
                                this.$Message.success({duration: 3, content:'出库单填写成功！'});
                                this.outStoreModal = false;
                                this.$refs[name].resetFields();
                            });
                        }
                    })
                } else {
                    this.$Message.warning({duration: 5, content:'请填写完整并检查是否正确！'});
                }
            })
        },
         //关闭模态框
        handleClose(modal){
            this[modal] = false;
        },
        initData(){
            this.today = base.dateFormat(new Date());
            this.initBtn(false);
        },
        initBtn(s){
            this.isToDelete = s;
            this.isToDetail = s;
            this.isToDeliver = s;
            this.isToOutStore = s;
            this.isToMainLook = s;
        },
        init(){
            this.changePage(this.pageCurrent);
        }
    },
    mounted () {
        //物品信息
        base.getGoodsList(this,107);
        this.offerCmpList=[];
        this.useCmpList=[];
        //公共信息类
        base.getAjaxData(base.baseURL + 'PublicApi/bs_comminfo_view?isEnable=1',(res) =>{
            res.results.forEach((item) => {
                if(item.subClass_Value && item.comm_ID){
                    let temp = item.comm_ID.substring(0,3);
                    if(temp == 100)this.offerCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                }
            })
        });
        base.getAjaxData(base.baseURL + 'PublicApi/Bs_commdep0_view?isEnable=1',(res) =>{
            res.results.forEach((item) => {
                if(item.mid){
                    if(item.mDepName){
                        this.useCmpList.push({id:String(item.mid),value:item.mDepName});
                    }
                }
            })
        });
        base.moveWindow(310);
    },
    watch:{
        total: function(val) {
            base.watchTotal(val, this);
        }
    }
};
</script>
