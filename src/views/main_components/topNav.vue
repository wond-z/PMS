<template>
    <!-- <Menu mode="horizontal" active-name="1" @on-select="selectChange">
        <Submenu name="3">
            <template slot="title">
                <Icon type="stats-bars"></Icon> {{ selectItem }}
            </template>
            <div v-for="item in department">
                <MenuItem :name="item">{{ item }}</MenuItem>
            </div>
        </Submenu>
    </Menu> -->
    <!-- <Menu mode="horizontal" active-name="1" @on-select="selectChange">
            <div v-for="item in department">
                <MenuItem :name="item"><Icon type="stats-bars"></Icon> {{ item }}</MenuItem>
            </div>
    </Menu> -->
    <Menu mode="horizontal" active-name="1" @on-select="selectChange">
        <div v-for="item in departmentFront">
            <MenuItem :name="item">
                <Icon type="flag"></Icon>{{ item }}
            </MenuItem >
        </div>
        <Submenu name="" v-if="departmentBack.length>0">
            <template slot="title">
                <Icon type="android-more-vertical"></Icon> 更多
            </template>
            <div v-for="item in departmentBack">
                <MenuItem :name="item">{{ item }}</MenuItem>
            </div>
        </Submenu>
    </Menu>
</template>

<script>
export default {
    name: 'topNav',
    props: {
        department: Array
    },
    data () {
        return {
            selectItem: '基础数据',
            navWidth: 0,
            departmentFront: [],
            departmentBack: []
        }
    },
    mounted () {
        this.navWidth = document.querySelector('.header-middle-con').offsetWidth;
        window.onresize = () => {
            return (() => {
                this.navWidth = document.querySelector('.header-middle-con').offsetWidth;
            })()
        }
    },
    methods: {
        selectChange (name) {
            this.selectItem = name;
            // this.currentDepartment = name;
            this.$emit('top-nav', name)
        }
    },
    watch: {
        navWidth: function (val) {
            this.departmentFront = this.department.slice(0, parseInt((val-103)/113));
            this.departmentBack = this.department.slice(parseInt((val-103)/113));
        }
    }
}
</script>

<style>

</style>
