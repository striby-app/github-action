import * as core from "@actions/core";
import { Striby } from "./striby";

export type Operation =
  | "get-last-finished-deployment"
  | "start-deployment"
  | "update-deployment";

export interface ActionParams {
  apiKey: string;
  operation: Operation;
  payload: any;
}

function parsedParams(): ActionParams {
  const apiKey = core.getInput("apiKey");
  const operation = core.getInput("operation") as Operation;
  const payload = JSON.parse(core.getInput("payload") || "{}");

  console.log(`apiKey=${apiKey}`);
  console.log(`operation=${operation}`);
  console.log(`payload=${JSON.stringify(payload)}`);

  if (!apiKey) {
    throw "apiKey is missing";
  }

  return {
    apiKey,
    operation,
    payload
  };
}

async function run(): Promise<void> {
  try {
    const result = await new Striby(parsedParams()).run();
    console.log(result);
    core.setOutput("result", result);
  } catch (exception) {
    core.setFailed(exception);
  }
}

run();
