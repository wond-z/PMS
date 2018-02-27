<style lang="less">
   @import './record-mgmt.less';
</style>

<template>
	 <div class="record-mgmt">
        <card>
            <row justify="center" >
                <Col style="display:inline-block;">
                    <div style="display: inline-block; margin-right: 15px;">
		            	<i-button type="primary" @click="delieverModal = true;" icon="minus">发货</i-button>
                        <i-button type="primary" :disabled = '!isToMainLook' @click="mainLookModal = true;" icon="ios-search">查看</i-button>
                        <i-button type="primary" :disabled = '!isToDelete' @click="toDeleteData" icon="trash-a">删除</i-button>
                        <i-button type="primary" :disabled = '!isToDetail' @click="detailModal = true;" icon="document-text">查看明细</i-button>
                        <i-button type="primary" :disabled = '!isToBind' @click="bindModal = true;" icon="ios-bookmarks">捆绑明细</i-button>
                        <i-button type="primary" :disabled = '!isToOutStore' @click="outStoreModal = true;handleOutBill()" icon="reply">出库单</i-button>
		            </div>
                </Col>
            </row>
        </card>
        <card class="margin-bottom-10 margin-top-10">
			<row justify="center" >
				<div class="margin-bottom-10">
			   		<div style="display: inline-block; margin-right: 15px;" justify="center">
		            	<label  for="for" align="middle" style="display:inline-block;width: 35px;text-align: right;">原料:</label>
				        <Select v-model="material" style="width:175px">
					        <Option v-for="item in materialList" :value="item || 0" :key="item">{{item}}</Option>
					    </Select>
		            </div>
		            <div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">供货单位:</label>
				        <Select v-model="office"  style="width:175px">
					        <Option v-for="item in officeList" :value="item || 0" :key="item">{{ item }}</Option>
					    </Select>
		            </div>
		        	<div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">使用单位:</label>
				        <Select v-model="user"  style="width:175px">
					        <Option v-for="item in userList" :value="item || 0" :key="item">{{ item }}</Option>
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
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">时间:</label>
		            	<Date-picker type="daterange" placement="bottom-end" placeholder="选择日期" style="width:175px" @on-change='dateFormat'></Date-picker>
		            </div>
			        <div style="display: inline-block; margin-right: 15px;">
			        	<i-button type="primary" icon="ios-search" @click="query()" >查询</i-button>
		                <i-button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</i-button>
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
        <!-- 查看明细弹出框 -->
        <Modal class="record-modal" width='1100px' :mask-closable="false" v-model="detailModal" ok-text="保存" cancel-text="关闭">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>原料发货明细</span>
            </p>
            <div class="margin-bottom-10">
                <i-button type="primary"  icon="ios-upload" size="small">导出excel</i-button>
                <i-button type="primary" icon="ios-close-empty" size="small">关闭</i-button>
            </div>
            <div>
                <h1 style="font-weight:lighter;text-align:center;margin-bottom:10px;">管材到(发)货登记表</h1>
                <div class="ivu-table ivu-table-border modal-table">
                    <!-- <Form ref="postForm" :model="formValidate" :rules="ruleValidate"> -->
                    <Form ref="postForm">
                        <table class="table-info" border="1" cellspacing='0'>
                            <tr>
                                <td colspan="1">重量单位:吨</td>
                                <td></td>
                                <td colspan="4"></td>
                                <td></td>
                                <td colspan="2">编码：SYC/ZJ JZ-19</td>
                            </tr>
                        </table>    
                        <table  border="1" cellspacing='0'>
                            <tr>
                                <td >品名</td>
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
                                <td> </td>
                                <td>73.02*5.51</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td >车皮号：</td>
                                <td colspan="5"></td>
                                <td>备注：</td>
                                <td colspan="2"></td>
                            </tr>
                        </table>
                        <p class="margin-top-10">录入数据:</p>
                        <table border="1" cellspacing='0'>
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
                                <td v-text="item.left.luhao"></td>
                                <td v-text="item.left.pici"></td>
                                <td v-text="item.left.zhishu"></td>
                                <td v-text="item.left.zhongliang"></td>

                                <td>{{index+16}}</td>
                                <td v-text="item.right.luhao"></td>
                                <td v-text="item.right.pici"></td>
                                <td v-text="item.right.zhishu"></td>
                                <td v-text="item.right.zhongliang"></td>
                            </tr>
                        </table>
                    </Form>
                </div>
            </div>    
            <div slot="footer">
            </div>
        </Modal>
        <!-- 捆绑界面明细 -->
        <Modal class="record-modal" width='90%' :mask-closable="false" v-model="bindModal" ok-text="保存" cancel-text="关闭">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>原料到货、发货明细绑定</span>
            </p>
            <div class="record-mgmt">
                <card>
                    <row justify="center" >
                        <Col style="display:inline-block;">
                            <div style="display: inline-block; margin-right: 15px;">
                                <i-button type="primary" :disabled = '!isToLook' @click="lookModal = true;look()" icon="ios-search">查看</i-button>
                            </div>
                        </Col>
                    </row>
                </card>
                <card class="margin-bottom-10 margin-top-10">
                    <row justify="center">
                        <div class="margin-bottom-10">
                            <div style="display: inline-block; margin-right: 15px;" justify="center">
                                <label  for="for" align="middle" style="display:inline-block;width: 35px;text-align: right;">原料:</label>
                                <Select :transfer="true" v-model="material" style="width:175px">
                                    <Option v-for="item in materialList" :value="item || 0" :key="item">{{item}}</Option>
                                </Select>
                            </div>
                            <div style="display: inline-block; margin-right: 15px;">
                                <label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">供货单位:</label>
                                <Select :transfer="true" v-model="office"  style="width:175px">
                                    <Option v-for="item in officeList" :value="item || 0" :key="item">{{ item }}</Option>
                                </Select>
                            </div>
                            <div style="display: inline-block; margin-right: 15px;">
                                <label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">使用单位:</label>
                                <Select :transfer="true" v-model="user"  style="width:175px">
                                    <Option v-for="item in userList" :value="item || 0" :key="item">{{ item }}</Option>
                                </Select>
                            </div>
                            <div style="display: inline-block; margin-right: 15px;">
                                <label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">筛选状态:</label>
                                <Select :transfer="true" v-model="state"  style="width:175px">
                                    <Option v-for="item in statesList" :value="item.num" :key="item.num">{{ item.value }}</Option>
                                </Select>
                            </div>
                            
                        </div>
                        <div >
                            <div style="display: inline-block; margin-right: 15px;">
                                <label  for="for" style="display:inline-block; vertical-align: middle;width: 35px;text-align: right;">车号:</label>
                                <Select :transfer="true" v-model="carNum"  style="width:175px">
                                    <Option v-for="item in carNumList" :value="item || 0" :key="item">{{ item }}</Option>
                                </Select>
                            </div>
                            <div style="display: inline-block; margin-right: 15px;">
                                <label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">库区:</label>
                                <Input v-model="storeA" placeholder="" style="width:175px"></Input>
                            </div>
                            <div style="display: inline-block; margin-right: 15px;">
                                <label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">时间:</label>
                                <Date-picker type="daterange" placement="bottom-end" placeholder="选择日期" style="width:175px" @on-change='dateFormat'></Date-picker>
                            </div>
                            <div style="display: inline-block; margin-right: 15px;">
                                <i-button type="primary" icon="ios-search" @click="query()" >查询</i-button>
                                <i-button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</i-button>
                                <i-button type="primary" icon="ios-upload">导出信息</i-button>
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
               
                <!-- 捆绑查看界面弹出框 -->
                <Modal class="record-modal zIndex-2000" :mask-closable="false" width='800px' v-model="lookModal" ok-text="保存" cancel-text="关闭">
                    <p slot="header" >
                        <Icon type="compose" size='16'></Icon>
                        <span>管材到(发)货登记表</span>
                        <p><span>单位：吨</span><span style='float:right;'>编号：SYC/ZJ-WL-07</span></p>
                    </p>
                    <div class="ivu-table ivu-table-border modal-table">
                        <Form ref="postForm" :rules="ruleValidate">
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
                        <Button type="primary" icon="android-done">保存</Button>
                    </p>
                </Modal>
            </div>
        </Modal>
        <!-- 查看界面弹出框 -->
            <Modal class="record-modal" width='800px' :mask-closable="false" v-model="mainLookModal" ok-text="保存" cancel-text="关闭">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>原料发货</span>
            </p>
            <div class="ivu-table ivu-table-border">
                <Form ref="toDeliverForm" :model="deliverBill" :rules="ruleValidate">
                    <div class="modal-table margin-top-10">
                        <h3 class="text-center margin-bottom-10">原料发货信息</h3>
                        <table class="tableHeade" border="1" cellspacing='0'>
                            <tr style="display:none">
                                <td class="text-center" colspan="4">原料发货信息</td>
                            </tr>
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
                <Button type="primary" icon="android-done" @click="toDeliverCommit('toStoreForm')">保存</Button>
            </p>
        </Modal>
        <!-- 出库单界面弹出框 -->
        <Modal class="record-modal" width='800px' :mask-closable="false" v-model="outStoreModal" ok-text="保存" cancel-text="关闭">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>原料出库单录入</span>
            </p>
            <div class="ivu-table ivu-table-border">
                <Form ref="postForm" :model="toStoreBillData" :rules="ruleValidate" label-position="right" :label-width="60" inline>
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
                        <FormItem label="单位:">
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
                        <h3 style="text-align:center;" class="margin-bottom-10">专用原(辅)料出库单</h3>
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
                <Form ref="toDeliverForm" :model="deliverBill" :rules="ruleValidate">
                    <div class="modal-table margin-top-10">
                        <h3 class="text-center margin-bottom-10">原料发货信息</h3>
                        <table class="tableHeade" border="1" cellspacing='0'>
                            <tr style="display:none">
                                <td class="text-center" colspan="4">原料发货信息</td>
                            </tr>
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
                <Button type="primary" icon="android-done" @click="toDeliverCommit('toStoreForm')">保存</Button>
            </p>
        </Modal>
	</div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        return {
                logTwoColData:[
                    // {
                    //     left:{luhao:'g',pici:'g',zhishu:'g',zhongliang:'g'},
                    //     right:{luhao:'h',pici:'h',zhishu:'h',zhongliang:'h'}
                    // },
                ],
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
                    ArrivalGoodsDate: [
                        { required: true, type: 'string', message: ' ', trigger: 'change' }
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
                //表单提交总验证
                formValid:true,
                //按钮状态
                isToMainLook:false,
                isToBind:true,
                isToLook:false,
                isToDetail:true,
                isToCancelCheck:false,
                isToOutStore:true,
                isToDeliver:false,
                //模态框控制
                mainLookModal:false,
                bindModal:false,
                delieverModal:false,
                outStoreModal:false,
                enterStoreModal:false,//入库
                detailModal: false,//录入模态框
                lookModal:false,//查看模态框
                addable:true,//录入时是否可添加行的判断
                columns: [//首页显示表格的列
                    {type: 'selection',width: 30,align:"center"},
                    {title: '品名',key: 'zylPinMing',align:"center","width": 225,"sortable": true},
                    {title: '供货单位', key: 'zylSupCmp',"width": 200,align:"center"},
                    {title: '使用分厂', key: 'zylUseCmp',"width": 100,align:"center"},
                    {title: '库区', key: 'zStoreArea', "width": 80,align:"center"},
                    {
                        title: '重量',
                        key: 'zPoundWeight',
                        "width": 80,align:"center"
                        
                    },
                    {
                        title: '支数',
                        key: 'zNumber',
                   "width": 80,align:"center"
                    },
                     {
                        title: '标重',
                        key: 'zylUseCmp',
                       "width": 80,align:"center"
                    },
                    {
                        title: '日期',
                         key: 'zArrivalGoodsDate',
                       "width": 120,align:"center"
                    },
                    {
                        title: '出库单',
                        key: 'zStoreArea',
                       "width": 80,align:"center"
                    },
                    {
                        title: '车号',
                        key: 'zStoreArea',
                        align:"center"
                    }

                ],
                ilogData:{data:[]},
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
                selectedData:[],//选中的数据
                selectedIds:[],//选中的id
                model2: '',
                data: [],//获取主页列表的数据
                total:0,//总条数
                pageCurrent: 1,//当前页码
                pageSize: 10,//页面大小
                //主页面
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
                    {num:4,value:'仅显示已发货记录'},
                ],
                state:'',//选中状态
                dateRange:[],//日期范围
                storeA:'',//选中库区
                carNumList:[],//车号列表
                carNum:'',//选定车号
                //录入界面
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
                let imouth = inow.getMonth();
                let iday = inow.getDate();
                let nowDay = iyear+'年'+imouth+'月'+iday+'日';
                return nowDay;
            },
            set: (val) => {

            }
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
        //查看明细数据处理
        handleOutBill(){
             this.logTwoColData = [];
            for(var i = 0;i < 15;i++){
                this.logTwoColData.push({
                    left:{},
                    right:{}
                });
            }
            for(var i = 0;i < 10;i++){
                if(i < 15)this.logTwoColData[i].left = {luhao:'l'+i,pici:'l'+i,zhishu:'l'+i,zhongliang:'l'+i};
                if(i >= 15)this.logTwoColData[i-15].right = {luhao:'r'+i,pici:'r'+i,zhishu:'r'+i,zhongliang:'r'+i};
            }
            
        },
        storeDate(value){
            this.toStoreBillData.date = value;
        },
        //日期范围
        dateFormat(val){
            this.dateRange = val
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
                for(var i = 0; i < 12 - len;i++){
                    this.lookChild.push({});
                }
            })
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
        //送检
        toCheck(){
            this.btnCommonFun(1, (data,id,index) => {
                    base.putAjaxData(base.baseURL + 'WlCenter/yl_arrivalstatupd_view?ID='+id+'&StoreStatus=2');
                    this.$Message.success('第'+(index+1)+'条送检成功！');
                    this.init();
            });
        },
        //取消送检
        toCancelCheck(){
            this.btnCommonFun(2, (data,id,index) => {
                    base.putAjaxData(base.baseURL + 'WlCenter/yl_arrivalstatupd_view?ID='+id+'&StoreStatus=1');
                    this.$Message.success('第'+(index+1)+'条取消送检成功！');
                    this.init();
            });
        },
        //删除
        toDeleteData(){
            this.btnCommonFun(1, (data,id,index) => {
                if(confirm('确定删除数据么？')){
                    base.deleteAjaxData(base.baseURL + 'WlCenter/Yl_ArrivalRec?ID='+id);
                    this.$Message.success('第'+(index+1)+'条取消送检成功！');
                    this.init();
                }
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
            options += '&ZYLPinMing='+this.material;
            if(this.office){
                options += '&ZYLSupCmp='+this.office;
            };
            if(this.user){
                options += '&ZYLUseCmp='+this.user;
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
            if(this.dateRange.length > 0){
                if(this.dateRange[1])options += '&ZArrivalGoodsDateBetween='+this.dateRange.join(',');
            }
            if(skip == undefined)skip = 0;
            if(take == undefined)take = this.pageSize;
            base.getAjaxData(base.baseURL+'WlCenter/yl_arrivalrecdetail_view?Skip='+skip+'&take='+take+options,(res) => {
                this.data = res.results;
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
                                    base.postAjaxData(base.baseURL+'WlCenter/Yl_InOutManage',JSON.stringify(this.toStoreBill));
                                    base.putAjaxData(base.baseURL + 'WlCenter/yl_arrivalstatupd_view?ID='+item+'&IsTmpStore=2');
                                    this.init();
                                    this.enterStoreModal = false;
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
        init(){
            //初始化按钮状态
            this.isToDelete = true;
            this.isToLook = false;
            this.isToCheck = true;
            this.isToCancelCheck = true;
            this.isToStore = true;
            this.isToDeliver = true;
            // 添加筛选选项的列表
            let _self = this;
            let materialListTemp = [];
            let officeListTemp = [];
            let userListTemp = [];
            let carNumListTemp = [];
            
            base.getAjaxData(base.baseURL+'PublicApi/bs_goodsinfo_view?',function(bsGoods){
                bsGoods.results.forEach(function(item) {
                    if(item.pinMing && item.isEnable) materialListTemp.push(item.pinMing);
                    _self.materialList = materialListTemp;
                    _self.material = materialListTemp[0];
                });
                base.getAjaxData(base.baseURL+'PublicApi/Bs_comminfo_view?',function(bsCommon){
                    bsCommon.results.forEach(function(item) {
                        if(item.subClass_Value && item.comm_ID.substring(0,3) === '100' && item.isEnable) officeListTemp.push(item.subClass_Value);
                        if(item.comm_ID.substring(0,3) === '104' && item.isEnable) userListTemp.push(item.subClass_Value);
                        if(item.comm_ID.substring(0,3) === '110' && item.isEnable) carNumListTemp.push(item.subClass_Value);
                    })
                    _self.officeList = officeListTemp;
                    _self.userList = userListTemp;
                    _self.carNumList = carNumListTemp;
                    _self.query();
                })
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
