import { container } from "./container";
import { TOKENS } from "./container.types";

const app = container.get(TOKENS.accountsApplication)
app.init();

export default app;