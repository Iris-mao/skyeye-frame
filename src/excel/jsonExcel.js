import XLSX from 'xlsx/dist/xlsx.full.min'

export default function toExcel(data, sheetName, title) {
    // 创建 workbook
    var workbook = XLSX.utils.book_new()

    for (var i = 0; i < data.length; i++) {
        var ws = 'ws' + i

        // 创建sheet
        ws = XLSX.utils.json_to_sheet(data[i])
        // 将sheet 添加到 workbook中
        XLSX.utils.book_append_sheet(workbook, ws, sheetName)
    }
    // 导出workbook
    XLSX.writeFile(workbook, title)
}
