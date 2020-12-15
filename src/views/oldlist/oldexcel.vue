<template>
  <div class="app-container">
    <!-- 这是上面上传那块代码 -->
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" @sentData="uploadFile"/>
    <!-- 这是上传之后的显示代码 -->
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { uploadOld } from "@/api/oldlist";
export default {
  name: 'oldExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    },
    uploadFile(rawFile){
      let form = new FormData();
      form.append("file", rawFile);
      uploadOld(form)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {});
    }
  }
}
</script>
