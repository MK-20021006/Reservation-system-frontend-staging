<template>
  <div class="form-message-container">
    <user-list-table
      :id="id"
      ref="_refTableData"
      :title="$t('admin.messages.target_title')"
      :created-date="formData.created_at"
      :check-all-user-page="formData.recipients"
      :table-data-checked="tableDataChecked"
      @array-users="setIdUsers"
      @message-data="setDataMessage"
    />
    <div class="setting-message-content">
      <div class="message-title">
        {{ $t("admin.messages.setting") }}
      </div>
      <div class="number-sms">
        {{ $t("the_remaining_amount") }}: {{ priceDisplay(remainingSms) }} (SMS)
        / {{ $t("amount_used") }}: {{ priceDisplay(totalSms) }} (SMS)
      </div>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="messageRules"
        class="form-setting"
        require-asterisk-position="right"
        label-width="120px"
        label-position="left"
      >
        <el-form-item
          :label="$t('admin.messages.sending_method')"
          prop="type"
          class="message-type"
          required
        >
          <el-radio-group v-model="sendType" @change="changeMethodSend">
            <el-radio
              v-for="item in messageTypes"
              :key="item.value"
              :disabled="id || isConfirmMessage"
              :label="item.value"
              size="large"
              >{{ $t(item.label) }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="sending-number d-flex">
          <el-form-item
            v-if="isCountUsers || id"
            class="target-delivery"
            prop="target_delivery"
            :label="$t('admin.messages.target_delivery')"
          >
            <InputNumberText v-model="sendCountUser" :disabled="true" />
          </el-form-item>
          <el-form-item
            v-if="id"
            class="account-send"
            prop="account_send"
            :label="$t('admin.messages.send_count')"
          >
            <InputNumberText v-model="recipientSend" :disabled="true" />
          </el-form-item>
        </div>
        <el-form-item
          prop="title"
          :label="$t('title_keyword')"
          :error="errorData.title?.[0]"
        >
          <input-text
            v-model="formData.title"
            :placeholder="$t('admin.messages.happy_birthday')"
            width="100%"
            :disabled="id || isConfirmMessage"
          />
        </el-form-item>
        <el-form-item
          prop="content"
          :label="$t('content')"
          :error="errorData.content?.[0]"
        >
          <el-input
            v-model="formData.content"
            v-input-trim
            :rows="8"
            :maxlength="maxLengthContent"
            type="textarea"
            :placeholder="$t('admin.messages.happy_birthday2')"
            :disabled="id || isConfirmMessage"
          />
        </el-form-item>
        <el-form-item v-if="id" :label="$t('created')">
          <input-date v-model="formData.created_at" :is-disable="true" />
        </el-form-item>
        <div class="sending-number d-flex">
          <div class="setting-time"></div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, provide } from "vue";
import UserListTable from "~/../../src/store/components/message/UserListTable.vue";
import {
  MESSAGE_TYPE,
  messageTypes,
} from "~/../../src/shared/constants/message";
import InputNumberText from "~/../../src/shared/components/input/InputNumberText.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputDate from "~/../../src/shared/components/input/Date.vue";
import messageRules from "~/../../src/admin/validates/message";
import { FormInstance } from "element-plus";
import MessageRequest from "~/../../src/shared/requests/MessageRequest";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import ContractRequest from "~/../../src/shared/requests/ContractRequest";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  MAX_LENGTH_TEXTAREA_MESSAGE_SMS,
  MAX_LENGTH_TEXTAREA_MESSAGE_MAIL,
  MAX_LENGTH_TEXTAREA_MESSAGE_LINE,
} from "~/../../src/shared/utils/validate";
import { useRouter } from "nuxt/app";
import {
  createError,
  createSuccess,
  messageError,
} from "~/../../src/shared/utils/notification";
import priceDisplay from "~/../../src/shared/utils/price";

interface Prop {
  id?: number;
}

const { t } = i18n.global;
const isConfirmMessage = ref(false);
const isCountUsers = ref(false);
const sendCountUser = ref(0);
const isShowCount = ref(false);
const errorData = ref({});
const maxLengthContent = ref(MAX_LENGTH_TEXTAREA_MESSAGE_MAIL);
const sendType = ref(MESSAGE_TYPE.MAIL);
const isLoadingAction = ref(false);
const isCreate = ref(false);
const props = defineProps<Prop>();
const { id } = toRefs(props);
const router = useRouter();
const formRef = ref(null);
const recipientSend = ref(null);
const _refTableData = ref();
const allUserCheck = ref([]);
const tableDataChecked = ref([]);
const totalSms = ref(0);
const remainingSms = ref(0);
const autoRenewSms = ref(false);
const formData = reactive({
  type: MESSAGE_TYPE.MAIL,
  title: "",
  content: "",
  created_at: "",
  recipients: [],
});
provide("isConfirmMessageProvide", isConfirmMessage);
provide("isCountUsers", isCountUsers);

const setIdUsers = (arrayUsers = [], removeUsers = [], allUsers = []) => {
  const dataTest = [];
  formData.recipients.forEach((val) => {
    const index = removeUsers.findIndex((item) => item === val);
    if (index === -1) {
      dataTest.push(val);
    }
  });

  formData.recipients = dataTest;

  arrayUsers.map((item) => {
    const index = !formData.recipients.includes(item);
    if (index) {
      formData.recipients.push(item);
    }
  });

  const dataAllCheck = [];
  allUserCheck.value.forEach((item) => {
    const index = formData.recipients.findIndex((data) => item._id === data);
    if (index !== -1) {
      dataAllCheck.push({ ...item });
    }
  });

  allUserCheck.value = dataAllCheck;
  formData.recipients.forEach((item) => {
    const index = allUsers.findIndex((data) => data._id === item);
    const indexUser = allUserCheck.value.findIndex((user) => user._id === item);
    if (index !== -1 && indexUser === -1) {
      allUserCheck.value.push(allUsers[index]);
    }
  });

  sendCountUser.value = formData.recipients.length;
};

const setDataMessage = (messageData) => {
  sendType.value = messageData.type;
  formData.title = messageData.title;
  formData.content = messageData.content;
  formData.created_at = messageData.created_at;
  sendCountUser.value =
    messageData.delivery_count?.unsend + messageData.delivery_count?.sent;
  recipientSend.value = messageData.delivery_count?.sent;
};

const createMessage = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.recipients.length > 0) {
          if (
            !autoRenewSms.value &&
            remainingSms.value === 0 &&
            sendType.value === MESSAGE_TYPE.SMS
          ) {
            messageError("sms_equal_zero");
          } else if (
            !autoRenewSms.value &&
            remainingSms.value < formData.recipients.length &&
            sendType.value === MESSAGE_TYPE.SMS
          ) {
            const message =
              t("rest_of_the_message") +
              remainingSms.value +
              t("destination_again");
            messageError(message);
          } else {
            isConfirmMessage.value = true;
            isCreate.value = true;
            isCountUsers.value = true;
            tableDataChecked.value = JSON.parse(
              JSON.stringify(allUserCheck.value)
            );
            await setIdUsers();
            await _refTableData.value.getAllDataTable();
          }
        } else {
          messageError("not_pick_user");
        }
      } catch (e) {
      } finally {
        isLoadingAction.value = false;
      }
    }
  });
};

const backMessage = async () => {
  isConfirmMessage.value = false;
  isCreate.value = false;
  isCountUsers.value = false;
  tableDataChecked.value = [];
  await _refTableData.value.getDataUsers();
};

const confirmCreateMessage = async () => {
  try {
    errorData.value = {};
    isLoadingAction.value = true;
    await MessageRequest.post(formData);
    await router.push("/messages");
    createSuccess();
  } catch (e: any) {
    if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      errorData.value = e?.data?.errors;
    } else if (e.response?.status === STATUS_CODE.BAD_REQUEST) {
      messageError("errors.not_setting_with_line");
    } else if (e.response.status === STATUS_CODE.NOT_ALLOW_IMAGE) {
      messageError(e.response?._data?.message);
    }
    await backMessage();
  } finally {
    isLoadingAction.value = false;
  }
};

defineExpose({
  createMessage,
  confirmCreateMessage,
  backMessage,
  formRef,
  isLoadingAction,
  isCreate,
  isConfirmMessage,
  isCountUsers,
});

const changeMethodSend = () => {
  if (sendType.value === MESSAGE_TYPE.SMS) {
    maxLengthContent.value = MAX_LENGTH_TEXTAREA_MESSAGE_SMS;
  }

  if (sendType.value === MESSAGE_TYPE.MAIL) {
    maxLengthContent.value = MAX_LENGTH_TEXTAREA_MESSAGE_MAIL;
  }

  if (sendType.value === MESSAGE_TYPE.LINE) {
    maxLengthContent.value = MAX_LENGTH_TEXTAREA_MESSAGE_LINE;
  }

  formData.content = null;
  formData.type = sendType.value;
};

const getDataSMS = async () => {
  try {
    const smsResponse = await ContractRequest.getSMSContract();
    totalSms.value = parseInt(smsResponse.data.total);
    remainingSms.value =
      parseInt(smsResponse.data.total) - parseInt(smsResponse.data.sent);
    autoRenewSms.value = smsResponse.data.sms_pack?.auto_renew;
  } catch (e) {}
};

onBeforeMount(() => {
  if (id.value) {
    isShowCount.value = true;
  }
  getDataSMS();
});
</script>

<style lang="scss" scoped>
.setting-message-content {
  .message-title {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    padding-bottom: 20px;
  }

  .number-sms {
    margin-bottom: 15px;
  }

  .form-setting {
    .sending-number {
      gap: 120px;

      .target-delivery,
      .account-send,
      .setting-time {
        width: 50%;
      }

      .custom-input-number {
        width: 100%;
      }
    }

    :deep(.el-date-editor.el-input) {
      height: 40px;
      width: 100%;
    }
  }
}
</style>
