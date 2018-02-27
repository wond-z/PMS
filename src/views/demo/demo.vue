<template>
    <div>
        <div class="margin-bottom-10">
			<div class="button-font-size">
			    <i-button type="primary" @click="modal1 = true" icon="plus">到货登记</i-button>
		   		<i-button type="primary" icon="ios-search">查看</i-button>
			    <i-button type="primary" icon="minus">删除</i-button>
			    <i-button type="primary" icon="forward">送检</i-button>
			    <i-button type="primary" icon="reply">取消送检</i-button>
			    <i-button type="primary" icon="forward">判定合格</i-button>
		    </div>
		</div>
        <card class="margin-bottom-10">
			<row justify="center" >
				 <div class="margin-bottom-10">
			   		<div style="display: inline-block; margin-right: 15px;" justify="center">
		            	<label  for="for" align="middle" style="display:inline-block;width: 60px;text-align: right;">原料:</label>
				        <Select v-model="model2" style="width:175px">
					        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					    </Select>
		            </div>
		            <div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">供货单位:</label>
				        <Select v-model="model2"  style="width:175px">
					        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					    </Select>
		            </div>
		        	<div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">使用单位:</label>
				        <Select v-model="model2"  style="width:175px">
					        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					    </Select>
		            </div>
				</div>
				<div >
		        	<div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">筛选状态:</label>
				        <Select v-model="model2"  style="width:175px">
					        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					    </Select>
		            </div>
		        	<div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">库区:</label>
				        <Select v-model="model2"  style="width:175px">
					        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					    </Select>
		            </div>
		            <div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">时间:</label>
		            	<Date-picker :transfer="true" type="daterange" placement="bottom-end" placeholder="选择日期" style="width:175px"></Date-picker>
		            </div>
			        <div style="display: inline-block; margin-right: 15px;">
			        	<i-button type="primary" icon="ios-search" >查询</i-button>
		                <i-button type="primary"  icon="social-dropbox-outline">清空</i-button>
		                <i-button type="primary"  icon="ios-upload">导出信息</i-button>
			        </div>
				</div>
			</row>
		</card>
        <tableCanEdit></tableCanEdit>
    </div>
</template>

<script>
import tableCanEdit from './table';

export default {
    name: 'demo',
    components: {
        tableCanEdit
    },
    data () {
        return {
            dataCount:0,
            modal1: false,
            cityList: [
                {value: 'beijing',　label: '北京市'},
                {value: 'shanghai',　label: '上海市'},
                {value: 'shenzhen', label: '深圳市'},
                {value: 'hangzhou', label: '杭州市'},
                {value: 'nanjing', label: '南京市'},
                {value: 'chongqing', label: '重庆市'}
            ],
            model2: '',
        }
    }
}
</script>
