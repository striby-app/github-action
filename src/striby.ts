import { ActionParams } from ".";

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
    },
    "update-deployment": {
      url: "/api/environment/update-deployment",
      method: "POST",
      queryParams: [
        "status",
        "environmentName",
        "externalDeploymentId",
      ],
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

    const response = await fetch(url.toString(), {
      method: actionData.method,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
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
