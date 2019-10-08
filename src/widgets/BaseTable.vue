<template>
    <div style="position: relative">
        <download-button :title="this.params.excelTitle" :data="this.params.excelData" :sheetName="this.params.sheetName"></download-button>
        <el-table :data="this.params.tableData" height="350" border style="width: 100%; margin-top: 70px">
            <el-table-column v-for="i in this.params.tableProp" :key="i" :prop="i" :label="i">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import DownloadButton from './DownloadButton'

export default {
    components: {
        DownloadButton
    },
    props:['params'],
    data() {
        return {}
    },
    mounted() {},
    watch: {},
    methods: {}
}
</script>
<style lang="scss">
.el-table__body-wrapper::-webkit-scrollbar {
    height: 16px;
    overflow: visible;
    width: 17px;
    background: transparent;
}
.el-table__body-wrapper::-webkit-scrollbar-button {
    height: 0;
    width: 0;
}
.el-table__body-wrapper::-webkit-scrollbar-corner {
    background: transparent;
}
.el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: rgba(144, 147, 153, 0.3);
    background-clip: padding-box;
    border: solid;
    border-color: rgba(0, 0, 0, 0);
    border-width: 5px;
    border-radius: 10px;
    min-height: 28px;
    padding: 100px 0 0;
    &:hover {
        background-color: rgba(144, 147, 153, 0.4);
    }
    &:active {
        background-color: rgba(144, 147, 153, 0.4);
    }
    &:horizontal {
        padding: 0 0 0 100px;
    }
}
.el-table__body-wrapper::-webkit-scrollbar-track {
    background-clip: padding-box;
    border: solid transparent;
    border-width: 0 0 0 17px;
}
</style>
