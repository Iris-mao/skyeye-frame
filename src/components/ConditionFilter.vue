<template>
  <div style="width: calc(100% - 330px)">
    <div class="ribbon">
      <span>已选择：</span>
      <div class="selected-items" @click.stop="showFilter">
        <el-tooltip v-for="(val, key) in selectedItems" :key="key" class="item" effect="dark" placement="top">
          <div slot="content" style="max-width: 600px"><span v-for="(item,index) in val" :key="index">{{item.name}}
                    {{(index === (val.length-1)) ? '' : ', '}}</span></div>
          <el-tag
            type="primary"  @click.stop="showFilter" @close.stop="onClose(key)" closable>
            <div style="max-width: 150px;overflow: hidden;white-space:nowrap;
                 text-overflow:ellipsis;display: inline-block">
              <span  class="" >({{ tag[key] }}) </span>
              <span v-for="(item,index) in val" :key="index">{{item.name}}
                    {{(index === (val.length-1)) ? '' : '、'}}</span>
            </div>
          </el-tag>
        </el-tooltip>
      </div>
      <el-button type="text" @click="showFilter"><i class="iconfont icon-filter"></i></el-button>
    </div>
    <div class="filter-content"
         :style="{'margin': '15px 20px 0 0','padding': '15px','background': '#fff','display':display,'position':'absolute','z-index':'999'
            ,'border':'1px solid #ddd','box-shadow':'-5px 5px 5px #ddd'}">
      <div class="selectable-part">
        <div v-for="(item,i) in filtersValue" :key="i" v-show="Boolean(item.data)" class="sort-list">
          <span>{{ condition[i] }} :</span>
          <el-checkbox :indeterminate="item.isIndeterminate" :checked="item.selected" v-model="item.selected"
                       @change="handleCheckedCountryAllChange(i,item.id,$event)"
                       :key="i" style="margin-right: 20px">
            全选</el-checkbox>
          <div>
            <el-checkbox v-for="data in item.data" v-model="data.selected" :checked="data.selected"
                         @change="handleCheckedCountryChange(i,data.pid,item.id,$event)"
                         :label="data" :key="data.pid"
            >
              {{data.name}}</el-checkbox>
          </div>
        </div>
      </div>
      <el-row style="text-align: center">
        <el-button size="mini" @click="formatPostData">确定</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import { isEmptyObject } from '../common'
import { SKYEYE4_API_URL } from '../api'

export default {
    data() {
        return {
            checked: true,
            display: 'none',
            flag: 0,
            filtersValue: {
                industry: [],
                province: {},
                revenue: {},
                staff: {},
                salesArea: {},
                price: {}
            },
            selectedItems: {},
            checkedValues: [],
            checkAll: false,
            isIndeterminate: true,
            condition: {
                industry: '所在行业',
                province: '所在地区',
                revenue: '营收规模',
                staff: '员工规模',
                salesArea: '销售区域',
                price: '软件单价'
            },
            tag: {
                industry: '行业',
                province: '地区',
                revenue: '营收',
                staff: '员工',
                salesArea: '销售区域',
                price: '客单价',
                signTime: '签约时间' }
        }
    },
    mounted() {
        this.getSortList()
    },
    methods: {
        handleCheckedCountryAllChange(index, topId, e) { // 二级change事件
            this.filtersValue[index].selected = e// 二级勾选后，子级全部勾选或者取消
            if (e === false) this.filtersValue[index].isIndeterminate = false // 去掉二级不确定状态
            var childrenArray = this.filtersValue[index].data
            if (childrenArray) {
                for (var i = 0, len = childrenArray.length; i < len; i++) { childrenArray[i].selected = e }
            }
        },
        handleCheckedCountryChange(topIndex, sonId, topId, e) { // 三级change事件
            var childrenArray = this.filtersValue[topIndex].data
            var tickCount = 0; var unTickCount = 0; var len = childrenArray.length
            for (var i = 0; i < len; i++) {
                if (sonId === childrenArray[i].id) childrenArray[i].selected = e
                if (childrenArray[i].selected === true) tickCount++
                if (childrenArray[i].selected === false) unTickCount++
            }
            if (tickCount === len) { // 三级级全勾选
                this.filtersValue[topIndex].selected = true
                this.filtersValue[topIndex].isIndeterminate = false
            } else if (unTickCount === len) { // 三级级全不勾选
                this.filtersValue[topIndex].selected = false
                this.filtersValue[topIndex].isIndeterminate = false
            } else {
                this.filtersValue[topIndex].selected = false
                this.filtersValue[topIndex].isIndeterminate = true // 添加二级不确定状态
            }
        },
        // 获取选择框部分的数据
        getSortList() {
            this.$http.get(SKYEYE4_API_URL.COMMON_CONDITIONS)
                .then(response => {
                    let data = response.data
                    let j = 0
                    for (let i in this.filtersValue) {
                        this.vm.$set(this.filtersValue, i, { data: data[i],
                            isIndeterminate: false,
                            selected: false,
                            id: j++ })
                    }
                    for (let i in this.filtersValue) {
                        for (let j in this.filtersValue[i].data) {
                            this.vm.$set(this.filtersValue[i].data, j, { name: this.filtersValue[i].data[j].name,
                                pid: this.filtersValue[i].data[j].pid,
                                selected: false })
                            this.filtersValue[i].data[j].selected = false
                        }
                    }
                })
        },
        // 格式化选中的数据
        formatPostData() {
            let rawData = this.filtersValue
            let postData = {}
            this.selectedItems = {}

            for (var i in rawData) {
                if (!isEmptyObject(rawData[i])) {
                    if (rawData[i].isIndeterminate === true || rawData[i].selected === true) {
                        postData[i] = []
                        this.vm.$set(this.selectedItems, i, [])
                        let m = 0
                        for (var j in rawData[i].data) {
                            if (rawData[i].data[j].selected === true) {
                                postData[i].push(rawData[i].data[j].pid)
                                this.vm.$set(this.selectedItems[i], m++, { name: rawData[i].data[j].name, pid: rawData[i].data[j].pid })
                            }
                        }
                    }
                }
            }

            this.$emit('filterItem', postData)

            this.flag = 0
            this.display = 'none'
        },
        showFilter() {
            this.flag = !this.flag
            this.display = (this.flag ? 'block' : 'none')
        },
        cancel() {
            this.flag = 0
            this.display = 'none'
        },
        onClose(key) {
            for (var i in this.filtersValue) {
                if (i === key) {
                    this.filtersValue[i].isIndeterminate = false
                    for (var j in this.filtersValue[i].data) {
                        this.filtersValue[i].data[j].selected = false
                    }
                }
            }
            this.$delete(this.selectedItems, key) // vue删除方式
            let postData = {}

            for (var m in this.selectedItems) {
                postData[m] = []
                for (var n in this.selectedItems[m]) {
                    postData[m].push(this.selectedItems[m][n].pid)
                }
            }

            this.$emit('filterItem', postData)
        }
    }
}
</script>

<style lang="scss">
  .el-tag .el-icon-close{
    top:-12px;
  }

  .el-tooltip__popper.is-dark {
    background: #ddd;
    color: #333;
  }

  .el-tooltip__popper[x-placement^=top] .popper__arrow::after {
    border-top-color: #ddd;
  }

  .el-tooltip__popper[x-placement^=top] .popper__arrow{
    border-top-color: #ddd;
  }

  .el-tooltip__popper[x-placement^=bottom] .popper__arrow::after {
    border-bottom-color: #ddd;
  }

  .el-tooltip__popper[x-placement^=bottom] .popper__arrow{
    border-bottom-color: #ddd;
  }

  .ribbon{
    display: flex;
    flex-flow: row nowrap;
    line-height: 40px;
    overflow: hidden;
    font-size: 14px;
    /*background: #EFF2F7;*/
    /*border: 1px solid #D3DCE6;*/
    color: #1F2D3D;

    > span:first-child{
      margin-left: 10px;
      line-height: 48px;
      white-space: nowrap;
    }

    .selected-items {
      flex: 1 1 auto;
      padding-right: 10px;
      margin-bottom: 8px;

      .el-tag{
        float: left;
        margin: 8px 0 0 10px;
        font-size: 13px;

        span:first-child{
          font-size: 10px;
          color: #a00;
        }
      }
    }
  }

  .selected-part {
    margin-bottom: 10px;
  }

  .selectable-part {
    font-size: 14px;
    padding: 0 10px 10px 10px;
    line-height: 19px;
    color: #1f2d3d;

    .sort-list {
      display: flex;
      flex-flow: row nowrap;
      margin-bottom: 5px;

      >span:first-child {
        min-width: 70px;
        /*padding: 10px 0 5px 0;*/
        margin-right: 10px;
      }

      >ul {
        list-style: none;
        padding: 0;
        margin: 0;
        transition: max-height 0.5s ease-in-out;
        max-height: 500px;
        overflow: hidden;

        >li {
          float: left;
          width: 120px;
          margin: 10px 20px 0 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          cursor: pointer;

          &:hover {
            color: #20A0FF;
          }
        }

        >li.select{
          color: #20A0FF;
        }
      }

      .collapse-btn {
        min-width: 60px;
        height: 25px;
        line-height: 25px;
        padding: 0;
        border-radius: 3px;
        text-align: center;
        border: 1px solid #bfcbd9;
        cursor: pointer;
        margin-left: auto;
        margin-top: 5px;

        &:hover {
          color: #20A0FF;
          border-color: #20A0FF;
        }
      }

      .collapse {
        height: 30px;
        max-height: 30px;
      }
    }
  }
</style>
