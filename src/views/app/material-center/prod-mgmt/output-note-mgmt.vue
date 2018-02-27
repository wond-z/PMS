<style lang="less">
   @import './prod-mgmt-common.less';
   .ivu-auto-complete{
       max-height: 200px !important;
   }
</style>

<template>
	<div class="table-component-common">
         <div class="margin-bottom-10">
            <Button type="primary" v-if='currentPageName == "material_output_note_mgmt"' @click="logBtn()" icon="plus">录入</Button>
            <Button type="primary" :disabled="!isToLook" @click="look()" icon="ios-search">查看</Button>
            <Button type="primary" v-if='currentPageName == "material_output_note_mgmt"' :disabled="!isToUpdate" @click="updateModal = true;update()" icon="edit">修改</Button>
            <Button type="primary" v-if='currentPageName == "material_output_note_mgmt"' :disabled="!isToDelete" @click="toDeleteData" icon="trash-a">删除</Button>
            <Button type="primary" v-if='currentPageName == "material_output_note_mgmt"' :disabled="!isToCheck" @click="toCheck" icon="reply">送检</Button>
            <Button type="primary" v-if='currentPageName == "material_output_note_mgmt"' :disabled="!isToCancelCheck" @click="toCancelCheck" icon="forward">取消送检</Button>
            <Button type="primary" v-if='currentPageName == "output_decide_mgmt"' :disabled="!isToSeal" @click="toSeal" icon="ios-person">盖章</Button>
            <Button type="primary" v-if='currentPageName == "output_decide_mgmt"' :disabled="!isToCancelSeal" @click="toCancelSeal" icon="refresh">取消盖章</Button>
        </div>
        <card class="margin-bottom-10 padding-top-bottom-minish">
            <div class="select-col" >
                <div class="div">
                    <label align="middle" class="label">产品</label>
                    <Select v-model="material" class="select li-width">
                        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">生产单位</label>
                    <Select v-model="office" class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in offerCmpList" :value="item.mid" :key="item.mid">{{ item.mDepName }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">订货单位</label>
                    <Select v-model="user"  class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">合同编号</label>
                    <Input v-model="xsHtCode" placeholder="请输入合同编号" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">出库序号</label>
                    <Input v-model="seqNum" placeholder="请输入出库序号" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">起始日期</label>
                    <DatePicker placement="bottom-end" :options="options" placeholder="选择日期" class="select" @on-change='dateFormatStart'></DatePicker>
                </div>
                <div class="div">
                    <label class="label">截止日期</label>
                    <DatePicker placement="bottom-end" :options="options" placeholder="选择日期" class="select" @on-change='dateFormatEnd'></DatePicker>
                </div>
                <Button type="primary" icon="ios-search" @click="btnQuery()" >查询</Button>
                <Button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</Button>
            </div>
		</card>
        <card>
			<div class="margin-bottom-10" >
	            <Table class="fontSize" highlight-row  size="small" border :loading='isLoading' :data="data" :columns="columns" stripe ref="table2image" @on-row-click='mainHandleRow'></Table>
	        </div>
                <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement='top' :transfer="true"></Page>
	      	<div style="clear: both;"></div>
        </card>
        <!-- 选择销售合同 界面-->
        <Modal class="output-modal modal-table-form zIndex-2000" width='1100px' v-model="logModal" @on-ok='nextStep()' :mask-closable="false" class-name="vertical-center-modal" >
            <p slot="header" >
                 <Icon type="compose" size='16'></Icon>
                <span>选择销售合同界面</span>
            </p>
            <div class="modal-formItem">
                <Form :label-width="60" inline>
                    <div  class="margin-bottom-10 ">
                        <Button type="primary" :disabled='!isToNext' icon="reply" size="small" @click="nextStep()">下一步</Button>
                    </div>
                    <Card class="modal-formItem margin-bottom-10">
                        <FormItem prop='CpProdCmp_ID' label="订购产品">
                            <Select v-model="xsMaterial">
                                <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem prop='Seq_Num' label="订货单位">
                            <Select v-model="order">
                                <Option :value="0">全部</Option>
                                <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem prop='Date' label="收货单位">
                            <Select v-model="receive">
                                <Option :value="0">全部</Option>
                                <Option v-for="item in receiveCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem prop='Date' label="合同编号">
                            <Input v-model="contractNum" placeholder=""></Input>
                        </FormItem>
                        <FormItem prop='Date' label="起始日期">
                            <DatePicker :option='options' placement="bottom-end" placeholder="选择日期" @on-change='dateFormatStart'></DatePicker>
                        </FormItem>
                        <FormItem prop='Date' label="截止日期">
                            <DatePicker :option='options' placement="bottom-end" placeholder="选择日期" @on-change='dateFormatEnd'></DatePicker>
                        </FormItem>
                        <Button type="primary" icon="ios-search" @click="btnLogQuery()" >查询</Button>
                        <Button type="primary" icon="social-dropbox-outline" @click="btnClearQuery()">清空</Button>
                    </Card>
                    <card class="padding-bottom-10">
                        <div class="margin-bottom-10" >
                            <Table class="fontSize" size="small" border :loading='isLoading' :data="logModalData" :columns="saleColumns" stripe highlight-row @on-row-click='handleRow'></Table>
                        </div>
                            <Page :total="xsTotal" :current="xsPageCurrent" @on-change="xsChangePage" @on-page-size-change="xsChangePageSize" show-elevator show-sizer placement='top' :transfer="true"></Page>
                        <div style="clear: both;"></div>
                    </card>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('logModal')">取消</Button>
                <Button type="primary" :disabled='!isToNext' @click="nextStep()">确定</Button>
            </p>
        </Modal>
        <!-- 查看界面弹出框 -->
        <Modal class="output-modal modal-table-form" width='1000px' v-model="lookModal" :mask-closable="false" :styles="{top: '0px'}">
            <p slot="header" >
                 <Icon type="compose" size='16'></Icon>
                <span>产品出库单录入</span>
            </p>
            <div class="">
                <Form :label-width="60" inline> 
                    <div  class="margin-bottom-10 ">
                        <Button type="primary"  icon="ios-upload" size="small">导出excel</Button>
                        <Button type="primary" v-if='currentPageName == "material_output_note_mgmt"' icon="ios-search" size="small"  @click="bundleLook()">捆编号查询</Button>
                        <Button type="primary" v-if='currentPageName == "output_decide_mgmt"' icon="ios-person" :disabled="!isToSeal" @click="toSeal" size="small">盖章</Button>
                        <Button type="primary" v-if='currentPageName == "output_decide_mgmt"' icon="refresh" :disabled="!isToCancelSeal" @click="toCancelSeal" size="small">取消盖章</Button>
                        <Button type="primary" v-if='currentPageName == "material_output_note_mgmt"' :disabled="!isToCheck" @click="toCheck" icon="reply" size="small">送检</Button>
                        <Button type="primary" v-if='currentPageName == "material_output_note_mgmt"' :disabled="!isToCancelCheck" @click="toCancelCheck" icon="forward" size="small">取消送检</Button>
                    </div>
                    <div>
                        <table class="table-common table-common-bottom table-common-top table-common-tworow small-row" cellspan="0" cellpadding="0" border="1" style="width:100%">
                            <tr class="font-size-16">
                                <td colspan="14" class="align-center">陕西延长石油材料责任有限公司</td>
                            </tr>
                            <tr >
                                <td colspan="14" class="table-title">产品出库清单</td>
                            </tr>
                            <tr>
                                <td colspan="3" class="align-left">日期：{{lookShow.zInputDate}}</td>
                                <td></td>
                                <td colspan="5"></td>
                                <td></td>
                                <td colspan="4" class="align-right">编码：SYC/ZJ-JZ-19</td>
                            </tr>
                            <tr>
                                <td colspan="2">订货单位</td>
                                <td v-text="lookShow.bcOrderGdCmp"></td>
                                <td colspan="2">技术条件</td>
                                <td colspan="2">API Spec5CT</td>
                                <td colspan="2">合同号</td>
                                <td v-text="lookShow.xsHt_Code"></td>
                                <td colspan="2">序号</td>
                                <td colspan="2" v-text="lookShow.zSeq_Num"></td>
                            </tr>
                            <tr>
                                <td colspan="2">产品类别</td>
                                <td v-text="postShow.bgSubClass_Value"></td>
                                <td>规格</td>
                                <td v-text="postShow.bgSpecifications"></td>
                                <td>钢级</td>
                                <td colspan="2" v-text="postShow.bgSteelGrade"></td>
                                <td>生产单位</td>
                                <td v-text="lookShow.depName"></td>
                                <td colspan="2">总重量kg</td>
                                <td colspan="2" v-text="lookShow.zTotalWeight"></td>
                            </tr>
                            <tr>
                                <td colspan="2">总长度m</td>
                                <td v-text="lookShow.zTotalLength"></td>
                                <td colspan="2" style="width:141px;">总支数</td>
                                <td colspan="2" v-text="lookShow.zTotalNumber"></td>
                                <td colspan="2">总件数</td>
                                <td v-text="lookShow.zTotalJianShu"></td>
                                <td>发货方式</td>
                                <td colspan="3" v-text="postShow.zTransportModeName"></td>
                            </tr>
                            <tr>
                                <td style="width:30px;"></td>
                                <td style="width:80px;">原料供货商</td>
                                <td style="width:110px;">炉号</td>
                                <td style="width:80px;">捆数编号</td>
                                <td style="width:80px;">捆重量kg</td>
                                <td style="width:70px;">捆长度m</td>
                                <td>支数</td>
                                <td style="width:30px;"></td>
                                <td style="width:80px;">原料供货商</td>
                                <td style="width:110px;">炉号</td>
                                <td style="width:80px;">捆数编号</td>
                                <td style="width:80px;">捆重量kg</td>
                                <td style="width:70px;">捆长度m</td>
                                <td>支数</td>
                            </tr>
                            <tr v-for="(item,index) in modelData2" :key="index">
                                <!-- 左 -->
                                <td>{{index+1}}</td>
                                <td v-if="index == 0 || (index>0 && modelData2[index].left.bcYLSupCmpName != modelData2[index-1].left.bcYLSupCmpName)" v-text="item.left.bcYLSupCmpName"></td>
                                <td v-else></td>
                                <td v-if="index == 0 || (index>0 && modelData2[index].left.furnaceNo != modelData2[index-1].left.furnaceNo)" v-text="item.left.furnaceNo"></td>
                                <td v-else></td>
                                <td v-text="item.left.bundleNo"></td>
                                <td v-text="item.left.weight"></td>
                                <td v-text="item.left.length"></td>
                                <td v-text="item.left.number"></td>
                                <!-- 右 -->
                                <td>{{index+rowNum+1}}</td>
                                <td v-if="(modelData2[0].right.bcYLSupCmpName != modelData2[rowNum-1].left.bcYLSupCmpName) || (index>0 && modelData2[index].right.bcYLSupCmpName != modelData2[index-1].right.bcYLSupCmpName)" v-text="item.right.bcYLSupCmpName"></td>
                                <td v-else></td>
                                <td v-if="(modelData2[0].right.furnaceNo != modelData2[rowNum-1].left.furnaceNo) || (index>0 && modelData2[index].right.furnaceNo != modelData2[index-1].right.furnaceNo)" v-text="item.right.furnaceNo"></td>
                                <td v-else></td>
                                <td v-text="item.right.bundleNo"></td>
                                <td v-text="item.right.weight"></td>
                                <td v-text="item.right.length"></td>
                                <td v-text="item.right.number"></td>
                            </tr>
                            <tr >
                                <td colspan="2">备注：</td>
                                <td colspan="5" v-text='lookShow.zRemarks'></td>
                                <td colspan="2">车号：</td>
                                <td colspan="5" v-text='lookShow.zCarNo'></td>
                            </tr>
                            <tr>
                                <td colspan="7">主管：</td>
                                <td colspan="7">库管员：</td>
                            </tr>
                            <img v-if='seal' src="../../../../images/stamp.png" alt="" style="position: absolute; right: 20px; bottom: 50px;">
                        </table>
                    </div>
                </Form>    
            </div>
            <p slot="footer" >
                <Button type="ghost"   @click="handleClose('lookModal')">取消</Button>
                <Button type="primary" @click="handleClose('lookModal')">确认</Button>
            </p>
        </Modal>
        <!-- 录入界面弹出框 -->
        <Modal class="output-modal modal-table-form zIndex-1000" width='1000px' v-model="updateModal" :mask-closable="false" :styles="{top: '0px'}">
             <p slot="header" >
                 <Icon type="compose" size='16'></Icon>
                <span>产品出库单录入</span>
            </p>
            <div class="">
                <Form ref="updateForm" :model="postData" :rules="ruleValidate" :label-width="70" inline>
                    <div class="margin-bottom-10">
                        <Button type="primary" @click="dataCheck()" icon="ios-eye" size="small">数据校验</Button>
                        <Button type="primary" icon="checkmark-round" :disabled='!isToUpLog' @click="handleSubmit('updateForm')" size="small">保存</Button>
                        <Button type="primary"  icon="ios-upload" size="small">导出excel</Button>
                        <Button type="primary" @click="bundleLook()" icon="ios-search" size="small">捆编号查询</Button>
                        <Button type="primary" @click="logModal = true;btnLogQuery()" icon="compose" size="small">变更合同</Button>
                        <Button type="warning"   icon="close-round" @click="handleClose('updateModal')" size="small">取消</Button>
                    </div>
                    <Card class="modal-formItem margin-bottom-10">
                        <FormItem prop='CpProdCmp_ID' label="生产单位">
                            <Select :transfer='true' v-model="postData.CpProdCmp_ID" :disabled=' postStatus != "post" ' size="small"  :label-in-value='true' @on-change='handleName'>
                                <Option v-for="item in offerCmpList" :value="item.mid" :key="item.mid">{{ item.mDepName }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem prop='Seq_Num' label="序号">
                            <Input v-model="postData.Seq_Num" :maxlength="10" placeholder="请输入序号" size="small" style="width:150px"></Input>
                        </FormItem>
                        <FormItem prop='InputDate' label="出库日期">
                            <DatePicker :transfer="true" :options='options' type="date" v-model="postData.InputDate" placement="bottom-end" placeholder="选择日期" style="width:150px" size="small" @on-change='outDateChange' ></DatePicker>
                        </FormItem>
                    </Card>
                    <div>
                        <table class="table-common table-common-bottom table-common-top table-common-tworow small-row" cellspan="0" cellpadding="0" border="1" style="width:100%">
                            <tr class="font-size-16">
                                <td colspan="14" class="align-center">陕西延长石油材料责任有限公司</td>
                            </tr>
                            <tr >
                                <td colspan="14" class="table-title">产品出库清单</td>
                            </tr>
                            <tr>
                                <td colspan="3" class="align-left">日期：{{outDateShow}}</td>
                                <td></td>
                                <td colspan="5"></td>
                                <td></td>
                                <td colspan="4" class="align-right">编码：SYC/ZJ-JZ-19</td>
                            </tr>
                            <tr>
                                <td colspan="2">订货单位</td>
                                <td v-text="postShow.bcCp_OrderGdCmp"></td>
                                <td colspan="2">技术条件</td>
                                <td colspan="2">API Spec5CT</td>
                                <td colspan="2">合同号</td>
                                <td v-text="postShow.zHt_Code"></td>
                                <td colspan="2">序号</td>
                                <td colspan="2" v-text="postData.Seq_Num"></td>
                            </tr>
                            <tr>
                                <td colspan="2">产品类别</td>
                                <td v-text="postShow.bgSubClass_Value"></td>
                                <td>规格</td>
                                <td v-text="postShow.bgSpecifications"></td>
                                <td>钢级</td>
                                <td colspan="2" v-text="postShow.bgSteelGrade"></td>
                                <td>生产单位</td>
                                <td v-text="proName"></td>
                                <td colspan="2">总重量kg</td>
                                <td colspan="2">{{totalWeight}}</td>
                            </tr>
                            <tr>
                                <td colspan="2">总长度m</td>
                                <td>{{totalLength}}</td>
                                <td colspan="2" style="width:141px;">总支数</td>
                                <td colspan="2">{{totalNumber}}</td>
                                <td colspan="2">总件数</td>
                                <td>{{totalJianShu}}</td>
                                <td>发货方式</td>
                                <td colspan="3" v-text="postShow.zTransportModeName"></td>
                            </tr>
                            <tr>
                                <td style="width:30px;"></td>
                                <td style="width:80px;">原料供货商</td>
                                <td style="width:110px;">炉号</td>
                                <td style="width:80px;">捆数编号</td>
                                <td style="width:80px;">捆重量kg</td>
                                <td style="width:70px;">捆长度m</td>
                                <td>支数</td>
                                <td style="width:30px;"></td>
                                <td style="width:80px;">原料供货商</td>
                                <td style="width:110px;">炉号</td>
                                <td style="width:80px;">捆数编号</td>
                                <td style="width:80px;">捆重量kg</td>
                                <td style="width:70px;">捆长度m</td>
                                <td>支数</td>
                            </tr>
                            <tr v-for="(item,index) in modelData2" :key="index">
                                
                                <td>{{index+1}}</td>
                                <td v-text="item.left.bcYLSupCmpName"></td>
                                <td v-text="item.left.furnaceNo"></td>
                                <td>
                                    <input @blur="blurFormat(index,$event)" @input="recIdsHandle(index,$event)" :id="'text'+index" @keydown="textFocus(index,$event)" v-model="item.left.bundleNo" maxlength="10" type="text">
                                </td>
                                <td v-text="item.left.weight"></td>
                                <td v-text="item.left.length"></td>
                                <td v-text="item.left.number"></td>
                                
                                <td>{{index+rowNum+1}}</td>
                                <td v-text="item.right.ylSupCmp_ID"></td>
                                <td v-text="item.right.furnaceNo"></td>
                                <td>
                                    <input @blur="blurFormat(index+rowNum,$event)" @input="recIdsHandle(index+rowNum,$event)" :id="'text'+(index+rowNum)" @keydown="textFocus(index+rowNum,$event)" v-model="item.right.bundleNo" maxlength="10" type="text">
                                </td>
                                <td v-text="item.right.weight"></td>
                                <td v-text="item.right.length"></td>
                                <td v-text="item.right.number"></td>
                            </tr>
                            <tr>
                                <td colspan="7" >
                                    <FormItem  label="备注">
                                        <input v-model="postData.Remarks" maxlength="119" type="text">
                                    </FormItem>
                                </td>
                                <td colspan="7" >
                                    <FormItem prop='CarNo' label="车号">
                                        <AutoComplete
                                        v-model="postData.CarNo"
                                        :data="carList"
                                        :transfer='true'
                                        placement='top'
                                        style="width:100%"></AutoComplete>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="7">主管：</td>
                                <td colspan="7">库管员：</td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" ></p>
        </Modal>
        <!-- 捆编号查询 -->
        <Modal class="zIndex-2000" width='1100px' v-model="bundleModal" @on-ok='' :mask-closable="false" :styles="{top:'0px'}" >
            <p slot="header" >
                 <Icon type="compose" size='16'></Icon>
                <span>产品捆编号查询</span>
            </p>
            <prod-stock-stat ref='proStock'></prod-stock-stat>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('bundleModal')">取消</Button>
                <Button type="primary" @click="handleClose('bundleModal')">确定</Button>
            </p>
        </Modal>
	</div>
</template>
<script>
import base from '@/libs/base';
import prodStockStat from './prod-stock-stat.vue';

export default {
    components: {
        prodStockStat
    },
    data () {
        return {
            seal:false,//盖章
            outDateShow:'',
            proName:'',
            postStatus:'',//提交状态
            postShow:{//提交显示
                bcCp_OrderGdCmp:'',
                bgSubClass_Value:'',
                bgSteelGrade:'',
                bgSpecifications:'',
                zTransportModeName:'',
                zHt_Code:''
            },
            lookShow:{
                bcOrderGdCmp:'',
                zInputDate:'',
                xsHt_Code:'',
                zSeq_Num:'',
                depName:'',
                zTotalJianShu:'',
                zTotalLength:'',
                zTotalNumber:'',
                zTotalWeight:'',
                zRemarks:'',
                zCarNo:'',
            },
            currentRow:'',//当前行
            contractRow:'',// 合同的行
            rowNum:15,//行数
            //验证数据
            ruleValidate: {
                CpProdCmp_ID: [
                    { required: true,message:' '}
                ],
                Seq_Num: [
                    {validator: base.intCheck, required: true,message:' '}
                ],
                InputDate: [
                    { required: true,type:'date',message:' '}
                ],
                CarNo: [
                    { required: true, message: ' '},
                ]
            },
            isLoading:false,
            //按钮状态
            isToCancelSeal:false,
            isToSeal:false,
            isToNext:false,
            isToLook:false,
            isToUpdate:false,
            isToUpLog:false,
            isToDelete:false,
            isToCheck:false,
            isToCancelCheck:false,
            //模态框控制
            bundleModal:false,//库存查询模态
            updateModal:false,// 录入模态框
            logModal: false,//销售合同模态框
            lookModal:false,//查看模态框
            logModal2:false,
            //主页面
            today:'',
            columns: [//首页显示表格的列
                // {type: 'selection',width: 30,align:"center",},
                // {title: 'ID',key: 'zid',align:"center",width: 60,},
                // {title: '序号',key: 'zSeq_Num',align:"center",width: 60,},
                {title: '产品类别',key: 'cpPinMin',align:"center",width: 200,},
                {title: '生产线', key: 'depName',align:"center",width: 100},
                {title: '合同编号', key: 'xsHt_Code',align:"center",width: 100,},
                {title: '订货单位', key: 'bcOrderGdCmp', align:"center",width: 100},
                {title: '车号',key: 'zCarNo',align:"center",width: 100},
                {title: '捆数',key: 'zTotalJianShu',align:"center",width: 80},
                {title: '支数', key: 'zTotalNumber',align:"center",width: 80},
                {title: '总量', key: 'zTotalWeight',align:"center",width: 80},
                {title: '长度', key: 'zTotalLength', align:"center",width: 80},
                {title: '日期',key: 'zInputDate',align:"center",width: 100},
                {title: '判定状态',key: 'zInspectionStatusN',align:"center",width: 80},
                {title: '冲红状态', key: 'zOffsetStatusN',align:"center",width: 80},
                {title: '录入', key: 'zLibrarian', align:"center",width: 100}
            ],
            selectedId:'',//选中的id
            data: [],//获取主页列表的数据
            total:0,//总条数
            pageCurrent: 1,//当前页码
            pageSize: 10,//页面大小
            material:'',//选中的材料
            office:0,//选中的供货单位
            user:0,//选中的使用单位
            xsHtCode:'',// 合同编号
            seqNum:'',//出库序号
            //销售合同页面
            order:0,// 选中的订货单位
            receive:0,// 选中的收货单位
            xsMaterial:'',
            contractNum:'',
            saleColumns: [
                {title: '合同编号',key: 'zHt_Code',align:"center",width: 100,},
                {title: '订货单位',key: 'bcCp_OrderGdCmp',align:"center",},
                {title: '收货单位', key: 'bcCp_CollectGdCmp',align:"center"},
                {title: '产品', key: 'bgCpPinMin',align:"center"},
                {title: '订货量', key: 'zOrderLiang', align:"center"},
                {title: '出货量',key: 'coOutTotalWeight',align:"center"},
                {title: '日期',key: 'zHtDate',align:"center"}
            ],
            logModalData:[],//数据
            xsTotal:0,
            xsPageCurrent: 1,//当前页码
            xsPageSize: 10,//页面大小
            dateRange:{srtart:'',end:''},//日期范围
            options:{//日期选项
                disabledDate(date){
                    return date.valueOf() > Date.now();
                }
            },
            goodsList:[],//品名列表
            offerCmpList:[],//生产单位
            useCmpList:[],//订货单位
            carList:[],//车号列表
            //录入界面提交的数据
            postData:{
                // "Seq_Num": "",
                // "Ht_ID": "",
                // "CP_TyID": "",
                // "CpProdCmp_ID": "",
                // "Cp_OrderGdCmp_ID": "",
                // "HtDate": "",
                // "TotalJianShu": "",
                // "TotalNumber": "",
                // "TotalWeight": 0,
                // "TotalLength": 0,
                // "Librarian": "",
                // "CarNo": "",
                // "InputDate": "",
                // "IsPrint": "",
                // "Remarks": "",
                // "Cp_OutManageRec": []
            },
            modelData2:[],
            childUpdateIds:[],//修改子数据id
            currentPageName:''
        }
    },
    computed:{
        //总重量显示
        totalWeight(){
            let sum = 0;
            this.modelData2.forEach( (item) => {
                if(item.left.weight || item.right.weight){
                    sum += (item.left.weight*1 || 0);
                    sum += (item.right.weight*1 || 0);
                }
            });
            this.postData.TotalWeight = sum.toFixed(3);
            return sum.toFixed(3);
        },
        // 总长度显示
        totalLength(){
            let sum = 0;
            this.modelData2.forEach( (item) => {
                if(item.left.weight || item.right.weight){
                    sum += (item.left.length*1 || 0);
                    sum += (item.right.length*1 || 0);
                }
            });
            this.postData.TotalLength = sum.toFixed(3);
            return sum.toFixed(3);
        },
        // 总支数显示
        totalNumber(){
            let sum = 0;
            this.modelData2.forEach( (item,index,data) => {
                    if(item.left.weight){
                        sum += (item.left.number*1 || 0);
                    }
                    if(item.right.weight){
                        sum += (item.right.number*1 || 0);
                    }
            });
            this.postData.TotalNumber = sum.toFixed(0);
            return sum.toFixed(0);
        },
        //总件数显示
        totalJianShu(){
            let sum = 0;
            this.modelData2.forEach( (item) => {
                if(item.left.weight) sum += 1;
                if(item.right.weight) sum += 1;
            });
            this.postData.TotalJianShu = sum;
            return sum;
        },
        // 月&日
        monthAndDay(){
            return this.today.replace(/\D/g,'').slice(2,6);
        }
    },
    methods: {
        handleSearch(value,options){
            if(value){
                return options.toUpperCase().indexOf(value.toUpperCase()) !== -1;
            }else{
                return false;
            }
        },
        // 存储修改行数据的id
        recIdsHandle(index,e){
            var id ;
            const border = this.rowNum;
            if( (id = doTowColItem(index,'id')) && this.childUpdateIds.indexOf(id) == -1)
                    this.childUpdateIds.push(id);
        },
        // 捆编号查询
        bundleLook(){
            this.bundleModal = true;
            this.$refs.proStock.init()
        },
        // 回车聚焦
        textFocus(index,e){
            if( e.keyCode != 13 ) return;
            const nextName = 'text' + (Number(index) + 1);
            var nextDom = document.getElementById(nextName);
            nextDom && nextDom.focus();
        },
        // 数据校验
        dataCheck(){
            if(this.postData.CpProdCmp_ID){
                this.isToUpLog = true;
                // this.$Message.info({duration: 5,content:'提示:若查询不到的数据,请检查捆编号和其对应的库存状态!'});
                this.modelData2.forEach( (item,index)=>{
                    this.modAdd(index,this.BundleNoFormat(item.left.bundleNo));
                })
                this.modelData2.forEach( (item,index)=>{
                    this.modAdd(this.rowNum+index,this.BundleNoFormat(item.right.bundleNo));
                })
            }else{
                this.$Message.warning({duration:5,content:'请先选择生产单位!'});
            }
        },
        outDateChange(val){
            this.outDateShow = val;
        },
        //生产单位名
        handleName(data){
            this.proName = data.label;
        },
        //下一步
        nextStep(){
            this.logModal = false;
            this.updateModal = true;
            this.postData.InputDate = this.today;
            this.outDateShow = this.today;
            const row = this.contractRow;
            for(var key in this.postShow){
                this.postShow[key] = row[key];
            }
            this.postData.Ht_ID = row.zid;//合同id
            this.postData.CP_TyID = row.zcP_TyID;//原料id
            this.postData.Cp_OrderGdCmp_ID = row.zCp_OrderGdCmp_ID;
        },
        // 查询入库明细
        queryStoreRec(index,bundle,row){
            const border = this.rowNum;
            const refrence = {
                zylSupCmp_ID:'',
                bcYLSupCmpName:'',
                zFurnaceNo:'',
                zWeight:'',
                zLength:'',
                zNumber:'',
            };
            if(!row){
                if( index < border){
                    this.modelData2[index].left = {};
                    this.$set(this.modelData2[index].left,'bundleNo',this.showBundleNo(bundle));//查询不到，清空
                }else{
                    this.modelData2[index-border].right = {};
                    this.$set(this.modelData2[index-border].right,'bundleNo',this.showBundleNo(bundle));//查询不到，清空
                }
                return;
            }
            for(var key in refrence){
                let ikey = key.replace(/^z/,'');
                ikey = ikey[0].toLowerCase() + ikey.slice(1);
                this.doTowColItem(index,ikey,row[key]);
            }
            this.doTowColItem(index,'Cp_ProdStoreRecID',row.zid);
            this.doTowColItem(index,'date',row.cpoInStoreDate);
            this.$forceUpdate();
        },
        //查询函数
        modAdd(index,bundle){
            const border = this.rowNum;
            if(!bundle) {
                if( index < border){
                    this.modelData2[index].left = {};
                }else{
                    this.modelData2[index-border].right = {};
                }
                return;
            };
            const basecdt = '&zBundleNo=' + bundle + '&zCpProdCmp_ID='+ this.postData.CpProdCmp_ID;
            let cdt1 = 'decisionStatusRec=2' + basecdt;
            let cdt2;
            this.postData.id ? cdt2 = 'cmoOutZID='+ this.postData.id + basecdt:cdt2 = cdt1;
            base.getAjaxData(base.baseURL + 'FCManage/Cp_ProdStoreRec_view?'+ cdt2,(res)=>{//子表视图
                let row = res.results[0];
                if(!row) {
                    base.getAjaxData(base.baseURL + 'FCManage/Cp_ProdStoreRec_view?'+ cdt1,(res)=>{
                        row = res.results[0];
                        this.queryStoreRec(index,bundle,row);
                    });
                    return;
                }
                this.queryStoreRec(index,bundle,row);
            })
        },
        lookDeliver(){
            this.detailModal = true;
        },
        //修改
        update(){
            this.postStatus = 'update';
            this.childUpdateIds = [];
            this.isToUpLog = false;
        },
        // 炉号显示
        showBundleNo(val){
            if(val >= 1000) {
                const date = String(val).match(/\d{4}/).toString();
                let num = String(val).replace(/\d{4}/, date + '-');
                return num;
            }else{
                return val;
            }
        },
        //日期范围
        dateFormatStart(val){
            this.dateRange.start = val;
        },
        dateFormatEnd(val){
            this.dateRange.end = val;
        },
        //点击选中项的操作
        mainHandleRow(row){
            this.btnInit();
            this.isToLook =true;
            this.selectedId = row.zid;
            this.currentRow = row;
            const status = row.zInspectionStatus;
            if (status == 1) {
                    this.isToCheck = true;
                    this.isToUpdate = true;
                    this.isToDelete = true;
            }else if(status > 1){
                if(status == 2){
                    this.isToSeal = true;
                    this.isToCancelCheck = true;
                }else{
                    if(status == 3){
                        this.isToCancelSeal = true;
                    }
                    this.seal = true;
                }
            };
            this.postShow.bgSubClass_Value = row.bgCPName;
            this.postShow.bgSteelGrade = row.bgSteelGrade;
            this.postShow.bgSpecifications = row.bgJsSpecifications;

            for (var key in this.lookShow){
                this.lookShow[key] = row[key];
                let ikey = key.replace(/^z/,'');
            }
            // 显示处理
            this.outDateShow = row.zInputDate
            this.postShow.zHt_Code = row.xsHt_Code;
            this.postShow.bcCp_OrderGdCmp = row.bcOrderGdCmp;
            this.postShow.zTransportModeName = row.xsTransportModeName;

            for(var key in row){
                let ikey = key.replace(/^z/,'');
                this.postData[ikey] = row[key];
            }
            this.getModelData2();
        },
        handleRow(row){
            this.contractRow = row;
            this.isToNext = true;
        },
        //获取子表数据
        getModelData2(){
            this.logInit();
            base.getAjaxData(base.baseURL + 'WlCenter/Cp_OutManageRec_view?ZCp_OutManageId='+ this.selectedId,(res)=>{
                const border = this.rowNum;
                res.results.forEach((item,index)=>{
                    for(var key in item){
                        let ikey = key.replace(/^z/,'');
                        ikey = ikey[0].toLowerCase() + ikey.slice(1);
                        if(key == 'zBundleNo') item[key] = this.showBundleNo(item[key]);
                        this.doTowColItem(index,ikey,item[key]);
                    }
                })
                this.$forceUpdate();
            })
        },
        //查看
        look(){
            this.lookModal = true;
        },
        //录入
        logBtn(){
            this.logModal = true;
            this.postData = {};
            this.logQuery();
            this.initData();
            this.$refs.updateForm.resetFields();
            this.postStatus = 'post';
            this.isToNext = false;
        },
        //状态公共函数
        btnCommonFun(status,callback){
            const id = this.selectedId;
            id && base.getAjaxData(base.baseURL+'WlCenter/Cp_OutManage?ID=' + id, (data)=>{
                if(data.results[0].inspectionStatus === status){
                    callback(data.results[0],id);
                }else{
                    this.$Message.error({duration: 5, content:'已选的数据已不可进行当前操作！请确认判定状态！'});
                }
            });
        },
        //送检
        toCheck(){
            this.btnCommonFun(1, (data,id) => {
                data.inspectionStatus = 2;
                base.putAjaxData(base.baseURL + 'WlCenter/Cp_OutManage',JSON.stringify(data),() =>{
                    this.$Message.success({duration: 5, content:'送检成功！'});
                    this.init();
                    this.lookModal = false;
                });
            });
        },
        //取消送检
        toCancelCheck(){
            this.btnCommonFun(2, (data,id) => {
                data.inspectionStatus = 1;
                base.putAjaxData(base.baseURL + 'WlCenter/Cp_OutManage',JSON.stringify(data),() =>{
                    this.$Message.success({duration: 5, content:'取消送检成功！'});
                    this.init();
                    this.lookModal = false;
                });
            });
        },
        //盖章
        toSeal(){
            this.btnCommonFun(2, (data,id) => {
                data.inspectionStatus = 3;
                base.putAjaxData(base.baseURL + 'WlCenter/Cp_OutManage',JSON.stringify(data),() =>{
                    this.$Message.success({duration: 5, content:'盖章成功！'});
                    this.init();
                    this.lookModal = false;
                });
            });
        },
        //取消盖章
        toCancelSeal(){
            this.btnCommonFun(3, (data,id) => {
                data.inspectionStatus = 2;
                base.putAjaxData(base.baseURL + 'WlCenter/Cp_OutManage',JSON.stringify(data),() =>{
                    this.$Message.success({duration: 5, content:'取消盖章成功！'});
                    this.init();
                    this.lookModal = false;
                });
            });
        },
        //删除
        toDeleteData(){
            this.btnCommonFun(1, (data,id) => {
                this.$Modal.confirm({
                    content:'<p>确定删除数据么？</p>',
                    onOk: () => {
                        base.deleteAjaxData(base.baseURL + 'WlCenter/Cp_OutManage?ID='+id, (res) =>{
                            this.$Message.success({duration: 3, content:'删除成功！'});
                            this.init();
                        });
                    }
                })
            });
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
        xsChangePage (index) {
            // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
            this.xsPageCurrent = index;
            let _size = this.xsPageSize;
            let _skip = (index-1)*_size;
            this.logQuery(_skip, _size);
        },
        //改变页显示数时的函数
        changePageSize (size) {
            this.pageSize = size;
            let _current = this.pageCurrent;
            let _skip = (_current-1)*size;
            this.query(_skip, size);
        },
        xsChangePageSize (size) {
            this.xsPageSize = size;
            let _current = this.xsPageCurrent;
            let _skip = (_current-1)*size;
            this.logQuery(_skip, size);
        },
        //查询按钮
        btnQuery(){
            this.pageCurrent = 1;
            this.query(0, this.pageSize);
        },
        btnLogQuery(){
            this.xsPageCurrent = 1;
            this.isToNext = false;
            this.logQuery(0, this.pageSize);
        },
        condition(){
            let options = '';
            let date = this.dateRange;
            options += '&zcP_TyID='+this.material;
            if(this.office)options += '&ZCpProdCmp_ID='+this.office;
            if(this.user)options += '&zCp_OrderGdCmp_ID='+this.user;
            if(this.xsHtCode)options += '&xsHt_CodeStartsWith='+this.xsHtCode;
            if(this.seqNum) options += '&zSeq_NumStartsWith='+this.seqNum;
            if(this.currentPageName == 'output_decide_mgmt'){
                options += '&ZInspectionStatus>=1';
            }else if(this.currentPageName == 'sales_output_note_mgmt'){
                options += '&ZInspectionStatus>=2';
            }
            if(date.start && date.end){
                date.start > date.end ? this.$Modal.warning({content: '<p>起始日期大于截至日期,条件无效</p>'}) : (options += '&zInputDateBetween='+ date.start + ',' + date.end);
            }else if(date.start){
                options += '&>zInputDate=' + date.start;
            }else if(date.end){
                options += '&zInputDate<=' + date.end;
            }
            return options;
        },
        //查询函数
        query(skip,take){
            let options = this.condition();
            if(skip == undefined)skip = 0;
            if(take == undefined)take = this.pageSize;
            this.isLoading = true;
            base.getAjaxData(base.baseURL+'/WlCenter/Cp_Outmanage_view?orderBy=-ZID&Skip='+ skip +'&take='+ take + options,(res) => {
                if(res.results){
                    res.results.forEach( (item) => {
                        if(item.zInputDate) item.zInputDate = item.zInputDate.substring(0,10);
                    });
                    this.data = res.results;
                    this.isLoading = false;
                }
                this.total = res.total;
                this.initData();
            });
        },
        logCondition(){
            let options = '';
            let date = this.dateRange;
            options += '&ZCP_TyID='+this.xsMaterial;
            if(this.order)options += '&ZCp_OrderGdCmp_ID='+this.order;
            if(this.receive)options += '&ZCp_CollectGdCmp_ID='+this.receive;
            if(this.contractNum != '')options += '&ZHt_CodeStartsWith='+this.contractNum;
            if(date.start && date.end){
                date.start > date.end ? this.$Modal.warning({content: '<p>起始日期大于截至日期,条件无效</p>'}) : (options += '&ZHtDateBetween='+date.start + ',' +date.end);
            }else if(date.start){
                options += '&>ZHtDate=' + date.start;
            }else if(date.end){
                options += '&ZHtDate<=' + date.end;
            }
            return options;
        },
        // 销售合同查询
        logQuery(skip,take){
            const options = this.logCondition();
            if(skip == undefined)skip = 0;
            if(take == undefined)take = this.pageSize;
            base.getAjaxData(base.baseURL+'XsManage/Xs_SaleHtManage_view?orderBy=-zID&Skip='+skip+'&take='+take+options,(res) => {
                this.logModalData = res.results;
                this.logModalData.forEach( (item) => {
                    if(item.zHtDate)item.zHtDate = item.zHtDate.substring(0,10);
                    item.zFinishDate && (item.zFinishDate = item.zFinishDate.substring(0,10));
                })
                this.xsTotal = res.total;
            });
        },
        //清空查询条件
        clearQuery(){
                this.office = 0;
                this.user = 0;
                this.decideStatus = 0;
                this.seqNum = '';
                this.xsHtCode = '';
        },
        btnClearQuery(){//销售合同界面
            this.order = 0;
            this.receive = 0;
            this.contractNum = '';
        },
        //判断对象是否为空
        isEmptyObject(obj){ 
            for(var key in obj){
                return false;
                break;
            };
            return true;
        },
        blurFormat(index,e){
            let curVal = e.target.value;
            let preVal = index ===0 ? this.monthAndDay : this.doTowColItem(index-1,'bundleNo');
            this.doTowColItem(index,'bundleNo',this.formatBundleNo(curVal,preVal));
        },
        // 处理两列类型表格数据
        doTowColItem(index,prop,val){
            const rowNum = this.rowNum;
            if(val !== undefined){
                if(index < rowNum){
                    this.$set(this.modelData2[index].left,prop,val);
                }else{
                    this.$set(this.modelData2[index -rowNum].right,prop,val);
                }
            }else{
                if(index < rowNum){
                    return this.modelData2[index].left[prop];
                }else{
                    return this.modelData2[index -rowNum].right[prop];
                }
            }
        },
        formatBundleNo(now,pre){
            let len = now.length;
            if(!len) return;
            let a = now;
            if(len > 5){
                a = a.replace(/\D/g,'');
                let date = a.substring(0,4);
                let num = a.slice(4);
                for(var i = num.length;i < 4;i++) num = '0' + num;
                return date + '-' + num;
            }else{
                let date = pre.substring(0,4);
                for(var i = len;i < 4;i++) a = '0' + a;
                return date + '-' + a;
            }
        },
        BundleNoFormat(val){
            let num = String(val).replace(/\D/g,'');
            return num;
        },
        // 数据提交处理
        commitLog(name,callback){
            let temp = [];
            this.postData.Cp_OutManageRec = [];
            this.modelData2.forEach( (item,index,data)=>{
                if( item.left.weight ){
                    temp.push(item.left);
                }
            });
            this.modelData2.forEach( (item,index,data)=>{
                if( item.right.weight ){
                    temp.push(item.right);
                }
            });
            if(temp.length > 0){
                this.recordModal = false;
                temp.forEach((item,index,data)=>{
                    item.bundleNo = this.BundleNoFormat(item.bundleNo);
                    this.postData.Cp_OutManageRec.push(item);
                })
                callback();
            }else{
                this.$Message.warning({duration: 5, content:'请填写数据！'});
            }
        },
        //保存提交按钮
        handleSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.postStatus == 'post')this.commitLog(name, () => {
                        base.postAjaxData(base.baseURL+'WlCenter/Cp_OutManage',JSON.stringify(this.postData),(e) =>{
                            this.$Message.success({duration: 3, content:'提交成功'});
                            this.updateModal = false;
                            this.init();
                            this.$refs[name].resetFields();
                        });
                    });
                    if(this.postStatus == 'update')this.commitLog(name, () => {
                        let postData = this.postData;
                        base.putAjaxData(base.baseURL+'WlCenter/Cp_OutManage',JSON.stringify(postData),() =>{
                            postData.Cp_OutManageRec.forEach( (item,index)=>{
                                if(item.id){
                                    const dex = this.childUpdateIds.indexOf(item.id);
                                    if(dex != -1){
                                        this.childUpdateIds.splice(dex,1);
                                        base.putAjaxData(base.baseURL+'WlCenter/Cp_OutManageRec',JSON.stringify(item),() =>{});
                                    }
                                }else{
                                    item.cp_OutManageId = postData.id;
                                    base.postAjaxData(base.baseURL+'WlCenter/Cp_OutManageRec',JSON.stringify(item),() =>{});
                                }
                            })
                            this.childUpdateIds.length && this.childUpdateIds.forEach( (item)=>{
                                base.deleteAjaxData(base.baseURL+'WlCenter/Cp_OutManageRec?id='+item,() =>{});
                            })
                            this.$Message.success({duration: 5, content:'更改成功'});
                            this.updateModal = false;
                            this.init();
                            this.$refs[name].resetFields();
                        });
                    });

                }else {
                    this.$Message.error({duration: 5, content:'请输入完整！'});
                };
            })
        },
        //关闭模态框
        handleClose(modal){
            this[modal] = false;
            this.lookModal = false;
        },
        logInit(){
            this.modelData2 = [];
            for(var i = 0;i < this.rowNum;i++){
                this.modelData2.push({
                    left:{},
                    right:{}
                });
            }
        },
        btnInit(){
            this.isToCheck = false;
            this.isToLook = false;
            this.isToCancelCheck = false;
            this.isToUpdate = false;
            this.isToDelete = false;
            this.isToCancelSeal = false;
            this.isToSeal = false;
            this.seal = false;
        },
        initData(){
            this.btnInit();
            this.logInit();
        },
        init(){
            //数据初始化
            this.initData();
            this.changePage(this.pageCurrent);
            if (this.goodsList[0].id) this.xsMaterial = this.goodsList[0].id;
        }
    },
    created(){
        // 添加筛选选项的列表
        base.getGoodsList(this,108);
        this.useCmpList=[];
        this.receiveCmpList = [];
        // 订货单位
        base.getAjaxData(base.baseURL + 'PublicApi/bs_comminfo_view',(res) =>{
            res.results.forEach((item) => {
                if(item.comm_ID){
                    let temp = item.comm_ID.substring(0,3);
                    if(item.subClass_Value){
                        if(temp == 102)this.useCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                        if(temp == 114)this.receiveCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                    }
                }
            })
        });
        // 生产单位
        base.getAjaxData(base.baseURL + 'PublicApi/Bs_commdep1_view',(res) =>{
            this.offerCmpList = res.results;
        });
        // 车号
        base.getAjaxData(base.baseURL + 'PublicApi/Bs_comminfo_view?Comm_IDStartsWith=110&IsEnable=1',(res) =>{
            this.carList = [];
            if(res.results.length > 0 ){
                res.results.forEach( (item)=>{
                    let m = this.carList.indexOf(item.subClass_Value);
                    m === -1 && this.carList.push(item.subClass_Value);
                })
            }
        });
    },
    mounted(){
        this.today = base.dateFormat(new Date());
        this.currentPageName = localStorage.currentPageName;
    },
    watch:{
        total: function(val) {
            base.watchTotal(val, this);
        },
        '$route': function(router){
            this.currentPageName = router.name;
            this.init();
        }
    }
};
</script>

               
