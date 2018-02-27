<style lang="less" >
    @import './daily-report-table.less';
</style>

<template>
    <div class="daily-report-table">
        <card class="margin-bottom-10 padding-top-bottom-minish">
            <div class="select-col">
                <div class="div">
                    <label for="for" align="middle" class="label">产品类别</label>
                    <Select v-model="material" class="select" :label-in-value='true' @on-change='showProCmp'>
                        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label  for="for"class="label">生产单位</label>
                    <Select v-model="useCmp" class="select" :label-in-value='true' @on-change='showUseCmp'>
                        <Option  :value="0">全部</Option>
                        <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label  for="for" class="label" style="width:50px;">日期</label>
                    <Date-picker type="month" :options="options" placement="bottom-end" format="yyyy年MM月" placeholder="选择日期" class="select" @on-change='dateFormatStart'></Date-picker>
                </div>
                <Button type="primary" icon="ios-upload">导出Excel</Button>
            </div>
		</card>
        <card>
            <r-table :type='type' :list='list' :material='material' :proUnit='useCmp' :date='someDay'>
                    <tbody slot="head">
                        <tr class="table-head">
                            <td colspan="13">{{goodType || '油管'}}管体月生产报表</td>
                        </tr>
                        <tr class="border-none">
                            <td colspan="2" class="align-left">生产：{{showUseName}}</td>
                            <td colspan="2">日期：{{someDay}}	</td>
                            <td colspan="2">品种：{{goodType}}</td>
                            <td colspan="2">钢级：{{steelGrade}}</td>
                            <td colspan="2">规格(mm)：{{specification}}</td>
                            <td colspan="2" class="align-right">编号：SYC/ZJ-GT-13</td>
                        </tr>
                        <tr>
                            <td colspan="2" rowspan="2" ref="first" class="first">
                                <div :style="first"></div>
                                <p style="text-align: right;">产量</p>
                                <p style="text-align: left;">类别</p>
                            </td>
                            <td colspan="2">甲班组</td>
                            <td colspan="2">乙班组</td>
                            <td colspan="2">丙班组</td>
                            <td colspan="2">丁班组</td>
                            <td colspan="4">合计</td>
                        </tr>
                        <tr>
                            <td>当月</td>
                            <td>年累计</td>
                            <td>当月</td>
                            <td>年累计</td>
                            <td>当月</td>
                            <td>年累计</td>
                            <td>当月</td>
                            <td>年累计</td>
                            <td>当月</td>
                            <td>年累计</td>
                        </tr>
                    </tbody>
            </r-table>
            <table>
                <tr class="border-none">
                    <td>批准：</td>
                    <td>制表人：</td>
                </tr>
            </table>
        </card>
    </div>
</template>

<script>
    import base from '@/libs/base';
    import rTable from '../components/rTable.vue';
    export default {
        components:{
            rTable
        },
        data(){
            return {
                showUseName:'',  //分厂名
                goodType:'',
                steelGrade:'',
                specification:'',
                goodsList:[],
                material:"",
                useCmpList:[],
                useCmp:0,
                options:{
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    }
                },
                list:[
                    {
                        key:'',
                        title:'原料计划',
                        rows:[
                                {info:'根数'},
                                {info:'重量(kg)'}
                            ],
                        len:2
                    },
                    {
                        key:'',
                        title:'原料投入',
                        rows:[
                                {info:'根数'},
                                {info:'重量(kg)'}
                            ],
                        len:2
                    },
                    {
                        key:'',
                        title:'车丝根数',
                        rows:[
                                {info:'1#'},
                                {info:'2#'},
                                {info:'3#'},
                                {info:'4#'},
                                {info:'5#'},
                                {info:'6#'},
                                {info:'小计'}
                            ],
                        len:7
                    },
                    {
                        key:'',
                        title:'机紧',
                        rows:[
                                {info:'(自)合格'},
                                {info:'外购接箍'}
                            ],
                        len:2
                    },
                    {
                        key:'',
                        title:'静水压',
                        rows:[
                                {info:'合格'}
                            ],
                        len:1
                    },
                    {
                        key:'',
                        title:'称重测长',
                        rows:[
                                {info:'根数'},
                                {info:'长度(m)'},
                                {info:'重量(kg)'}
                            ],
                        len:3
                    },
                    {
                        key:'',
                        title:'成品包装',
                        rows:[
                                {info:'根数'},
                                {info:'捆数'},
                                {info:'长度(m)'},
                                {info:'重量(kg)'}
                            ],
                        len:4
                    },
                    {
                        key:'',
                        title:'入库量',
                        rows:[
                                {info:'根数'},
                                {info:'捆数'},
                                {info:'长度(m)'},
                                {info:'重量(kg)'}
                            ],
                        len:4
                    },
                    {
                        key:'',
                        title:'未入库量',
                        rows:[
                                {info:'根数'},
                                {info:'重量'}
                            ],
                        len:2
                    }
                ],
                someDay:'',
                type:'M',
                firstLen:0,
                angle:0
            }
        },
        computed:{
            first(){
                return {
                    position: 'absolute',
                    width: '1px',
                    height:this.firstLen + 'px',
                    top:0,
                    left:0,
                    backgroundColor: '#ccc',
                    display: 'block',
                    transform: 'rotate(-'+ this.angle +'deg)',
                    transformOrigin: 'top'
                }
            }
        },
        methods:{
            showProCmp(data){
                base.showGoodsInfo({
                    'vm':this,
                    'wpId':data.value,
                    'subClass_Value':'goodType',
                    'steelGrade':'steelGrade',
                    'jsSpecifications':'specification',
                });
            },
            showUseCmp(data){
                this.showUseName = data.label;
            },
            //日期
            dateFormatStart(val){
                this.someDay = val;
            },
            setBias(){
                let otd = this.$refs.first;
                this.firstLen = Math.sqrt(otd.offsetWidth * otd.offsetWidth + otd.offsetHeight * otd.offsetHeight);
                this.angle = Math.atan2(otd.offsetWidth,otd.offsetHeight);
                this.angle = this.angle *180 / Math.PI;
            },
            init(){
                
            }
        },
        created(){
            base.getGoodsList(this,108);
            base.getAjaxData(base.baseURL + 'PublicApi/Bs_commdep1_view',(res) =>{
                res.results.forEach((item) => {
                    if(item.mid){
                        if(item.isEnable==1 && item.mDepName){
                            this.useCmpList.push({id:String(item.mid),value:item.mDepName});
                        }
                    }
                })
            });
        },
        watch:{

        },
        mounted(){
            this.setBias();
            window.onresize = () => {
                return setTimeout(() => {
                    this.setBias();
                }, 0);
            }
        },
    }
</script>
