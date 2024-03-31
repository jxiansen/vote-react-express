import PocketBase from "pocketbase";
import { validateUserId } from "./helpers";

const pb = new PocketBase(import.meta.env.VR_BACKEND_URL);

export default pb;
