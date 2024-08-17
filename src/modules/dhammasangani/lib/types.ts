import type keystaticConfig from "keystatic.config";
import { type Entry } from "@keystatic/core/reader";

export type TikaEntry = Entry<(typeof keystaticConfig)["collections"]["tika"]>;
