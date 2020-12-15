<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryOldName"
        placeholder="姓名"
        style="width: 150px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
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
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        Add
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        Export
      </el-button> -->
      <!-- <el-checkbox
        v-model="showReviewer"
        class="filter-item"
        style="margin-left: 15px"
        @change="tableKey = tableKey + 1"
      >
        reviewer
      </el-checkbox> -->
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
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="80px" align="center">
        <span>{{ oldName }}</span>
      </el-table-column>

      <el-table-column label="日期" width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.dayTime | dateFilter("YYYY-MM-DD") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.start | dateFilter("HH:mm:ss") }}</span>
        </template>
      </el-table-column>
      <el-table-column
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
      </el-table-column>
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
import { getOldList, getBehRowData, getOldId } from "@/api/datashow";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import moment from "moment";
import user from "@/store/modules/user";
import store from "@/store";

export default {
  name: "BehRowData",
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
        oldId: "",
        start: new Date(new Date().setDate(new Date().getDate() - 24)),
        stop: new Date(),
        name,
      },
      oldName: "",
      queryOldName: "",
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: "",
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
  },
  computed: {
    currentOldId() {
      this.queryOldName = "";
      return store.state.datashow.currentOldId;
    },
  },
  watch: {
    currentOldId: function (val) {
      this.getList();
    },
  },
  methods: {
    // getList() {
    //   this.listLoading = true;
    //   // 这里通过params传参的方式拿到当前老人的参数
    //   // 这个oldId 是userId 不是真的oldId
    //   this.listQuery.oldId = store.getters.currentOldId;
    //   this.oldName = store.getters.currentOldName;
    //   getBehRowData(this.listQuery).then((response) => {
    //     this.list = response.data.oldInfo;
    //     this.total = response.data.total;
    //     // Just to simulate the time of the request
    //     setTimeout(() => {
    //       this.listLoading = false;
    //     }, 1 * 1000);
    //   });
    // },
    getList() {
      this.listLoading = true;
      this.listQuery.oldId = store.getters.currentOldId;
      this.oldName = store.getters.currentOldName;
      if (!(this.listQuery.oldId || this.queryOldName)) {
        this.list = [];
        this.total = 0;
        this.listLoading = false;
        return;
      }
      if (this.queryOldName) {
        this.oldName = JSON.parse(JSON.stringify(this.queryOldName));
        getOldId({
          oldname: this.queryOldName,
        }).then((response) => {
          this.listQuery.oldId = response.data.userId.user.id;
          this.oldName = this.queryOldName;

          getBehRowData(this.listQuery).then((response) => {
            this.list = response.data.oldInfo;
            this.total = response.data.total;
            // Just to simulate the time of the request
            setTimeout(() => {
              this.listLoading = false;
            }, 0.8 * 1000);
          });
        });
      } else {
        this.queryOldName = store.getters.currentOldName;
        getBehRowData(this.listQuery).then((response) => {
          this.list = response.data.oldInfo;
          this.total = response.data.total;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false;
          }, 0.8 * 1000);
        });
      }
      // getAlaRowData(this.listQuery).then((response) => {
      //   this.list = response.data.oldInfo;
      //   this.total = response.data.total;
      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false;
      //   }, 1.5 * 1000);
      // });
      // this.queryOldName = "";
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

