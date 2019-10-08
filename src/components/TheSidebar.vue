<template>
    <div class="sidebar-container" :class="{ 'is-collapsed': isCollapse }">
        <el-menu
            :default-active="activeIndex"
            @select="handleSelect"
            router
            :collapse="isCollapse"
            :collapse-transition="false"
            background-color="#ffffff"
        >
           <el-submenu index="0" :default-openeds="[routerPrefix]">
             <template slot="title">
               <i class="el-icon-s-home"></i>
               <span>客户数据</span>
             </template>
             <el-menu-item index="record">档案</el-menu-item>
             <el-menu-item index="general">概要</el-menu-item>
             <!--<el-menu-item index="active">活跃</el-menu-item>-->
             <!--<el-menu-item index="knowledge">学习</el-menu-item>-->
             <!--<el-menu-item index="knowledge">排行榜</el-menu-item>-->
           </el-submenu>

        </el-menu>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import ElSubmenu from 'element-ui/packages/menu/src/submenu'

export default {
    components: {
        ElSubmenu },
    data() {
        return {
            routerPrefix: '/',
            openeds: ['0']
        }
    },
    computed: {
        ...mapState({
            isCollapse: state => state.isCollapse
        }),
        activeIndex() {
            // console.log(this.$route.path.split('/').pop())
            return this.$route.path.split('/').pop()
        }
    },
    mounted() {},
    methods: {
        handleSelect() {}
    }
}
</script>
<style lang="scss">
$sideWidth: 200px;
$toggleWidth: 64px;

.sidebar-container {
    transition: all 0.5s;
    position: absolute;
    z-index: 2;
    width: $sideWidth;
    // min-height: calc(100vh - 64px);
    height: calc(100vh - 64px);
    // height: 100%;
    font-size: 14px;
    background-color: #fff;
    box-shadow: 1px 0 5px 0 rgba(0, 0, 0, 0.15);

    i {
        font-size: 18px !important;
        padding-right: 10px;
    }

    &.is-collapsed {
        width: $toggleWidth;
    }

    .el-menu {
        transition: all 0.5s;
        border-right: none;
    }
}
</style>
