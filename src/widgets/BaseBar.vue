<template>
  <div style="width: 100%;height:100%;">
    <chart ref="bar" :options="options" auto-resize style="width: 100%;height:100%;"></chart>
    <base-table :params="resultData"></base-table>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import _debounce from 'lodash/debounce'
  import BaseTable from '../widgets/BaseTable'
  import { toPercent } from '../common'

  export default {
    components: {
      BaseTable
    },
    props:['params'],
    data() {
      return {
        resultData:{
          tableProp: [],
          tableLabel: [],
          tableData: [],
          excelTitle: '',
          excelData: [],
          sheetName: ''
        },
        options: {
          title: {
            text: this.params.title,
            subtext: '',
          },
          color: ['#1890FF'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter:function (params) {
              let string = (params[0].seriesName.split('-'))[1].split(',')
              let return_string = params[0].name + '<br>' + params[0].marker
                + params[0].value + ' (' + toPercent(string[params[0].dataIndex]) + ')'
              return return_string
            }
          },
          grid: {
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '2%',
            containLabel: true
          },
          toolbox: {
            right: '5%',
            feature: {
              saveAsImage: {}
            }
          },
          xAxis : {
            type: 'category',
            boundaryGap: true,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#bbbbbb'
              },
              interval:0,
              rotate:20,
            },
            axisLine:{
              lineStyle:{
                color:'#bbbbbb',
                width:2
              }
            },
            data : [],
          },
          yAxis : {
            type: 'value',
            axisLine: {show:false},
            axisTick: {show:false},
            splitLine:{
              lineStyle:{
                type:'dashed'
              }
            },
          },
          graphic: [
            {
              type: 'text',
              left: 'center',
              top: 'middle',
              invisible: true,
              style: {
                fill: '#333',
                text: '暂无数据',
                font: '14px Microsoft YaHei'
              }
            }
          ],
          series : {
            name: '人数',
            type:'bar',
            data: [],
            smooth: true
          }
        }
      }
    },
    computed: {
      ...mapState({
        isCollapse: state => state.isCollapse
      })
    },
    watch: {
      'params.postData.date_range': function (newVal, oldVal) {
        if (oldVal) {
          this.getData()
        }
      },
      isCollapse() {
        if (this.debounced) {
          this.debounced.cancel()
        }
        this.debounced = _debounce(() => {
          if (this.$refs.bar) {
            this.$refs.bar.resize()
          }
        }, 500)
        this.debounced()
      }
    },
    mounted() {
      this.getData()

      window.addEventListener('resize', () => {
        if (this.$refs.bar) {
          this.$refs.bar.resize()
        }
      }, false)
    },
    methods: {
      getData() {
        this.options.graphic[0].invisible = true
        this.$refs.bar.showLoading()

        this.options.series.data = []

        this.$http.request({
          url: this.params.url,
          method: 'post',
          data:this.params.postData
        }).then(response =>  {
          const result = response.data

          if (result.date) {
            this.options.title.subtext = result.date[0] + ' ~ ' + result.date[1] + (this.params.subTitle || '')
          }

          this.options.xAxis.data = result.x_data

          if (result.y_data) {
            this.options.series.name = result.y_data.amount + '-' + result.y_data.rate
            this.options.series.data = result.y_data.amount
          } else {
            this.options.graphic[0].style.text = '暂无数据'
            this.options.graphic[0].invisible = false
          }

          // table数据
          // table 数据
          this.resultData.tableProp = ['次数分布', '人数','占比']
          this.resultData.tableData = result.x_data.map((name, index) => ({
            '次数分布': name,
            '人数': result.y_data['amount'][index],
            '占比': toPercent(result.y_data['rate'][index])
          }))

          this.resultData.excelTitle = this.params.title + '.xlsx'
          this.resultData.sheetName = this.params.title
          this.resultData.excelData.push(this.resultData.tableData)

          this.$refs.bar.hideLoading()
        }).catch(error => {
          this.options.graphic[0].style.text = '网络异常'
          this.options.graphic[0].invisible = false
          this.$refs.bar.hideLoading()
          console.error(error)
        })
      }
    }
  }

</script>
