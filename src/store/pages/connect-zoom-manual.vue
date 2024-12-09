<template>
  <div class="container-manual">
    <div class="logo-item">
      <ArxiaLogo></ArxiaLogo>
      <span>{{ $t("site_name") }}</span>
    </div>
    <div class="intro">
      Instructions for using Zoom and Video call in the Arxia system
    </div>
    <div class="content">
      <div class="title-content">1. Open login page</div>
      <img src="../assets/image/login.png" alt="" />
      <div class="title-content">2. Login with an account</div>
      <div class="email-password">Email & Password</div>
      <div class="title-content">3. Click to Zoom連携設定 on sidebar</div>
      <img src="../assets/image/clickBtnZoom.png" alt="" />
      <div class="title-content">
        4. The Zoom連携設定 will be displayed, click on the button [連携する]
        and the Zoom login screen will be display
      </div>
      <img src="../assets/image/configZoomPage.png" alt="" />
      <div class="title-content">5. Sign In with your Zoom account</div>
      <img src="../assets/image/zoomHome.png" alt="" />
      <div class="title-content">
        6. If connect to Zoom successfully, will return to Zoom連携設定 screen
        and the display status will be connected
      </div>
      <img src="../assets/image/connectSuccess.png" alt="" />
      <div class="details">
        When you do not want to connect with your Account, you can click on the
        button [Disconnect], and your account information will be deleted.
        However, your activities in the past were saved on our history database
        and cannot be deleted. Please read carefully before connecting your
        account with our system.
      </div>
      <img src="../assets/image/disconectZoom.png" alt="" />
      <div class="title-content">
        7. Get link Zoom of イベント新規作成 screen
      </div>
      <div class="details">
        If you have linked Zoom, pressing Zoom会議自動発行 button will
        automatically create a Zoom meeting room for you. Use this link to join
        the Zoom meeting room.
      </div>
      <img src="../assets/image/connectZoomEvent.png" alt="" />
      <img src="../assets/image/linkZoomGenerate.png" alt="" />
      <div class="text-end">Thank you</div>
      <div class="text-end">Arxia Team</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArxiaLogo from "~/../../src/shared/components/icon/ArxiaLogo.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";

definePageMeta({
  layout: "guest",
});
const t = i18n;
</script>

<style lang="scss" scoped>
img {
  padding-left: 20px;
  width: 1200px;
  height: 800px;
  margin-bottom: 20px;
}

.container-manual {
  padding-bottom: 50px;
  font-family: Times New Roman;

  .logo-item {
    margin-left: 80px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      width: 80px;
      height: 80px;
    }

    span {
      font-weight: bold;
      font-size: 25px;
    }
  }

  .intro {
    text-align: center;
    font-weight: bold;
    font-size: 30px;
    margin-bottom: 50px;
  }

  .content {
    padding: 0 350px 0 350px;
    white-space: break-spaces;

    .details {
      font-size: 16px;
      font-weight: bold;
      margin-left: 20px;
      margin-bottom: 10px;
    }

    .title-content {
      margin-bottom: 20px;
      font-weight: bold;
      font-size: 24px;
    }

    .email-password {
      margin-left: 20px;
      margin-bottom: 10px;
      font-size: 16px;
    }

    .text-end {
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
