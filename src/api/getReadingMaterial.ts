import { Bool, OpenAPIRoute, Str } from "chanfana";
import { Env } from "../type";
import { z } from "zod";
import { Context } from "hono";
import { getReadingMaterialTableName, getQuestionsTableName } from "./common";

type ReadingMaterialType = {
    id: number,
    filename: string,
    reading: string,
    chinese: string
}

type QuestionType = {
    id: number,
    question: string,
    option_A: string,
    option_B: string,
    option_C: string,
    option_D: string,
    correct_answer: string
}

export class GetReadingMaterial extends OpenAPIRoute {
    schema = {
        tags: ["Reading"],
        summary: "Get reading material based on the input.",
        request: {
            query: z.object({
                type: z.string(),
                id: z.number()
            })
        },
        responses: {
            "200": {
                description: "Returns the generated content",
                content: {
                    "application/json": {
                        schema: z.object({
                            material: z.object({
                                contents: z.string(),
                                translate: z.string(),
                                questions: z.array(z.object({
                                    question: z.string(),
                                    option: z.array(z.object({
                                        name: z.string(),
                                        content: z.string(),
                                    })),
                                    answer: z.string(),
                                })),
                            }),
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

    // 从数据库获取阅读材料
    async getReadingMaterial(env: Env, table_name: string, id: number): Promise<ReadingMaterialType> {
        const result = await env.DB.prepare(`
            SELECT id, filename, reading, chinese 
            FROM ${table_name} 
            WHERE id = ?`).bind(id).first<ReadingMaterialType>();

        if (!result) {
            throw new Error('Reading material not found');
        }

        return result;
    }

    // 从数据库获取问题
    async getQuestions(env: Env, table_name: string, id: number): Promise<QuestionType[]> {
        const { results } = await env.DB.prepare(`
            SELECT id, question, option_A, option_B, option_C, option_D, correct_answer 
            FROM ${table_name} 
            WHERE reading_id = ?`).bind(id).all<QuestionType>();

        return results || [];
    }

    async handle(request: Context) {
        try {
            const data = await this.getValidatedData<typeof this.schema>();
            const material_table_name = getReadingMaterialTableName(data.query.type);
            const questions_table_name = getQuestionsTableName(data.query.type);
    
            if (material_table_name === null || questions_table_name === null) {
                throw new Error("无效的类型参数");
            }
    
            const metaril = await this.getReadingMaterial(request.env, material_table_name!, data.query.id)
            const questions = await this.getQuestions(request.env, questions_table_name!, data.query.id)
    
            return {
                material: {
                    contents: metaril.reading,
                    translate: metaril.chinese,
                    questions: questions.map((q) => ({
                        question: q.question,
                        option: [{name:'A', content: q.option_A}, 
                            {name:'B', content: q.option_B}, 
                            {name:'C', content: q.option_C}, 
                            {name:'D', content: q.option_D}],
                        answer: q.correct_answer,
                    })),
                }
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