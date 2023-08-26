const queryString = require("query-string");
const client = require("./http-client");
const { isAbsolute } = require("path");
const autoBind = require("auto-bind");
const { URL } = require("url");

class Telegram {
  constructor({ token }) {
    this.baseUrl = "https://api.telegram.org/";
    this.baseBotUrl = `${this.baseUrl}bot${token}/`;
    autoBind(this);
  }

  async apiCall({ method, params, endpoint }) {
    try {
      const url = this.baseBotUrl + endpoint;
      const { body } = await client({ url, method, ...params });
      //thats is necessary because GOT (http request module) cant work with JSON module when body is form data
      const jsonResult = typeof body == "string" ? JSON.parse(body) : body;
      if (jsonResult && jsonResult.result) {
        return jsonResult.result;
      }
      return null;
    } catch (e) {
      console.warn(e);
      return null;
    }
  }

  getUpdate(params) {
    return this.apiCall({
      endpoint: `getUpdates?${queryString.stringify(params)}`,
      method: "get",
    });
  }
  getMe() {
    return this.apiCall({ endpoint: "getMe", method: "get" });
  }
  getFile(fileId) {
    return this.apiCall({
      endpoint: "getFile",
      method: "post",
      params: {
        file_id: fileId,
      },
    });
  }
  async getFileLink(fileId) {
    if (typeof fileId === "string") {
      fileId = await this.getFile(fileId);
    } else if (fileId.file_path === undefined) {
      fileId = await this.getFile(fileId.file_id);
    }
    if (fileId.file_path !== undefined && isAbsolute(fileId.file_path)) {
      const url = new URL(this.baseUrl);
      url.port = "";
      url.pathname = fileId.file_path;
      url.protocol = "file:";
      return url;
    }
    return new URL(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      `./file/bot${token}/${fileId.file_path}`,
      this.baseUrl
    );
  }
  sendMessage(params) {
    return this.apiCall({
      endpoint: "sendMessage",
      method: "post",
      params,
    });
  }
  sendPhoto(params) {
    return this.apiCall({ endpoint: "sendPhoto", method: "post", params });
  }
  sendAudio(params) {
    return this.apiCall({ endpoint: "sendAudio", method: "post", params });
  }
  sendDocument(params) {
    return this.apiCall({ endpoint: "sendDocument", method: "post", params });
  }
  sendVideo(params) {
    return this.apiCall({ endpoint: "sendVideo", method: "post", params });
  }
  sendAnimation(params) {
    return this.apiCall({ endpoint: "sendAnimation", method: "post", params });
  }
  sendVoice(params) {
    return this.apiCall({ endpoint: "sendVoice", method: "post", params });
  }
  sendVideoNote(params) {
    return this.apiCall({ endpoint: "sendVideoNote", method: "post", params });
  }
  sendMediaGroup(params) {
    return this.apiCall({ endpoint: "sendMediaGroup", method: "post", params });
  }
  sendLocation(params) {
    return this.apiCall({ endpoint: "sendLocation", method: "post", params });
  }
  sendVenue(params) {
    return this.apiCall({ endpoint: "sendVenue", method: "post", params });
  }
  sendContact(params) {
    return this.apiCall({ endpoint: "sendContact", method: "post", params });
  }
  sendPoll(params) {
    return this.apiCall({ endpoint: "sendPoll", method: "post", params });
  }
  sendChatAction(params) {
    return this.apiCall({ endpoint: "sendChatAction", method: "post", params });
  }
  sendSticker(params) {
    return this.apiCall({ endpoint: "sendSticker", method: "post", params });
  }

  forwardMessage(params) {
    return this.apiCall({
      endpoint: "forwardMessage",
      method: "post",
      params,
    });
  }
  editMessageLiveLocation(params) {
    return this.apiCall({
      endpoint: "editMessageLiveLocation",
      method: "post",
      params,
    });
  }

  stopMessageLiveLocation(params) {
    return this.apiCall({
      endpoint: "stopMessageLiveLocation",
      method: "post",
      params,
    });
  }
  getUserProfilePhotos(params) {
    return this.apiCall({
      endpoint: `getUserProfilePhotos?${queryString.stringify(params)}`,
      method: "get",
    });
  }
  editMessageText(params) {
    return this.apiCall({
      endpoint: `editMessageText`,
      method: "post",
      params,
    });
  }
  answerCbQuery(callbackQueryId, text, extra) {
    return this.apiCall({
      endpoint: "answerCallbackQuery",
      method: "post",
      params: {
        text,
        callback_query_id: callbackQueryId,
        ...extra,
      },
    });
  }
  getMyCommands(params) {
    return this.apiCall({
      endpoint: `getMyCommands`,
      method: "post",
      params,
    });
  }
  setMyCommands(params) {
    return this.apiCall({
      endpoint: `setMyCommands`,
      method: "post",
      params,
    });
  }
}

module.exports = Telegram;
