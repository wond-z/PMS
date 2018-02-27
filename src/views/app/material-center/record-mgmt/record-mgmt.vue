<style lang="less">
   @import './record-mgmt.less';
</style>

<template>
	<div class="record-mgmt">
        <card>
            <row justify="center" >
                <Col style="display:inline-block;">
                    <div style="display: inline-block; margin-right: 15px;">
		            	<i-button type="primary" @click="logModal = true;" icon="plus">到货登记</i-button>
                        <i-button type="primary" :disabled = '!isToLook' @click="lookModal = true;look()" icon="ios-search">查看</i-button>
                        <i-button type="primary" :disabled = '!isToDelete' @click="toDeleteData" icon="trash-a">删除</i-button>
                        <i-button type="primary" :disabled = '!isToCheck' @click="toCheck" icon="forward">送检</i-button>
                        <i-button type="primary" :disabled = '!isToCancelCheck' @click="toCancelCheck" icon="reply">取消送检</i-button>
                        <i-button type="primary" :disabled = '!isToStore' @click="enterStoreModal = true;toStore()" icon="reply">入库单</i-button>
                        <i-button type="primary" :disabled = '!isToDeliver' @click="delieverModal = true;toDeliver()" icon="reply">发货</i-button>
		            </div>
                </Col>
            </row>
        </card>
        <card class="margin-bottom-10 margin-top-10">
			<row justify="center">
				<div class="margin-bottom-10">
			   		<div style="display: inline-block; margin-right: 15px;" justify="center">
		            	<label  for="for" align="middle" style="display:inline-block;width: 35px;text-align: right;">原料:</label>
				        <Select v-model="material" style="width:175px">
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
                    <div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">筛选状态:</label>
				        <Select v-model="state"  style="width:175px">
					        <Option v-for="item in statesList" :value="item.num" :key="item.num">{{ item.value }}</Option>
					    </Select>
		            </div>
                    
				</div>
				<div >
		        	<div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 35px;text-align: right;">车号:</label>
				        <Select v-model="carNum"  style="width:175px">
					        <Option v-for="item in carNumList" :value="item || 0" :key="item">{{ item }}</Option>
					    </Select>
		            </div>
		        	<div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">库区:</label>
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
		            <!-- <div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">时间:</label>
		            	<Date-picker type="daterange" placement="bottom-end" placeholder="选择日期" style="width:175px" @on-change='dateFormat'></Date-picker>
		            </div> -->
			        <div class="mystyle" style="display: inline-block;">
			        	<i-button type="primary" icon="ios-search" @click="query()" >查询</i-button>
		                <i-button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</i-button>
		                <i-button type="primary" icon="ios-upload">导出信息</i-button>
			        </div>
				</div>
			</row>
		</card>
			<div class="margin-bottom-10" >
	            <Table class="fontSize" size="small" border :loading='isLoading' :data="data" :columns="columns" stripe ref="table2image" @on-selection-change='haveSelected'></Table>
	        </div>
                <Page :total="total" :current="1" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
	      	<div style="clear: both;"></div>
        </card>
        <!-- 录入界面弹出框 -->
        <Modal class="record-modal record-mgmt" width='800px' v-model="logModal" :mask-closable="false" ok-text="保存" cancel-text="关闭"  @on-ok="handleSubmit('postForm')">
             <p slot="header" >
                 <Icon type="compose" size='16'></Icon>
                <span>管材到(发)货登记表</span>
                <p><span>单位：吨</span><span style='float:right;'>编号：SYC/ZJ-WL-07</span></p>
            </p>
            <div class="ivu-table ivu-table-border modal-table">
                <Form ref="postForm" :model="postData" :rules="ruleValidate">                
                    <table class="tableHeade" border="1" cellspacing='0'>
                        <tr style="display:none;font-size:24px;">
                            <td colspan="6">管材到(发)货登记表</td>
                        </tr>
                        <tr>
                            <td colspan="2">品名</td>
                            <td>规格</td>
                            <td colspan="2">供货单位</td>
                            <td>到货日期</td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <FormItem prop="YL_TyID">
                                    <Select :transfer="true" @on-change='goodId'>
                                        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                                    </Select>
                                </FormItem>
                            </td>
                            <td>73.02*5.51</td>
                            <td colspan="2">
                                <FormItem prop="YLSupCmp_ID">
                                    <Select :transfer="true" @on-change='offerCmpId'>
                                        <Option v-for="item in offerCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                                    </Select>
                                </FormItem>
                            </td>
                            <td>
                                <FormItem prop="ArrivalGoodsDate">
                                    <DatePicker :options="options" :value="today" :transfer="true" type="date" placeholder="选择日期"  @on-change='pickerDate'></DatePicker>
                                </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">使用单位</td>
                            <td>存储库区</td>
                            <td>磅重一</td>
                            <td>磅重二</td>
                            <td>磅重合计</td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <FormItem prop="YLUseCmp_ID">
                                    <Select :transfer="true" @on-change='useCmpId'>
                                        <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                                    </Select>
                                </FormItem>
                            </td>
                            <td>
                                <FormItem prop="StoreArea">
                                    <Input v-model="postData.StoreArea" placeholder="" pattern="[A-z]{3}"></Input>
                                    <!-- <input type="text" pattern="[A-z]{3}" title="三个字母"> -->
                                </FormItem>
                            </td>
                            <td>
                                <!-- <FormItem prop="PoundWeight1"> -->
                                    <InputNumber :max="100" :min="1" v-model="postData.PoundWeight1"></InputNumber>
                                <!-- </FormItem> -->
                            </td>
                            <td>
                                <!-- <FormItem prop="PoundWeight1"> -->
                                    <InputNumber :max="100" :min="1" v-model="postData.PoundWeight2"></InputNumber>
                                <!-- </FormItem> -->
                            </td>
                            <td><span>{{PoundWeightTotle}}</span></td>
                        </tr>
                        <tr>
                            <td>车皮号</td>
                            <td>支数</td>
                            <td>质保书量</td>
                            <td colspan="3">备注</td>
                        </tr>
                        <tr>
                            <td>
                                <FormItem prop="CarNo">
                                    <Input :maxlength="10" v-model="postData.CarNo" placeholder=""></Input>
                                </FormItem>
                            </td>
                            <td>{{postData.Number}}</td>
                            <td>{{postData.StandardWeight}}</td>
                            <td colspan="3">
                                <FormItem prop="Remark">
                                    <Input v-model="postData.Remark" placeholder="" ></Input>
                                </FormItem>
                            </td>
                        </tr>
                    </table>
                    <Table :columns='logColumns' :data='logData'></Table>
                </Form>                     
                <div style="width:24px;margin:5px auto;">
                    <Button type="primary" shape="circle" icon="plus" size="small" :disabled="!addable" @click="addTr"></Button>
                </div>
            </div>
            <p slot="footer" >
                <Button type="primary" icon="android-close" @click="handleClose">关闭</Button>
                <Button type="primary" icon="android-done" @click="handleSubmit('postForm')">保存</Button>
            </p>
            
        </Modal>
        <!-- 查看界面弹出框 -->
        <Modal class="record-modal" width='800px' v-model="lookModal" :mask-closable="false" ok-text="保存" cancel-text="关闭"  @on-ok="handleSubmit()">
             <p slot="header" >
                 <Icon type="compose" size='16'></Icon>
                <span>管材到(发)货登记表</span>
                <p><span>单位：吨</span><span style='float:right;'>编号：SYC/ZJ-WL-07</span></p>
            </p>
            <div class="ivu-table ivu-table-border modal-table">
                <Form ref="lookForm" :model="postData" :rules="ruleValidate">
                    <table class="tableHeade" border="1" cellspacing='0'>
                        <tr style="display:none;font-size:24px;">
                            <td colspan="6">管材到(发)货登记表</td>
                        </tr>
                        <tr>
                            <td colspan="2">品名</td>
                            <td>规格</td>
                            <td colspan="2">供货单位</td>
                            <td>到货日期</td>
                        </tr>
                        <tr>
                            <td colspan="2" v-text="lookHead[0].zylPinMing"></td>
                            <td>73.02*5.51</td>
                            <td colspan="2" v-text="lookHead[0].zylSupCmp"></td>
                            <td v-text="lookHead[0].zArrivalGoodsDate"></td>
                        </tr>
                        <tr>
                            <td colspan="2">使用单位</td>
                            <td>存储库区</td>
                            <td>磅重一</td>
                            <td>磅重二</td>
                            <td>磅重合计</td>
                        </tr>
                        <tr>
                            <td colspan="2" v-text="lookHead[0].zylUseCmp"></td>
                            <td v-text="lookHead[0].zStoreArea"></td>
                            <td v-text="lookHead[0].zPoundWeight1"></td>
                            <td v-text="lookHead[0].zPoundWeight2"></td>
                            <td v-text="lookHead[0].zPoundWeight"></td>
                        </tr>
                        <tr>
                            <td>车皮号</td>
                            <td>支数</td>
                            <td>质保书量</td>
                            <td colspan="3">备注</td>
                        </tr>
                        <tr>
                            <td v-text="lookHead[0].zCarNo"></td>
                            <td v-text="lookHead[0].zNumber"></td>
                            <td v-text="lookHead[0].zStandardWeight"></td>
                            <td colspan="3"  v-text="lookHead[0].zRemark"></td>
                        </tr>
                    </table>
                    <Table :columns='lookColumns' :data='lookChild'></Table>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="primary" icon="android-close" @click="handleClose">关闭</Button>
                <Button type="primary" icon="android-done" @click="handleSubmit('lookForm')">保存</Button>
            </p>
        </Modal>
        <!-- 入库单界面弹出框 -->
        <Modal class="record-modal" width='800px' :mask-closable="false" v-model="enterStoreModal" ok-text="保存" cancel-text="关闭">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>原料入库单</span>
            </p>
            <div class="ivu-table ivu-table-border">
                <Form :model="toStoreBillData" :rules="ruleValidate" label-position="right" :label-width="60" inline>
                    <Card class="modal-formItem">
                        <FormItem label="原料:">
                            <Input :disabled='true' v-model="toStoreBillData.storeYL"></Input>
                        </FormItem>
                        <FormItem style="width:190px;" label="供货:">
                            <Input :disabled='true' v-model="toStoreBillData.cupCmp"></Input>
                        </FormItem>
                        <FormItem label="总磅重">
                            <Input style="width:60px;" :disabled='true' v-model="toStoreBillData.weightTotle"></Input>
                        </FormItem>
                        <FormItem label="质保重量">
                            <Input style="width:60px;" :disabled='true' v-model="toStoreBillData.standardWeight"></Input>
                        </FormItem>
                        <FormItem  style="width:160px;" label="单号:">
                            <InputNumber :max="99999999" :min="0" :precision="0" v-model="toStoreBillData.billNum"></InputNumber>
                        </FormItem>
                        <FormItem label="计价方式">
                            <RadioGroup v-model="toStoreBillData.radio">
                                <Radio label="吨">吨</Radio>
                                <Radio label="支">支</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem style="width:170px;" label="日期:">
                            <DatePicker :transfer="true" type="date" placeholder="Select date" :value='today' @on-change ='storeDate'></DatePicker>
                        </FormItem>
                        <FormItem style="width:100px;" label="总支数">
                            <InputNumber :max="999999999" :min="0" :precision="0" v-model="toStoreBill.ThisNum"></InputNumber>
                        </FormItem>
                    </Card>
                </Form>
                <Form ref="toStoreForm" :model="toStoreBill" :rules="ruleValidate">
                    <div class="modal-table margin-top-10">
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
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="primary" icon="android-close" @click="handleClose">关闭</Button>
                <Button type="primary" icon="android-done" @click="tostoreCommit('toStoreForm')">保存</Button>
            </p>
        </Modal>
        <!-- 发货界面弹出框 -->
        <Modal class="record-modal" width='800px' :mask-closable="false" v-model="delieverModal" ok-text="保存" cancel-text="关闭">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>原料发货</span>
            </p>
            <div class="ivu-table ivu-table-border">
                <Form ref="DeliverForm" :model="deliverBill" :rules="ruleValidate">
                    <div class="modal-table margin-top-10">
                        <h3 class="text-center margin-bottom-10">原料发货信息</h3>
                        <table class="tableHeade" border="1" cellspacing='0'>
                            <tr>
                                <td>使用单位</td>
                                <td>
                                    <FormItem>
                                        <Select :transfer="true" v-model="deliverBill.cupCmp">
                                            <Option value="beijing">New York</Option>
                                        </Select>
                                    </FormItem>
                                </td>
                                <td>发货日期</td>
                                <td>
                                    <FormItem>
                                        <DatePicker :transfer="true" type="date" placeholder="Select date" :value='today' @on-change ='storeDate'></DatePicker>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>原料类别</td>
                                <td>
                                    <FormItem>
                                        <Select :transfer="true" v-model="deliverBill.cupCmp">
                                            <Option value="beijing">New York</Option>
                                        </Select>
                                    </FormItem>
                                </td>
                                <td>规格</td>
                                <td>...</td>
                            </tr>
                            <tr>
                                <td>供货单位</td>
                                <td>
                                    <FormItem>
                                        <Select :transfer="true" v-model="deliverBill.cupCmp">
                                            <Option value="beijing">New York</Option>
                                        </Select>
                                    </FormItem>
                                </td>
                                <td>库区</td>
                                <td>
                                    <FormItem>
                                        <InputNumber :max="9999" :min="0" :precision="0" v-model="deliverBill.billNum"></InputNumber>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>重量</td>
                                <td>
                                    <FormItem>
                                        <InputNumber :max="9999" :min="0" :precision="0" v-model="deliverBill.billNum"></InputNumber>
                                    </FormItem>
                                </td>
                                <td>支数</td>
                                <td>
                                    <FormItem>
                                        <InputNumber :max="9999" :min="0" :precision="0" v-model="deliverBill.billNum"></InputNumber>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>标重</td>
                                <td>
                                    <FormItem>
                                        <InputNumber :max="9999" :min="0" :precision="0" v-model="deliverBill.billNum"></InputNumber>
                                    </FormItem>
                                </td>
                                <td>质保书重量</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td colspan="3">
                                    <FormItem prop="Remark">
                                        <Input v-model="deliverBill.Remark" placeholder="" ></Input>
                                    </FormItem>
                                </td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="primary" icon="android-close" @click="handleClose">关闭</Button>
                <Button type="primary" icon="android-done" @click="toDeliverCommit('DeliverForm')">保存</Button>
            </p>
        </Modal>
	</div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        return {
                //出库单
                deliverBill:{

                },
                //入库单显示数据
                toStoreBillData:{
                    cupCmp:'',
                    storeYL:'',
                    billNum: 0,
                    branchTotle:0,
                    weightTotle:0,
                    standardWeight:0,
                    radio: '吨',
                    date: '',
                },
                //入库单提交数据
                toStoreBill:{
                        "YL_TyID": "",
                        "Cmp_ID": "",
                        "InOutStats": "",
                        "InOutDate": "",
                        "ThisWeight": 0,
                        "ThisNum": 0,
                        "UnitPrice": 0,
                        "ValuationMethod": "",
                        "Librarian": "",
                        "Remarks": ""
                },
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
                    CarNo: [
                        { required: true, message: ' ', trigger: 'blur' },
                        { type: 'string', max: 9, message: ' ', trigger: 'blur' }
                    ],
                    Remark: [
                        { type: 'string', max: 60, message: ' ', trigger: 'blur' }
                    ]
                },
                isLoading:false,
                //表单提交总验证
                formValid:true,
                //按钮状态
                isToDelete:false,
                isToLook:false,
                isToCheck:false,
                isToCancelCheck:false,
                isToStore:false,
                isToDeliver:false,
                //模态框控制
                delieverModal:false,
                enterStoreModal:false,//入库
                logModal: false,//录入模态框
                lookModal:false,//查看模态框
                //查看界面
                lookColumns:[//查看表格的列
                    {title: ' ', type:'index', "width": 50,align:"center"},
                    {title: '炉号', key: 'furnaceNo', "width": 250,align:"center"},
                    {title: '批次', key: 'batch',align:"center"},
                    {title: '支数', key: 'number',align:"center"},
                    {title: '重量', key: 'weight',align:"center"},
                ],
                lookData:[],//选中数据
                //查看模态表头
                lookHead:[{
                    zylPinMing:'',
                    zylSupCmp:'',
                    zArrivalGoodsDate:'',
                    zylUseCmp:'',
                    zStoreArea:'',
                    zPoundWeight1:'',
                    zPoundWeight2:'',
                    zPoundWeight:'',
                    zCarNo:'',
                    zNumber:'',
                    zStandardWeight:'',
                    zRemark:''
                }],
                lookChild:[],
                //主页面
                columns: [//首页显示表格的列
                    {type: 'selection',width: 30,align:"center","fixed": "left",},
                    {title: '车号',key: 'zCarNo',align:"center","width": 60,"fixed": "left","sortable": true},
                    {title: '品名',key: 'zylPinMing',align:"center","width": 225,"sortable": true},
                    {title: '供货单位', key: 'zylSupCmp',"width": 100,align:"center"},
                    {title: '榜重1', key: 'zPoundWeight1',"width": 60,align:"center"},
                    {title: '榜重2', key: 'zPoundWeight2', "width": 60,align:"center"},
                    {
                        title: '榜重合计',
                        key: 'zPoundWeight',
                        "width": 80,align:"center"
                        
                    },
                    {
                        title: '质保书量',
                        key: 'zStandardWeight',
                        "width": 80,align:"center"
                   
                    },
                     {
                        title: '磅差',
                        key: 'zPoundsDiff',
                    "width": 60,align:"center"
                    },
                     {
                        title: '支数',
                        key: 'zNumber',
                   "width": 60,align:"center"
                    },
                     {
                        title: '分厂',
                        key: 'zylUseCmp',
                       "width": 60,align:"center"
                    },
                     {
                        title: '库区',
                        key: 'zStoreArea',
                       "width": 60,align:"center"
                    },
                    {
                        title: '明细',
                        key: 'zDetailNum',
                       "width": 60,align:"center"
                    },
                    {
                        title: '日期',
                         key: 'zArrivalGoodsDate',
                       "width": 120,align:"center"
                    },
                    {
                        title: '状态',
                        key: 'zStoreStatus',
                     "width": 60,align:"center"
                    },
                     {
                        title: '入库单',
                        key: 'zYLStoreSglID',
                     "width": 60,align:"center"
                    },
                     {
                        title: '质检员',
                        key: 'zinspector',
                     "width": 70,align:"center"
                    },
                    {
                        title: '操作',
                        "width": 60,align:"center",
                        width: 80,
                        key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '判定书')
                            ]);
                        }
                    } 
                ],
                selectedData:[],//选中的数据
                selectedIds:[],//选中的id
                model2: '',
                data: [],//获取主页列表的数据
                total:0,//总条数
                pageCurrent: 1,//当前页码
                pageSize: 10,//页面大小
                materialList:[],//原料筛选列表
                material:'',//选中的材料
                officeList:[],//供货单位列表
                office:'',//选中的供货单位
                userList:[],//使用单位列表
                user:'',//选中的使用单位
                statesList:[//状态列表
                    {num:0,value:'全部显示记录'},
                    {num:1,value:'仅显示未送检记录'},
                    {num:2,value:'仅显示待判记录'},
                    {num:3,value:'显示已合格记录'},
                    {num:4,value:'仅显示已发货记录'}
                ], 
                state:'',//选中状态
                dateRange:{srtart:'',end:''},//日期范围
                storeA:'',//选中库区
                carNumList:[],//车号列表
                carNum:'',//选定车号
                //录入界面
                options:{
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    }
                },
                addable:true,//录入时是否可添加行的判断
                goodsList:[],//品名列表
                offerCmpList:[],//供货单位列表
                useCmpList:[],//使用单位列表
                logColumns:[//录入表格的列
                    {title: ' ', type:'index', "width": 50,align:"center"},
                    {title: '炉号', key: 'FurnaceNo', "width": 250,align:"center"},
                    {title: '批次', key: 'Batch',align:"center"},
                    {title: '支数', key: 'Number',align:"center"},
                    {title: '重量', key: 'Weight',align:"center"},
                ],
                //录入界面提交的数据
                postData:{
                    "CarNo": "",
                    "YL_TyID": "",
                    "YLSupCmp_ID": "",
                    "YLStoreSgl_ID": "",
                    "ArrivalGoodsDate": "",
                    "YLUseCmp_ID": "",
                    "StoreArea": 1,
                    "PoundWeight1": 0,
                    "PoundWeight2": 0,
                    "PoundWeight": 0,
                    "StandardWeight": 0,
                    "Number": 0,
                    "DetailNum": "",
                    "Librarian": "",
                    "StoreStatus": 0,
                    "DecisionSgl_ID": "",
                    "Inspector": "",
                    "InspectionResult": "",
                    "IsTmpStore": "",
                    "DecisionDate": "",
                    "IsLock": 1,
                    "Remark": "",
                    "Yl_ArrivalRecDetail": []
                },
                logData:[],//录入子表的数据
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
                let nowDay = iyear+'年'+imouth+'月'+iday+'日';
                return nowDay;
            }
        },
        //录入总重量计算
        PoundWeightTotle(){
             let sum = parseFloat(this.postData.PoundWeight1) + parseFloat(this.postData.PoundWeight2);
             sum = sum || 0;
             this.postData.PoundWeight = sum;
             return sum ;
         },
        // 录入支数计算
         numTotle(){
             let sum = 0;
             this.logData.forEach((item) => {
                 if(item.Number)
                 sum += parseFloat(item.Number);
             });
             this.postData.Number = sum;
             return sum;
         },
         weightTotle(){
             let sum = 0;
             this.logData.forEach((item) => {
                 if(item.Weight)
                 sum += parseFloat(item.Weight);
             });
             return sum;
         }
    },
    methods: {
        //到货日期
        pickerDate(value){
            this.postData.ArrivalGoodsDate = value;
        },
        //入库日期
        storeDate(value){
            this.toStoreBillData.date = value;
        },
        //日期范围
        dateFormatStart(val){
            this.dateRange.start = val;
        },
        dateFormatEnd(val){
            this.dateRange.end = val;
        },
        //日期范围
        // dateFormat(val){
        //     this.dateRange = val
        // },
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
                this.isToDeliver = true,
                selectedData.forEach((item,index) => {
                    this.selectedIds.push(item.id);
                    if(item.zStoreStatus != "待判"){
                        this.isToCancelCheck=false;
                    }
                    if(item.zStoreStatus != "未送检"){
                        this.isToDelete = false;
                        this.isToCheck = false;
                    }
                    if(item.zStoreStatus != "合格"){
                        this.isToDeliver = false;
                        if(item.zStoreStatus != "已发货"){
                            this.isToStore = false;
                        }
                    }
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
            this.lookChild = [];
            base.getAjaxData(base.baseURL + 'WlCenter/Yl_ArrivalRecDetail?Yl_ArrivalRecId=' + this.lookData[0].id, (res) => {
                res.results.forEach( (item) => {
                    this.lookChild.push(item);
                })
                let len = this.lookChild.length;
                for(var i = 0; i < 20 - len;i++){
                    this.lookChild.push({});
                }
            })
        },
        //状态公共函数
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
        //送检
        toCheck(){
            this.btnCommonFun(1, (data,id,index) => {
                    base.putAjaxData(base.baseURL + 'WlCenter/yl_arrivalstatupd_view?ID='+id+'&StoreStatus=2', () =>{
                        this.$Message.success('将第'+(index+1)+'条送检！');
                        this.init();
                    });
                    
            });
        },
        //取消送检
        toCancelCheck(){
            this.btnCommonFun(2, (data,id,index) => {
                    base.putAjaxData(base.baseURL + 'WlCenter/yl_arrivalstatupd_view?ID='+id+'&StoreStatus=1', () => {
                        this.$Message.success('第'+(index+1)+'条取消送检！');
                        this.init();
                    });  
            });
        },
        //删除
        toDeleteData(){
            this.btnCommonFun(1, (data,id,index) => {
                this.$Modal.confirm({
                    content:'<p>确定删除数据么？</p>',
                    onOk: () => {
                        base.deleteAjaxData(base.baseURL + 'WlCenter/Yl_ArrivalRec?ID='+id, (res) =>{
                            this.$Message.success('第'+(index+1)+'条删除成功！');
                            this.init();
                        });
                    }
                })
            });
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
        //发货按钮
        toDeliver(){
            
        },
        //获取选中品名的id
        goodId(id){
            this.postData.YL_TyID = id;
        },
        offerCmpId(id){
            this.postData.YLSupCmp_ID = id;
        },
        useCmpId(id){
            this.postData.YLUseCmp_ID = id;
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
            if(this.carNum != ''){
                options += '&ZCarNo='+this.carNum;
            }
            if(this.state){
                options += '&zStoreStatus='+this.state;
            }
            if(date.start && date.end){
                date.start > date.end ? this.$Modal.warning({content: '<p>起始日期大于截至日期,条件无效</p>'}) : (options += '&ZArrivalGoodsDateBetween='+date.start + ',' +date.end);
            }else if(date.start){
                options += '&>ZArrivalGoodsDate=' + date.start;
            }else if(date.end){
                options += '&ZArrivalGoodsDate<=' + date.end;
            }
            // if(this.dateRange.length > 0){
            //     if(this.dateRange[1])options += '&ZArrivalGoodsDateBetween='+this.dateRange.join(',');
            // }
            if(skip == undefined)skip = 0;
            if(take == undefined)take = this.pageSize;
            this.isLoading = true;
            base.getAjaxData(base.baseURL+'WlCenter/yl_arrivalrecdetail_view?Skip='+skip+'&take='+take+options,(res) => {
                this.data = res.results;
                this.isLoading = false;
                //对一些字段进行处理
                this.data.forEach( (item) => {
                    if(item.zArrivalGoodsDate){
                       item.zArrivalGoodsDate = item.zArrivalGoodsDate.substring(0,10);
                    }
                    switch (item.zStoreStatus) {
                        case 1:item.zStoreStatus = '未送检';
                            break;
                        case 2:item.zStoreStatus = '待判';
                            break;
                        case 3:item.zStoreStatus = '合格';
                            break;
                        case 4:item.zStoreStatus = '已发货';
                            break;
                        default:
                            break;
                    }
                });
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
        // //判断对象是否为空
        isEmptyObject(obj){ 
            for(var key in obj){
                return false;
                break;
            };
            return true;
        },
        // 判断对象的值是否为空
        isEmptyValue(obj){
            for(var key in obj){
                if(obj[key] !== ''){
                    return false;
                    break;
                }
            };
            return true;
        },
        // 录入提交
        commitLog(name){
            let self = this;
            let isPass = true;
            this.postData.Yl_ArrivalRecDetail = [];
            this.logData.forEach((item) =>{//做提交处理
                if(!this.isEmptyObject(item) && !this.isEmptyValue(item)){
                    this.postData.Yl_ArrivalRecDetail.push(item);
                }
            });
            if(this.postData.Yl_ArrivalRecDetail.length === 0){
                this.$Message.error('至少添加一条数据！');
                isPass = false;
            }else{
                this.postData.Yl_ArrivalRecDetail.forEach( (item) => {//应该检查所有数据
                    //对FurnaceNo和Batch进行验证
                    if(item.FurnaceNo && item.Batch){
                        if(this.formValid){
                            isPass = true;
                        }else{
                            this.$Message.error('某个值输入过长！');
                        }
                    }else{
                        this.$Message.error('请输入完整');
                        isPass = false;
                        return;
                    }
                });
            }
            if(isPass){
                base.postAjaxData(base.baseURL+'WlCenter/Yl_ArrivalRec',JSON.stringify(this.postData),() =>{
                    this.$Message.success('提交成功');
                    this.logModal = false;
                    this.init();
                    this.$refs[name].resetFields();
                });
            }
        },
        //保存提交按钮
        handleSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.commitLog(name);
                } else {
                    this.$Message.error('请输入完整并正确填写表头！');
                };
            })
        },
        //入库保存
        tostoreCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.selectedIds.length == 1){ //单数据入库，需修改
                        this.selectedIds.forEach( (item,index) => {
                            base.getAjaxData(base.baseURL+'WlCenter/yl_arrivalstatupd_view?ID=' + item, (data) => {
                                if(data.results[0].isTmpStore === 1){
                                    this.toStoreBill.InOutDate = this.toStoreBillData.date;
                                    this.toStoreBill.ValuationMethod = (this.toStoreBillData.radio == '吨') ? 1 : 2;
                                    this.toStoreBill.InOutDate = this.toStoreBillData.date;
                                    base.postAjaxData(base.baseURL+'WlCenter/Yl_InOutManage',JSON.stringify(this.toStoreBill),() =>{
                                        base.putAjaxData(base.baseURL + 'WlCenter/yl_arrivalstatupd_view?ID='+item+'&IsTmpStore=2', () => {
                                            this.init();
                                            this.enterStoreModal = false;
                                        });
                                    });
                                    
                                }else{
                                    this.$Message.error('已选项已填写入库单！');
                                }
                            });
                        });
                    }else{
                        this.$Message.error('选择一条数据！');
                    }
                    
                } else {
                    this.$Message.error('请正确填写！');
                }
            })
            
        },
        //发货保存
        toDeliverCommit(name){
            this.btnCommonFun(3, (data,id,index) => {
                    base.putAjaxData(base.baseURL + 'WlCenter/yl_arrivalstatupd_view?ID='+id+'&StoreStatus=4');
                    this.$Message.success('第'+(index+1)+'条发货成功！');
                    this.init();
            });
        },
        //关闭模态框
        handleClose(){
            this.logModal = false;
            this.enterStoreModal = false;
            this.lookModal = false;
        },
        addTr(){
            let len = this.logData.length;
            if(len < 25){
                this.logData.push({
                    // 'FurnaceNo':'',
                    // 'Batch':'',
                    // 'Number':0,
                    // 'Weight':0
                });
            }else{
                this.addable = false;
            }
        },
        initData(){
            this.postData={
                    "CarNo": "",
                    "YL_TyID": "",
                    "YLSupCmp_ID": "",
                    "YLStoreSgl_ID": "",
                    "ArrivalGoodsDate": "",
                    "YLUseCmp_ID": "",
                    "StoreArea": 1,
                    "PoundWeight1": 0,
                    "PoundWeight2": 0,
                    "PoundWeight": 0,
                    "StandardWeight": 0,
                    "Number": 0,
                    "DetailNum": "",
                    "Librarian": "",
                    "StoreStatus": 0,
                    "DecisionSgl_ID": "",
                    "Inspector": "",
                    "InspectionResult": "",
                    "IsTmpStore": "",
                    "DecisionDate": "",
                    "IsLock": 1,
                    "Remark": "",
                    "Yl_ArrivalRecDetail": []
                };
                this.logData = [];
        },
        init(){
            this.initData();
            //初始化按钮状态
            this.isToDelete = false;
            this.isToLook = false;
            this.isToCheck = false;
            this.isToCancelCheck = false;
            this.isToStore = false;
            this.isToDeliver = false;
            // 添加筛选选项的列表
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
                        if(item.comm_ID.substring(0,3) === '110' && item.isEnable) this.carNumList.push(item.subClass_Value);
                    })
                    this.query();
                });
            });

            for(var i = 0;i < 10;i++){
                this.logData.push({
                    // 'FurnaceNo':'',
                    // 'Batch':'',
                    // 'Number':0,
                    // 'Weight':0
                });
            }
        }
    },
    created(){
            this.init();
            //给表格增加input框
            let self = this;
            this.logColumns.forEach((item,index) => {
                if(item.key){//只循环有key的项
                    item.render = (h, params) => {
                        let i = params.index;//读取当前行
                        return h('FormItem',{
                            props:{

                            }
                        },[ params.column._index < 3 ?  h('Input',{
                            props:{
                                type:'text',
                                value: self.logData[i][item.key]
                            },
                            on:{
                                'on-blur':(e) => {
                                    self.formValid = true;
                                    if(e.target.value.length > 15){
                                        self.formValid = false;
                                        self.$Message.error('输入长度超过字数限制！');
                                    }
                                    self.logData[i][item.key] = e.target.value;
                                    // self.$set(self.logData[i],item.key,e.target.value)
                                    let sum = 0;
                                    self.logData.forEach((item) => {
                                        if(item.Number) sum += parseFloat(item.Number);
                                    });
                                    self.postData.Number = sum;
                                }
                            }
                        }):h('InputNumber',{
                            props:{
                                max:999999,
                                min:0,
                                precision:params.column._index == 3? 0:3,
                                value: self.logData[i][item.key] || 0
                            },
                            on:{
                                'on-change':(val) => {
                                    self.logData[i][item.key] = val;
                                    let sum1 = 0;
                                    let sum2 = 0;
                                    self.logData.forEach((item) => {
                                        if(item.Number) sum1 += parseFloat(item.Number);
                                        if(item.Weight) sum2 += parseFloat(item.Weight);
                                    });
                                    self.postData.Number = sum1;
                                    self.postData.StandardWeight = sum2;
                                }
                            }
                        })]
                        )
                    }
                }
            })
    },
    mounted(){
    },
    watch:{

    }
};
</script>

               
