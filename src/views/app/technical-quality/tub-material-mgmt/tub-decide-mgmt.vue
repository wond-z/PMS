<style lang="less" >
   @import '../../page-common.less';
   @import './tub-decide-mgmt.less';
</style>
<template>
    <div class="storage-notice-mgmt">
        <div class="margin-bottom-10">
            <div>
                <i-button type="primary" @click="lookBill()" icon="ios-search">查看/修改</i-button>
                <i-button type="primary" icon="forward">判定合格</i-button>
                <i-button type="primary" icon="reply" >取消判定</i-button>
            </div>
        </div>
        <card class="margin-bottom-10">
           <div class="select-col margin-bottom-10 " >
                <div class="div">
                    <label class="label" for="for" >原料:</label>
                    <Select :transfer="true" v-model="materiaSelect" class="select" >
                        <Option  value="全部">全部</Option>
                        <Option  v-for="item in materiaData" :value="item.pinMing" :key="item.pinMing" >{{ item.pinMing }}</Option> 
                    </Select>
                </div>
                <div class="div">
                    <label class="label" for="for">供货单位:</label>
                    <Select :transfer="true" v-model="supplierSelect" class="select" filterable>
                        <Option  value="全部" >全部</Option>
                        <Option  v-for="item in supplierData" :value="item.subClass_Value" :key="item.subClass_Value">{{item.subClass_Value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label" for="for" >库区:</label>
                    <Input  class="select" v-model="inputOne" placeholder="请输入入库序列号"></Input>
                </div>
                <div class="div">
                    <label class="label" for="for">使用单位:</label>
                    <Select :transfer="true" v-model="userSelect" class="select" >
                        <Option  value="全部" >全部</Option>
                        <Option  v-for="item in userData" :value="item.subClass_Value" :key="item.subClass_Value" >{{ item.subClass_Value }}</Option>
                    </Select >
                </div>
            </div>
            <div class="select-col">
                
                <div class="div">
                    <label class="label" for="for"  filterable>筛选状态:</label>
                    <Select :transfer="true" v-model="filtStateSelect" class="select" >
                        <Option  value="全部" >全部</Option>
                        <Option  v-for="item in filtStateData" :value="item.num" :key="item.num" >{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label" for="for">入库日期:</label>
                    <!-- <Date-picker :transfer="true"  type="daterange" placement="bottom-end" placeholder="选择日期" style="width:175px"></Date-picker> -->
                    <DatePicker :transfer="true" type="date" v-model="storageDate" placement="bottom-end" placeholder="起始日期" style="width:175px"></DatePicker>
                </div>
                <div class="div">   
                    <label class="label" for="for">至:</label>
                    <DatePicker :transfer="true" type="date" v-model="storageDate" placement="bottom-end" placeholder="截止日期" style="width:175px"></DatePicker>
                </div>
                <div class="div">
                    <i-button type="primary" @click="check()" icon="ios-search">查询</i-button>
                    <i-button type="primary" icon="ios-upload">导出</i-button>
                    <i-button type="primary" icon="social-dropbox-outline">清空条件</i-button>
                </div>
            </div>
        </card>
        <card class="margin-bottom-10">
            <Table class="margin-bottom-10" size="small" border  style="min-height:400px;" :columns="columns" :data="data"></Table>
            <div>
                <Page :total="total" :current="1" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
            </div>
        </card>
        <!-- 查看模态框 -->
        <Modal class="decide-notice modal-common " v-model="lookModal" icon="clipboard" :mask-closable="false" class-name="vertical-center-modal" width="800px" :styles="{top: '20px'}">
            <p slot="header" >
                <Icon type="clipboard" size="100px"></Icon>
                <span>产品判定入库通知书</span>
            </p>
            <div class="margin-bottom-10">
                <i-button type="primary"  icon="plus" size="small">保存</i-button>
                <i-button type="primary"  icon="ios-upload" size="small">导出excel</i-button>
                <i-button type="primary" icon="ios-close-empty" size="small">关闭</i-button>
                <div style="float:right;">
                    <span>第3张，共20张</span>
                    <i-button type="primary"  size="small">  <Icon type="ios-arrow-back"></Icon>  上一张  </i-button>
                    <i-button type="primary"  size="small"> 下一张  <Icon type="ios-arrow-forward"></Icon> </i-button>
                    <i-button type="primary" icon="plane" size="small" @click="sendOutBill()">发货单</i-button>
                </div>
            </div>
            <div>
                <h1 style="font-weight:lighter;text-align:center;margin-bottom:10px;">管材到(发)货登记表</h1>
                <div class="ivu-table ivu-table-border">
                    <Form ref="postForm" :model="formValidate" :rules="ruleValidate">
                        <table  class="table-common table-common-top margin-bottom-10" border="1" cellspacing='0'>
                            <tr>
                                <td colspan="1">重量单位:吨;</td>
                                <td colspan="3"></td>
                                <td colspan="2">编码：SYC/ZJ JZ-19；</td>
                            </tr>
                            <tr>
                                <td colspan="2">品名</td>
                                <td>规格</td>
                                <td colspan="2">供货单位</td>
                                <td>到货日期</td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                </td>
                                <td>73.02*5.51</td>
                                <td colspan="2">
                                </td>
                                <td>
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
                                </td>
                                <td>
                                </td>
                                <td>
                                </td>
                                <td>
                                </td>
                                <td><span></span></td>
                            </tr>
                            <tr>
                                <td>车皮号</td>
                                <td>支数</td>
                                <td>质保书量</td>
                                <td colspan="3">备注</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td colspan="3">
                                </td>
                            </tr>
                        </table>
                        <!-- <Table class="table-common" size="small" border  style="min-height:400px;" :columns="logColumns" :data="data"></Table> -->
                        <table class="table-common "border="1" cellspacing='0'>
                            <tr>
                                <td style="width:50px;">序号</td>
                                <td>炉号</td>
                                <td>批次</td>
                                <td>支数</td>
                                <td>重量</td>
                            </tr>
                            <tr v-for="(item,index) in lookModalData" :key="index">
                                <td style="width:50px;">{{index+1}}</td>
                                <td>{{item.luhao}}</td>
                                <td>{{item.pici}}</td>
                                <td>{{item.zhishu}}</td>
                                <td>{{item.zhongliang}}</td>
                            </tr>
                        </table>
                    </Form>
                </div>
            </div>    
            <div slot="footer">
           </div>
        </Modal>
        <!-- 发货单模态框 -->
        <Modal class="decide-notice modal-common" v-model="sendOutModal" icon="clipboard" :mask-closable="false"  width="800px" :styles="{top: '20px'}">
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
                <div class="ivu-table ivu-table-border">
                    <Form ref="postForm" :model="formValidate" :rules="ruleValidate">
                        <table  class="table-common table-common-top" border="1" cellspacing='0'>
                            <tr>
                                <td colspan="1">重量单位:吨;</td>
                                <td></td>
                                <td colspan="4"></td>
                                <td></td>
                                <td colspan="2">编码：SYC/ZJ JZ-19；</td>
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
                        <table class="table-common "border="1" cellspacing='0'>
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
                            <tr v-for="(item,index) in sendOutModalData" :key="index">
                                <td style="width:50px;">{{index+1}}</td>
                                <td>{{item.left.luhao}}</td>
                                <td>{{item.left.pici}}</td>
                                <td>{{item.left.zhishu}}</td>
                                <td>{{item.left.zhongliang}}</td>
                                <td style="width:50px;">{{index+16}}</td>
                                <td>{{item.right.luhao}}</td>
                                <td>{{item.right.pici}}</td>
                                <td>{{item.right.zhishu}}</td>
                                <td>{{item.right.zhongliang}}</td>
                            </tr>
                        </table>
                    </Form>
                </div>
            </div>    
            <div slot="footer">
           </div>
        </Modal>
        <!-- 原材料复验判定单 -->
        <Modal class="oil-decide-notice modal-common " v-model="materiaDecideModal" :mask-closable="false"  width="800px" >
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>原材料复验判定单</span>
            </p>
            <div class="margin-bottom-10">
                <i-button type="primary"  icon="ios-upload" size="small">导出excel</i-button>
                <i-button type="primary" icon="ios-close-empty" size="small">关闭</i-button>
            </div>
            <div>
                <h1 style="font-weight:lighter;text-align:center;margin-bottom:10px;">原材料复验判定单</h1>
                <div class="ivu-table ivu-table-border">
                    <Form ref="postForm" :model="formValidate" :rules="ruleValidate">
                        <table class="table-common" border="1" cellspacing='0'>
                            <tr>
                                <td colspan="2">供货厂家:天津无缝;</td>
                                <td ></td>
                                <td colspan="2">2017年11月20日</td>
                                <td ></td>
                                <td colspan="2">编码：SYC/ZJ-JZ-19</td>
                            </tr>
                            <tr>
                                <td >合同编号</td>
                                <td>-</td>
                                <td >产品名称</td>
                                <td colspan="2">油管光管</td>
                                <td >执行标准</td>
                                <td colspan="2">API Spec 5CT</td>
                            </tr>
                            <tr>
                                <td >钢级</td>
                                <td>-</td>
                                <td >规格</td>
                                <td colspan="2">J55</td>
                                <td >交货状态</td>
                                <td colspan="2">正火</td>
                            </tr>
                            <tr>
                                <td >炉号</td>
                                <td>-   </td>
                                <td >车号</td>
                                <td >1485469</td>
                                <td >重量</td>
                                <td >5000</td>
                                <td >支数</td>
                                <td >5</td>
                            </tr>
                            <tr>
                                <td colspan="2">抗拉强度</td>
                                <td colspan="2">屈服强度</td>
                                <td colspan="2">伸长率</td>
                                <td colspan="2">化学成分</td>
                            </tr>
                            <tr>
                                <td colspan="2"></td>
                                <td colspan="2"></td>
                                <td colspan="2"></td>
                                <td colspan="2"></td>
                            </tr>
                            <tr>
                                <td colspan="2">尺寸检查</td>
                                <td colspan="2">外观检查</td>
                                <td colspan="2">通径检验</td>
                                <td colspan="2">无损探伤</td>
                            </tr>
                            <tr>
                                <td colspan="2"></td>
                                <td colspan="2"></td>
                                <td colspan="2"></td>
                                <td colspan="2"></td>
                            </tr>
                            <tr rowspan="2">
                                <td >综合判定</td>
                                <td colspan="7"></td>
                            </tr>
                            <tr rowspan="2">
                                <td colspan="6"></td>
                                <td >判定员：</td>
                                <td >某某某</td>
                            </tr>
                            <tr rowspan="2" style="text-align:center;">
                                <td colspan="8">注：一式4分，生产安环处、技术质量处、销售处、物料中心各一份。</td>
                            </tr>
                        </table>
                    </Form>
                </div>
            </div>
           <div slot="footer">
           </div>
        </Modal>
        <!-- 验收记录模态框 -->
        <Modal class="check-table modal-common vertical-center-modal" v-model="materiaCheckModal" icon="clipboard" :mask-closable="false"  width="800px">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>原材料复验判定单</span>
            </p>
            <div class="margin-bottom-10">
                <i-button type="primary" icon="plus" size="small" @click="save">保存</i-button>
                <i-button type="primary" icon="ios-upload" size="small">导出excel</i-button>
            </div>
            <div>
                <h1 class="modalh1">油、套管原料入厂验收记录</h1>
                <table  class="table-common table-common-top table-common-bottom" cellspan="0" cellpadding="0" border="1">
                    <tr>
                        <td colspan="4"></td>
                        <td ></td>
                        <td colspan="5">2017年11月20日</td>
                        <td ></td>
                        <td colspan="4">编码：SYC/ZJ-JZ-19</td>
                    </tr>
                    <tr>
                        <td colspan="3">供货商</td>
                        <td colspan="3"></td>
                        <td colspan="2">钢级</td>
                        <td colspan="3">J55</td>
                        <td colspan="2">规格</td>
                        <td colspan="2">73.02*5.51</td>
                    </tr>
                    <tr>
                        <td colspan="3">车号</td>
                        <td colspan="2">12</td>
                        <td></td>
                        <td colspan="2"></td>
                        <td colspan="2">批重量t</td>
                        <td colspan="2">24.000 </td>
                        <td colspan="2">批支数</td>
                        <td>2</td>
                    </tr>
                     <tr>
                        <td colspan="3" rowspan="2">化学成分</td>
                        <td>C</td>
                        <td>Si</td>
                        <td>Mn</td>
                        <td>P</td>
                        <td>S</td>
                        <td>Cr</td>
                        <td>Ni</td>
                        <td>Cu</td>
                        <td>V</td>
                        <td>Ti</td>
                        <td>B</td>
                        <td>Mo</td>
                    </tr>
                    <tr>
                        <td>合格</td>
                        <td></td>
                        <td></td>
                        <td>合格</td>
                        <td>合格</td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                    </tr>
                    <tr>
                        <td colspan="3" rowspan="2">力学性能</td>
                        <td colspan="4">抗拉强度 Rm,Mpa</td>
                        <td colspan="4">屈服强度 Ys,Mpa</td>
                        <td colspan="4">伸长率 &，%</td>
                    </tr>
                    <tr>
                        <td colspan="4">合格</td>
                        <td colspan="4">合格</td>
                        <td colspan="4">合格</td>
                    </tr>
                    <tr>
                        <td rowspan="2" colspan="1">序号</td>
                        <td rowspan="2" colspan="3">外径范围<span class="modaltdText">73.02 (+0.79) mm</span></td>
                        <td rowspan="2" colspan="4">壁厚范围<span class="modaltdText">5.51 (-0.11~+0.61) mm</span></td>
                        <td rowspan="2" colspan="3">长度范围<span class="modaltdText">(9.2~9.7) m</span></td>
                        <td             colspan="2">直度mm</td>
                        <td rowspan="2" colspan="2">表面质量</td>
                    </tr>
                    <tr>
                        <td>全长</td>
                        <td>端部</td>
                    </tr>
                    <tr v-for="(item, index) in materiaCheckData" :key="index">
                         <td style="width:50px;">{{index+1}}</td>
                         <td colspan="3"><Input v-model="materiaCheckData[index].waijing"></Input></td>
                         <td colspan="4"><Input v-model="materiaCheckData[index].bihou"></Input></td>
                         <td colspan="3"><Input v-model="materiaCheckData[index].changdu"></Input></td>
                         <td colspan="2">合格</td>
                         <td colspan="2">合格</td>
                    </tr>
                    <tr>
                        <td rowspan="2"style="min-height:48px">备   注：</td>
                        <td rowspan="2" colspan="14"></td>
                    </tr>
                    <tr>
                    </tr>
                    <tr>
                        <td colspan="12"></td>
                        <td colspan="1">质检员：</td>
                        <td colspan="2">系统管理员</td>
                    </tr>
                </table>
            </div>
            <!-- <div slot="footer">
            </div> -->
        </Modal>
    </div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        return {
            ArrivalGoodsDate:'',
            lookModalData:[],
            sendOutModalData:[],
            materiaCheckData:[],
            sendOutModal:false,          // 发货单弹出框
            lookModal: false,            // 查看模态框
            materiaDecideModal: false,   // 原料复验判定模态框
            materiaCheckModal: false,    // 原料复验验收模态框
            materiaSelect: '油管光管 J55 73.02*5.51',           // 原料下拉框
            supplierSelect: '西安玛柯特',          // 供货单位下拉框
            userSelect:[],               // 使用单位下来框
            filtStateSelect:[],          // 筛选状态下拉框
            storageDate: '',
            options: '',                 // 用来存储查询函数的帅选字段
            materiaData: [],             // 第一个select下拉列表数据
            data: [],                    // 表格数据
            supplierData:[],             // 第二个select下拉列表数据
            userData:[],                 // 第三个select下拉列表数据
            filtStateData:[],            // 筛选状态数据
            skip: 0,                     // 数据起始值
            take: 10 ,                   // 一次获取的条数--一页显示的条数
            total: 100,                  // 数据总数
            pageCurrent: 1,              // 当前页
            inputOne: '',                // 拼音检索input的值    
            inputTwo: '',
            pageSize: 10,                // 每页的数据
            indexData: [],               // 删除模态框所用的表格行数据
            columns: [                   // 表格表头/列信息
                {type: 'selection',width: 30,align:"center","fixed": "left",},
                {title: '车号',key: 'zCarNo',align:"center","width": 60,"fixed": "left","sortable": true},
                {title: '品名',key: 'zylPinMing',align:"center","width": 225,"sortable": true},
                {title: '供货单位', key: 'zylSupCmp',"sortable": true,"width": 100,align:"center"},
                {title: '榜重1', key: 'zPoundWeight1',"sortable": true,"width": 60,align:"center"},
                {title: '榜重2', key: 'zPoundWeight2', "sortable": true,"width": 60,align:"center"},
                {title: '榜重合计',key: 'zPoundWeight',"sortable": true,"width": 80,align:"center"},
                {title: '质保书量',key: 'installationAddress',"sortable": true,"width": 80,align:"center"},
                {title: '磅差',key: 'installationAddress',"sortable": true,"width": 60,align:"center"},
                {title: '支数',key: 'zNumber',"sortable": true,"width": 60,align:"center"},
                {title: '分厂',key: 'zylUseCmp',"sortable": true,"width": 60,align:"center"},
                {title: '库区',key: 'zStoreArea',"sortable": true,"width": 60,align:"center"},
                {title: '明细',key: 'zDetailNum',"sortable": true,"width": 60,align:"center"},
                {title: '日期',key: 'zArrivalGoodsDate',"sortable": true,"width": 120,align:"center"},
                {title: '状态',key: 'storeStatus',"sortable": true,"width": 60,align:"center"},
                {title: '入库单',key: 'installationAddress',"sortable": true,"width": 60,align:"center"},
                {title: '质检员',key: 'inspector',"sortable": true,"width": 70,align:"center"},
                {title: '检测报告',key: '',"sortable": true,"width": 90,align:"center"},
                {title: '操作',"sortable": true,"width": 60,align:"center",width: 250,key: 'handle',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'default',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.show(params.index)
                                    }
                                }
                            }, '验收记录'),
                            h('Button', {
                                props: {
                                    type: 'default',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.modify(params.index)
                                    }
                                }
                            }, '判定书'),
                        ]);
                    }
                } 
            ],
            modelColumnsOne: [        
                {key: "subClass_Value", title: "产品类别",align: 'center',},
                {key: "steelGrade", title: "钢级",align: 'center', },
                {key: "specifications", title: "规格",align: 'center', },
                {key: "pinyin", title: "技术条件",align: 'center',width: 100 },
                {key: "unit", title: "总重量",align: 'center', },
                {key: "threadType", title: "总长度",align: 'center', },
                {key: "pinyin", title: "总支数",align: 'center',width: 100 },
                {key: "lengthRange", title: "总件数",align: 'center', },
                {key: "pinyin", title: "入库序号",align: 'center',width: 100 },
                {key: "isEnable", title: "库区",align: 'center',},
            ],
            modelColumnsTwo: [        
                {key: "subClass_Value", title: "原料供货商",align: 'center', render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},                  
                {key: "steelGrade", title: "炉号",align: 'center',render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},    
                {key: "specifications", title: "捆数编号",align: 'center',render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},   
                {key: "pinyin", title: "捆重量kg",align: 'center',width: 100 , render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},    
                {key: "unit", title: "捆长度m",align: 'center',  render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},   
                {key: "threadType", title: "支数",align: 'center', render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},   
                {key: "pinyin", title: "总支数",align: 'center',width: 100, render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},   
                {key: "lengthRange", title: "总件数",align: 'center',render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},   
                {key: "pinyin", title: "入库序号",align: 'center',width: 100 , render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},   
                {key: "isEnable", title: "库区",align: 'center', render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},   
            ],
            logColumns:[//录入表格的列
                {title: ' ', type:'index', "width": 50,align:"center"},
                {title: '炉号', key: 'FurnaceNo', "width": 250,align:"center"},
                {title: '批次', key: 'Batch',align:"center"},
                {title: '支数', key: 'Number',align:"center"},
                {title: '重量', key: 'Weight',align:"center"},
            ],
            // 提交的数据  也是验证表单绑定的数据
            formValidate:{
                "ID": "int",
                "Class_ID": "",
                "CsubClass_ID": "",
                "SubClass_Value": "",
                "SubSubClass_ID": "",
                "SteelGrade": "",
                "Specifications": "",
                "Unit": "",
                "UunitPrice": 0,
                "StockNum": "int",
                "StockWeight": 0,
                "YJ_UpLimit": 0,
                "YJ_DownLimit": 0,
                "TecSpecifications": "",
                "PhysicalPara": "",
                "ChemicalPara": "",
                "TestMethod": "",
                "StandardRequire": "",
                "ThreadType": "",
                "LengthRange": "",
                "IsEnable":'int',
                "UpDateTime": "int",
                "Remark": ""
            },
            // 表单验证的规则
            ruleValidate: {
                class_ID: [
                    { required: true, message: '分类不能为空', trigger: 'change' }
                ],
                subClass_Value: [
                    { required: true, message: '公司简称不能为空', trigger: 'blur' },
                    { type: 'string', min: 5, message: 'Introduce no less than 20 words', trigger: 'blur' }
                ],
                specifications: [
                    { required: true, message: '产品规格不能为空', trigger: 'blur' },
                ],
                steelGrade: [
                    { required: true, message: '产品钢级不能为空', trigger: 'blur' },
                    // { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
                ],
                isEnable: [
                    { type: 'boolean', required: true,  trigger: 'blur' },
                ],
                cmp_Adress: [
                    // { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
                ]
            },
            filtStateData:[//状态列表
                {num:0,value:'全部显示记录'},
                {num:1,value:'仅显示未送检记录'},
                {num:2,value:'仅显示待判记录'},
                {num:3,value:'显示已合格记录'},
                {num:4,value:'仅显示已发货记录'},
            ],
        }
    },
    methods: {
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
        // 修改数据模态框---确认
        amend () {
            let input = document.querySelectorAll(input);
            base.putAjaxData(base.baseURL + '/PublicApi/Bs_CommInfo',JSON.stringify(this.indexData));
            alert("提交成功")
        },
        // 表格里面的单行修改模态框
        modify (index) {
            this.materiaDecideModal = true;
            this.indexData = this.data[index];
        },
        show (index) {
            this.materiaCheckModal = true;
            this.indexData = this.data[index];
            this.materiaCheckData = [];
            for(var i=0; i<15; i++){
                this.materiaCheckData.push(
                    { waijing: base.randomNum(73.02, 73.81), bihou: base.randomNum(5.4, 6.12), changdu: base.randomNum(9.2, 9.7)}
                );
            }
        },
        save () {
            console.log(this.materiaCheckData)
        },
        // 表格里面单行删除
        remove (index) {
            let _self = this;
            this.$Modal.confirm({
                title: '提醒消息',
                content: '<p>确定删除这条吗？</p>',
                onOk: () => {
                    this.$Message.info('删除成功！');
                    base.deleteAjaxData(base.baseURL + '/PublicApi/bs_goodsinfo?ID=' + this.data[index].id,(e)=>{
                        _self.changePage(_self.pageCurrent)
                    });
                },
                onCancel: () => {
                    this.$Message.info('您取消了删除');
                }
            });  
        },
        // 查询函数
        check(skip,take){
                this.options = '';              // 清空options
                let _self = this;
            if(this.materiaSelect){
                this.options = '&pinMing='+this.materiaSelect;
            }
            if(this.supplierSelect){
                this.options = '&subClass_Value='+this.supplierSelect;
            }
            if( skip == undefined ) skip = 0;                 
            if( take == undefined ) take = this.pageSize;   
            base.getAjaxData(base.baseURL + '/PublicApi/bs_goodsinfo?Skip=' + skip + '&take=' + take + this.options, (e)=>{
                _self.data = e.results;
                _self.total = e.total;
            })
        },
        // 分页
        changePage (index) {
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
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
        // 表单提交
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                let _self = this;
                if (valid) {
                    if( _self.isEnable == false){
                        _self.isEnable = 2;
                    }else{
                        _self.isEnable = 1;
                    }
                    base.postAjaxData(base.baseURL + '/PublicApi/Bs_GoodsInfo',JSON.stringify(this.formValidate));
                    this.$Message.success('登记保存成功,您可以继续登记下条记录,或者关闭登记窗口!');
                    this.check();
                } else {
                    this.$Message.error('保存失败');
                }
            })
        },
        // 表单重置
        handleReset (name) {
            this.$refs[name].resetFields();
        },
        lookBill(){
            this.lookModal = true ;
            this.lookModalData = [];
            for(var i = 0;i < 15;i++){
                this.lookModalData.push({
                });
            }
            for(var i = 0;i < 1;i++){
                if(i < 15)this.lookModalData[i].left = {luhao:'l'+i,pici:'l'+i,zhishu:'l'+i,zhongliang:'l'+i};
            }
        },
        sendOutBill(){
            this.sendOutModal = true ;
            this.sendOutModalData = [];
            for(var i = 0;i < 15;i++){
                this.sendOutModalData.push({
                    left:{},
                    right:{}
                });
            }
            for(var i = 0;i < 1;i++){
                if(i < 15)this.sendOutModalData[i].left = {luhao:'l'+i,pici:'l'+i,zhishu:'l'+i,zhongliang:'l'+i};
                if(i >= 15)this.sendOutModalData[i-15].right = {luhao:'r'+i,pici:'r'+i,zhishu:'r'+i,zhongliang:'r'+i};
            }
        },
        

    },
    // 获取数据
    mounted () {
        // 表格获取的全部数据
        let _self = this;
        base.getAjaxData(base.baseURL + 'WlCenter/Yl_arrivalrecdetail_view?Skip=' + this.skip + '&take=' + this.take, (e) => {
            _self.data = e.results;
            _self.total = e.total;
        })
        // 下拉列表数据
        base.getAjaxData(base.baseURL+'/PublicApi/Bs_goodsinfo_view?Skip=' + this.skip + '&take=' + this.take,(e)=>{
            _self.materiaData = e.results;
            _self.total = e.total;
            });
        // 下拉列表数据
        base.getAjaxData(base.baseURL+'/PublicApi/Bs_CommInfo?Skip=' + this.skip + '&take=' + this.take,(e)=>{
            _self.supplierData = e.results;
            _self.total = e.total;
            });
        // 下拉列表数据
        base.getAjaxData(base.baseURL+'/PublicApi/Bs_CommInfo?Skip=' + this.skip + '&take=' + this.take,(e)=>{
            _self.userData = e.results;
            _self.total = e.total;
            });
    },
        watch: {
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
