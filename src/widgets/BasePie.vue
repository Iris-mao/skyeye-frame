<template>
  <div style="width: 100%;height: 100%;">
    <chart ref="pie" :options="options" auto-resize style="width: 100%;height: 100%;"></chart>
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
            subtext: this.params.subtitle,
          },
          legend: {
            icon:"circle",
            orient: 'vertical',
            right: '10%',
            top: '45%',
            bottom: 20,
            data: []
          },
          color:['#1890FF','#41D9C7','#2FC25B','#FACC14','#E6965C','#223273','#7564CC','#8543E0','#5C8EE6',
            '#13C2C2','#5CA3E6'],
          tooltip : {
            trigger: 'item'
          },
          grid: {
            top: '10%',
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          toolbox: {
            right: '5%',
            feature: {
              saveAsImage: {}
            }
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
          series : [
            {
              name: this.params.title,
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['35%', '60%'],
              data:[],
              label: {
                normal: {
                  formatter: ' {b|{b}: }{c} ({per|{d}%})  ',
                  borderRadius: 4,
                  rich: {
                    b: {
                      fontSize: 14,
                      lineHeight: 33
                    },
                    per: {
                      padding: [2, 4],
                      borderRadius: 2
                    }
                  }
                }
              },
            }
          ]
        }
      }
    },
    computed: {
      ...mapState({
        isCollapse: state => state.isCollapse
      })
    },
    watch: {
      'params.postData.date_range': function () {
        this.getData()
      },
      isCollapse() {
        if (this.debounced) {
          this.debounced.cancel()
        }
        this.debounced = _debounce(() => {
          if (this.$refs.pie) {
            this.$refs.pie.resize()
          }
        }, 500)
        this.debounced()
      }
    },
    mounted() {
      this.getData()

      window.addEventListener('resize', () => {
        if (this.$refs.pie) {
          this.$refs.pie.resize()
        }
      }, false)
    },
    methods: {
      getData() {
        this.options.graphic[0].invisible = true
        this.$refs.pie.showLoading()

        this.options.series[0].data = []
        this.options.legend.data = []

        this.$http.request({
          url: this.params.url,
          method: 'post',
          data:this.params.postData
        }).then(response =>  {
          const result = response.data

          this.resultData.excelData = []

          if (result.date) {
            this.options.title.subtext = result.date[0] + ' ~ ' + result.date[1] + (this.params.subTitle || '')
          }

          if (result.x_data && result.x_data.length > 0 && result.y_data.length > 0) {
            const arr = []
            for(const i in result.x_data){
              this.options.legend.data.push(result.x_data[i])
              arr.push({name:result.x_data[i],value:result.y_data[i]})
            }
            this.options.series[0].data = arr

            // table数据
            this.resultData.tableProp = ['name', 'value']
            this.resultData.tableData = result.x_data.map((name, index) => ({
              name,
              value: result.y_data[index]
            }))

            this.resultData.excelTitle = this.params.title + '.xlsx'
            this.resultData.sheetName = this.params.title
            this.resultData.excelData.push(this.resultData.tableData)

          } else {
            this.options.graphic[0].style.text = '暂无数据'
            this.options.graphic[0].invisible = false
          }

          this.$refs.pie.hideLoading()
        }).catch(error => {
          this.options.graphic[0].style.text = '网络异常'
          this.options.graphic[0].invisible = false
          this.$refs.pie.hideLoading()
          console.error(error)
        })
      }
    }
  }

</script>
