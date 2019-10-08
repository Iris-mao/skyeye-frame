<template>
  <div class="date-picker">
    <el-select v-model="value" @change="change()" size="medium">
      <el-option key="week" label="按周" value="week"></el-option>
      <el-option key="month" label="按月" value="month"></el-option>
    </el-select>
    <el-date-picker size="medium" v-model="valueTime[value]" :type="value" :format="formatValue[value]" :placeholder="placeholderValue[value]"
                    @change="change()" style="width:220px" :picker-options="pickerOptions1" :clearable="false">
    </el-date-picker>
  </div>
</template>

<script>
import { formatDate } from '../common'
export default {
    data() {
        return {
            value: 'week', // 默认下拉选值为周
            placeholderValue: { 'week': '选择周', 'month': '选择月' },
            valueTime: { 'week': (new Date()).getTime(), 'month': new Date() }, // 初始化周和月的默认值
            formatValue: { 'week': '', 'month': '' },
            pickerOptions1: { // 当前时间之后的时间在时间选框中无法选择
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
                firstDayOfWeek: 1
            },
            postData: [] // 传给父组件的时间值
        }
    },
    mounted() {
        // 初始化传给父组件的周取值，默认为当前周
        this.postData = []
        var preDate = new Date(this.getFirstDayOfWeek(new Date()).getTime())
        var lastDate = new Date(this.getFirstDayOfWeek(new Date()).getTime() + 6 * 24 * 60 * 60 * 1000)
        this.formatValue['week'] = formatDate(new Date(preDate), 'yyyy-MM-dd') + ' ~ ' + formatDate(new Date(lastDate), 'yyyy-MM-dd')
        this.postData.push(formatDate(new Date(preDate), 'yyyy-MM-dd'))
        this.postData.push(formatDate(new Date(lastDate), 'yyyy-MM-dd'))

        this.$emit('timeItem', this.postData)
    },
    methods: {
        change() {
        // 时间切换之后的postData存值
            if (this.value === 'week') {
                this.postData = []
                var p = /[a-z]/i
                var preDate = ''; var lastDate = ''
                if (p.test(this.valueTime['week'])) {
                    preDate = new Date(this.valueTime['week'].getTime() - 24 * 60 * 60 * 1000)
                    lastDate = new Date(this.valueTime['week'].getTime() + 5 * 24 * 60 * 60 * 1000)
                } else {
                    preDate = new Date(this.getFirstDayOfWeek(new Date()).getTime())
                    lastDate = new Date(this.getFirstDayOfWeek(new Date()).getTime() + 6 * 24 * 60 * 60 * 1000)
                }
                this.formatValue['week'] = formatDate(new Date(preDate), 'yyyy-MM-dd') + ' ~ ' + formatDate(new Date(lastDate), 'yyyy-MM-dd')
                this.postData.push(formatDate(new Date(preDate), 'yyyy-MM-dd'))
                this.postData.push(formatDate(new Date(lastDate), 'yyyy-MM-dd'))
            } else {
                this.postData = []
                this.postData.push(formatDate(this.valueTime['month'], 'yyyy-MM'))
            }
            this.$emit('timeItem', this.postData)
        },
        // 获取当前日期所在周的星期一,初始化一开始的自然周时间
        getFirstDayOfWeek(date) {
            var day = date.getDay() || 7
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day)
        }

    }
}
</script>

<style lang="scss">
  .date-picker{
    width: 330px;
    text-align: right;
    padding: 5px 10px;
  }

  .el-select{
    width: 80px;
    margin-right: 10px;
  }
  /*.el-input--suffix .el-input__inner{*/
  /*border: none;*/
  /*}*/
  .el-input__prefix{
    left: initial;
    right: 5px;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 15px;
  }
</style>
