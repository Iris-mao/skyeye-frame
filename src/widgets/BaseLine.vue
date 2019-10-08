<template>
  <div style="width: 100%;height:100%">
    <chart  ref="line" :options="options" auto-resize style="width: 100%;height:100%"></chart>
    <base-table :params="resultData"></base-table>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import _debounce from 'lodash/debounce'
  import BaseTable from '../widgets/BaseTable'

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
          tooltip: {
            trigger: 'axis'
          },
          color:['#1890FF','#41D9C7','#2FC25B','#FACC14','#E6965C','#223273','#7564CC','#8543E0','#5C8EE6',
            '#13C2C2','#5CA3E6'],
          legend: {
            type:'scroll',
            x : 'center',
            y : 'bottom',
            data:[],
            formatter:function (params) {
              if(params.split("-").length > 1){
                return params.split("-")[1] + '-' + params.split("-")[2]
              }else{
                return params
              }
            },
            icon:"circle"
          },
          grid: {
            top: '24%',
            left: '3%',
            right: '4%',
            bottom: '13%',
            containLabel: true
          },
          toolbox: {
            right: '5%',
            feature: {
              saveAsImage: {}
            }
          },
          dataZoom: [],
          xAxis: {
            type: 'category',
            boundaryGap: true,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#bbbbbb'
              }
            },
            axisLine:{
              lineStyle:{
                color:'#bbbbbb',
                width:2,
              }
            },
            data: []
          },
          yAxis: {
            type: 'value',
            name: this.params.unit,
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
          series: []
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
      'params.postData.active_type': function (newVal, oldVal) {
        if (oldVal) {
          this.getData()
        }
      },
      isCollapse() {
        if (this.debounced) {
          this.debounced.cancel()
        }
        this.debounced = _debounce(() => {
          if (this.$refs.line) {
            this.$refs.line.resize()
          }
        }, 500)
        this.debounced()
      }
    },
    mounted() {
      this.getData()

      window.addEventListener('resize', () => {
        if (this.$refs.line) {
          this.$refs.line.resize()
        }
      }, false)
    },
    methods: {
      getData() {
        this.options.graphic[0].invisible = true
        this.$refs.line.showLoading()

        this.options.legend.data = []
        this.options.series = []
        this.options.xAxis.data = []

        this.$http.request({
          url: this.params.url,
          method: 'post',
          data:this.params.postData
        }).then(response =>  {
          const result = response.data

          // this.options.dataZoom = []

          if (result.date) {
            this.options.title.subtext = result.date[0] + ' ~ ' + result.date[1] + (this.params.subTitle || '')
          }

          this.options.xAxis.data = result.x_data

          if (result.x_data && result.y_data && result.x_data.length > 0) {
            let yDataKeys = []

            if (result.y_data.constructor !== Array) {
              yDataKeys = Object.keys(result.y_data)
              if (Date.parse(yDataKeys[0])) {
                yDataKeys = yDataKeys.sort((a, b) => Date.parse(a) - Date.parse(b))
              } else if (yDataKeys.some( val => val === '全部')) {
                yDataKeys.splice(yDataKeys.indexOf('全部'), 1)
                yDataKeys.unshift('全部')
              }
              this.options.legend.data = yDataKeys

              yDataKeys.forEach((i) => {
                this.options.series.push({
                  name: i,
                  type:'line',
                  data: result.y_data[i],
                  smooth: true
                })
              })
            } else {
              this.options.series.push({
                name: this.params.title,
                type:'line',
                data: result.y_data,
                smooth: true
              })
            }

            if(this.params.zoom){
              this.options.dataZoom = [{
                type: 'inside',
                zoomOnMouseWheel: false,
                start: 70,
                end: 100
              }, {
                type: 'slider',
                show: true,
                bottom: '10%'
              }]
              this.options.grid.bottom = '20%'
            }

            // table数据
            if (result.y_data instanceof Array) {
              this.resultData.tableProp = ['时间', '数值']
              this.resultData.tableData = result.x_data.map((date, index) => ({
                '时间': date,
                '数值': result.y_data[index]
              }))
            } else {
              this.resultData.tableData = result.x_data.map((date, index) => {
                const datum = {
                  '时间': date
                }
                yDataKeys.forEach(key => {
                  datum[key] = result.y_data[key][index]
                })
                return datum
              })
              this.resultData.tableProp = ['时间', ...yDataKeys]
            }

            this.resultData.excelTitle = this.params.title + '.xlsx'
            this.resultData.sheetName = this.params.title
            this.resultData.excelData.push(this.resultData.tableData)

          } else {
            this.options.graphic[0].style.text = '暂无数据'
            this.options.graphic[0].invisible = false
          }
          this.$refs.line.hideLoading()
        }).catch(error => {
          this.options.graphic[0].style.text = '网络异常'
          this.options.graphic[0].invisible = false
          this.$refs.line.hideLoading()
          console.error(error)
        })

      }
    }
  }

</script>
