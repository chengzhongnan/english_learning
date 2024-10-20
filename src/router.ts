import { OpenAPIRoute } from "chanfana";
import { GetReadingMaterial } from "./api/getReadingMaterial";
import { GetReadingMaterialMaxId } from "./api/getMaxMaterialId";
import { GetMaterialConfigs } from "./api/getMaterialConfigs";

interface OpenAPI {
    get<T extends OpenAPIRoute>(path: string, func: new (...args: any[]) => T): void;
    post<T extends OpenAPIRoute>(path: string, func: new (...args: any[]) => T): void;
    put<T extends OpenAPIRoute>(path: string, func: new (...args: any[]) => T): void;
    delete<T extends OpenAPIRoute>(path: string, func: new (...args: any[]) => T): void;
  }

export function registerRoute(openapi: OpenAPI) {
    openapi.get("/getReadingMaterial", GetReadingMaterial);
    openapi.get("/getReadingMaterialMaxId", GetReadingMaterialMaxId);
    openapi.get("/getMaterialConfigs", GetMaterialConfigs);
}