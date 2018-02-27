<style lang="less" >
</style>

<template>
    <div>
        <Card class="select-col margin-bottom-10 padding-top-bottom-minish">
            <div class="div">
                <label class="label" style="width:50px;">部门</label>
                <Select :transfer="true" v-model="mDepName" class="select">
                    <Option  :value="0" >全部</Option>
                    <Option  v-for="item in departList" :value="item.name" :key="item.name" >{{item.name}}</Option>
                </Select>
            </div>
            <div class="div">
                <label class="label" style="width:50px;">年份</label>
                <DatePicker :options='options' type="year"  v-model="Years" placeholder="选择年份" class="select"></DatePicker>
            </div>
             <div class="div">
                <label class="label" style="width:50px;">月份</label>
                <Select :transfer="true" v-model="Month" class="select">
                    <Option  :value="0" >全部</Option>
                    <Option  v-for="item in months" :value="item.num" :key="item.num" >{{item.value}}</Option>
                </Select>
            </div>
            <Button type="primary" icon="ios-search" @click="btnCheck()" >查询</Button>
            <Button type="primary" icon="gear-b" @click="add()" >设置</Button>
        </Card>
        <card class="margin-bottom-10">
            <Table class="margin-bottom-10" size="small" border  style="min-height:400px;" :columns="columns" :data="data1"></Table>
            <div>
                <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
            </div>
        </card>
        <!-- 新增模态框 -->
        <Modal class="modal-common" v-model="addModal" icon="clipboard" :mask-closable="false" class-name="vertical-center-modal" >
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>新增月设置信息</span>
            </p>
            <Form ref="postDate" :model="postDate"  :rules="ruleStoreForm"  :label-width="120" :show-message="false">
                <FormItem  label="部门" prop="Dep_ID">
                    <Select :transfer="true" v-model="postDate.Dep_ID"  style="width:300px;">
                        <Option  v-for="item in departList" :value="item.departmentId" :key="item.departmentId" >{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem   label="年份" prop='Years'>
                    <DatePicker type="year" :value='postDate.Years' placeholder="选择年份" @on-change="chooseYear" style="width:300px;" ></DatePicker>
                </FormItem>
                <FormItem   label="月份" prop='Month'>
                    <Select :transfer="true" v-model="postDate.Month" style="width:300px;" @on-change="chooseMonth">
                        <Option  v-for="item in months" :value="item.num"  :key="item.num">{{item.value}}</Option>
                    </Select>
                </FormItem>
                <FormItem   label="起始日期" prop='StartDate' class="label-width-i">
                    <DatePicker v-model="postDate.StartDate" placement="bottom-end" placeholder="选择日期" style="width:300px;" ></DatePicker>
                </FormItem>
                <FormItem   label="截止日期" prop='EndDate' class="label-width-i">
                    <DatePicker v-model="postDate.EndDate" placement="bottom-end" placeholder="选择日期" style="width:300px;" > </DatePicker>
                </FormItem>
            </Form>
            <div slot="footer">
                 <Button type="ghost" @click="addModal=false;" style="margin-left: 8px">取消</Button>
                 <Button type="primary" @click="addDate('postDate')">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import base from '@/libs/base';

 export default {
        data () {
            return {
                departList: [],
                data1: [],                   // 表格数据
                skip: 0,                     // 数据起始值
                take: 10 ,                   // 一次获取的条数--一页显示的条数
                total: 100,                  // 数据总数
                pageCurrent: 1,              // 当前页
                pageSize: 10,                // 每页的数据
                mDepName: 0,
                Month: 0,
                Years: '',
                addModal: false,
                options:{
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    }
                },
                columns: [ 
                    // {key: "bmID", title: "ID",align: 'center'},
                    {key: "dep_Name", title: "分厂",align: 'center'},
                    {key: "bmYears", title: "年度",align: 'center'},
                    {key: "bmMonth", title: "月份",align: 'center'},
                    {key: "bmStartDate", title: "起始日期",align: 'center'},
                    {key: "bmEndDate", title: "截止日期",align: 'center'},
                    {title: '操作',width: 120,align:"center",key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                params.index == 0 && this.pageCurrent == 1 ?h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteData(params.row.bmID)
                                        }
                                    }
                                }, '删除'):''
                            ]);
                        }
                    } 
                ],
                postDate:{
                    "ID": "",
                    "Dep_ID": "",
                    "Years": "",
                    "Month": "",
                    "StartDate": "",
                    "EndDate": "",
                    "Remarks": ""
                },
                months:[ 
                    {num: "1", value: "1"},
                    {num: "2", value: "2"},
                    {num: "3", value: "3"},
                    {num: "4", value: "4"},
                    {num: "5", value: "5"},
                    {num: "6", value: "6"},
                    {num: "7", value: "7"},
                    {num: "8", value: "8"},
                    {num: "9", value: "9"},
                    {num: "10", value: "10"},
                    {num: "11", value: "11"},
                    {num: "12", value: "12"}
                ],
                ruleStoreForm:{
                    Years: [
                        { required: true,message:' '}
                    ],
                    Month: [
                        { required: true,message:' '}
                    ],
                    StartDate: [
                        { required: true,message:' ' }
                    ],
                    EndDate: [
                        { required: true, message: ' '}
                    ],
                    Dep_ID:[
                        { required: true,message:' '}
                    ]
                }
            }  
        },
        methods: {
            add(){
                this.addModal = true;
                this.$refs.postDate.resetFields();
            },
            chooseYear(val){
                this.postDate.Years = val;
                this.postDate.StartDate = val +'-'+ (Number(this.postDate.Month)-1) +'-'+ 1;
                this.postDate.EndDate = val +'-' + this.postDate.Month +'-'+ 1;
            },
            chooseMonth(val){
                let year = this.postDate.Years;
                this.postDate.StartDate = year + '-' + (Number(val)-1) +'-'+ 1;
                this.postDate.EndDate = year + '-' + val +'-'+ 1;
            },
            // 查询函数
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            // 新增
            addDate(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(this.postDate.StartDate < this.postDate.EndDate) {
                            base.postAjaxData(base.baseURL+'/PublicApi/Bs_Monset?orderBy=-ID',JSON.stringify(this.postDate),() =>{
                                this.$Message.success({duration: 3, content: '设置成功！'});
                                this.changePage(this.pageCurrent);
                                this.addModal = false;
                            });
                        }else{
                            this.$Message.error('请输入正确日期');
                        }
                    }else{
                        this.$Message.error('请填写完整！');
                    }
                })
            },
            deleteData(id){
                base.getAjaxData(base.baseURL+'/PublicApi/Bs_Monset?orderBy=-ID&Take=1', (res) => {
                    if(res.results[0].id === id){
                        base.getAjaxData(base.baseURL+'/PublicApi/Bs_Monset?ID=' + id, (data) => {
                            this.$Modal.confirm({
                                content:'<p>确定删除数据么</p>',
                                onOk:() =>{
                                    base.deleteAjaxData(base.baseURL + '/PublicApi/Bs_Monset?ID='+id,() => {
                                        this.$Message.success({duration: 3, content:'数据已删除！'});
                                        this.changePage(this.pageCurrent);
                                    });
                                }
                            })
                        });
                    }else{
                        this.$Message.warning({duration: 5, content:'已前数据不可删除！'});
                    }
                });
            },
            btnCheck() {
                this.pageCurrent = 1;
                this.check(0, this.pageSize);
            },
            check(skip, take) {
                let _self = this;
                let para = {};
                
                para.Skip = skip;
                para.Take = take;
            
                if(this.mDepName) para.dep_Name = this.mDepName;
                if(this.Years) {
                    if(this.Years.length == undefined){
                        this.Years = base.dateFormat(this.Years).substring(0,4);
                    }
                    para.BmYears = this.Years;
                }
                if(this.Month)para.bmMonth = this.Month;
                
                base.ajaxData('PublicApi/Bs_Monset_view?orderBy=-BmID', para, 'GET', (e) => {
                    if(e.results){
                        e.results.forEach( (item) => {
                            if(item.bmStartDate) item.bmStartDate = item.bmStartDate.substring(0,10);
                            if(item.bmEndDate) item.bmEndDate = item.bmEndDate.substring(0,10);
                        });
                        _self.data1 = e.results;
                        _self.total = e.total;
                    }
                });
            },
            // 分页
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
        },
        // 获取数据
        mounted () {
            let departArray = [];
            let _self = this;
            this.departList = [];

            let date = base.dateFormat(new Date());
            let year = date.substring(0,4);
            this.Years = year;
            
           
            base.ajaxData('/PublicApi/Sys_Deparment', {}, 'GET', (e) => {
                if(e.results.length > 0){
                    e.results.forEach((item) => {
                        departArray.push({departmentId:item.departmentId,name:item.name})
                    })
                    this.departList = departArray;
                }
            });
            this.check(this.skip, this.take);
        }
    }
</script>
