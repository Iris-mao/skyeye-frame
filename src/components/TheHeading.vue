<template>
    <div class="heading-container" :class="{ 'is-collapsed': isCollapse }">
        <div class="logo-part">
            <img src="../assets/logo-small.png" alt="">
            <img v-show="!isCollapse" src="../assets/logo-text.png" alt="" style="margin-left: 5px">
        </div>
        <div class="content-part">
            <div class="toggle-clicker">
                <i
                    :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
                    @click="toggleSidebar"
                ></i>
            </div>
            <div class="company-detail">
                <!--<slot name="logo">-->
                    <!--<img src="../assets/co.png" alt="" />-->
                <!--</slot>-->
              <el-autocomplete v-model="state" ref="searchInput"
                               :fetch-suggestions="fetchOrgQuery" @select="handleSelect"
                               :trigger-on-focus="true" popper-class="org-admin-autocomplete"
                               size="mini" style="margin-right: 20px;width: 300px" width="500"
                               placeholder="请输入要搜索的企业">
                <template slot-scope="{ item }">
                  <div @click.stop="jumpJudgement(item)">{{item.value}}</div>
                </template>
              </el-autocomplete>
              <slot name="title"><i class="el-icon-user-solid"></i> maocy</slot>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { SKYEYE4_API_URL } from '../api'

export default {
    data() {
        return {
            title: '',
            state: ''
        }
    },
    mounted() {
    // this.getInfo()
    // if(document.body.clientWidth < 700){
    //   this.$store.state.isCollapse = true
    // }else{
    //   this.$store.state.isCollapse = false
    // }
        if (document.body.clientWidth < 1000) {
            this.$store.state.isCollapse = true
        }
        window.addEventListener('resize', () => {
            if (document.body.clientWidth < 1000) {
                this.$store.state.isCollapse = true
            }
        }, false)
    },
    computed: {
        ...mapState({
            isCollapse: state => state.isCollapse
        })
    },
    methods: {
        toggleSidebar() {
            this.$store.commit('TOGGLE_SIDEBAR_COLLAPSE')
        },
        fetchOrgQuery(queryString, cb) {
            let cbData = []
            if (!queryString || (this.presentSite !== 'srvskyeye' && queryString.length < 2)) {
                cb(cbData)
                return
            }

            const url = SKYEYE4_API_URL.COMMON_SEARCH

            this.$http.request({
                url: url,
                method: 'post',
                data: { keyword: queryString }
            }).then((response) => {
                cbData = response.data.map((item, i) => {
                    return { id: item.orgId, value: item.orgName, token: item.token }
                })
                cb(cbData)
            })
                .catch((response) => {
                    console.log(response)
                })
        },
        jumpJudgement(item) {
            if (!item.id) return
            this.handleSelect(item)
        },
        handleSelect(item) {
            setTimeout(() => {
                this.handleOrgClick({
                    id: item.id,
                    name: item.value,
                    token: item.token
                })
                this.state = ''
                this.$refs.searchInput.focus()
            }, 100)
        },
        handleOrgClick(item) {
            if (!item.id) return
            let urlBase = 'https://orgskyeyev4.yunxuetang.com/'

            if (!urlBase) {
                urlBase = window.location.origin
            }
            window.open(urlBase + '?id=' + item.id + '&token=' + item.token)
        }
        // getInfo(){
        //   this.$http.request({
        //     url: SKYEYE_COMMON_URL.ORG_INFO,
        //     method: 'post',
        //     data:{orgid: sessionStorage.getItem('id')}
        //   }).then(response =>  {
        //     this.title = response.data.orgName
        //   }).catch(error => {
        //     console.error(error)
        //   })
        // }
    }
}
</script>

<style lang="scss">
$sideWidth: 200px;
$toggleWidth: 64px;
$headingHeight: 64px;

.heading-container {
    height: $headingHeight;

    .logo-part {
        transition: all 0.5s;
        float: left;
        width: $sideWidth;
        height: 100%;
        background-color: #7f63f4;
        padding-left: 15px;
        box-shadow: 1px 0 5px 0 rgba(0, 0, 0, 0.4);
    }

    .content-part {
        height: 100%;
        transition: all 0.5s;
        margin-left: $sideWidth;

        .toggle-clicker {
            transition: all 0.5s;
            float: left;
            margin-left: 10px;
            color: #909399;
            font-size: 32px;
            height: $headingHeight;
            line-height: $headingHeight;
            display: none;

            i {
                cursor: pointer;
            }
        }

      @media screen and (min-width: 800px) {
        .toggle-clicker {
          display: inline-block!important;
        }
      }

        .company-detail {
            float: right;
            padding-right: $headingHeight;
            height: $headingHeight;
            line-height: $headingHeight;
            color: #333;

            img {
                width: 32px;
                height: 32px;
                vertical-align: middle;
                margin-right: 10px;
            }
        }
    }

    &.is-collapsed {
        .logo-part {
            width: $toggleWidth;
            padding-left: 7px;
        }
        .content-part {
            margin-left: $toggleWidth;
        }
    }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
