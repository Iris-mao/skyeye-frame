<template>
  <div>
    <div class="select-top">
      <condition-filter @filterItem = "filterItem" style="width: calc(100% - 330px)"></condition-filter>
      <date-picker @timeItem="timeItem"></date-picker>
    </div>
    <div class="content">
    </div>
  </div>
</template>

<script>
import DatePicker from '../components/DatePicker'
import ConditionFilter from '../components/ConditionFilter.vue'

export default {
    components: {
        DatePicker,
        ConditionFilter
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
