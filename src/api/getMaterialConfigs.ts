import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { Context } from "hono";
import { getMaterialTypes } from "./common";

export class GetMaterialConfigs extends OpenAPIRoute {
    schema = {
        tags: ["Reading"],
        summary: "Get material types",
        request: {
        },
        responses: {
            "200": {
                description: "Returns the generated content",
                content: {
                    "application/json": {
                        schema: z.object({
                            types: z.array(z.object({
                                name: Str(),
                                desc: Str(),
                                image: Str()
                            }))
                        }),
                    }
                }
            }
        }
    };

    async handle(request: Context) {
        return {
            types: getMaterialTypes()
        }
    }
}