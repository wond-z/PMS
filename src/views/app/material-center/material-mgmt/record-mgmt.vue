<style lang="less">
   @import './record-mgmt.less';
</style>

<template>
	<div class="table-component-common">
        <div>
            <Button type="primary" @click="logModal = true;logBtn()" icon="plus">到货登记</Button>
            <Button type="primary" :disabled = '!isToLook' @click="lookModal = true;look()" icon="ios-search">查看</Button>
            <Button type="primary" :disabled = '!isToUpdate' @click="logModal = true;update()" icon="edit">修改</Button>
            <Button type="primary" :disabled = '!isToDelete' @click="toDeleteData" icon="trash-a">删除</Button>
            <Button type="primary" :disabled = '!isToCheck' @click="toCheck" icon="forward">送检</Button>
            <Button type="primary" :disabled = '!isToCancelCheck' @click="toCancelCheck" icon="reply">取消送检</Button>
            <Button type="primary" :disabled = '!isToStore' @click="toStore()" icon="social-linkedin-outline">入库单</Button>
            <Button type="primary" :disabled = '!isToDeliver' @click="toDeliver()" icon="reply">发货</Button>
            <Button type="primary" icon="ios-upload" @click="exportData()">导出信息</Button>
        </div>
        <card class="margin-bottom-10 margin-top-10 padding-top-bottom-minish">
            <div class="select-col" >
                <div class="div">
                    <label align="middle" class="label" style="width:40px;">原料</label>
                    <Select v-model="material" class="select li-width">
                        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">供货单位</label>
                    <Select v-model="office"  class="select">
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
                    <label class="label">筛选状态</label>
                    <Select v-model="state"  class="select">
                        <Option v-for="item in statesList" :value="item.num" :key="item.num">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label" style="width:40px">车号</label>
                    <Input v-model="carNum" placeholder="请输入车号" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">库区</label>
                    <Input v-model="storeA" placeholder="请输入库区" class="select"></Input>
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
                
            </div>
		</card>
        <card>
			<div class="margin-bottom-10" >
	            <Table class="fontSize" size="small" border :loading='isLoading' :data="data" :columns="columns" stripe  ref="tableCsv" @on-selection-change='haveSelected'></Table>
	        </div>
                <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement='top'></Page>
	      	<div style="clear: both;"></div>
        </card>
        <!-- 录入界面弹出框 -->
        <Modal class="record-modal modal-table-form" width='900px' v-model="logModal" :mask-closable="false" :styles="{top: '0px'}">
             <p slot="header" >
                 <Icon type="compose" size='16'></Icon>
                <span>管材到(发)货登记表</span>
            </p>
            <div class="">
                <Form ref="postForm" :model="postData" :rules="ruleValidate">                
                    <table class="table-common table-common-tworow small-row" border="1" cellspacing='0'>
                        <tr style="display:none;font-size:24px;">
                            <td colspan="6">管材到(发)货登记表</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="text-align:left;">单位：吨</td>
                            <td colspan="2"></td>
                            <td colspan="2" style="text-align:right;">编号：SYC/ZJ-WL-07</td>
                        </tr>
                        <tr>
                            <td colspan="2">品名</td>
                            <td style="width:150px;">规格</td>
                            <td colspan="2">供货单位</td>
                            <td>到货日期</td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <FormItem prop="YL_TyID">
                                    <Select :transfer="true" v-model="postData.YL_TyID" :label-in-value='true'  @on-change='handleYLName'>
                                        <Option v-for="item in goodsList" :value="item.id" :label='item.value' :key="item.value">{{ item.value }}</Option>
                                    </Select>
                                </FormItem>
                            </td>
                            <td>{{YLName}}</td>
                            <td colspan="2">
                                <FormItem prop="YLSupCmp_ID">
                                    <Select :transfer="true" v-model="postData.YLSupCmp_ID">
                                        <Option v-for="item in offerCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                                    </Select>
                                </FormItem>
                            </td>
                            <td>
                                <FormItem prop="ArrivalGoodsDate">
                                    <DatePicker :options="options" :transfer="true" type="date" v-model="postData.ArrivalGoodsDate"></DatePicker>
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
                                    <Select :transfer="true" v-model="postData.YLUseCmp_ID">
                                        <Option value="">无</Option>
                                        <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                                    </Select>
                                </FormItem>
                            </td>
                            <td>
                                <FormItem prop="StoreArea">
                                    <Input :maxlength="50" v-model="postData.StoreArea" placeholder=""></Input>
                                </FormItem>
                            </td>
                            <td>
                                <FormItem prop="PoundWeight1">
                                    <Input v-model="postData.PoundWeight1" placeholder="" :maxlength="8"></Input>
                                </FormItem>
                            </td>
                            <td>
                                <FormItem prop="PoundWeight2">
                                    <Input v-model="postData.PoundWeight2" placeholder="" :maxlength="8"></Input>
                                </FormItem>
                            </td>
                            <td><span>{{PoundWeightTotle}}</span></td>
                        </tr>
                        <tr>
                            <td>车皮号</td>
                            <td style="width:100px;">支数</td>
                            <td>质保书量</td>
                            <td colspan="3">备注</td>
                        </tr>
                        <tr>
                            <td>
                                <FormItem prop="CarNo">
                                    <Input v-model="postData.CarNo" placeholder="" :maxlength="120"></Input>
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
                    <Table class="margin-top-8 small-row" :columns='logColumns' :data='logData' border style="min-height:400px"></Table>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleReset('postForm')">重置</Button>
                <!-- <Button @click="handleClose('logModal')">关闭</Button> -->
                <Button type="primary" @click="handleSubmit('postForm')">保存</Button>
            </p>
        </Modal>
        <!-- 查看界面弹出框 -->
        <Modal class="record-modal modal-table-form" width='900px' v-model="lookModal" :mask-closable="false" :styles="{top: '0px'}">
            <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>管材到(发)货登记表</span>
            </p>
            <div class="">
                <Button type="primary" size="small" @click="lookDeliver()">发货单</Button>
                <div style="float:right;">
                    <span>第{{this.lookPageIndex+1}}页</span>
                    <Button type="primary" size="small" @click="prePage()">上一页</Button>
                    <Button type="primary" size="small" @click="nextPage()">下一页</Button>
                </div>
            </div>
            <div class="">
                <Form> 
                    <table class="table-common table-common-tworow table-common-top small-row" border="1" cellspacing='0'>
                        <tr>
                            <td colspan="6" class="table-title">管材到(发)货登记表</td>
                        </tr>
                        <tr>
                            <td colspan="2">单位：吨</td>
                            <td colspan="2"></td>
                            <td colspan="2">编号：SYC/ZJ-WL-07</td>
                        </tr>
                        <tr>
                            <td colspan="2">品名</td>
                            <td>规格</td>
                            <td colspan="2">供货单位</td>
                            <td>到货日期</td>
                        </tr>
                        <tr>
                            <td colspan="2" v-text="lookHead.zylPinMing"></td>
                            <td>73.02*5.51</td>
                            <td colspan="2" v-text="lookHead.zylSupCmp"></td>
                            <td v-text="lookHead.zArrivalGoodsDate"></td>
                        </tr>
                        <tr>
                            <td colspan="2">使用单位</td>
                            <td>存储库区</td>
                            <td>磅重一</td>
                            <td>磅重二</td>
                            <td>磅重合计</td>
                        </tr>
                        <tr>
                            <td colspan="2" v-text="lookHead.zylUseCmp"></td>
                            <td v-text="lookHead.zStoreArea"></td>
                            <td v-text="lookHead.zPoundWeight1"></td>
                            <td v-text="lookHead.zPoundWeight2"></td>
                            <td v-text="lookHead.zPoundWeight"></td>
                        </tr>
                        <tr>
                            <td>车皮号</td>
                            <td>支数</td>
                            <td>质保书量</td>
                            <td colspan="3">备注</td>
                        </tr>
                        <tr>
                            <td v-text="lookHead.zCarNo"></td>
                            <td v-text="lookHead.zNumber"></td>
                            <td v-text="lookHead.zStandardWeight"></td>
                            <td colspan="3"  v-text="lookHead.zRemark"></td>
                        </tr>
                    </table>
                    <Table class="margin-top-8 small-row" :columns='lookColumns' :data='lookChild' border size="small" style="min-height:400px;"></Table>
                </Form>    
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('lookModal')">取消</Button>
                <Button type="primary">保存</Button>
            </p>
        </Modal>
        <!-- 入库单界面弹出框 -->
        <Modal class="record-modal modal-table-form" width='900px' :mask-closable="false" v-model="enterStoreModal" class-name="vertical-center-modal">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>原料入库单</span>
            </p>
            <div class="">
                <Form ref="toStoreForm" :model="toStoreBill" :rules="ruleStoreForm" label-position="right" :label-width="60" inline>
                    <Card class="modal-formItem">
                        <FormItem label="原料">
                            <Input :disabled='true' v-model="toStoreBillData.storeYL"></Input>
                        </FormItem>
                        <FormItem style="width:190px;" label="供货单位">
                            <Input :disabled='true' v-model="toStoreBillData.cupCmp"></Input>
                        </FormItem>
                        <FormItem label="总磅重">
                            <Input style="width:100px;" :disabled='true' v-model="toStoreBillData.weightTotle"></Input>
                        </FormItem>
                        <FormItem  label="总支数">
                            <Input :disabled='true' v-model="toStoreBillData.branchTotle" placeholder="" :maxlength="10" style="width:100px;"></Input>
                        </FormItem>
                        
                        <FormItem  label="单号" prop='Bill_ID'>
                            <Input :maxlength="10" style="width:170px;" v-model="toStoreBill.Bill_ID"></Input>
                        </FormItem>
                        <FormItem  style="width:190px;" label="日期" prop='InoutDate'>
                            <DatePicker :options="options" :transfer="true" type="date" v-model="toStoreBill.InOutDate"></DatePicker>
                        </FormItem>
                        <FormItem label="质保重量">
                            <Input style="width:100px;" :disabled='true' v-model="toStoreBillData.standardWeight"></Input>
                        </FormItem>
                        <FormItem label="计价方式">
                            <RadioGroup v-model="toStoreBillData.radio">
                                <Radio label="吨">吨</Radio>
                                <Radio label="支">支</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Card>
                    <div class="modal-table margin-top-10">
                        <h3 style="text-align:center;" class="margin-bottom-10">专用原(辅)料入库验收单</h3>
                        <table class="larger-row table-common table-common-top" border="1" cellspacing='0'>
                            <tr>
                                <td >编码:SYC/ZJ-WL-12</td>
                                <td colspan="3">供货单位：{{toStoreBillData.cupCmp}}</span></td>
                                <td colspan="3">日期:{{iDate}}</td>
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
                                <td v-text="Array(toStoreBillData.storeYL.match(/^[\u4e00-\u9fa5]+\s\w+\s/g)).join()"></td>
                                <td v-text="String(toStoreBillData.storeYL).replace(/^[\u4e00-\u9fa5]+\s\w+\s/,'')"></td>
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
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('enterStoreModal')">取消</Button>
                <Button type="primary" @click="tostoreCommit('toStoreForm')">保存</Button>
            </p>
        </Modal>
        <!-- 发货界面弹出框 -->
        <Modal class="record-modal modal-table-form" width='900px' :mask-closable="false" v-model="delieverModal" class-name="vertical-center-modal">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>原料发货</span>
            </p>
            <div class="">
                <Form ref="toDeliverForm" :model="deliverBill" :rules="ruleDeliverBill">
                    <div class="modal-table margin-top-10">
                        <h3 class="text-center margin-bottom-10">原料发货信息</h3>
                        <table class="larger-row table-common" border="1" cellspacing='0'>
                            <tr style="display:none">
                                <td class="text-center" colspan="4">原料发货信息</td>
                            </tr>
                            <tr>
                                <td>使用单位</td>
                                <td>
                                    <FormItem prop='YLUseCmp_ID'>
                                        <Select :transfer="true" v-model="deliverBill.YLUseCmp_ID">
                                            <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{item.value}}</Option>
                                        </Select>
                                    </FormItem>
                                </td>
                                <td>发货日期</td>
                                <td>
                                    <FormItem prop='DeliverGoodsDate'>
                                        <DatePicker :options='options' :transfer="true" type="date" placeholder="" v-model="deliverBill.DeliverGoodsDate"></DatePicker>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>原料类别</td>
                                <td>
                                    <FormItem prop='YL_TyID'>
                                        <Select :transfer="true" v-model="deliverBill.YL_TyID">
                                            <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                                        </Select>
                                    </FormItem>
                                </td>
                                <td>规格</td>
                                <td>...</td>
                            </tr>
                            <tr>
                                <td>供货单位</td>
                                <td>
                                    <FormItem prop='YLSupCmp_ID'>
                                        <Select :transfer="true" v-model="deliverBill.YLSupCmp_ID">
                                            <Option v-for="item in offerCmpList" :value="item.id" :key="item.value">{{item.value}}</Option>
                                        </Select>
                                    </FormItem>
                                </td>
                                <td>库区</td>
                                <td>
                                    <FormItem prop='StoreArea'>
                                        <Input v-model="deliverBill.StoreArea" placeholder="" :maxlength="60"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>重量</td>
                                <td>
                                    <FormItem prop='Weight'>
                                        <Input v-model="deliverBill.Weight" placeholder="" :maxlength="10"></Input>
                                    </FormItem>
                                </td>
                                <td>支数</td>
                                <td>
                                    <FormItem prop='Number'>
                                        <Input v-model="deliverBill.Number" placeholder="" :maxlength="10"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>标重</td>
                                <td>
                                    <FormItem prop='StandardWeight'>
                                        <Input v-model="deliverBill.StandardWeight" placeholder="" :maxlength="10"></Input>
                                    </FormItem>
                                </td>
                                <td>质保书重量</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td colspan="3">
                                    <FormItem prop="Remarks">
                                        <Input v-model="deliverBill.Remarks" placeholder="" :maxlength="200"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('delieverModal')">取消</Button>
                <Button type="primary" @click="toDeliverCommit('toDeliverForm')">保存</Button>
            </p>
        </Modal>
        <!-- 查看页发货单弹出框 -->
        <Modal class="deliver-modal modal-table-form" width='900px' :mask-closable="false" v-model="detailModal" :styles="{top: '0px'}">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>原料发货明细</span>
            </p>
            <div class="margin-bottom-10">
                <Button type="primary"  icon="ios-upload" size="small">导出excel</Button>
            </div>
            <div>
                <table  class="table-common table-common-tworow table-common-top deliver-table" border="1" cellspacing='0'>
                    <tr>
                        <td colspan="9" class="table-title">管材到(发)货登记表</td>
                    </tr>
                    <tr>
                        <td colspan="1">重量单位：吨</td>
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
                        <td v-text="Array(lookDetail.bgPinMin.match(/^[\u4e00-\u9fa5]+\s\w+\s/g)).join()"></td>
                        <td v-text="String(lookDetail.bgPinMin).replace(/^[\u4e00-\u9fa5]+\s\w+\s/,'')">73.02*5.51</td>
                        <td v-text="lookDetail.bcSubClass_Value"></td>
                        <td v-text="lookDetail.zDeliverGoodsDate"></td>
                        <td v-text="lookDetail.bsSubClass_Value"></td>
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
                <table class="table-common deliver-table margin-top-10" border="1" cellspacing='0'>
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
                        <td v-text="item.left.furnaceNo"></td>
                        <td v-text="item.left.batch"></td>
                        <td v-text="item.left.number"></td>
                        <td v-text="item.left.weight"></td>

                        <td>{{index+16}}</td>
                        <td v-text="item.right.furnaceNo"></td>
                        <td v-text="item.right.batch"></td>
                        <td v-text="item.right.number"></td>
                        <td v-text="item.right.weight"></td>
                    </tr>
                </table>
            </div>    
            <div slot="footer">
                <Button type="ghost" @click="handleClose('detailModal')">取消</Button>
                <Button type="primary"  @click="handleClose('detailModal')">保存</Button>
            </div>
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
                "YL_TyID": "",
                "YLSupCmp_ID": "",
                "YLUseCmp_ID": "",
                "YLOutStoreSgl_ID": "",
                "DeliverGoodsDate": "",
                "BranchFactory": "",
                "StoreArea": 0,
                "Weight": 0,
                "Number": 0,
                "StandardWeight": 0,
                "Librarian": "",
                "CarNo": "",
                "DeliverGoodsDetails": "",
                "Remarks": ""
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
                    "InOutStats": 1,
                    "InOutDate": "",
                    "ThisWeight": "",
                    "ThisNum":"",
                    "UnitPrice": "0",
                    "ValuationMethod": "",
                    "Librarian": "",
                    "InOutDetails":"",
                    "Remarks": ""
            },
            //验证数据
            ruleValidate: {
                StoreArea: [
                    { required: true,message:' '}
                ],
                PoundWeight1: [
                    {validator: base.floatCheck, required: true,message:' '}
                ],
                PoundWeight2: [
                    {validator: base.nFloatCheck, message:' '}
                ],
                YL_TyID: [
                    { required: true, message: ' ', trigger: 'change' }
                ],
                YLSupCmp_ID:[
                    { required: true, message: ' ', trigger: 'change' }
                ],
                CarNo: [
                    { required: true, message: ' '},
                ],
                Remark: [
                    { type: 'string', max: 60, message: ' '}
                ]
            },
            ruleStoreForm:{
                InOutDate: [
                    { required: true, type:'date', message:' '}
                ],
                ThisNum: [
                    {validator: base.intCheck, required: true, message:' '}
                ],
                ThisWeight: [
                    {validator: base.floatCheck, required: true, message:' ' }
                ],
                UnitPrice: [
                    { validator: base.floatCheck, required: true, message: ' '}
                ],
                ThisAmount: [
                    {validator: base.floatCheck, required: true, message: ' '}
                ],
                Bill_ID:[
                    { required: true, message: ' '}
                ]
            },
            ruleDeliverBill:{
                DeliverGoodsDate: [
                    { required: true,type:'date', message:' '}
                ],
                YLUseCmp_ID: [
                    { required: true,message:' '}
                ],
                StoreArea: [
                    { required: true,message:' '}
                ],
                YL_TyID: [
                    { required: true, message: ' '}
                ],
                YLSupCmp_ID:[
                    { required: true, message: ' '}
                ],
                Weight:[
                    { validator: base.floatCheck,required: true, message: ' '}
                ],
                Number:[
                    { validator: base.intCheck,required: true, message: ' '}
                ],
                StandardWeight:[
                    { validator: base.floatCheck,required: true, message: ' ' }
                ]
            },
            isLoading:false,
            //表单提交总验证
            formValid:true,
            //按钮状态
            isToUpdate:false,
            isToDelete:false,
            isToLook:false,
            isToCheck:false,
            isToCancelCheck:false,
            isToStore:false,
            isToDeliver:false,
            //模态框控制
            detailModal:false,//查看明细
            updateModal:false,//更新
            delieverModal:false,//发货
            enterStoreModal:false,//入库
            logModal: false,//录入模态框
            lookModal:false,//查看模态框
            //查看界面
            lookPageIndex:0,
            lookColumns:[//查看表格的列
                {title: ' ', type:'index', "width": 50,align:"center"},
                {title: '炉号', key: 'furnaceNo', "width": 250,align:"center"},
                {title: '批次', key: 'batch',align:"center"},
                {title: '支数', key: 'number',align:"center"},
                {title: '重量', key: 'weight',align:"center"},
            ],
            lookKeys:{'furnaceNo':'','batch':'','number':'','weight':''},
            lookData:[],//查看数据
            lookDetail:{ //查看界面的入库单数据
                "bgPinMin":'',
                "bcSubClass_Value":'',
                "zDeliverGoodsDate":'',
                "bsSubClass_Value":'',
                "zStoreArea":'',
                "zNumber":'',
                "zStandardWeight":'',
                "zWeight":'',
                "zCarNo":'',
                "zRemarks":''
            },
            logTwoColData:[],
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
            today:'',
            columns: [//首页显示表格的列
                {type: 'selection',align:"center",width: 30},
                {title: '车号',key: 'zCarNo',align:"center",width: 80,},
                {title: '品名',key: 'zylPinMing',align:"center",width: 160,},
                {title: '供货单位', key: 'zylSupCmp',align:"center",width: 90},
                {title: '榜重1', key: 'zPoundWeight1',align:"center",width: 60},
                {title: '榜重2', key: 'zPoundWeight2', align:"center",width: 60},
                {title: '榜重合计', key: 'zPoundWeight',"width": 80,align:"center"},
                {title: '质保书量',key: 'zStandardWeight',"width": 60,align:"center"},
                {title: '磅差',key: 'zPoundsDiff',align:"center",width: 60},
                {title: '支数',key: 'zNumber',align:"center",width: 60},
                {title: '分厂',key: 'zylUseCmp',align:"center",width: 60},
                {title: '库区',key: 'zStoreArea',align:"center",width: 50},
                {title: '明细',key: 'zDetailNum',align:"center",width: 50},
                {title: '日期',key: 'zArrivalGoodsDate',width: 100,align:"center"},
                {title: '状态',key: 'zStoreStatusN',align:"center",width: 80},
                {title: '入库单',key: 'zylStoreSgl_ID',align:"center",width: 90},
                {title: '质检员',key: 'zinspector',align:"center",width: 100}
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
            office:0,//选中的供货单位
            userList:[],//使用单位列表
            user:0,//选中的使用单位
            statesList:[//状态列表
                {num:0,value:'显示全部记录'},
                {num:1,value:'显示未送检记录'},
                {num:2,value:'显示待判记录'},
                {num:3,value:'显示已合格记录'},
                {num:4,value:'显示已发货记录'}
            ], 
            state:0,//选中状态
            dateRange:{start:'',end:''},//日期范围
            storeA:'',//选中库区
            carNumList:[],//车号列表
            carNum:'',//选定车号
            options:{//日期选项
                disabledDate(date){
                    return date.valueOf() > Date.now();
                }
            },
            //录入界面
            goodsList:[],//品名列表
            offerCmpList:[],//供货单位列表
            useCmpList:[],//使用单位列表
            logColumns:[//录入表格的列
                {title: ' ', type:'index', "width": 50,align:"center"},
                {title: '炉号', key: 'furnaceNo', "width": 250,align:"center"},
                {title: '批次', key: 'batch',align:"center"},
                {title: '支数', key: 'number',align:"center"},
                {title: '重量', key: 'weight',align:"center"},
            ],
            //录入界面提交的数据
            postData:{
                "id":'',
                "CarNo": "",
                "YL_TyID": "",
                "YLSupCmp_ID": "",
                "YLStoreSgl_ID": "",
                "ArrivalGoodsDate": "",
                "YLUseCmp_ID": "",
                "StoreArea": '',
                "PoundWeight1": '',
                "PoundWeight2": '',
                "PoundWeight": '',
                "StandardWeight":'' ,
                "Number": '',
                "DetailNum": "",
                "Librarian": "",
                "StoreStatus": 1,
                "DecisionSgl_ID": "",
                "Inspector": "",
                "InspectionResult": "",
                "IsTmpStore": 1,
                "DecisionDate": "",
                "IsLock": 1,
                "Remark": "",
                "Yl_ArrivalRecDetail": []
            },
            logData:[],//录入子表的数据
            upYLName:'',
            YLName:'',
            childUpdateIds:[],//修改子数据id
            postStatus:'',
            options:{
                disabledDate(date){
                    return date.valueOf() > Date.now();
                }
            },
        }
    },
    computed:{
        iDate(){
            if(typeof this.toStoreBill.InOutDate === 'object'){
                return base.dateFormat(this.toStoreBill.InOutDate);
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
        //录入总重量计算
        PoundWeightTotle(){
             let sum = (1*this.postData.PoundWeight1 || 0) + (1*this.postData.PoundWeight2 || 0);
             sum = sum.toFixed(3);
             this.postData.PoundWeight = sum;
             return sum ;
         },
        // 录入支数计算
        numTotle(){
            let sum = 0;
            this.logData.forEach((item) => {
                if(item.Number)
                sum += parseInt(item.Number);
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
        },
        //总金额
        inPriceTotle(){
            if(this.toStoreBillData.radio == '支')this.toStoreBill.ThisAmount = (this.toStoreBill.ThisNum *this.toStoreBill.UnitPrice || 0).toFixed(3);
            if(this.toStoreBillData.radio == '吨')this.toStoreBill.ThisAmount = (this.toStoreBill.ThisWeight *this.toStoreBill.UnitPrice || 0).toFixed(3);
        }
    },
    methods: {
        exportData () {
            this.$refs.tableCsv.exportCsv({
                filename: 'Csv格式数据'
            });
        },
        //回车聚焦
        textFocus(e,index,interval){
            if( e.keyCode != 13 ) return;
            interval < 4 ? interval += 1:(interval = 1,index += 1);
            const nextName = 'text' + index + interval;
            var nextDom = document.getElementById(nextName);
            nextDom && nextDom.focus();
        },
        lookDeliver(){
            this.detailModal = true;
        },
        //名称显示
        handleYLName(data){
            base.showGoodsInfo({
                'vm':this,
                'wpId':data.value,
                'jsSpecifications':'YLName'
            });
        },
        //修改
        update(){
            this.postStatus = 'update';
            let slt = this.selectedData;
            for(var key in this.postData){
                let oKey = key;
                key = key.replace(/^YL/,'yl');
                key = 'z' + key;
                this.postData[oKey] = slt[0][key];
            }
            this.postData.YL_TyID = slt[0].zyL_TyID;
            this.postData.id = slt[0].id;
            this.postData.StoreStatus = 1;
            this.logData = [];
            base.getAjaxData(base.baseURL + 'WlCenter/Yl_ArrivalRecDetail?Yl_ArrivalRecId=' + slt[0].id, (res) => {
                this.childUpdateIds = [];
                res.results.forEach( (item,index) => {
                    this.childUpdateIds.push(item.id);
                    this.logData[index] = item;
                })
                let len = this.logData.length;
                for(var i = 0; i < 25 - len;i++){
                    this.logData.push({});
                }
            })

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
                this.lookHead =selectedData[0];

                this.isToDelete = true;
                this.isToLook = true;
                this.isToUpdate = true;
                this.isToCheck = true;
                this.isToCancelCheck = true;
                this.isToStore = true,
                this.isToDeliver = true,
                selectedData.forEach((item,index) => {
                    this.selectedIds.push(item.id);
                    if(item.zStoreStatus != 2){
                        this.isToCancelCheck=false;
                    }
                    if(item.zStoreStatus != 1){
                        this.isToDelete = false;
                        this.isToCheck = false;
                        this.isToUpdate = false;
                    }
                    if(item.zStoreStatus != 3){
                        this.isToDeliver = false;
                        if(item.zStoreStatus != 4){
                            this.isToStore = false;
                        }
                    }
                })
            }else{
                this.initBtn();
            }
            if(selectedData.length >1 ){
                this.isToUpdate = false;
                this.isToDelete = false;
            }
        },
        //翻页查询
        pageQuery(){
            this.lookChild = [];
            this.lookHead = this.lookData[this.lookPageIndex];
            base.getAjaxData(base.baseURL + 'WlCenter/Yl_ArrivalRecDetail?Yl_ArrivalRecId=' + this.lookData[this.lookPageIndex].id, (res) => {
                res.results.forEach( (item,index) => {
                    this.lookChild[index] = item;
                })
                let len = this.lookChild.length;
                for(var i = 0; i < 25 - len;i++){
                    this.lookChild.push({});
                }
            })
        },
        //翻页
        nextPage(){
            let len = this.lookData.length;
            if(this.lookPageIndex >= len-1) return;
            this.lookPageIndex++;
            this.pageQuery();
        },
        prePage(){
            if(this.lookPageIndex <= 0) return;
            this.lookPageIndex--;
            this.pageQuery();
        },
        //查看列表填充
        look(){
            this.lookChild = [];
            this.lookPageIndex = 0;
            base.getAjaxData(base.baseURL + 'WlCenter/Yl_ArrivalRecDetail?Yl_ArrivalRecId=' + this.lookData[0].id, (res) => {
                res.results.forEach( (item,index) => {
                    this.lookChild[index] = item;
                })
                let len = this.lookChild.length;
                for(var i = 0; i < 25 - len;i++){
                    this.lookChild.push({});
                }
                
            })

            this.logTwoColData = [];
            for(var i = 0;i < 15;i++){
                this.logTwoColData.push({
                    left:{},
                    right:{}
                });
            }
            base.getAjaxData(base.baseURL + 'WlCenter/Yl_ArrivalRecDetail?orderBy=ID&Yl_ArrivalRecIdIn=' + this.selectedIds.join(','), (res) => {
                res.results.forEach( (item,index) => {
                    if(index<15)this.logTwoColData[index].left = item;
                    if(index>=15)this.logTwoColData[index-15].right = item;
                })
            })
        },
        //状态公共函数
        btnCommonFun(storeState,callback){
            let selectedIds = this.selectedIds;
            let len = selectedIds.length;
            if( len > 0){
                for(let i = 0;i < len;i++){
                    base.getAjaxData(base.baseURL+'WlCenter/yl_arrivalstatupd_view?ID=' + selectedIds[i], (data)=>{
                        if(data.results[0].storeStatus === storeState){
                            callback(data.results[0],selectedIds[i],i,len);
                        }else{
                            this.$Message.error({duration: 5, content:'已选的第'+i+'条已不可进行当前操作！请刷新！'});
                        }
                    });
                };
            }else{
                this.$Message.error({duration: 5, content:'至少选择一条数据！'});
            }
        },
        //到货登记
        logBtn(){
            this.$refs.postForm.resetFields();
            this.postStatus = 'post';
            this.logData = [];
            for(var i = 0;i < 25;i++){
                this.logData.push({});
            }
            this.postData.ArrivalGoodsDate = this.today;
            this.postData.YL_TyID = this.goodsList[0].id;
        },
        //送检
        toCheck(){
            this.btnCommonFun(1, (data,id,index,len) => {
                data.storeStatus = 2;
                base.putAjaxData(base.baseURL + 'WlCenter/yl_arrivalstatupd_view',JSON.stringify(data),() =>{
                    if(len == index+1){
                        this.$Message.success({duration: 5, content:'送检成功！'});
                        this.init();
                    }
                });
            });
        },
        //取消送检
        toCancelCheck(){
            this.btnCommonFun(2, (data,id,index,len) => {
                data.storeStatus = 1;
                base.putAjaxData(base.baseURL + 'WlCenter/yl_arrivalstatupd_view',JSON.stringify(data), () => {
                   if(len == index+1){
                        this.$Message.success({duration: 3, content:'取消送检成功！'});
                        this.init();
                    }
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
                            this.$Message.success({duration: 3, content:'删除成功！'});
                            this.init();
                        });
                    }
                })
            });
        },
        //入库单按钮
        toStore(){

            let slt = this.selectedData;
            let len = slt.length;
            if(len > 0){
                this.toStoreBillData={
                    cupCmp:'',
                    storeYL:'',
                    billNum: 0,
                    branchTotle:0,
                    weightTotle:0,
                    standardWeight:0,
                    radio: '吨',
                    date: '',
                };
                this.toStoreBill={
                        "YL_TyID": "",
                        "Cmp_ID": "",
                        "InOutStats": 1,
                        "InOutDate": "",
                        "ThisWeight": "",
                        "ThisNum":"",
                        "UnitPrice": "0",
                        "ValuationMethod": "",
                        "Librarian": "",
                        "InOutDetails":"",
                        "Remarks": ""
                }
                this.toStoreBill.InOutDate = this.today;
                let showData = this.toStoreBillData;
                let postData = this.toStoreBill;
                postData.YL_TyID = slt[0].zyL_TyID;
                postData.Cmp_ID = slt[0].zylSupCmp_ID;
                let useCmpId = slt[0].zylUseCmp_ID;
                for(var i = 1;i < len;i++){
                    if(slt[i].zylUseCmp_ID !== useCmpId  || slt[i].zylSupCmp_ID !== postData.Cmp_ID){
                        this.$Message.warning({duration: 5, content:'请选择同原料，同供货商，同使用厂的数据！'});
                        return;
                    }
                }
                this.enterStoreModal = true;
                let ids = [];
                
                showData.storeYL = slt[0].zylPinMing;
                showData.cupCmp = slt[0].zylSupCmp;
                slt.forEach( (item) => {
                    ids.push(item.id);
                    showData.branchTotle += parseInt(item.zNumber || 0) ;
                    showData.weightTotle += (1*item.zPoundWeight || 0);
                    showData.standardWeight += (1*item.zStandardWeight || 0);
                })
                postData.ThisNum = showData.branchTotle;
                postData.ThisWeight = showData.weightTotle;
                postData.InOutDetails = ids.join(',');

                this.toStoreBillData = showData;
                this.toStoreBill = postData;
            }else{
                this.$Message.warning({duration: 5, content:'请选择数据！'})
            }
            
        },
        //发货按钮
        toDeliver(){
            let slt = this.selectedData;
            if(slt.length > 0){
                let db = {
                    "YL_TyID": "",
                    "YLSupCmp_ID": "",
                    "YLUseCmp_ID": "",
                    "YLOutStoreSgl_ID": "",
                    "DeliverGoodsDate": "",
                    "BranchFactory": "",
                    "StoreArea": "",
                    "Weight": 0,
                    "Number": 0,
                    "StandardWeight": 0,
                    "Librarian": "",
                    "CarNo": "",
                    "DeliverGoodsDetails": "",
                    "Remarks": ""
                }
                db.DeliverGoodsDate = this.today;
                this.delieverModal = true;
                let ids = [];
                let cars = [];
                db.YL_TyID = slt[0].zyL_TyID;
                db.YLSupCmp_ID = slt[0].zylSupCmp_ID;
                db.YLUseCmp_ID = slt[0].zylUseCmp_ID;
                db.StoreArea = slt[0].zStoreArea;
                slt.forEach( (item) => {
                    ids.push(item.id);
                    if(item.zCarNo)cars.push(item.zCarNo);
                    db.Number += parseInt(item.zNumber || 0) ;
                    db.Weight += (1*item.zPoundWeight || 0);
                    db.StandardWeight +=(1*item.zStandardWeight || 0);
                    db.CarNo = cars.join(',');
                })
                db.DeliverGoodsDetails = ids.join(',');
                this.deliverBill = db;
            }else{
                this.$Message.warning({duration: 5, content:'请选择数据！'})
            }
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
        btnQuery(){
            this.pageCurrent = 1;
            this.query(0, this.pageSize);
        },
        condition(){
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
            return options;
        },
        //查询函数
        query(skip,take){
            let options = this.condition();
            if(skip == undefined)skip = 0;
            if(take == undefined)take = this.pageSize;
            this.isLoading = true;
            base.getAjaxData(base.baseURL+'WlCenter/yl_arrivalrecdetail_view?orderBy=-ID&Skip='+skip+'&take='+take+options,(res) => {
                this.data = res.results;
                this.isLoading = false;
                //对一些字段进行处理
                this.data.forEach( (item) => {
                    if(item.zArrivalGoodsDate){
                       item.zArrivalGoodsDate = item.zArrivalGoodsDate.substring(0,10);
                    }
                });
                this.total = res.total;
                this.initData();
            });
        },
        //清空查询条件
        clearQuery(){
                this.office = 0;
                this.user = 0;
                this.state = 0;
                this.storeA = '';
                this.carNum = '';
                this.dateRange.start = '';
                this.dateRange.end = '';
        },
        //判断对象是否为空
        isEmptyObject(obj){ 
            for(var key in obj){
                return false;
                break;
            };
            return true;
        },
        // 判断对象的值是否为空
        isEmptyValue(obj){
            let n=0;
            for(var key in this.lookKeys){
                if(obj[key] != '' && obj[key] != undefined)n++;
            };
            return n==4? 0:n==0? 1:2;//0没有空值，1都为空值，2部分空
        },
        //检查不合法数据
        isTest(data){
            let len = data.length;
            let nReg = /[^0-9]/;
            let wReg = /^-?[1-9]\d*\.?\d*$|0\.\d*[1-9]\d*$/;
            for(var i = 0;i<len;i++){
                if( nReg.test(String(data[i].number)) ) return false;
                if( !wReg.test(String(data[i].weight)) ) return false;
            }
            return true;
        },
        // 录入提交处理
        commitLog(name,callback){
            this.postData.Yl_ArrivalRecDetail = [];
            let logData = this.logData;
            for(var i = 0,len = logData.length;i<len;i++){
                if(!this.isEmptyObject(logData[i]) && this.isEmptyValue(logData[i])==0){
                    this.postData.Yl_ArrivalRecDetail.push(logData[i]);
                }else if(this.isEmptyObject(logData[i])){
                    if(this.postData.Yl_ArrivalRecDetail.length == 0){
                        this.$Message.error({duration: 5, content:'请添加数据！'});
                        return;
                    }
                }else if(!this.isEmptyObject(logData[i]) && this.isEmptyValue(logData[i]) == 2){
                    this.$Message.error({duration: 5, content:'请输入完整'});
                    return;
                }
            };
            if( this.isTest(this.postData.Yl_ArrivalRecDetail) ) this.formValid = true;
            if(!this.formValid){
                this.$Message.error({duration: 5, content:'请确定支数和重量的值是否正确！'});
                return;
            }
            callback();
        },
        //重置按钮
        handleReset(name) {
            this.$refs[name].resetFields();
            this.postData.ArrivalGoodsDate = this.today;
            this.postData.YL_TyID = this.goodsList[0].id;
            this.logData = [];
            for(var i = 0;i < 25;i++){
                this.logData.push({});
            }
        },
        //保存提交按钮
        handleSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.postStatus == 'post')this.commitLog(name, () => {
                        this.postData.DetailNum = this.postData.Yl_ArrivalRecDetail.length;
                        base.postAjaxData(base.baseURL+'WlCenter/Yl_ArrivalRec',JSON.stringify(this.postData),() =>{
                            this.$Message.success({duration: 5, content:'提交成功'});
                            this.logModal = false;
                            this.init();
                            this.$refs[name].resetFields();
                        });
                    });
                    if(this.postStatus == 'update')this.commitLog(name, () => {
                        let postData = this.postData;
                        postData.DetailNum = postData.Yl_ArrivalRecDetail.length;
                        base.putAjaxData(base.baseURL+'WlCenter/Yl_ArrivalRec',JSON.stringify(postData),() =>{
                            postData.Yl_ArrivalRecDetail.forEach( (item,index)=>{
                                if(item.id){
                                    const dex = this.childUpdateIds.indexOf(item.id);
                                    this.childUpdateIds.splice(dex,1);
                                    base.putAjaxData(base.baseURL+'WlCenter/Yl_ArrivalRecDetail',JSON.stringify(item),() =>{});
                                }else{
                                    item.yl_ArrivalRecId = postData.id;
                                    base.postAjaxData(base.baseURL+'WlCenter/Yl_ArrivalRecDetail',JSON.stringify(item),() =>{});
                                }
                            })
                            this.childUpdateIds.length && this.childUpdateIds.forEach( (item)=>{
                                base.deleteAjaxData(base.baseURL+'WlCenter/Yl_ArrivalRecDetail?id='+item,() =>{});
                            })
                            this.$Message.success({duration: 5, content:'更改成功'});
                            this.logModal = false;
                            this.init();
                            this.$refs[name].resetFields();
                        });
                    });

                }else {
                    this.$Message.error({duration: 5, content:'请将上半部分输入完整！'});
                };
            })
        },
        //入库保存
        tostoreCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.selectedIds.length > 0){
                        this.selectedIds.forEach( (item,index) => {
                            base.getAjaxData(base.baseURL+'WlCenter/yl_arrivalstatupd_view?ID=' + item, (data) => {
                                if(data.results[0].isTmpStore === 1){
                                    this.toStoreBill.ValuationMethod = (this.toStoreBillData.radio == '吨') ? 1 : 2;
                                    base.postAjaxData(base.baseURL+'WlCenter/Yl_InOutManage',JSON.stringify(this.toStoreBill),() =>{
                                        data.results[0].isTmpStore = 2;
                                        base.putAjaxData(base.baseURL + 'WlCenter/yl_arrivalstatupd_view',JSON.stringify(data.results[0]),() => {
                                            if(this.selectedIds.length == index+1){
                                                this.enterStoreModal = false;
                                                this.$Message.success({duration: 3, content:'入库操作成功！'});
                                                this.init();
                                                this.$refs[name].resetFields();
                                            }
                                        });
                                    });
                                }else{
                                    this.$Message.error({duration: 5, content:'已选项已填写入库单！'});
                                }
                            });
                        });
                    }else{
                        this.$Message.error({duration: 5, content:'选择一条数据！'});
                    }
                } else {
                    this.$Message.warning({duration: 5, content:'请填写完整并检查是否正确！'});
                }
            })
        },
        //发货保存
        toDeliverCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.deliverBill.ValuationMethod = (this.toStoreBillData.radio == '吨') ? 1 : 2;
                    this.deliverBill.Bill_ID = this.billNumFull;
                    this.btnCommonFun(3, (data,id,index,len) => {
                        data.storeStatus = 4;
                        base.putAjaxData(base.baseURL + 'WlCenter/yl_arrivalstatupd_view',JSON.stringify(data),()=>{
                            if(len == index+1){
                                base.postAjaxData(base.baseURL + 'WlCenter/Yl_DeliverGoodsRec',JSON.stringify(this.deliverBill),()=>{
                                    this.delieverModal = false;
                                    this.$Message.success({duration: 3, content:'发货成功！'});
                                    this.init();
                                    this.$refs[name].resetFields();
                                })
                            }
                        });
                    });
                }else{
                    this.$Message.warning({duration: 5, content:'请填写完整并检查是否正确！'});
                }
            })
            
        },
        //关闭模态框
        handleClose(modal){
            this[modal] = false;
            this.lookModal = false;
        },
        //初始化按钮状态
        initBtn(){
            this.isToUpdate = false;
            this.isToDelete = false;
            this.isToLook = false;
            this.isToCheck = false;
            this.isToCancelCheck = false;
            this.isToStore = false;
            this.isToDeliver = false;
        },
        initData(){
            this.postData={
                    "CarNo": "",
                    "YL_TyID": "",
                    "YLSupCmp_ID": "",
                    "YLStoreSgl_ID": "",
                    "ArrivalGoodsDate": "",
                    "YLUseCmp_ID": "",
                    "StoreArea": '',
                    "PoundWeight1": '',
                    "PoundWeight2": '',
                    "PoundWeight": '',
                    "StandardWeight": '',
                    "Number": '',
                    "DetailNum": "",
                    "Librarian": "",
                    "StoreStatus": 1,
                    "DecisionSgl_ID": "",
                    "Inspector": "",
                    "InspectionResult": "",
                    "IsTmpStore": 1,
                    "DecisionDate": "",
                    "IsLock": 1,
                    "Remark": "",
                    "Yl_ArrivalRecDetail": []
            };
            this.logData = [];
            this.today = base.dateFormat(new Date());
            this.toStoreBill.InoutDate = this.today;
            this.initBtn();
        },
        init(){
            //数据初始化
            this.changePage(this.pageCurrent);
        }
    },
    created(){
        // 添加筛选选项的列表
        this.offerCmpList=[];
        this.useCmpList=[];
        base.getGoodsList(this,107);
        //公共信息类
        base.getAjaxData(base.baseURL + 'PublicApi/Bs_commdep0_view?isEnable=1',(res) =>{
            res.results.forEach((item) => {
                if( item.mid && item.mDepName){
                    this.useCmpList.push({id:item.mid,value:item.mDepName});
                }
            })
        });
        base.getAjaxData(base.baseURL + 'PublicApi/bs_comminfo_view?isEnable=1',(res) =>{
            res.results.forEach((item) => {
                if(item.comm_ID){
                    let temp = item.comm_ID.substring(0,3);
                    if(item.subClass_Value){
                        if(temp == 100)this.offerCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                    }
                    if(temp === '110' && item.isEnable==1) this.carNumList.push({id:item.comm_ID,value:item.subClass_Value});
                }
            })
        });
        //给表格增加input框
        let self = this;
        this.logColumns.forEach((item,index) => {
            if(item.key){//只循环有key的项
                item.render = (h, params) => {
                    const i = params.index;//读取当前行
                    const j = params.column._index;//读取当前列
                    return h('FormItem',{
                        props:{

                        }
                    },[ j < 3 ?  h('Input',{
                        props:{
                            elementId:'text' + i + j,
                            type:'text',
                            maxlength:14,
                            value: self.logData[i][item.key]
                        },
                        on:{
                            'on-blur':(e) => {
                                self.logData[i][item.key] = e.target.value;
                                if(e.target.value.length > 15){
                                    this.formValid = false;
                                    self.$Message.error({duration: 5,content:'输入长度超过字数限制！'});
                                }
                            },
                            "on-keydown":(e) => {
                                this.textFocus(e,i,j)
                            }
                        }
                    }):h('Input',{
                        props:{
                            elementId:'text' + i + j,
                            type:'text',
                            maxlength:10,
                            value: self.logData[i][item.key] ? String(self.logData[i][item.key]).replace(/[^0-9.]/g, ''):''
                        },
                        on:{
                            'on-change':(e) => {
                                self.logData[i][item.key] = e.target.value;
                                let sum1 = 0;
                                let sum2 = 0;
                                self.logData.forEach((item) => {
                                    if(item.number) sum1 += parseInt(item.number);
                                    if(item.weight) sum2 += parseFloat(item.weight);
                                });
                                self.postData.Number = sum1 || 0;
                                self.postData.StandardWeight = sum2.toFixed(3) || 0;
                            },
                            'on-blur':(e) =>{
                                if(j == 3){
                                    if(/[^0-9]/g.test(e.target.value)){
                                        this.formValid = false;
                                        self.$Message.warning({duration: 5, content:'支数的值只能为整数！'});
                                    }
                                }else if(j == 4){
                                    if(/[^0-9.]/g.test(e.target.value)){
                                        this.formValid = false;
                                        self.$Message.warning({duration: 5, content:'重量的值只能为数字！'});
                                    }
                                }
                            },
                            "on-keydown":(e) => {
                                this.textFocus(e,i,j)
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
    activated(){

    },
    watch:{
        total: function(val){
            base.watchTotal(val, this);
        },
        logTwoColData:{
            handler(cur){
                let sumN = 0;
                let sumW = 0;
                cur.forEach( (item)=>{
                    sumN += item.left.number || 0;
                    sumN += item.right.number || 0;
                    sumW += item.left.weight || 0;
                    sumW += item.right.weight || 0;
                } );
                this.lookDetail.zNumber = sumN;
                this.lookDetail.zWeight = sumW.toFixed(3);
            },
            deep:true
        },
        selectedData:function(cur){
            if(cur.length){
                let sumZ = 0;
                let sumC = [];
                let sumR = [];
                let lookDetail = this.lookDetail;
                lookDetail.bgPinMin = cur[0].zylPinMing;
                lookDetail.bcSubClass_Value = cur[0].zylSupCmp;
                lookDetail.zDeliverGoodsDate = cur[0].zArrivalGoodsDate;
                lookDetail.bsSubClass_Value = cur[0].zylUseCmp;
                lookDetail.zStoreArea = cur[0].zStoreArea;
                cur.forEach( (item)=>{
                    sumZ += parseFloat(item.zStandardWeight) || 0;
                    if(item.zCarNo)sumC.push(item.zCarNo);
                    if(item.zRemark)sumR.push(item.zRemark);
                });
                lookDetail.zStandardWeight = sumZ.toFixed(3);
                lookDetail.zCarNo = sumC.join('，');
                lookDetail.zRemarks = sumR.join(';');
                this.lookDetail = lookDetail;
            }
        }
    }
};

</script>

               
