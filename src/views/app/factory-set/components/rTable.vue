<style lang='less' scoped>
    table{
		text-align: center;
    }
</style>
<template>
	<table>
		<slot name='head'></slot>
		<tbody v-for='item in list'>
			<tr v-for='(line,index) in item.rows' :key='index'>
				<td v-if='index==0' :rowspan="item.len">{{item.title}}</td>
				<td>{{line.info}}</td>
				<td>{{line.day1}}</td>
				<td>{{line.month1}}</td>
				<td>{{line.day2}}</td>
				<td>{{line.month2}}</td>
				<td>{{line.day3}}</td>
				<td>{{line.month3}}</td>
				<td>{{line.day4}}</td>
				<td>{{line.month4}}</td>
				<td>{{line.dayTotle}}</td>
				<td>{{line.monthTotle}}</td>
				<td v-if='type == "D"'>{{line.yearTotle}}</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
	import base from '@/libs/base';
	export default {
		name:'rTable',
        data(){
            return {
				refrence:{//排除干扰，确定顺序
                    "dPlanNum": 0,
					"dPlanWeight": 0,
					"dUseNum": 0,
					"dUseWeight": 0,
					"dCarWire1": 0,
					"dCarWire2": 0,
					"dCarWire3": 0,
					"dCarWire4": 0,
					"dCarWire5": 0,
					"dCarWire6": 0,
					"dCarWire7": 0,
					"dCarWire8": 0,
					"dCarWire9": 0,
					"dCarWire10": 0,
					"dMachineTight1": 0,
					"dMachineTight2": 0,
					"dMachineTight3": 0,
					"dMachineTight4": 0,
					"dJinshuiPressure": 0,
					"dChenCeNum": 0,
					"dChenCeWeight": 0,
					"dChenCeLength": 0,
					"dBaoZhuangNum": 0,
					"dBaozhuangWeight": 0,
					"dBaozhuangLength": 0,
					"dBaozhuangKunNum": 0,
					"dStoreNum": 0,
					"dStoreWeight": 0,
					"dStoreLength": 0,
					"dStoreKunNum": 0,
					"dNoStoreNum": 0,
					"dNoStoreWeight": 0,
					"mPlanNum": 0,
					"mPlanWeight": 0,
					"mUseNum": 0,
					"mUseWeight": 0,
					"mCarWire1": 0,
					"mCarWire2": 0,
					"mCarWire3": 0,
					"mCarWire4": 0,
					"mCarWire5": 0,
					"mCarWire6": 0,
					"mCarWire7": 0,
					"mCarWire8": 0,
					"mCarWire9": 0,
					"mCarWire10": 0,
					"mMachineTight1": 0,
					"mMachineTight2": 0,
					"mMachineTight3": 0,
					"mMachineTight4": 0,
					"mJinshuiPressure": 0,
					"mChenCeNum": 0,
					"mChenCeWeight": 0,
					"mChenCeLength": 0,
					"mBaoZhuangNum": 0,
					"mBaozhuangWeight": 0,
					"mBaozhuangLength": 0,
					"mBaozhuangKunNum": 0,
					"mStoreNum": 0,
					"mStoreWeight": 0,
					"mStoreLength": 0,
					"mStoreKunNum": 0,
					"mNoStoreNum": 0,
					"mNoStoreWeight": 0,
					"yPlanNum": 300,
					"yPlanWeight": 26,
					"yUseNum": 300,
					"yUseWeight": 26,
					"yCarWire1": 200,
					"yCarWire2": 100,
					"yCarWire3": 180,
					"yCarWire4": 120,
					"yCarWire5": 0,
					"yCarWire6": 0,
					"yCarWire7": 0,
					"yCarWire8": 0,
					"yCarWire9": 0,
					"yCarWire10": 0,
					"yMachineTight1": 150,
					"yMachineTight2": 155,
					"yMachineTight3": 0,
					"yMachineTight4": 0,
					"yJinshuiPressure": 300,
					"yChenCeNum": 300,
					"yChenCeWeight": 25,
					"yChenCeLength": 3000,
					"yBaoZhuangNum": 300,
					"yBaozhuangWeight": 25,
					"yBaozhuangLength": 3000,
					"yBaozhuangKunNum": 16,
					"yStoreNum": 300,
					"yStoreWeight": 25,
					"yStoreLength": 2800,
					"yStoreKunNum": 16,
					"yNoStoreNum": 0,
					"yNoStoreWeight": 0
                },
				rowRefrence:{day1:0,month1:0,day2:0,month2:0,day3:0,month3:0,day4:0,month4:0,dayTotle:0,monthTotle:0,yearTotle:0}
			}
        },
        props:{
			list:Array,
			type:String,
			date:String,
			material:String,
			proUnit:[String,Number]
		},
		computed:{
			isFull(){
				if(this.date && this.material && this.proUnit)return true;
				else return false;
			}
		},
		methods:{
			fullList(ele,group,type){
                let i = 0;
				let count = {};
				let carTotal = {}
				type = type || this.type;
                for(var key in this.refrence){
					let ckey = key.slice(1);
					const capFlag = key[0];
                    ckey = ckey.slice(0,3);
                    switch(ckey) {// 模块
                        case 'Pla':
                            i = 1;
                            break;
                        case 'Use':
                            i = 2;
                            break;
                        case 'Car':
                            i = 3;
                            break;
                        case 'Mac':
                            i = 4;
                            break;
                        case 'Jin':
                            i = 5;
                            break;
                        case 'Che':
                            i = 6;
                            break;
                        case 'Bao':
                            i = 7;
                            break;
                        case 'Sto':
                            i = 8;
                            break;
                        case 'NoS':
                            i = 9;
                            break;
                        default:
                            i = 0;
                            break;
                    }
                    if(i){
						ckey = capFlag + ckey;
						const len = this.list[i-1].len
						count[ckey] != undefined ? count[ckey]++:(count[ckey] = 0,this.list[i-1].key = Math.random().toFixed(3));
						if(i == 3 && count[ckey] < len-1){// 小计处理
							carTotal[ckey] != undefined ? carTotal[ckey] += ele[key]:carTotal[ckey] = ele[key];
						}
						if(count[ckey] > len-1) {
							continue;
						}
						switch (capFlag) {
							case 'd':
								if(type == 'D')this.list[i-1].rows[count[ckey]]['day'+group] = (i == 3 && count[ckey] == len-1) ? carTotal[ckey] : ele[key];
								break;
							case 'm':
								if(type == 'D')this.list[i-1].rows[count[ckey]]['month'+group] = (i == 3 && count[ckey] == len-1) ? carTotal[ckey] : ele[key];
								if(type == 'M')this.list[i-1].rows[count[ckey]]['day'+group] = (i == 3 && count[ckey] == len-1) ? carTotal[ckey] : ele[key];
								break;
							case 'y':
								if(type == 'M')this.list[i-1].rows[count[ckey]]['month'+group] = (i == 3 && count[ckey] == len-1) ? carTotal[ckey] : ele[key];
								this.list[i-1].rows[count[ckey]]['year'+group] = ele[key];// 年累计
								break;
							default:
								break;
						}
                    }
                }
			},
			clearList(){
				this.list.forEach( (item,index)=>{
					item.rows.forEach( (row,i)=>{
						for(var key in row){
							key !== 'info' ? row[key] = 0:''
						}
					})
				})
			},
			query(){
				const date = this.date.replace(/\D/g,'');
				base.getAjaxData(base.baseURL + 'FCManage/Cp_FcDailyReportParm?pFDate='+ date +'&pCpUseCmp_ID='+ this.proUnit +'&pCp_Type='+ this.material +'&pUID=0004&pFlag='+this.type,(sta) =>{
					if(sta.Results[0].Flag == 'Y'){
						base.getAjaxData(base.baseURL + 'FCManage/Cp_FcDailyReport?UID=0004',(e) =>{
							let data = e.results;
							data.forEach( (ele, index) => {
								switch(ele.dWorkSection_ID) {
									case "11310000":
										this.fullList(ele,1);
										break;
									case "11310001":
										this.fullList(ele,2);
										break;
									case "11310002":
										this.fullList(ele,3);
										break;
									case "11310003":
										this.fullList(ele,4);
										break;
								}
							});
							this.$forceUpdate();
						})
					}else{
						this.clearList();
					}
				})
			},
			init(){
				this.isFull && this.query();
			}
		},
		created(){
			let listlen = this.list.length;
			for(var m = 0; m < listlen; m++){
				let rowlen = this.list[m].len;
				for(var j = 0; j < rowlen; j++){
					for(var co in this.rowRefrence){
						this.list[m].rows[j][co] = 0;
					}
				}
			};
			this.init();
		},
		watch:{
			list:{
                handler(cur,old){
					if(this.type == 'D'){
						cur.forEach( function(item, i) {
							let carTotal = 0;
							item.rows.forEach( (row,j) =>{
								let numD = 0;
								let numM = 0;
								let numY = 0;
								for(var key in row){
									/^day\d/.test(key) ? numD += row[key]:'';
									/^month\d/.test(key) ? numM += row[key]:'';
									/^year\d$/.test(key) ? numY += row[key]:'';
								}
								row.dayTotle = numD;
								row.monthTotle = numM;
								row.yearTotle = numY;
								if(i == 2){// 小计
									if(j < item.len - 1 ) carTotal += numY;
									else if(j == item.len - 1 ) row.yearTotle = carTotal;
								}
							})						
						});
					}else if(this.type == 'M'){
						cur.forEach( function(item, i) {
							item.rows.forEach( (row,j) =>{
								let numM = 0;
								let numY = 0;
								for(var key in row){
									/^day\d/.test(key) ? numM += row[key]:'';
									/^month\d/.test(key) ? numY += row[key]:'';
								}
								row.dayTotle = numM;
								row.monthTotle = numY;
							})						
						});
					}
				},
                deep:true
			},
			date:function(val){
				this.init();
			},
			material:function(val){
				this.init();
			},
			proUnit:function(val){
				this.init();
			}
		}
	}
</script>