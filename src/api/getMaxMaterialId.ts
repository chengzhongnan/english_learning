import { Bool, OpenAPIRoute, Str } from "chanfana";
import { Env } from "../type";
import { z } from "zod";
import { Context } from "hono";
import { getReadingMaterialTableName, getQuestionsTableName } from "./common";


export class GetReadingMaterialMaxId extends OpenAPIRoute {
    schema = {
        tags: ["Reading"],
        summary: "Get reading material max id.",
        request: {
            query: z.object({
                type: z.string(),
            })
        },
        responses: {
            "200": {
                description: "Returns the generated content",
                content: {
                    "application/json": {
                        schema: z.object({
                            id: z.number()
                        }),
                    },
                },
            },
            "404": {
                description: "Returns the error message.",
                content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: Bool(),
								error: Str(),
							}),
						}),
					},
				},
            }
        },
    };

    async getMaxId(env: Env, tableName: string): Promise<number | null> {
        const result = await env.DB.prepare(`SELECT MAX(id) AS max_id FROM ${tableName}`).first<{max_id: number}>();
        
        return result?.max_id ?? 0;
    }

    async handle(request: Context) {
        try {
            const data = await this.getValidatedData<typeof this.schema>();
            const material_table_name = getReadingMaterialTableName(data.query.type);
    
            if (material_table_name === null) {
                throw new Error("无效的类型参数");
            }
    
            const maxId = await this.getMaxId(request.env, material_table_name!);
    
            return {
                id: maxId
            }
        } catch(error: any) {
            return Response.json(
				{
					success: false,
					error: error.message || "Internal Server Error",
				},
				{
					status: 404,
				},
			);
        }
    }
}