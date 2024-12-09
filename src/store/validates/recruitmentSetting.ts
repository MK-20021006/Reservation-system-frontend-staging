import { reactive } from "#imports";
import { MAX_LENGTH_EMAIL, REGEX_EMAIL } from "../../shared/utils/validate";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { STATUS_RECRUITMENT } from "~/../../src/shared/constants/recruitment";

const { t } = i18n.global;

const recruitmentRules = () => {
  const formRecruitment = reactive({
    images: [],
    enable: STATUS_RECRUITMENT.ENABLE,
    job_title: null, //職種
    start_date: null,
    end_date: null,
    recruitment_detail: null, //求人内容
    email: null,
    job_overview: null, //主な仕事内容
    workflow: null, //業務流れ
    workplace: null, //勤務地
    working_time: null, //勤務時間
    salary: null, //給与
    manager: null, //担当者
    training: null, //研修制度
    contact: null,
    recruitment_title: null,
    recruitment_overview: null,
    staff_reviews: [
      {
        image_ids: [],
        image: null,
        title_keyword: "",
        overview: "",
      },
    ],
  });
  const formRecruitmentRules = reactive({
    images: [
      {
        required: true,
        message: t("validate.required.field", { field: t("image") }),
        trigger: "blur",
      },
    ],
    job_title: [
      {
        required: true,
        message: t("validate.required.field", { field: t("occupation") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("occupation") }),
      },
    ],
    recruitment_detail: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("recruitment_details"),
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("recruitment_details"),
        }),
      },
    ],
    job_overview: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("main_work_content"),
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("main_work_content"),
        }),
      },
    ],
    workflow: [
      {
        required: true,
        message: t("validate.required.field", { field: t("business_flow") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("business_flow") }),
      },
    ],
    workplace: [
      {
        required: true,
        message: t("validate.required.field", { field: t("work_location") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("work_location") }),
      },
    ],
    working_time: [
      {
        required: true,
        message: t("validate.required.field", { field: t("working_hours") }),
        trigger: "blur",
      },
    ],
    salary: [
      {
        required: true,
        message: t("validate.required.field", { field: t("salary") }),
        trigger: "blur",
      },
    ],
    training: [
      {
        required: true,
        message: t("validate.required.field", { field: t("training_system") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("training_system") }),
      },
    ],
    manager: [
      {
        required: true,
        message: t("validate.required.field", { field: t("manager") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("manager") }),
      },
    ],
    contact: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("contact_information"),
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("contact_information"),
        }),
      },
    ],
    email: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("email_address"),
        }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_EMAIL,
        message: t("validate.max.field", {
          field: t("email_address"),
          max: MAX_LENGTH_EMAIL,
        }),
        trigger: "blur",
      },
      {
        pattern: REGEX_EMAIL,
        message: t("validate.format.field", { field: t("email_address") }),
        trigger: "blur",
      },
    ],
    recruitment_title: [
      {
        required: true,
        message: t("validate.required.field", { field: t("title_keyword") }),
        trigger: "blur",
      },
    ],
    recruitment_overview: [
      {
        required: true,
        message: t("validate.required.field", { field: t("overview") }),
        trigger: "blur",
      },
    ],
  });
  return {
    formRecruitment,
    formRecruitmentRules,
  };
};
export default recruitmentRules;
