import * as Process from "process";
import { appConfig } from "../config";
import { AccountWebApi } from "../api/AccountWebApi";
import { container } from "./container";
import { TOKENS } from "./container.types";

const app = container.get(TOKENS.accountsApplication)
app.init();

export default app;