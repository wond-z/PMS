<style lang="less">
 @import './outsourcing_coupling.less';
</style>

<template>
    <div class="table-component-common">
        <div class="margin-bottom-10">
            <Button type="primary" @click="look" icon="ios-search" :disabled="btnLook">查看</Button>
            <Button type="primary" @click="conformity" icon="forward" :disabled="btnJudgePass">判定合格</Button>
            <Button type="primary" @click="conformityRecall" icon="reply" :disabled="btnJudgeRecall">取消判定</Button>
        </div>
        <Card class="margin-bottom-10 padding-top-bottom-minish">
           <div class="select-col">
                <div class="div">
                    <label class="label">原料</label>
                    <Select  v-model="selectMateria" class="select li-width">
                        <Option v-for="item in materiaData" :value="item.pinMing" :key="item.pinMing" >{{ item.pinMing }}</Option> 
                    </Select>
                </div>
                <div class="div">
                    <label class="label">供货单位</label>
                    <Select :transfer="true" v-model="selectSupplier" class="select" filterable>
                        <Option :value="0">全部</Option>
                        <Option v-for="item in supplierData" :value="item.subClass_Value" :key="item.subClass_Value">{{item.subClass_Value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">库区</label>
                    <Input class="select" v-model="inputRepository" placeholder="请输入入库序列号"></Input>
                </div>
                <div class="div">
                    <label class="label">使用单位</label>
                    <Select :transfer="true" v-model="selectDeptm" class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in deptmData" :value="item.mDepName" :key="item.mDepName" >{{ item.mDepName }}</Option>
                    </Select >
                </div>
                <div class="div">
                    <label class="label" filterable>筛选状态</label>
                    <Select :transfer="true" v-model="selectFiltState" class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in filtStateData" :value="item.value" :key="item.value" >{{ item.text }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">入库日期</label>
                    <DatePicker :options="options" :transfer="true" type="date" :value="startDate" placement="bottom-end" placeholder="起始日期" @on-change="dateStrat"></DatePicker>
                </div>
                <div class="div">   
                    <label class="label">至</label>
                    <DatePicker :options="options" :transfer="true" type="date" :value="endDate" placement="bottom-end" placeholder="截止日期" @on-change="dateEnd"></DatePicker>
                </div>
                <Button type="primary" @click="btnCheck()" icon="ios-search">查询</Button>
                <Button type="primary" icon="ios-upload">导出</Button>
                <Button type="primary" icon="social-dropbox-outline" @click="clear()">清空条件</Button>
            </div>
        </Card>
        <Card class="margin-bottom-10">
            <Table class="margin-bottom-10" highlight-row ref="currentRowTable" @on-current-change="selectRow" :columns="columns" :data="data" size="small" border style="min-height:400px;"></Table>
            <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement="top"></Page>
        </Card>
        <!-- 查看模态框 -->
        <Modal class="outsourcing-modal modal-table-form" v-model="lookModal" icon="clipboard" :mask-closable="false" width="800px" :styles="{top: '0'}">
            <p slot="header" >
                <Icon type="clipboard" size="100px"></Icon>
                <span>管材到(发)货登记表</span>
            </p>
            <div>
                <Form ref="postForm" :model="formValidate" :rules="ruleValidate">
                    <table  class="look-table table-common-tworow table-common table-common-top margin-bottom-10" border="0" cellspacing='0'>
                        <tr>
                            <td colspan="6" class="table-title">管材到(发)货登记表</td>
                        </tr>
                        <tr>
                            <td colspan="2">重量单位：吨</td>
                            <td colspan="2"></td>
                            <td colspan="2">编码：SYC/ZJ JZ-19</td>
                        </tr>
                        <tr>
                            <td colspan="2">品名</td>
                            <td>规格</td>
                            <td colspan="2">供货单位</td>
                            <td>到货日期</td>
                        </tr>
                        <tr>
                            <td colspan="2">{{ rowData.cSubClass_Value }}</td>
                            <td>{{ rowData.cSpecifications }}</td>
                            <td colspan="2">{{ rowData.zylSupCmp }}</td>
                            <td>{{ arrivalGoodsDate }}</td>
                        </tr>
                        <tr>
                            <td colspan="2">使用单位</td>
                            <td>存储库区</td>
                            <td>磅重一</td>
                            <td>磅重二</td>
                            <td>磅重合计</td>
                        </tr>
                        <tr>
                            <td colspan="2">{{ rowData.zylUseCmp }}</td>
                            <td>{{ rowData.zStoreArea }}</td>
                            <td>{{ rowData.zPoundWeight1 }}</td>
                            <td>{{ rowData.zPoundWeight2 }}</td>
                            <td>{{ rowData.zPoundWeight }}</td>
                        </tr>
                        <tr>
                            <td>车皮号</td>
                            <td>支数</td>
                            <td>质保书量</td>
                            <td colspan="3">备注</td>
                        </tr>
                        <tr>
                            <td>{{ rowData.zCarNo }}</td>
                            <td>{{ rowData.zNumber }}</td>
                            <td>{{ rowData.zStandardWeight }}</td>
                            <td colspan="3">{{ rowData.zRemark }}</td>
                        </tr>
                        <tr>
                            <td style="width:50px;">序号</td>
                            <td colspan="2">炉号</td>
                            <td>批次</td>
                            <td>支数</td>
                            <td>重量</td>
                        </tr>
                        <tr v-for="(item,index) in lookModalData">
                            <td style="width:50px;">{{index+1}}</td>
                            <td colspan="2">{{item.furnaceNo}}</td>
                            <td>{{item.batch}}</td>
                            <td>{{item.number}}</td>
                            <td>{{item.weight}}</td>
                        </tr>
                    </table>
                </Form>
               
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="lookModal=false">取消</Button>
                <Button type="primary"@click="lookModal=false">确认</Button>
            </p>
        </Modal>
        <!-- 判定书 -->
        <Modal class="outsourcing-modal modal-table-form" class-name="vertical-center-modal" v-model="materiaJudgeModal" :mask-closable="false" width="800px" >
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>原材料复验判定单</span>
            </p>
            <Button type="primary"  icon="ios-upload" size="small">导出excel</Button>
            <div>
                <Form ref="postForm" :model="formValidate" :rules="ruleValidate">
                    <table class="table-common decide-table table-common-tworow table-common-top table-common-bottom" border="1" cellspacing='0'>
                        <tr>
                            <td colspan="8" class="table-title">原材料复验判定单</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="align-left">供货厂家: {{ rowData.zylSupCmp }}</td>
                            <td ></td>
                            <td colspan="2">日期：{{ judgeDate }}</td>
                            <td ></td>
                            <td colspan="2" class="align-right">编码：SYC/ZJ-JZ-19</td>
                        </tr>
                        <tr>
                            <td >合同编号</td>
                            <td>-</td>
                            <td >产品名称</td>
                            <td colspan="2">{{ rowData.cSubClass_Value }}</td>
                            <td >执行标准</td>
                            <td colspan="2">{{ rowData.zExecutionStandard }}</td>
                        </tr>
                        <tr>
                            <td >钢级</td>
                            <td>{{ rowData.cSteelGrade }}</td>
                            <td >规格</td>
                            <td colspan="2">{{ rowData.cSpecifications }}</td>
                            <td >交货状态</td>
                            <td colspan="2">{{ rowData.zDeliveryState }}</td>
                        </tr>
                        <tr>
                            <td >炉号</td>
                            <td>-   </td>
                            <td >车号</td>
                            <td >{{ rowData.zCarNo }}</td>
                            <td >重量</td>
                            <td >{{ rowData.zPoundWeight }}</td>
                            <td >支数</td>
                            <td >{{ rowData.zNumber }}</td>
                        </tr>
                        <tr>
                            <td colspan="2">抗拉强度</td>
                            <td colspan="2">屈服强度</td>
                            <td colspan="2">伸长率</td>
                            <td colspan="2">化学成分</td>
                        </tr>
                        <tr>
                            <td colspan="2">{{ materiaStatus }}</td>
                            <td colspan="2">{{ materiaStatus }}</td>
                            <td colspan="2">{{ materiaStatus }}</td>
                            <td colspan="2">{{ materiaStatus }}</td>
                        </tr>
                        <tr>
                            <td colspan="2">尺寸检查</td>
                            <td colspan="2">外观检查</td>
                            <td colspan="2">通径检验</td>
                            <td colspan="2">无损探伤</td>
                        </tr>
                        <tr>
                            <td colspan="2">{{ materiaStatus }}</td>
                            <td colspan="2">{{ materiaStatus }}</td>
                            <td colspan="2">{{ materiaStatus }}</td>
                            <td colspan="2">{{ materiaStatus }}</td>
                        </tr>
                        <tr rowspan="2">
                            <td >综合判定</td>
                            <td colspan="7">{{ materiaStatus }}</td>
                        </tr>
                        <tr>
                            <td colspan="8" style="text-align: left;">注：一式4分，生产安环处、技术质量处、销售处、物料中心各一份。</td>
                        </tr>
                        <img v-if="materiaStatus=='合格'" src="../../../../images/stamp.png" alt="" style="position: absolute; right: 20px; bottom: 50px;">
                    </table>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="materiaJudgeModal=false">取消</Button>
                <Button type="primary"@click="materiaJudgeModal=false">确认</Button>
            </p>
        </Modal>
        <!-- 验收记录 -->
        <Modal class="outsourcing-modal modal-table-form" v-model="materiaCheckModal" @on-cancel="cancelMateriaCheck" icon="clipboard" :mask-closable="false" width="800px" :styles="{top: '0'}">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>成品接箍螺纹验收记录</span>
            </p>
            <Button type="primary" icon="ios-upload" size="small">导出excel</Button>
            <div>
                <table  class="check-table table-common table-common-tworow table-common-top table-common-bottom" cellspan="0" cellpadding="0" border="1">
                    <tr>
                        <td colspan="11" class="table-title">成品接箍螺纹验收记录</td>
                    </tr>
                    <tr>
                        <td colspan="3"></td>
                        <td colspan="5">日期：{{ judgeDate }}</td>
                        <td colspan="3" style="text-align: right;">编码：SYC/ZJ-JZ-19</td>
                    </tr>
                    <tr>
                        <td>供货商</td>
                        <td>{{ rowData.zylSupCmp }}</td>
                        <td>品名</td>
                        <td colspan="2">{{ rowData.cSubClass_Value }}</td>
                        <td>钢级</td>
                        <td>{{ rowData.cSteelGrade }}</td>
                        <td colspan="2">规格</td>
                        <td colspan="2">{{ rowData.cSpecifications }}</td>
                    </tr>
                    <tr>
                        <td>车号</td>
                        <td>{{ rowData.zCarNo }}</td>
                        <td>炉号</td>
                        <td colspan="2">-</td>
                        <td>批重量</td>
                        <td>{{ rowData.zPoundWeight }}</td>
                        <td colspan="2">批支数</td>
                        <td colspan="2">{{ rowData.zNumber }}</td>
                    </tr>
                    <tr>
                        <td>接箍编号</td>
                        <td>锥度<span class="modaltdText">(mm/m)</span></td>
                        <td>螺距<span class="modaltdText">(10ˉ³in)</span></td>
                        <td>齿高<span class="modaltdText">(10ˉ³in)</span></td>
                        <td>承载面度<span class="modaltdText">(b,mm)</span></td>
                        <td>紧密距<span class="modaltdText">(mm)</span></td>
                        <td>最小长度<span class="modaltdText">(N<sub>L</sub>,mm)</span></td>
                        <td>接箍外径<span class="modaltdText">(W,mm)</span></td>
                        <td>镗孔深度<span class="modaltdText">(q,mm)</span></td>
                        <td>镗孔直径<span class="modaltdText">(Q,mm)</span></td>
                        <td>结论</td>
                    </tr>
                    <tr v-for="(item, index) in materiaCheckData" :key="index">
                        <td style="width:50px;">{{index+1}}</td>
                        <td><Input v-model="materiaCheckData[index].zhuiDu"></Input></td>
                        <td><Input v-model="materiaCheckData[index].luoJu"></Input></td>
                        <td><Input v-model="materiaCheckData[index].chiGao"></Input></td>
                        <td><Input v-model="materiaCheckData[index].chenZaiMD"></Input></td>
                        <td><Input v-model="materiaCheckData[index].jinMiJu"></Input></td>
                        <td><Input v-model="materiaCheckData[index].minLength"></Input></td>
                        <td><Input v-model="materiaCheckData[index].jieGuWDiameter"></Input></td>
                        <td><Input v-model="materiaCheckData[index].tangKuDepth"></Input></td>
                        <td><Input v-model="materiaCheckData[index].tangKunZDiameter"></Input></td>
                        <td><Input v-model="materiaCheckData[index].conclusion"></Input></td>
                    </tr>
                    <tr>
                        <td>备 注</td>
                        <td colspan="10"></td>
                    </tr>
                    <tr>
                    </tr>
                    <tr>
                        <td colspan="9"></td>
                        <td colspan="2" style="text-align: right;">质检员：{{ rowData.zInspector }}</td>
                    </tr>
                </table>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="cancelMateriaCheck">取消</Button>
                <Button type="primary" :disabled="btnUpdateMateriaCheck" @click="updateMateriaCheck">更新</Button>
            </p>
        </Modal>
    </div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        return {
            // 筛选条件数据
            selectMateria: '成品套管接箍 N80Q 153.67*13',
            selectSupplier: 0,
            inputRepository: '',
            selectDeptm: 0,
            selectFiltState: 0,
            materiaData: [],
            supplierData: [],
            deptmData: [],
            filtStateData: [
                // { text: '显示全部记录', value: 0 },
                { text: '显示未送检记录', value: 1 },
                { text: '显示待判记录', value: 2 },
                { text: '显示已合格记录', value: 3 },
                { text: '显示已发货记录', value: 4 }
            ],
            startDate: '',
            endDate: '',
            options:{
                disabledDate(date){
                    return date.valueOf() > Date.now();
                }
            },
            // 表格及分页数据
            data: [],
            total: 100,
            pageCurrent: 1,
            pageSize: 10,
            skip: 0,
            columns: [
                // {type: 'selection', width: 30, align:"center", fixed: "left"},
                {title: '车号', key: 'zCarNo', align:"center", width: 80},
                {title: '品名', key: 'zylPinMing', align:"center", width: 180},
                {title: '供货单位', key: 'zylSupCmp', width: 100, align:"center"},
                {title: '榜重1', key: 'zPoundWeight1', width: 60, align:"center"},
                {title: '榜重2', key: 'zPoundWeight2', width: 60, align:"center"},
                {title: '榜重合计', key: 'zPoundWeight', width: 80, align:"center"},
                {title: '质保书量', key: 'zStandardWeight', width: 80, align:"center"},
                {title: '磅差', key: '', width: 60, align:"center",
                    render: (h, params) => {
                        let res = (params.row.zPoundWeight-params.row.zStandardWeight).toFixed(2);
                        return res;
                    }
                },
                {title: '支数', key: 'zNumber',width: 60, align:"center"},
                {title: '分厂', key: 'zylUseCmp',width: 60, align:"center"},
                {title: '库区', key: 'zStoreArea',width: 60, align:"center"},
                {title: '明细', key: 'zDetailNum',width: 60, align:"center"},
                {title: '日期', key: 'zArrivalGoodsDate', width: 100, align:"center",
                    render: (h, params) => {
                        return params.row.zArrivalGoodsDate.substr(0, 10);
                    }
                },
                {title: '状态', key: 'zStoreStatusN', width: 60, align:"center"},
                {title: '入库单', key: 'zYLStoreSgl_ID', width: 60, align:"center"},
                {title: '质检员', key: 'zInspector', width: 70, align:"center"},
                {title: '检测结果', key: 'zInspectionResult', width: 100, align:"center"},
                {title: '操作', key: 'handle', width: 130, align:"center", fixed: "right",
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: { type: 'success', size: 'small' },
                                on: {
                                    click: () => { this.btnMateriaCheck(params) }
                                }
                            }, '验收记录'),
                            h('Button', {
                                props: { type: 'warning', size: 'small' },
                                style: { marginRight: '5px' },
                                on: {
                                    click: () => { this.judge(params) }
                                }
                            }, '判定书'),
                        ]);
                    }
                } 
            ],
            rowData: {},

            // 模态框数据
            materiaCheckModal: false,
            materiaCheckData: [],
            materiaCheckRange: {},
            materiaJudgeModal: false,
            materiaStatus: '',
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

            tubeRange: [
                {name: '成品油管接箍', zd: [61.0, 64.0], lj: [-3, 3], cg: [53.6, 57.6], czmd: [4.76, 5.26], jmj: [7.0, 8.0], zxcd: [130.18, 89.74], jgwj: [88.50, 89.74], tksd: [7.94, 8.73], tkzj: [74.63, 75.42]},
                {name: '成品套管接箍', zd: [61.0, 64.0], lj: [-3, 3], cg: [69.25, 73.25], czmd: [3.18, 3.68], jmj: [7.5, 8.5], zxcd: [203.2, 208.0], jgwj: [152.90, 154.87], tksd: [12.70, 13,49], tkzj: [142.08, 142.87]}
            ],

            // 查看
            lookModal: false,
            lookModalData: [],

            // 按钮状态
            btnLook: true,
            btnJudgePass: true,
            btnJudgeRecall: true,
            btnUpdateMateriaCheck: true,
        }
    },
    computed: {
        arrivalGoodsDate: function () {
            if (this.rowData.zArrivalGoodsDate) {
                let date = this.rowData.zArrivalGoodsDate;
                return date.substr(0, 10);
            }
        },
        judgeDate: function () {
            if (this.rowData.zDecisionDate) {
                let date = this.rowData.zDecisionDate;
                return date.substr(0, 10);
            }
        }
    },
    mounted () {
        let _self = this;

        this.check(0, this.pageSize);
        
        // 原料
        base.ajaxData('/PublicApi/Bs_goodsinfo_view?Wp_IDStartsWith=107', {}, 'GET', (e) => {
            if(e.results.length){
                e.results.forEach((item) => {
                    if(item.wp_ID && item.pinMing){
                        _self.materiaData.push({id:item.wp_ID,pinMing:item.pinMing});
                    }
                })
            }
        });
        // 供货单位
        base.ajaxData('PublicApi/Bs_CommInfo?Class_ID=100&Fields=subClass_Value', {}, 'GET',(e) => {
            _self.supplierData = e.results;
        });
        // 使用单位
        base.ajaxData('PublicApi/Bs_commdep0_view?Fields=mDepName', {}, 'GET', (e) => {
            _self.deptmData = e.results;
        });
    },
    methods: {
         dateStrat(val){
            this.startDate = val;
        },
        dateEnd(val){
            this.endDate = val;
        },
        clear(){
            this.selectSupplier = 0;
            this.inputRepository = '';
            this.selectDeptm = 0;
            this.selectFiltState = 0;
            this.startDate = '';
            this.endDate = '';
        },
        // 获取表格数据
        check(skip, take) {
            let _self = this;
            let para = {};
            
            para.Skip = skip;
            para.Take = take;
            para['ZStoreStatus!'] = 1;
            para.orderByDesc = 'ZArrivalGoodsDate';
            para.cSubSubClass_ID = 3;

            if(this.selectMateria) para.zylPinMing = this.selectMateria;
            if(this.selectSupplier) para.zylSupCmp = this.selectSupplier;
            if(this.inputRepository) para.zStoreAreaContains = this.inputRepository;
            if(this.selectDeptm) para.zylUseCmp = this.selectDeptm;
            if(this.selectFiltState) para.zStoreStatus = this.selectFiltState;
            if(this.startDate) para['ZArrivalGoodsDate<'] = base.dateFormat(this.startDate);
            if(this.endDate) para['ZArrivalGoodsDate>'] = base.dateFormat(this.endDate);
            if(this.startDate && this.endDate) para.ZArrivalGoodsDateBetween = base.dateFormat(this.startDate) + ',' + base.dateFormat(this.endDate);

            base.ajaxData('WlCenter/Yl_arrivalrecdetail_view', para, 'GET', (e) => {
                _self.data = e.results;
                _self.total = e.total;
            });
        },
        btnCheck(skip, take) {
            this.pageCurrent = 1;
            this.check(0, this.pageSize);
        },
        changePage (index) {
            this.pageCurrent = index;
            let _size = this.pageSize;
            this.skip = (index - 1) * _size;
            this.check(this.skip, _size);
        },
        changePageSize (size) {
            this.pageSize = size;
            this.check(this.skip, size);
        },
        // 表格选行
        selectRow (val) {
            this.rowData = val;
        },
        // 判定合格
        conformity () {
            let _self = this;
            let range = this.materiaCheckRange;
            
            for(var i=0; i<50; i++) {
                this.materiaCheckData.push({
                    zhuiDu: base.randomNum(range.zd[0], range.zd[1]),
                    luoJu: base.randomNum(range.lj[0], range.lj[1]),
                    chiGao: base.randomNum(range.cg[0], range.cg[1]),
                    chenZaiMD: base.randomNum(range.czmd[0], range.czmd[1]),
                    jinMiJu: base.randomNum(range.jmj[0], range.jmj[1]),
                    minLength: base.randomNum(range.zxcd[0], range.zxcd[1]),
                    jieGuWDiameter: base.randomNum(range.jgwj[0], range.jgwj[1]),
                    tangKuDepth: base.randomNum(range.tksd[0], range.tksd[1]),
                    tangKunZDiameter: base.randomNum(range.tkzj[0], range.tkzj[1]),
                    conclusion: '合格'
                });
            }

            let para = { id: this.rowData.id, storeStatus: 3, decisionDate: base.dateFormat(new Date()) };
            base.ajaxData('ZLCheck/Yl_zlcheckstatupd_view', para, 'PUT', (e) => {
                if (e.errMsg == 'ok') {
                    this.saveMateriaCheck();
                    this.$Message.success({duration: 3, content: '判定成功！'});
                    this.$refs.currentRowTable.clearCurrentRow();
                    _self.rowData = {};
                    _self.check(_self.skip, _self.pageSize);
                } else {
                    this.$Message.error({duration: 5, content: '判定失败，请重试！'});
                }
            });
        },
        // 取消判定
        conformityRecall () {
            let _self = this;
            
            if(this.rowData.id) {
                let status = this.rowData.zStoreStatus;
                if (status ==3) {
                    base.ajaxData('ZLCheck/Zj_JieGuCheckRec?Rec_ID=' + this.rowData.id, {}, 'DELETE', (e) => {
                        if (e.errMsg == 'ok') {
                            base.ajaxData('ZLCheck/Yl_zlcheckstatupd_view', { id: this.rowData.id, storeStatus: 2 }, 'PUT', (e) => {
                                if (e.errMsg == 'ok') {
                                    this.$Message.success({duration: 3, content: '取消判定成功！'});
                                    this.$refs.currentRowTable.clearCurrentRow();
                                    _self.rowData = {};
                                    _self.check(_self.skip, _self.pageSize);
                                } else {
                                    this.$Message.error({duration: 5, content: '取消判定失败，请重试！'});
                                }
                            })
                        } else {
                            this.$Message.error({duration: 5, content: '取消判定失败，请重试！'});
                        }
                    });
                } else {
                    this.$Message.error({duration: 5, content: '请确定所选状态为合格再进行判定提交！'});
                }
            } else {
                this.$Message.warning({duration: 5, content: '请先选择要取消判定行！'});
            }
        },
        // 验收记录
        btnMateriaCheck (params) {
            let _self = this;
            
            switch (params.row.zStoreStatus) {
                case 1: break;    // 未送检
                case 2:     // 待判
                    this.materiaCheckModal = true;
                    for(var i=0; i<50; i++) {
                        _self.materiaCheckData.push({
                            zhuiDu: '',
                            luoJu: '',
                            chiGao: '',
                            chenZaiMD: '',
                            jinMiJu: '',
                            minLength: '',
                            jieGuWDiameter: '',
                            tangKuDepth: '',
                            tangKunZDiameter: '',
                            conclusion: ''
                        });
                    }
                    break;
                case 3:case 4:     // 合格 已发货
                    this.materiaCheckModal = true;
                    base.ajaxData('ZLCheck/Zj_JieGuCheckRec', { Rec_ID: params.row.id }, 'GET', (e) => {
                        _self.materiaCheckData = e.results;
                    });
                    break;
                default:
                    break;
            }
        },
        saveMateriaCheck () {
            let _data = this.materiaCheckData;
            let _row = this.rowData;

            for(let i=0; i<_data.length; i++) {
                let _para = {
                    'Rec_ID': _row.id,
                    'YL_TyID': _row.zyL_TyID,
                    'ZhuiDu': _data[i].zhuiDu,
                    'LuoJu': _data[i].luoJu,
                    'ChiGao': _data[i].chiGao,
                    'ChenZaiMD': _data[i].chenZaiMD,
                    'JinMiJu': _data[i].jinMiJu,
                    'MinLength': _data[i].minLength,
                    'JieGuWDiameter': _data[i].jieGuWDiameter,
                    'TangKuDepth': _data[i].tangKuDepth,
                    'TangKunZDiameter': _data[i].tangKunZDiameter,
                    'Conclusion': _data[i].conclusion
                }
                base.ajaxData('ZLCheck/Zj_JieGuCheckRec', _para, 'POST', (e) => {
                })
            }
            this.materiaCheckData = [];
        },
        // 关闭验收记录模态框
        cancelMateriaCheck () {
            this.materiaCheckModal = false;
            this.materiaCheckData = [];
        },
        // 更新验收记录数据
        updateMateriaCheck () {
            let _self = this;
            base.ajaxData('ZLCheck/Zj_JieGuCheckRec?Rec_ID=' + this.rowData.id, {}, 'DELETE', (e) => {
                if (e.errMsg == 'ok') {
                    _self.saveMateriaCheck();
                    _self.materiaCheckModal = false;
                    this.$Message.success({duration: 3, content: '更新成功！'});
                    this.$refs.currentRowTable.clearCurrentRow();
                    _self.rowData = {};
                } else {
                    this.$Message.error({duration: 5, content: '更新失败，请重试！'});
                }
            });
        },
        // 判定书
        judge (params) {
            this.materiaJudgeModal = true;
            this.rowData = params.row;
        },
        // 查看
        look () {
            if(this.rowData.id) {
                let _self = this;
                this.lookModal = true;
                base.ajaxData('WlCenter/Yl_ArrivalRecDetail', {yl_ArrivalRecId: this.rowData.id}, 'GET', (e) => {
                    let data = e.results;
                    let len = 25 - data.length;
                    for (let i = 0; i < len; i++) {
                        data.push({});
                    }
                    _self.lookModalData = data;
                });
            } else {
                this.$Message.warning({duration: 5, content: '请先选择要取消判定行！'});
            }
        }
    },
    watch: {
        // 监听行数据中的到货状态
        rowData: function (val) {
            // 根据行状态数据确定按钮显示状态及判定状态
            if(val.zStoreStatus) {
                this.btnLook = false;
                switch (val.zStoreStatus) {
                    case 2:
                        this.btnJudgePass = false;
                        this.btnJudgeRecall = true;
                        this.btnUpdateMateriaCheck = true;
                        this.materiaStatus = '';
                        break;
                    case 3:case 4:
                        this.btnJudgePass = true;
                        this.btnJudgeRecall = false;
                        this.btnUpdateMateriaCheck = false;
                        this.materiaStatus = '合格';
                    default:
                        break;
                }
            } else {
                this.btnLook = true;
                this.btnJudgePass = true;
                this.btnJudgeRecall = true;
                this.btnUpdateMateriaCheck = true;
                this.materiaStatus = '';
            }
            
            // 自动生成数据范围确定
            if (val.cSubClass_Value) {
                switch (val.cSubClass_Value) {
                    case '成品油管接箍':
                        this.materiaCheckRange = this.tubeRange[0];
                        break;
                    case '成品套管接箍':
                        this.materiaCheckRange = this.tubeRange[1];
                        break;
                
                    default:
                        break;
                }
            }
            
            
        }
    }
}
</script>