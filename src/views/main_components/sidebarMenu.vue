<style lang="less">
    @import './menu.less';
</style>

<template>
    <Menu ref="sideMenu" :active-name="currentPageName" :open-names="openedSubmenuArr" :theme="$store.state.menuTheme" width="auto" @on-select="changeMenu">
        <template v-for="item in menuList">
            <div v-if="currentDepartment==item.give">
                <MenuItem v-if="item.children.length<=1" :name="item.children[0].name" :key="item.path">
                    <Icon :type="item.icon" :size="iconSize" :key="item.path"></Icon>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </MenuItem>

                <Submenu v-if="item.children.length>1" :name="item.name" :key="item.path">
                    <template slot="title">
                        <Icon :type="item.icon" :size="iconSize"></Icon>
                        <span class="layout-text">{{ itemTitle(item) }}</span>
                    </template>
                    <template v-for="child in item.children">
                        <MenuItem :name="child.name" :key="child.name">
                            <Icon :type="child.icon" :size="iconSize"></Icon>
                            <span class="layout-text">{{ child.title }}</span>
                        </MenuItem>
                    </template>
                </Submenu>
            </div>
        </template>
    </Menu>
</template>

<script>
import util from '@/libs/util';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
export default {
    data () {
        return {
            openedSubmenuArr: this.$store.state.openedSubmenuArr,
            currentPageName: this.$route.name,
            department:[]
        };
    },
    name: 'sidebarMenu',
    props: {
        slotTopClass: String,
        menuList: Array,
        iconSize: Number,
        currentDepartment: String
    },
    computed: {
        tagsList () {
            return this.$store.state.tagsList;
        }
    },
    methods: {
        changeMenu (active) {
            if (active !== 'accesstest_index') {
                util.openNewPage(this, active);
                this.$router.push({
                    name: active
                });
            }
        },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        }
    },
    watch: {
        '$route' (to) {
            this.currentPageName = to.name;
            localStorage.currentPageName = to.name;
        },
        currentPageName () {
            this.openedSubmenuArr = this.$store.state.openedSubmenuArr;
            this.$nextTick(() => {
                if (this.$refs.sideMenu) {
                    this.$refs.sideMenu.updateOpened();
                }
            });
        }
    },
    updated () {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
            }
        });
    }

};
</script>
