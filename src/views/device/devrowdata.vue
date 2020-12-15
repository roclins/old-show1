<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.start"
        type="date"
        placeholder="开始时间"
      />
      <el-date-picker
        v-model="listQuery.stop"
        type="date"
        placeholder="结束时间"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
    </div>
    <!-- 下面是列表 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="序号"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ $index }">
          <span>{{ $index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类型" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.device.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备编号" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.device.idintype }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.time | dateFilter("YYYY-MM-DD") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数值" align="center" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.data }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备id" align="center" width="120" v-if="false">
        <template slot-scope="{ row }">
          <span>{{ row.device.id }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="结束时间"
        class-name="status-col"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.stop | dateFilter("HH:mm:ss") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.chinese }}</span>
        </template>
      </el-table-column>
      <el-table-column label="持续时间" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.duration }}</span>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getDeviceData } from "@/api/device";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import moment from "moment";
import user from "@/store/modules/user";
import store from "@/store";

export default {
  name: "DevRowData",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    dateFilter: function (input, fmtstring) {
      return moment(input).format(fmtstring);
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        sort: "",
        limit: 10,
        page: 1,
        deviceId: "",
        start:new Date(new Date().setDate(new Date().getDate() - 14)),
        stop:new Date(),
      },
    };
  },
  created() {
    this.getList();
  },
  computed:{
    currentDeviceId(){
      return store.state.device.currentDeviceId
    }
  },
  watch:{
    currentDeviceId:function(val){
        this.getList()
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      // 这里通过params传参的方式拿到当前老人的参数
      this.listQuery.deviceId = store.getters.currentDeviceId;
      getDeviceData(this.listQuery).then((response) => {
        this.list = response.data.deviceDataList;
        this.total = response.data.total;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },

    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>

<style>
.addSingleOldDialog-container {
  width: 300px;
  margin: 0 auto;
}
.addSingleOldDialog-input {
  width: 220px;
}
.dialogBox-container {
  width: 1500px;
  margin: 0 auto;
}
</style>

