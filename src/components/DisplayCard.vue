<template>
    <el-card :body-style="{ height: showTable ? '800px' : '400px', 'position': 'relative' }">
        <div style="height: 330px">
            <slot></slot>
        </div>
        <el-button type="text" @click="toggleTable" :style="{display: (params === false ? 'none':'inline-block')}">{{ showTable ? '收起数据' : '明细数据' }}
            <i v-bind:class="[showTable ? 'el-icon-arrow-up':'el-icon-arrow-down']" class="el-icon--right"></i>
        </el-button>
    </el-card>
</template>

<script>

export default {
    props:['params'],
    data() {
        return {
            showTable: false,
            cardData: {}
        }
    },
    methods: {
        toggleTable() {
            this.showTable = !this.showTable
        }
    }
}
</script>

<style lang="scss">
.el-button--text{
    float: right;
}

.el-card__body {
    padding: 20px 20px 50px 20px
}
</style>
