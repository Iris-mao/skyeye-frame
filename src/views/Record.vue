<template>
  <div>
    <div class="select-top">
      <condition-filter @filterItem = "filterItem" style="width: calc(100% - 330px)"></condition-filter>
      <date-picker @timeItem="timeItem"></date-picker>
    </div>
    <div class="content">
      <el-row :gutter="20" class="card-row row-one">
        <el-col :span="24" >
          <display-card :showData="true">

          </display-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import DatePicker from '../components/DatePicker'
import ConditionFilter from '../components/ConditionFilter.vue'
import DisplayCard from '../components/DisplayCard'

export default {
    components: {
        DatePicker,
        ConditionFilter,
        DisplayCard
    },
    data() {
        return {

        }
    },
    methods: {
        timeItem(data) {
            console.log(data)
        },
        filterItem(data) {
            console.log(data)
        }
    }
}
</script>

<style lang="scss">

</style>
