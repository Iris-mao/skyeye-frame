<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    :header-cell-style="{background:'#fafafa',color:'#555','border-top':'1px solid #eaeaea',height:'40px','line-height':'40px'}"
    :cell-style="{height:'70px','line-height':'70px'}">
    <el-table-column
      prop="name"
      label="项目名">
    </el-table-column>
    <el-table-column
      prop="proNum"
      label="项目数量（个）">
    </el-table-column>
    <el-table-column
      prop="signNum"
      label="指派/报名人数（人）">
    </el-table-column>
    <el-table-column
      prop="joinNum"
      label="参与人数（人）">
    </el-table-column>
    <el-table-column
      prop="cmpNum"
      label="完成人数（人）">
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          name: '学习计划',
          proNum: '1',
          signNum: '2107',
          joinNum: '1904',
          cmpNum: '809'
        }, {
          name: '混合式培训（OTO）',
          proNum: '1',
          signNum: '2107',
          joinNum: '1904',
          cmpNum: '809'
        }, {
          name: '线下培训',
          proNum: '1',
          signNum: '2107',
          joinNum: '1904',
          cmpNum: '809'
        }, {
          name: '师徒制培训（OJT）',
          proNum: '1',
          signNum: '2107',
          joinNum: '1904',
          cmpNum: '809'
        }, {
          name: '合计',
          proNum: '1',
          signNum: '2107',
          joinNum: '1904',
          cmpNum: '809'
        }]
      }
    }
  }
</script>
