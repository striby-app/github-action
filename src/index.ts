import * as core from "@actions/core";
import { Striby } from "./striby";

export type Operation =
  | "get-last-finished-deployment"
  | "start-deployment"
  | "update-deployment"
  | "send-playwright-results";

export interface ActionParams {
  apiKey: string;
  filePathToPost: string;
  operation: Operation;
  payload: any;
}

function parsedParams(): ActionParams {
  const apiKey = core.getInput("apiKey");
  const operation = core.getInput("operation") as Operation;
  const payload = JSON.parse(core.getInput("payload") || "{}");
  const filePathToPost = core.getInput("filePathToPost");

  console.log(
    "================================ params ================================"
  );
  console.log(`apiKey=${apiKey}`);
  console.log(`operation=${operation}`);
  console.log(`filePathToPost=${filePathToPost}`);
  console.log(`payload=${JSON.stringify(payload)}`);
  console.log(
    "========================================================================"
  );

  if (!apiKey) {
    throw "apiKey is missing";
  }

  return {
    apiKey,
    operation,
    payload,
    filePathToPost
  };
}

async function run(): Promise<void> {
  try {
    const result = await new Striby(parsedParams()).run();
    const resultAsString = JSON.stringify(result);
    console.log(
      "================================ output ================================"
    );

    console.log(resultAsString);
    console.log(
      "========================================================================"
    );
    core.setOutput("result", resultAsString);
  } catch (exception) {
    core.setFailed(exception);
  }
}

run();
