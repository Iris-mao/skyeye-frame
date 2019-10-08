<template>
   <div style="width: 100%;height:100%">
      <chart ref="funnel" :options="options" auto-resize style="width: 100%;height:100%"></chart>
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
      return{
        resultData:{
          tableProp: [],
          tableLabel: [],
          tableData: [],
          excelTitle: '',
          excelData: [],
          sheetName: ''
        },
        options:{
          title: {
            text: this.params.title,
            subtext: '纯属虚构'
          },
          color:['#2673ea','#5a95f2','#90bbfb'],
          toolbox: {
            right: '5%',
            feature: {
              saveAsImage: {}
            }
          },
          calculable: true,
          graphic: [
            {
              type: 'text',
              // left: 'center',
              left: '30%',
              top: 'middle',
              invisible: true,
              style: {
                fill: '#333',
                text: '暂无数据',
                font: '14px Microsoft YaHei'
              }
            }
          ],
          series: [
            {
              name:'项目完成度',
              type:'funnel',
              left: '10%',
              top: '20%',
              //x2: 80,
              bottom: 20,
              // right: '35%',
              right: '58%',
              // width: '80%',
              // height: {totalHeight} - y - y2,
              min: 0,
              max: 100,
              minSize: '40%',
              maxSize: '100%',
              sort: 'descending',
              gap: 2,
              label: {
                // normal: {
                //   formatter: '{b}'
                // },
                show: true,
                position: 'inside'
              },
              markLine:{
                symbol:['none'],
                lineStyle:{
                  type:'solid',
                  opacity: 1
                },
                label: {
                  show: true
                },
                data:[
                  [{x:'44%',y:'35%'},{x:'49%',y:'35%'}],
                  [{x:'49%',y:'35%'},{x:'49%',y:'50%',value:''}],
                  [{x:'49%',y:'50%'},{x:'42%',y:'50%',symbol:['arrow']}],   // 第一根
                  [{x:'44%',y:'60%'},{x:'49%',y:'60%'}],
                  [{x:'49%',y:'60%'},{x:'49%',y:'75%',value:''}],
                  [{x:'49%',y:'75%'},{x:'42%',y:'75%',symbol:['arrow']}],   // 第二根
                  [{x:'42%',y:'25%'},{x:'56%',y:'25%'}],
                  [{x:'56%',y:'25%'},{x:'56%',y:'90%',value:''}],
                  // [{x:'56%',y:'25%'},{x:'56%',y:'90%',value:'',lineStyle:{color:'rgba(0,0,0,0.5)'}}],
                  [{x:'56%',y:'90%'},{x:'37%',y:'90%',symbol:['arrow']}],   // 第三根
                ]
              },
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 1
              },
              data: []
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
          if (this.$refs.funnel) {
            this.$refs.funnel.resize()
          }
        }, 500)
        this.debounced()
      }
    },
    mounted(){
      this.getData()

      window.addEventListener('resize', () => {
        if (this.$refs.funnel) {
          this.$refs.funnel.resize()
        }
      }, false)
    },
    methods:{
      getData(){
        this.options.series[0].markLine.lineStyle.opacity = 1
        this.options.series[0].markLine.label.show = true
        this.options.graphic[0].invisible = true
        this.$refs.funnel.showLoading()

        this.options.series[0].data = []

        this.$http.request({
          url: this.params.url,
          method: 'post',
          data:this.params.postData
        }).then(response =>  {
          let result = response.data

          if (result.date) {
            this.options.title.subtext = result.date[0] + ' ~ ' + result.date[1] + (this.params.subTitle || '')
          }

          this.options.series[0].data.push({value: result.arrange_study_amount, name: '安排学习人数'},
            {value: result.join_study_amount, name: '参与学习人数'},
            {value: result.complete_amount, name: '完成人数'})
          this.options.series[0].markLine.data[1][1].value = '参与度'+'\n'+ toPercent(result.join_rate)
          this.options.series[0].markLine.data[4][1].value = '参与完成度'+ '\n'+ toPercent(result.join_complete_rate)
          this.options.series[0].markLine.data[7][1].value = '项目完成率'+ '\n' + toPercent(result.project_complete_rate)

          this.resultData.tableProp = ['指标','数值']
          this.resultData.tableData.push({'指标':'学习项目数','数值':result.study_project_amount},
              {'指标':'安排人数','数值':result.arrange_study_amount},{'指标':'参与人数','数值':result.join_study_amount},
              {'指标':'完成人数','数值':result.complete_amount},{'指标':'参与度','数值':toPercent(result.join_rate)},
              {'指标':'参与完成度','数值':toPercent(result.join_complete_rate)},
              {'指标':'项目完成率','数值':toPercent(result.project_complete_rate)})
          this.resultData.excelTitle = this.params.title + '.xlsx'
          this.resultData.sheetName = this.params.title
          this.resultData.excelData.push(this.resultData.tableData)

          this.$refs.funnel.hideLoading()
        }).catch(error => {
          this.options.series[0].markLine.lineStyle.opacity = 0
          this.options.series[0].markLine.label.show = false
          this.options.graphic[0].style.text = '网络异常'
          this.options.graphic[0].invisible = false
          this.$refs.funnel.hideLoading()
          console.error(error)
        })
      }
    }
  }
</script>
