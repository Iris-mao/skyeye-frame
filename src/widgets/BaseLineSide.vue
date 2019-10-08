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
            x : 'center',
            y : 'bottom',
            data:[],
            icon:"circle"
          },
          grid: {
            top: '25%',
            left: '3%',
            right: '8%',
            bottom: '10%',
            containLabel: true
          },
          toolbox: {
            right: '5%',
            feature: {
              saveAsImage: {}
            }
          },
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
          yAxis: [{
            name: '总时长(小时)',
            type: 'value',
            axisLine: {show:false},
            axisTick: {show:false},
            splitLine:{
              lineStyle:{
                type:'dashed'
              }
            },
          },{
            name: '人均时长(分钟)',
            type: 'value',
            axisLine: {show:false},
            axisTick: {show:false},
            splitLine:{
              lineStyle:{
                type:'dashed'
              }
            },
          }],
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
      'params.active': function () {
        this.getData()
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

          if (result.y_data && Object.keys(result.y_data).length > 0) {
            for(var i in result.y_data){
              this.options.legend.data.push(i)
              this.options.series.push({
                name: i,
                type:'line',
                yAxisIndex: i==='人均学习时长'?1:0,
                data: result.y_data[i],
                smooth: true
              })
            }

            // table数据
            const yDataKeys = Object.keys(result.y_data)
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

            this.resultData.excelTitle = this.params.title + '.xlsx'
            this.resultData.sheetName = this.params.title
            this.resultData.excelData.push(this.resultData.tableData)

            // var img = this.$refs.line.getDataURL();  // 获取图片的base64编码，为png图片
            // console.log(img,1)

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
