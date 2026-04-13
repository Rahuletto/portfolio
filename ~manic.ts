import { createManicServer } from "manicjs/server";
import app from "./app/index.html";

await createManicServer({ html: app });
