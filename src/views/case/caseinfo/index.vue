<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="案例标题" prop="title">
              <el-input v-model="queryParams.title" placeholder="请输入案例标题" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="图片地址" prop="imageUrl">
              <el-input v-model="queryParams.imageUrl" placeholder="请输入图片地址" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="信息" prop="info">
              <el-input v-model="queryParams.info" placeholder="请输入信息" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="审核状态" prop="start">
              <el-input v-model="queryParams.start" placeholder="请输入审核状态" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="视频地址" prop="videoUrl">
              <el-input v-model="queryParams.videoUrl" placeholder="请输入视频地址" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['case:caseinfo:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['case:caseinfo:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['case:caseinfo:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['case:caseinfo:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="caseinfoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="案例id" align="center" prop="caseId" v-if="true" />
        <el-table-column label="案例标题" align="center" prop="title" />
        <el-table-column label="图片地址" align="center" prop="imageUrl" />
        <el-table-column label="信息" align="center" prop="info" />
        <el-table-column label="审核状态" align="center" prop="start" />
        <el-table-column label="视频地址" align="center" prop="videoUrl" />
        <el-table-column label="操作" align="center" fixed="right"  class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['case:caseinfo:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['case:caseinfo:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改案例信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="caseinfoFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="案例标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入案例标题" />
        </el-form-item>
        <el-form-item label="图片地址" prop="imageUrl">
          <el-input v-model="form.imageUrl" placeholder="请输入图片地址" />
        </el-form-item>
        <el-form-item label="信息" prop="info">
            <el-input v-model="form.info" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="审核状态" prop="start">
          <el-input v-model="form.start" placeholder="请输入审核状态" />
        </el-form-item>
        <el-form-item label="视频地址" prop="videoUrl">
          <el-input v-model="form.videoUrl" placeholder="请输入视频地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Caseinfo" lang="ts">
import { listCaseinfo, getCaseinfo, delCaseinfo, addCaseinfo, updateCaseinfo } from '@/api/case/caseinfo';
import { CaseinfoVO, CaseinfoQuery, CaseinfoForm } from '@/api/case/caseinfo/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const caseinfoList = ref<CaseinfoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const caseinfoFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CaseinfoForm = {
  caseId: undefined,
  title: undefined,
  imageUrl: undefined,
  info: undefined,
  start: undefined,
  videoUrl: undefined,
}
const data = reactive<PageData<CaseinfoForm, CaseinfoQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: undefined,
    imageUrl: undefined,
    info: undefined,
    start: undefined,
    videoUrl: undefined,
    params: {
    }
  },
  rules: {
    caseId: [
      { required: true, message: "案例id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询案例信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCaseinfo(queryParams.value);
  caseinfoList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  caseinfoFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: CaseinfoVO[]) => {
  ids.value = selection.map(item => item.caseId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加案例信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CaseinfoVO) => {
  reset();
  const _caseId = row?.caseId || ids.value[0]
  const res = await getCaseinfo(_caseId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改案例信息";
}

/** 提交按钮 */
const submitForm = () => {
  caseinfoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.caseId) {
        await updateCaseinfo(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCaseinfo(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CaseinfoVO) => {
  const _caseIds = row?.caseId || ids.value;
  await proxy?.$modal.confirm('是否确认删除案例信息编号为"' + _caseIds + '"的数据项？').finally(() => loading.value = false);
  await delCaseinfo(_caseIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('case/caseinfo/export', {
    ...queryParams.value
  }, `caseinfo_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
