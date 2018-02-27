<style lang="less" >
    @import './daily-data-mgmt.less';
</style>

<template>
    <div class="table-component-common">
        <div class="margin-bottom-10">
            <div>
                <Button type="primary" @click="handleLog()" icon="plus">录入</Button>
                <Button type="primary" :disabled = '!isToUpdate' @click="show()" icon="edit">查看/修改</Button>
                <Button type="primary" :disabled = '!isToDelete' @click="remove()" icon="trash-a">删除</Button>
                <Button type="primary" :disabled = '!isToReport' @click="supReport()" icon="ios-search">上报生产处</Button>
                <Button type="primary" :disabled = '!isToCancel' @click="cancelReport()" icon="ios-search">取消上报</Button>
            </div>
        </div>
        <card class="margin-bottom-10 padding-top-bottom-minish">
           <div class="select-col" >
                <div class="div" >
                    <label class="label">产品类别</label>
                    <Select  v-model="prodClassSelect" class="select li-width" >
                        <Option  v-for="item in prodClass" :value="item.wp_ID" :key="item.wp_ID">{{item.pinMing}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">分厂</label>
                    <Select :transfer="true" v-model="ProdCmpNameSelect" class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in ProdCmpName" :value="item.mid" :key="item.mid">{{item.mDepName}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">工段</label>
                    <Select :transfer="true" v-model="workSectionSelect" class="select">
                        <Option :value="0" >全部</Option>
                        <Option v-for="item in workSection" :value="item.comm_ID" :key="item.comm_ID" >{{item.subClass_Value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">起始日期</label>
                    <DatePicker :options="options" :value="startDate" placement="bottom-end" placeholder="选择日期" @on-change="dateStrat"></DatePicker>
                </div>
                <div class="div">
                    <label class="label">截止日期</label>
                    <DatePicker :options="options" :value="endDate" placement="bottom-end" placeholder="选择日期" @on-change="dateEnd"></DatePicker>
                </div>
                <Button type="primary" icon="ios-search" @click="btnQuery()">查询</Button>
                <Button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</Button>
            
            </div>
        </card>
        <card class="margin-bottom-10">
            <Table class="margin-bottom-10" size="small" border style="min-height:400px;" :columns="columns" :data="data1" highlight-row @on-row-click='handleRow'></Table>
            <div>
                <Page :total="total" :current="1" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
            </div>
        </card>
        <!-- 录入模态框 -->
        <Modal  class="modal-table-form daily-modal" v-model="recordModal"  :mask-closable="false"  width="900px" class-name="vertical-center-modal">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>生产日进度数据录入</span>
            </p>
            <div class="" >
                <Form ref="typeInModal" :model="formValidate" :rules="typeInRuleValidate" :label-width="50" inline :show-message="false"> 
                    <Card class="modal-formItem margin-bottom-10">
                        <FormItem label="分厂" prop='CpProdCmp_ID'>
                            <Select :transfer="true" style="width:100px;" v-model="formValidate.CpProdCmp_ID">
                                <Option  v-for="item in ProdCmpName" :value="item.mid" :key="item.mid">{{item.mDepName}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="工段" prop='WorkSection_ID'>
                            <Select :transfer="true" v-model="formValidate.WorkSection_ID" style="width:100px;" >
                                <Option  v-for="item in workSection" :value="item.comm_ID" :key="item.comm_ID" >{{item.subClass_Value}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="产品" prop='CP_TyID'>
                            <Select :transfer="true" v-model="formValidate.CP_TyID" style="width:200px;" >
                                <Option  v-for="item in prodClass" :value="item.wp_ID" :key="item.wp_ID">{{item.pinMing}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="日期" prop='ProdDate'>
                            <DatePicker :options='options' :transfer="true" type="date" v-model="formValidate.ProdDate" placement="bottom-end" placeholder="选择日期" style="width:120px"></DatePicker>
                        </FormItem>
                    </Card>
                    <div>
                        <table  class="table-common daily-table" cellspan="0" cellpadding="0" border="1">
                            <tr>
                                <td style="width:100px;">钢管</td>
                                <td >
                                    <FormItem  label="计划支数：" prop='PlanNum'>
                                        <Input :maxlength="10" v-model='formValidate.PlanNum'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="计划重量(kg)：" prop='PlanWeight'class="label-80">
                                        <Input :maxlength="9" v-model='formValidate.PlanWeight'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="投入支数：" prop='UseNum'>
                                        <Input :maxlength="10" v-model='formValidate.UseNum'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="投入重量(kg)：" prop='UseWeight' class="label-80">
                                        <Input :maxlength="10" v-model='formValidate.UseWeight'></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td rowspan="2" >车丝支数</td>
                                <td >
                                    <FormItem  label="1#：" prop='CarWire1'>
                                        <Input :maxlength="10" v-model='formValidate.CarWire1'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="2#：" prop='CarWire2'>
                                        <Input :maxlength="10" v-model='formValidate.CarWire2'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="3#：" prop='CarWire3'>
                                        <Input :maxlength="10" v-model='formValidate.CarWire3'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="4#：" prop='CarWire4'>
                                        <Input :maxlength="10" v-model='formValidate.CarWire4'></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td >
                                    <FormItem  label="5#：" prop='CarWire5'>
                                        <Input :maxlength="10" v-model='formValidate.CarWire5'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="6#：" prop='CarWire6'>
                                        <Input :maxlength="10" v-model='formValidate.CarWire6'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                </td>
                                <td >
                                </td>
                            </tr>
                            <tr>
                                <td >机紧（支）</td>
                                <td >
                                    <FormItem  label="自产：" prop='MachineTight1'>
                                        <Input :maxlength="10" v-model='formValidate.MachineTight1'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="外购：" prop='MachineTight2'>
                                        <Input :maxlength="10" v-model='formValidate.MachineTight2'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    静水压（支）
                                </td>
                                <td >
                                    <FormItem  label="合格：" prop='JinShuiPressure'>
                                        <Input :maxlength="10" v-model='formValidate.JinShuiPressure'></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td >称重测长</td>
                                <td >
                                    <FormItem  label="支数：" prop='ChenCeNum'>
                                        <Input :maxlength="10" v-model='formValidate.ChenCeNum'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="长度（m）：" prop='ChenCeLength'>
                                        <Input :maxlength="10" v-model='formValidate.ChenCeLength'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="重量（kg）：" prop='ChenCeWeight'>
                                        <Input :maxlength="10" v-model='formValidate.ChenCeWeight'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                </td>
                            </tr>
                            <tr>
                                <td >成品包装</td>
                                <td >
                                    <FormItem  label="支数：" prop='BaoZhuangNum'>
                                        <Input :maxlength="10" v-model='formValidate.BaoZhuangNum'></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem  label="捆数：" prop='BaozhuangKunNum'>
                                        <Input :maxlength="4" v-model='formValidate.BaozhuangKunNum'></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem  label="长度（m）：" prop='BaozhuangLength'>
                                        <Input :maxlength="10" v-model='formValidate.BaozhuangLength'></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem  label="重量（kg）：" prop='BaozhuangWeight'>
                                        <Input :maxlength="10" v-model='formValidate.BaozhuangWeight'></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>成品入库</td>
                                <td>
                                    <FormItem  label="支数：" prop='StoreNum'>
                                        <Input :maxlength="10" v-model='formValidate.StoreNum'></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem  label="捆数：" prop='StoreKunNum'>
                                        <Input :maxlength="4" v-model='formValidate.StoreKunNum'></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem  label="长度（m）：" prop='StoreLength'>
                                        <Input :maxlength="10" v-model='formValidate.StoreLength'></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem  label="重量（kg）：" prop='StoreWeight'>
                                        <Input :maxlength="10" v-model='formValidate.StoreWeight'></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td >未入库</td>
                                <td>
                                    <FormItem  label="支数：" prop='NoStoreNum'>
                                        <Input :maxlength="10" v-model='formValidate.NoStoreNum'></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem label="重量（kg）：" prop='NoStoreWeight'>
                                        <Input :maxlength="10" v-model='formValidate.NoStoreWeight'></Input>
                                    </FormItem>
                                </td>
                                <td colspan="2"> 
                                    <FormItem label="填表人：" prop='ReportPerson'>
                                        <Input :maxlength="4" v-model='formValidate.ReportPerson'></Input>
                                    </FormItem>
                                </td>
                            </tr>
                        </table>       
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handlereset('typeInModal')">重置</Button>
                <Button type="primary" @click="handleSubmit('typeInModal')">保存</Button>
            </p>
        </Modal>
        <!-- 修改模态框 -->
        <Modal  class="modal-table-form daily-modal" v-model="editModal"  :mask-closable="false"  width="900px" class-name="vertical-center-modal">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>生产日进度数据录入</span>
            </p>
            <div class="" >
                <Form ref="editModal" :model="indexData" :rules="editRuleValidate" :label-width="50" inline :show-message="false"> 
                    <Card class="modal-formItem margin-bottom-10">
                        <FormItem label="分厂" prop='CpProdCmp_ID'>
                            <Select :transfer="true" style="width:100px;" v-model="indexData.CpProdCmp_ID">
                                <Option  v-for="item in ProdCmpName" :value="item.mid" :key="item.mid">{{item.mDepName}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="工段" prop='WorkSection_ID'>
                            <Select :transfer="true" v-model="indexData.WorkSection_ID" style="width:100px;" >
                                <Option  v-for="item in workSection" :value="item.comm_ID" :key="item.comm_ID" >{{item.subClass_Value}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="产品" prop='CP_TyID'>
                            <Select :transfer="true" v-model="indexData.CP_TyID" style="width:250px;" >
                                <Option  v-for="item in prodClass" :value="item.wp_ID" :key="item.wp_ID">{{item.pinMing}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="日期" prop='ProdDate'>
                            <DatePicker :options='options' :transfer="true" type="date" v-model="indexData.ProdDate" placement="bottom-end" placeholder="选择日期" style="width:120px"></DatePicker>
                        </FormItem>
                    </Card>
                    <div>
                        <table  class="table-common daily-table" cellspan="0" cellpadding="0" border="1">
                            <tr>
                                <td style="width:100px;">钢管</td>
                                <td >
                                    <FormItem  label="计划支数：" prop='PlanNum'>
                                        <Input :maxlength="10" v-model='indexData.PlanNum'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="计划重量(kg)：" prop='PlanWeight' class="label-80">
                                        <Input :maxlength="10" v-model='indexData.PlanWeight'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="投入支数：" prop='UseNum'>
                                        <Input :maxlength="10" v-model='indexData.UseNum'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="投入重量(kg)：" prop='UseWeight' class="label-80">
                                        <Input :maxlength="10" v-model='indexData.UseWeight'></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td rowspan="2">车丝支数</td>
                                <td >
                                    <FormItem  label="1#：" prop='CarWire1'>
                                        <Input :maxlength="10" v-model='indexData.CarWire1'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="2#：" prop='CarWire2'>
                                        <Input :maxlength="10" v-model='indexData.CarWire2'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="3#：" prop='CarWire3'>
                                        <Input :maxlength="10" v-model='indexData.CarWire3'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="4#：" prop='CarWire4'>
                                        <Input :maxlength="10" v-model='indexData.CarWire4'></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td >
                                    <FormItem  label="5#：" prop='CarWire5'>
                                        <Input :maxlength="10" v-model='indexData.CarWire5'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="6#：" prop='CarWire6'>
                                        <Input :maxlength="10" v-model='indexData.CarWire6'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                </td>
                                <td >
                                </td>
                            </tr>
                            <tr>
                                <td>机紧(支)</td>
                                <td >
                                    <FormItem  label="自产：" prop='MachineTight1'>
                                        <Input :maxlength="10" v-model='indexData.MachineTight1'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="外购：" prop='MachineTight2'>
                                        <Input :maxlength="10" v-model='indexData.MachineTight2'></Input>
                                    </FormItem>
                                </td>
                                <td >静水压（支）</td>
                                <td >
                                    <FormItem  label="合格：" prop='JinShuiPressure'>
                                        <Input :maxlength="10" v-model='indexData.JinshuiPressure'></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td >称重测长</td>
                                <td >
                                    <FormItem  label="支数：" prop='ChenCeNum'>
                                        <Input :maxlength="10" v-model='indexData.ChenCeNum'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="长度（m）：" prop='ChenCeLength'>
                                        <Input :maxlength="10" v-model='indexData.ChenCeLength'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                    <FormItem  label="重量（kg）：" prop='ChenCeWeight'>
                                        <Input :maxlength="10" v-model='indexData.ChenCeWeight'></Input>
                                    </FormItem>
                                </td>
                                <td >
                                </td>
                            </tr>
                            <tr>
                                <td >成品包装</td>
                                <td >
                                    <FormItem  label="支数：" prop='BaoZhuangNum'>
                                        <Input :maxlength="10" v-model='indexData.BaoZhuangNum'></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem  label="捆数：" prop='BaozhuangKunNum'>
                                        <Input :maxlength="4" v-model='indexData.BaozhuangKunNum'></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem  label="长度（m）：" prop='BaozhuangLength'>
                                        <Input :maxlength="10" v-model='indexData.BaozhuangLength'></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem  label="重量（kg）：" prop='BaozhuangWeight'>
                                        <Input :maxlength="10" v-model='indexData.BaozhuangWeight'></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>成品入库</td>
                                <td>
                                    <FormItem  label="支数：" prop='StoreNum'>
                                        <Input :maxlength="10" v-model='indexData.StoreNum'></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem  label="捆数：" prop='StoreKunNum'>
                                        <Input :maxlength="4" v-model='indexData.StoreKunNum'></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem  label="长度（m）：" prop='StoreLength'>
                                        <Input :maxlength="10" v-model='indexData.StoreLength'></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem  label="重量（kg）：" prop='StoreWeight'>
                                        <Input :maxlength="10" v-model='indexData.StoreWeight'></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td >未入库</td>
                                <td>
                                    <FormItem  label="支数：" prop='NoStoreNum'>
                                        <Input :maxlength="10" v-model='indexData.NoStoreNum'></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem label="重量（kg）：" prop='NoStoreWeight'>
                                        <Input :maxlength="10" v-model='indexData.NoStoreWeight'></Input>
                                    </FormItem>
                                </td>
                                <td colspan="2"> 
                                    <FormItem label="填表人：" prop='ReportPerson'>
                                        <Input  :maxlength="4" v-model='indexData.ReportPerson'></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            
                        </table>       
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose">取消</Button>
                <Button type="primary" @click="handleEdit('editModal')">保存</Button>
            </p>
        </Modal>
        <!-- 查看模态框 -->
        <Modal  class="modal-table-form daily-modal" v-model="lookModal"  :mask-closable="false"  width="900px" class-name="vertical-center-modal">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>生产日进度数据录入</span>
            </p>
            <div class="">
                    <div>
                        <table  class="table-common daily-table looktable" cellspan="0" cellpadding="0" border="1">
                            <tr>
                                <td style="width:100px;">钢管</td>
                                <td><span>计划支数：</span></td>
                                <td>{{indexData.PlanNum}}</td>
                                <td><p>计划重量(kg)：</p> </td>
                                <td>{{indexData.PlanWeight}}</td>
                                <td><span>投入支数：</span></td>
                                <td>{{indexData.UseNum}}</td>
                                <td><p>投入重量(kg)：</p></td>
                                <td>{{indexData.UseWeight}}</td>
                            </tr>
                            <tr>
                                <td rowspan="2">车丝支数</td>
                                <td><span>1#：</span></td>
                                <td>{{indexData.CarWire1}}</td>
                                <td><span>2#：</span></td>
                                <td>{{indexData.CarWire2}}</td>
                                <td><span>3#：</span></td>
                                <td>{{indexData.CarWire3}}</td>
                                <td><span>4#：</span></td>
                                <td>{{indexData.CarWire4}}</td>
                            </tr>
                            <tr>
                                <td class="align-right"><span>5#：</span></td>
                                <td class="align-center">{{indexData.CarWire5}}</td>
                                <td class="align-right"><span>6#：</span></td>
                                <td class="align-center">{{indexData.CarWire6}}</td>
                                <td class="align-right"></td>
                                <td class="align-right"></td>
                                <td class="align-right"></td>
                                <td class="align-right"></td>
                            </tr>
                            <tr>
                                <td>机紧(支)</td>
                                <td><span>自产：</span></td>
                                <td>{{indexData.MachineTight1}}</td>
                                <td><span>外购：</span></td>
                                <td>{{indexData.MachineTight2}}</td>
                                <td colspan="2" class="align-center"> 静水压（支）</td>
                                <td class="align-right"><span>合格：</span></td>
                                <td class="align-center">{{indexData.JinshuiPressure}}</td>
                            </tr>
                            <tr>
                                <td>称重测长</td>
                                <td><span>支数：</span></td>
                                <td>{{indexData.ChenCeNum}}</td>
                                <td><span>长度：</span></td>
                                <td>{{indexData.ChenCeLength}}</td>
                                <td><span>重量：</span></td>
                                <td>{{indexData.ChenCeWeight}}</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>成品包装</td>
                                <td><span>支数：</span></td>
                                <td>{{indexData.BaoZhuangNum}}</td>
                                <td><span>捆数：</span></td>
                                <td>{{indexData.BaozhuangKunNum}}</td>
                                <td><span>长度：</span></td>
                                <td>{{indexData.BaozhuangLength}}</td>
                                <td><span>重量：</span></td>
                                <td>{{indexData.BaozhuangWeight}}</td>
                            </tr>
                            <tr>
                                <td>成品入库</td>
                                <td><span>支数：</span></td>
                                <td>{{indexData.StoreNum}}</td>
                                <td><span>捆数：</span></td>
                                <td>{{indexData.StoreKunNum}}</td>
                                <td><span>长度：</span></td>
                                <td>{{indexData.StoreLength}}</td>
                                <td><span>重量：</span></td>
                                <td>{{indexData.StoreWeight}}</td>
                            </tr>
                            <tr>
                                <td>未入库</td>
                                <td><span>支数：</span></td>
                                <td>{{indexData.NoStoreNum}}</td>
                                <td><span>重量：</span></td>
                                <td>{{indexData.NoStoreWeight}}</td>
                                <td colspan="4" class="align-center"><span> 填表人：</span>{{indexData.ReportPerson}}</td>
                            </tr>
                        </table>       
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose">取消</Button>
                <Button type="primary" @click="handleClose">确定</Button>
            </p>
        </Modal>
    </div>
</template>

<script>
import base from '@/libs/base';

 export default {
        data () {
            return {
                isLock: true,
                currentRow: '',
                // 按钮控制
                isToCancel: false,
                isToReport: false,
                isToUpdate: false,
                isToDelete: false,
                typeInDate: '',               // 录入日期
                editModal: false,             // 修改模态框
                lookModal: false,             // 查看模态框
                recordModal: false,          // 录入模态框
                prodClassSelect: [],          // 产品类别下拉框
                ProdCmpNameSelect: 0,       // 第一个select下拉列表数据
                startDate: '',                // 起始日期
                endDate: '',                  // 截止日期
                prodClass: [],         
                ProdCmpName: [],
                workSection: [],  
                workSectionSelect: 0,   
                data1: [],                   // 表格数据
                skip: 0,                     // 数据起始值
                take: 10 ,                   // 一次获取的条数--一页显示的条数
                total: 100,                  // 数据总数
                pageCurrent: 1,              // 当前页
                pageSize: 10,                // 每页的数据
                indexData: {},               // 删除模态框所用的表格行数据
                options:{
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    }
                },
                columns: [     
                    {title: '状态',key: 'name',align: 'center',width: 60,
                        render: (h, params) => {
                            if( params.row.zIsLock == 3){
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'locked',
                                            size: '18',
                                            color: 'gray'
                                        }
                                    })
                                ])
                            }else{
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'unlocked',
                                            size: '18',
                                            color: 'yellowgreen'
                                        }
                                    })
                                ])
                            }
                        }
                    },        
                    {key: "zylPinMing", title: "产品类别",align: 'center',width: 240 },
                    {key: "depProdCmpName", title: "分厂",align: 'center'},
                    {key: "bcWorkSection", title: "工段",align: 'center'},
                    {key: "zStoreKunNum", title: "捆数",align: 'center'},
                    {key: "zStoreWeight", title: "重量",align: 'center'},
                    {key: "zPlanNum", title: "计划支数",align: 'center'},
                    {key: "zPlanWeight", title: "计划重量",align: 'center'},
                    {key: "zProdDate", title: "日期",align: 'center'},
                    {key: "zReportPerson", title: "填报人",align: 'center',width: 100 }
                ],
               // 提交的数据  也是验证表单绑定的数据
                formValidate:{
                    "ID": '',
                    "CpProdCmp_ID": '',
                    "ProdDate": new Date(),
                    "CP_TyID": "",
                    "WorkSection_ID": '',
                    "PlanNum": '',
                    "PlanWeight": '',
                    "UseNum": '',
                    "UseWeight": '',
                    "CarWire1": '',
                    "CarWire2": '',
                    "CarWire3": '',
                    "CarWire4":'',
                    "CarWire5": '',
                    "CarWire6": '',
                    "MachineTight1": '',
                    "MachineTight2": '',
                    "JinShuiPressure": '',
                    "ChenCeNum":'',
                    "ChenCeLength": '',
                    "ChenCeWeight": '',
                    "BaoZhuangNum": '',
                    "BaozhuangKunNum": '',
                    "BaozhuangLength":'',
                    "BaozhuangWeight": '',
                    "StoreNum":'',
                    "StoreKunNum": '',
                    "StoreLength": '',
                    "StoreWeight": '',
                    "NoStoreNum": '',
                    "NoStoreWeight": '',
                    "IsLock": '',
                    "ReportPerson": '',
                    "ReportDate": '',
                    "Remarks": ''
                },
                indexData:{
                    "ID": '',
                    "CpProdCmp_ID": '',
                    "ProdDate": '',
                    "CP_TyID": "",
                    "WorkSection_ID": '',
                    "PlanNum": '',
                    "PlanWeight": '',
                    "UseNum": '',
                    "UseWeight": '',
                    "CarWire1": '',
                    "CarWire2": '',
                    "CarWire3": '',
                    "CarWire4":'',
                    "CarWire5": '',
                    "CarWire6": '',
                    "MachineTight1": '',
                    "MachineTight2": '',
                    "JinShuiPressure": '',
                    "ChenCeNum":'',
                    "ChenCeLength": '',
                    "ChenCeWeight": '',
                    "BaoZhuangNum": '',
                    "BaozhuangKunNum": '',
                    "BaozhuangLength":'',
                    "BaozhuangWeight": '',
                    "StoreNum":'',
                    "StoreKunNum": '',
                    "StoreLength": '',
                    "StoreWeight": '',
                    "NoStoreNum": '',
                    "NoStoreWeight": '',
                    "IsLock": '',
                    "ReportPerson": '',
                    "ReportDate": '',
                    "Remarks": ''
                },
                // 表单验证
                typeInRuleValidate: {
                    CpProdCmp_ID: [
                        { required: true, trigger: 'change' }
                    ],
                    ProdDate: [
                        { required: true,type:'date',trigger: 'blur' }
                    ],
                    CP_TyID: [
                        { required: true, trigger: 'blur' },
                    ],
                    WorkSection_ID: [
                        { required: true, trigger: 'change' }
                    ],
                    PlanNum: [
                        { required: true,trigger: 'blur' }
                    ],
                    PlanWeight: [
                        { required: true,trigger: 'blur' },
                    ],
                    UseNum: [
                        {  required: true,trigger: 'change' }
                    ],
                    UseWeight: [
                        { required: true,trigger: 'blur' }
                    ],
                   
                },
                editRuleValidate: {
                    CpProdCmp_ID: [
                        { required: true,}
                    ],
                    WorkSection_ID: [
                        { required: true,}
                    ],
                    CP_TyID: [
                        { required: true, },
                    ],
                    PlanNum: [
                        { required: true,}
                    ],
                    PlanWeight: [
                        { required: true,},
                    ],
                    UseNum: [
                        {  required: true,}
                    ],
                    UseWeight: [
                        { required: true,}
                    ],
                },
            }   
        },
        methods: {
            dateStrat(val){
                this.startDate = val;
            },
            dateEnd(val){
                this.endDate = val;
            },
            //取消上报
            cancelReport(){
                const id = this.currentRow.zid;
                base.getAjaxData(base.baseURL + 'FCManage/Cp_DailyProgress?ID=' + id,(getData) => {
                    if(getData.results[0].isLock != 3){
                        getData.results[0].isLock = 1;
                        base.putAjaxData(base.baseURL + 'FCManage/Cp_DailyProgress',JSON.stringify(getData.results[0]),(putData) => {
                            this.$Message.success({duration: 3, content: '取消成功！'});
                            this.init();
                        });
                    }else{
                        this.$Message.info({duration: 5, content: '已锁定，需修改，请联系生产处！'});
                    }
                })
            },
            //上报
            supReport(){
                const id = this.currentRow.zid;
                this.$Modal.confirm({
                    title: '提醒消息',
                    content: '<p>确认上报生产处？</p>',
                    onOk: () => {
                        base.getAjaxData(base.baseURL + 'FCManage/Cp_DailyProgress?ID=' + id,(getData) => {
                            if(getData.results[0].isLock != 3){
                                getData.results[0].isLock = 2;
                                getData.results[0].reportDate = new Date();
                                base.putAjaxData(base.baseURL + 'FCManage/Cp_DailyProgress',JSON.stringify(getData.results[0]),() => {
                                    this.$Message.success({duration: 3, content: '上报成功！'});
                                    this.init();
                                })
                            }else{
                                this.$Message.info({duration: 5, content: '已锁定，需修改，请联系生产处！'});
                            }
                        })
                    },
                    onCancel: () => {
                        this.$Message.info({duration: 5, content: '取消上报！'});
                    }
                });
            },
            // 选行
            handleRow(data){
                this.currentRow = data;
                this.isToUpdate = true;
                if(data.zIsLock != 3){
                    this.isToDelete = true;
                    this.isToCancel = true;
                    this.isToReport = true;
                    this.isLock = false;
                }else{
                    this.isToDelete = false;
                    this.isToCancel = false;
                    this.isToReport = false;
                    this.isLock = true;
                }
            },
            handleLog (){
                this.recordModal = true;
                this.$refs.typeInModal.resetFields();
            },
            // 查看
            show () {
                    this.$refs.editModal.resetFields();
                    let rowDate = this.currentRow;
                    console.log(rowDate)
                    for(var key in this.formValidate){
                        let oKey =  key;
                        key = 'z' + key;
                        this.indexData[oKey] = rowDate[key];
                    }
                    this.indexData.ID = rowDate.zid;
                    this.indexData.CP_TyID = rowDate.zcP_TyID;
                    this.indexData.JinshuiPressure = rowDate.zJinshuiPressure
                    console.log(rowDate.zJinshuiPressure)
                    
                    console.log(this.indexData.JinshuiPressure)
                    this.isLock ? this.lookModal = true:this.editModal = true;
                    
            },
            // 删除
            remove () {
                let _self = this;
                const id = this.currentRow.zid;
                base.getAjaxData(base.baseURL + 'FCManage/Cp_DailyProgress?id='+id,(res) =>{
                    if(res.results[0].isLock != 3){
                        this.$Modal.confirm({
                            title: '提醒消息',
                            content: '<p>确定删除这条吗？</p>',
                            onOk: () => {
                                base.deleteAjaxData(base.baseURL + 'FCManage/Cp_DailyProgress?ID=' + id,(e) => {
                                    _self.$Message.success({duration: 3, content: '删除成功！'});
                                    _self.init();
                                });
                            },
                            onCancel: () => {
                                this.$Message.info({duration: 5, content: '取消删除！'});
                            }
                        });
                    }else{
                        this.$Message.waring({duration: 5, content: '当前数据已锁定，不可删除！请刷新页面'});
                    }
                });
                
            },
            // 清空
            clearQuery () {
                this.ProdCmpNameSelect = 0;      // 第一个select下拉列表数据
                this.workSectionSelect = 0;
                this.startDate = '';
                this.endDate = '';
            },
            // 查询函数
            btnQuery() {
                this.pageCurrent = 1;
                this.check(0, this.pageSize);
            },
            // 查询
            check(skip, take) {
                let para = {};
                
                para.Skip = skip;
                para.Take = take;

                para.orderByDesc = 'zProdDate';
            
                if(this.ProdCmpNameSelect) {
                    para.zCpProdCmp_ID = this.ProdCmpNameSelect;
                }
                   
                if(this.workSectionSelect) {
                    para.zWorkSection_ID = this.workSectionSelect;
                }
                
                if(this.prodClassSelect ){
                    para.zcP_TyID = this.prodClassSelect;
                }

                if(this.startDate) para['zProdDate>'] = base.dateFormat(this.startDate);
                if(this.endDate) para['zProdDate<'] = base.dateFormat(this.endDate);
                if(this.startDate && this.endDate) para.zProdDateBetween = base.dateFormat(this.startDate) + ',' + base.dateFormat(this.endDate);

                base.ajaxData('FCManage/Cp_DailyProgress_view', para, 'GET', (e) => {
                    e.results.forEach( (item) => {
                        if(item.zProdDate) item.zProdDate = item.zProdDate.substring(0,10);
                    });
                    this.data1 = e.results;
                    this.total = e.total;
                    this.initData();
                });
            },
            // 分页
            changePage (index) {
                this.pageCurrent = index;          // 当前页
                let _size = this.pageSize;         // 一页显示的条数
                let _skip = (index-1)*_size;       // 偏移量--数据的起始位置
                this.check(_skip,_size);
            },
            changePageSize (size) {
                this.pageSize = size;                //一页显示的条数
                let _current = this.pageCurrent;     //当前页
                let _skip = (_current-1)*size;       // 偏移量---数据的起始位置
                this.check(_skip, size);
            },
            handleEdit (name) {
               this.$refs[name].validate((valid) => {
                   console.log(this.indexData)
                    if (valid) {
                        let postData = this.indexData;
                        base.putAjaxData(base.baseURL + 'FCManage/Cp_DailyProgress',JSON.stringify(postData),(e) =>{
                            this.$Message.success({duration: 3, content: '修改成功！'});
                            this.changePage(this.pageCurrent)
                            this.editModal = false;
                            this.$refs[name].resetFields();
                        });
                    } else {
                        this.$Message.error({duration: 5, content: '保存失败!'});
                    }
                })
            },
            // 录入提交
            handleSubmit (name) {
               console.log(this.formValidate)
               this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.formValidate.IsLock = 1;
                        base.postAjaxData(base.baseURL + 'FCManage/Cp_DailyProgress',JSON.stringify(this.formValidate),(e) =>{
                            this.$Message.success({duration: 3, content: '录入成功！'});
                            this.changePage(this.pageCurrent);
                            this.recordModal = false;
                            this.$refs[name].resetFields();
                        });
                    } else {
                        this.$Message.error({duration: 5, content: '保存失败!'});
                    }
                })
            },
            handlereset(name){
                this.$refs[name].resetFields();
            },
            handleClose(){
               this.recordModal = false;
               this.lookModal = false;
               this.editModal = false;
            },
            initData(){
                this.currentRow = '';
                this.isToUpdate = false;
                this.isToDelete = false;
                this.isToCancel = false;
                this.isToReport = false;
            },
            init(){
                this.changePage(this.pageCurrent);
            }
        },
        // 获取数据
        mounted () {
            // 分厂
            base.ajaxData('PublicApi/Bs_commdep1_view?isEnable=1', {}, 'GET', (e) => {
                this.ProdCmpName = e.results;
            });
            // 工段
            base.ajaxData('PublicApi/Bs_comminfo_view?Comm_IDStartsWith=113&isEnable=1',{}, 'GET', (e) => {
                this.workSection = e.results;
            });
            // 品名
            base.ajaxData('PublicApi/Bs_goodsinfo_view?Wp_IDStartsWith=108&isEnable=1', {}, 'GET', (e) => {
                this.prodClass = e.results;
                this.prodClassSelect = e.results[0].wp_ID;
                this.init();
            });
        },
        watch : {
            total: function(val) {
                let num = this.pageSize*this.pageCurrent - 9;
                if(num > val) {
                    this.pageCurrent = this.pageCurrent - 1;
                    this.check(this.pageCurrent*this.pageSize-10, this.pageSize)
                }
            }
        }
    }
</script>
