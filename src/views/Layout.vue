<template>
    <div style="height: 100vh">
        <the-heading></the-heading>
        <the-sidebar></the-sidebar>
        <div class="page-container" :class="{ 'is-collapsed': isCollapse }">
            <router-view></router-view>
        </div>
        <el-tooltip content="回到顶部" effect="dark">
            <transition name="fade">
                <div
                    class="back-to-top"
                    v-show="showBackBtn"
                    @click="backToTop"
                >
                    <i class="el-icon-arrow-up"></i>
                </div>
            </transition>
        </el-tooltip>
    </div>
</template>
<script>
import TheHeading from '../components/TheHeading'
import TheSidebar from '../components/TheSidebar'
import { mapState } from 'vuex'

export default {
    components: {
        TheHeading,
        TheSidebar
    },
    data() {
        return {
            showBackBtn: false
        }
    },
    computed: {
        ...mapState({
            isCollapse: state => state.isCollapse
        })
    },
    mounted() {
        window.onscroll = () => {
            if (this.getScrollTop() > 200) {
                this.showBackBtn = true
            } else {
                this.showBackBtn = false
            }
        }
    },
    methods: {
        getScrollTop() {
            let scrollTop =
                document.documentElement.scrollTop || document.body.scrollTop
            return scrollTop
        },
        backToTop() {
            this.$velocity(document.body, 'scroll', {
                offset: 0,
                duration: 200
            })
        }
    }
}
</script>
<style lang="scss">
$sideWidth: 200px;
$toggleWidth: 64px;

.page-container {
    transition: all 0.5s;
    /*padding: 20px;*/
    background-color: #f0f2f5;
    margin-left: $sideWidth;
    height: calc(100vh - 64px);
    overflow: hidden;
    /*min-width: calc(1280px - 240px);*/

    &.is-collapsed {
        margin-left: $toggleWidth;
    }
}

.back-to-top {
    position: fixed;
    z-index: 1001;
    right: 100px;
    bottom: 100px;
    height: 50px;
    width: 50px;
    padding: 8px 10px 12px 10px;
    background: #324057;
    opacity: 0.8;
    border-radius: 50%;
    cursor: pointer;

    i {
        font-size: 30px;
        color: #fff;
    }

    &:hover {
        opacity: 1;
    }
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-active {
    opacity: 0 !important;
}
</style>
