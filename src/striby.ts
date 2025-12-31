import { ActionParams } from ".";
import fs from "fs";
import path from "path";

export class Striby {
  private params!: ActionParams;

  private serverOptions = {
    baseUrl: "https://api.striby.app",
  };

  private actionUrls = {
    "get-last-finished-deployment": {
      url: "/api/environment/get-last-finished-deployment",
      method: "GET",
      queryParams: ["environmentName"],
      body: false,
    },

    "start-deployment": {
      url: "/api/environment/start-deployment",
      method: "POST",
      queryParams: [
        "branch",
        "startCommit",
        "endCommit",
        "environmentName",
        "externalDeploymentId",
      ],
      body: false,
    },
    "update-deployment": {
      url: "/api/environment/update-deployment",
      method: "POST",
      queryParams: ["status", "environmentName", "externalDeploymentId"],
      body: false,
    },
    "send-playwright-results": {
      url: "/api/playwright/send-results",
      method: "POST",
      queryParams: ["tags", "runId", "externalDeploymentId"],
      body: true,
    },
  };

  constructor(params: ActionParams) {
    this.params = params;
  }

  async run() {
    const result = await this.doRequest();
    return result;
  }

  private async doRequest(): Promise<any> {
    const actionData = this.actionUrls[this.params.operation];

    const url = new URL(`${this.serverOptions.baseUrl}${actionData.url}`);

    actionData.queryParams.forEach((qp) => {
      url.searchParams.set(qp, this.params.payload[qp]);
    });

    url.searchParams.set("key", this.params.apiKey);

    let body = null;

    if (actionData.body && this.params.filePathToPost) {
      const workspace = process.env.GITHUB_WORKSPACE;
      if (!workspace) {
        throw new Error("GITHUB_WORKSPACE is not set");
      }

      const filePath = path.join(workspace, this.params.filePathToPost);

      // const fileBuffer = fs.readFileSync(filePath);

      const fileText = fs.readFileSync(filePath, "utf8");
      body = fileText
    }

    const response = await fetch(url.toString(), {
      method: actionData.method,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data;
  }
}
