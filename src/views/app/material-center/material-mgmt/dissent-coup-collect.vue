<style lang="less">
   @import './dissent-collect.less';
   .color-red{
       color: red !important;
   }
</style>

<template>
	 <div class="dissent-collect">
        <card class="margin-bottom-10 select-col padding-top-bottom-minish">
            <div class="div">
                <label align="middle" class="label" style="width:40px;">原料</label>
                <Select v-model="material" class="select li-width" >
                    <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                </Select>
            </div>
            <div class="div">
                <label class="label">起始日期</label>
                <Date-picker :options='options' v-model="startDate" placement="bottom-end" placeholder="选择日期" class="select"></Date-picker>

            </div>
            <div class="div">
                <label class="label">截止日期</label>
                <Date-picker :options='options' v-model="endDate" placement="bottom-end" placeholder="选择日期" class="select"> </Date-picker>
            </div>
            <Button type="primary" icon="ios-search" @click="btnQuery()" >查看报表</Button>
            <Button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</Button>
            <Button type="primary" icon="ios-upload">导出明细账</Button>
		</card>
        <card>
            <p style="font-size:24px;text-align:center;"class="margin-bottom-10">油管接箍质量异议总账12月份139.7*7.72 (J55)</p>
            <table class="main-table margin-bottom-10" border="1" >
                <tr style="font-size:24px;display:none;">
                    <td colspan="11">油管质量异议总账12月份139.7*7.72 (J55)</td>
                </tr>
                <tr>
                    <td ></td>
                    <td colspan="2">前期结存</td>
                    <td colspan="2">本期发生</td>
                    <td colspan="2">异议处理</td>
                    <td colspan="2">本期结存</td>
                    <td ></td>
               
                </tr>
                <tr>
                    <td >单位名称</td>
                    <td >数量</td>
                    <td >金额</td>
                    <td >数量</td>
                    <td >金额</td>
                    <td >数量</td>
                    <td >金额</td>
                    <td >数量</td>
                    <td >金额</td>
                    <td >三分厂</td>
                   
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
                    <td></td>
                    <td></td>
          
                </tr>
                <tr >
                    <td >合计：</td>
                    <td ></td>
                    <td ></td>
                    <td ></td>
                    <td ></td>
                    <td ></td>
                    <td ></td>
                    <td ></td>
                    <td ></td>
                    <td ></td>
             
                </tr>
            </table>
            <div>
                <Page ref='page' :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" placement="top" show-elevator show-sizer></Page>
            </div>
        </card>
	</div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        return {
            material:'',
            tubDissentData: [],//获取主页列表的数据
            total:0,//总条数
            pageCurrent: 1,//当前页码
            pageSize: 10,//页面大小
            skip: 0,
            goodsList:[],//品名列表
            startDate:'',
            endDate:'',
            options:{
                disabledDate(date){
                        return date.valueOf() > Date.now();
                }
            },
        }
    },
    computed: {
        outDate(){
            if(typeof this.outStoreBill.InOutDate === 'object'){
              return base.dateFormat(this.outStoreBill.InOutDate)
            }
        },
        inDate(){
            if(typeof this.toStoreBill.InOutDate === 'object'){
              return base.dateFormat(this.toStoreBill.InOutDate)
            }
        }
    },
    methods: {
        lookBill(){
            let num = this.lookIndex.length
            let _self = this;
            this.cTableData = [];
            // if( num == 0){
            //     this.$Message.error('请你选择要查看的物品');
            //     this.lookModal = false ;
            // }
            // else{
                if(num == 1){
                    // this.lookModalData = this.lookIndex;
                    for(var i = 0;i < 15;i++){
                            this.tubDissentData.push({
                                zlookModalData:{}
                            });
                        }
                    // base.getAjaxData(base.baseURL + '/WlCenter/Yl_ArrivalRecDetail?Yl_ArrivalRecId=' + this.lookModalData[0].id + '&Skip=' + this.skip + '&take=' + this.take, (e) => {
                    //     _self.total = e.total;
                    //     let data = e.results;
                    //     let num = data.length;
                    //     for(var i = 0;i < num;i++){
                    //         this.cTableData[i].zlookModalData = data[i];
                    //     } 
                    // })
                }
            // }
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
        //获取选中品名的id
        materialId(data){
            this.toStoreBill.YL_TyID = data.value;
            this.toStoreBillData.storeYLName = data.label;

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
                let _self = this;
                let para = {};
                
                para.Skip = skip;
                para.Take = this.pageSize;

                if(this.material) para.yL_TyID = this.material;
                if(this.filtStateSelect) para.bilL_ID = this.filtStateSelect;
                if(this.state) para.inOutStats = this.state;
                if(this.startDate) para['StartArrivalGoodsDate<'] = base.dateFormat(this.startDate);
                if(this.endDate) para['EndedArrivalGoodsDate>'] = base.dateFormat(this.endDate);
                if(this.startDate && this.endDate) para.ArrivalGoodsDateBetween = base.dateFormat(this.startDate) + ',' + base.dateFormat(this.endDate);
                if(this.office) para.cmp_ID = this.office;
                if(this.user) para.cmp_ID = this.user;

            base.ajaxData('WlCenter/Yl_Inoutmanage_view', para, 'GET', (e) => {
                    _self.data = e.results;
                    _self.total = e.total;
                });
            
        },
        //清空查询条件
        clearQuery(){
                this.office='';
                this.user='';
                this.state='';
                this.filtStateSelect='';
        },
        // 初始化
        init(){
            let today = base.dateFormat(new Date())
            this.toStoreBill.InOutDate = today;
            this.outStoreBill.InOutDate = today;

            this.changePage(this.pageCurrent);
        }
    },
    created(){
            // this.init();
            //物品信息
        this.goodsList=[];
        this.offerCmpList=[];
        this.useCmpList=[];
        base.getAjaxData(base.baseURL + 'PublicApi/bs_goodsinfo_view',(bsGoods) =>{
            bsGoods.results.forEach((item) => {
                if(item.isEnable && item.pinMing && item.wp_ID){
                    this.goodsList.push({id:item.wp_ID,value:item.pinMing});
                }
            })
            if(!this.material)this.material = this.goodsList[0].id;
            //公共信息类
            base.getAjaxData(base.baseURL + 'PublicApi/bs_comminfo_view',(res) =>{
                res.results.forEach((item) => {
                    if(item.isEnable && item.subClass_Value && item.comm_ID){
                        let temp = item.comm_ID.substring(0,3);
                        if(temp == 100)this.offerCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                        if(temp == 104)this.useCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                    }else{

                    }
                })
                this.query();
            });
        });
    }
};
</script>
