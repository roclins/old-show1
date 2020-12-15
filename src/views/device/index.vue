<template>
  <div class="app-container">
    <!-- 控件 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.roomNumber"
        placeholder="房间号"
        style="width: 150px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.sensorType"
        placeholder="传感器类型"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          v-for="item in calendarSensorOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="
          downloadUrl(
            'test/device/downloadtemplate?filename=devicetemplate.xlsx&newname=devicetemplate.xlsx'
          )
        "
        >设备信息模板下载</el-button
      >
    </div>

    <!-- 下面是列表 -->
    <el-table-bar>
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
        <el-table-column label="传感器物理地址" width="80px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.macAddress }}</span>
          </template>
        </el-table-column>
        <el-table-column label="传感器类型" width="80px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="传感器编号" align="center" width="95">
          <template slot-scope="{ row }">
            <span>{{ row.idintype }}</span>
          </template>
        </el-table-column>
        <el-table-column label="传感器房间号" align="center" width="95">
          <template slot-scope="{ row }">
            <span>{{ row.roomNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备禁用" align="center" width="95">
          <template slot-scope="{ row }">
            <span>{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="绑定用户名" width="80px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.user.account }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="personId"
          width="80px"
          align="center"
          v-if="false"
        >
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="900"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row, $index }">
            <el-button
              type="primary"
              @click="handleDisabledDevice(row, $index)"
            >
              禁用设备
            </el-button>
            <el-button type="primary" @click="handleDevRowData(row, $index)">
              查看原始传感器数据
            </el-button>
            <el-button type="primary" @click="handleDevStaData(row, $index)">
              查看统计传感器数据
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-table-bar>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      class="dialogBox-container"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        class="addSingleOldDialog-container"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <!-- <el-form-item label="性别" prop="gender">
          <el-select
            v-model="temp.gender"
            class="filter-item addSingleOldDialog-input"
            placeholder="Please select"
          >
            <el-option
              v-for="item in calendarGenderOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="temp.birthday"
            type="date"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="temp.age" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="temp.idCard" />
        </el-form-item>
        <el-form-item label="体重" prop="weight">
          <el-input v-model="temp.weight" />
        </el-form-item>
        <el-form-item label="身高" prop="height">
          <el-input v-model="temp.height" />
        </el-form-item>
        <el-form-item label="床号" prop="bedNumber">
          <el-input v-model="temp.bedNumber" />
        </el-form-item>
        <el-form-item label="认知状态" prop="status">
          <el-input v-model="temp.status" />
        </el-form-item>
        <el-form-item label="绑定账号" prop="account">
          <el-input v-model="temp.account" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDeviceList, disabledDevice } from "@/api/device";
import store from "@/store";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import moment from "moment";
import user from "@/store/modules/user";

const calendarSensorOptions = [
  { key: "水流", display_name: "水流" },
  { key: "温度", display_name: "温度" },
  { key: "湿度", display_name: "湿度" },
  { key: "警报", display_name: "警报" },
  { key: "加速度", display_name: "加速度" },
  { key: "门磁", display_name: "门磁" },
];

export default {
  name: "DeviceIndex",
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
        idCard: "",
        roomNumber: "",
        sensorType: "",
        page: 1,
        limit: 10,
      },
      calendarSensorOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      showReviewer: false,
      temp: {
        name: "",
        age: "",
        birthday: "", //使用时间框
        idCard: "",
        height: "",
        weight: "",
        status: "",
        nursingGrade: "", //使用下拉框
        bedNumber: "",
        gender: "", //使用下拉框
        account: "",
        persionId: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改老人信息",
        create: "添加老人信息",
      },
      pvData: "",
      dialogPvVisible: false,
      rules: {
        name: [{ required: true, message: "请填入姓名", trigger: "change" }],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 因为是从device出发，所以页面中会带有一个oldlist
    downloadUrl(url) {
      let iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      iframe.onload = function () {
        document.body.removeChild(iframe);
      };
      document.body.appendChild(iframe);
    },
    getList() {
      this.listLoading = true;
      getDeviceList(this.listQuery).then((response) => {
        //TODO
        this.list = response.data.info;
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
    resetTemp() {
      this.temp = {
        name: " ",
        age: "",
        birthday: "", //使用时间框
        idCard: "",
        height: "",
        weight: "",
        status: "",
        nursingGrade: "", //使用下拉框
        bedNumber: "",
        gender: "", //使用下拉框
        account: "",
      };
    },
    // 点击add之后的逻辑
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 点击确认后的逻辑
    /*
      现在确认后的逻辑如下：
      1.调用接口，然后后调
          */
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let personInfo = this.temp;
          personInfo.age = parseInt(this.temp.age);
          personInfo.height = parseInt(this.temp.height);
          personInfo.weight = parseInt(this.temp.weight);
          // console.log(this.temp);

          addSingleOld(personInfo)
            .then((response) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "Created Successfully",
                type: "success",
                duration: 2000,
              });
            })
            .catch(() => {});
          // createArticle(this.temp).then(() => {
          //   // this.list.unshift(this.temp);  把新加入的数据呈现在前端的页面中
          //   this.dialogFormVisible = false;
          //   this.$notify({
          //     title: "Success",
          //     message: "Created Successfully",
          //     type: "success",
          //     duration: 2000,
          //   });
          // });
        }
      });
    },
    // 点击修改按钮后的逻辑
    handleUpdate(row) {
      //TODO
      console.log(row.id);
      this.temp = Object.assign({}, row); // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp);
      console.log(this.temp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 点击comfirm 后的逻辑
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          let personInfo = tempData;
          personInfo.age = parseInt(tempData.age);
          personInfo.height = parseInt(tempData.height);
          personInfo.weight = parseInt(tempData.weight);
          updateSingleOld(tempData.oldId, tempData)
            .then((response) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "Update Successfully",
                type: "success",
                duration: 2000,
              });
            })
            .catch(() => {});
        }
      });
    },
    handleDisabledDevice(row, index) {
      disabledDevice(row.id)
        .then((response) => {
          // console.log(response)
          this.getList();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 跳转到设备原始数据的页面
    handleDevRowData(row, index) {
      store.commit("SET_CURRENTDEVICEID", row.id);
      console.log(store.state.device.currentDeviceId);
      this.$router.push({
        name: "DevRowData",
      });
    },
    handleDevStaData(row, index) {
      store.commit("SET_CURRENTDEVICEID", row.id);
      // console.log(row.id);
      this.$router.push({
        name: "DevStaData",
      });
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
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

