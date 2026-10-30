// JSON Schema for a module + its exercises. Written to be passed as-is to OpenAI Structured Outputs:
//   response_format: { type: "json_schema", json_schema: { name: "lingo_module", strict: true, schema: LINGO_MODULE_SCHEMA } }
// Strict mode requires every property listed in `required` and additionalProperties: false.
// The same payload is what POST /api/admin/modulos accepts; create_lingo_module() enforces the rules.
export const LINGO_MODULE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["language", "cefr_level", "class_topic", "title", "exercises"],
  properties: {
    language: { type: "string", enum: ["EN", "FR", "IT", "PT", "DE"] },
    cefr_level: { type: "string", enum: ["A1", "A2", "B1", "B2"], description: "IT, PT and DE go up to B1 only." },
    class_topic: { type: "string", description: "Grammar/topic of the class, e.g. 'Passé Composé con Être'." },
    title: { type: "string" },
    exercises: {
      type: "array", // non-empty is enforced by create_lingo_module()
      items: {
        type: "object",
        additionalProperties: false,
        required: ["type", "question", "options", "correct_answer", "audio_url"],
        properties: {
          type: { type: "string", enum: ["MULTIPLE_CHOICE", "FILL_BLANK", "LISTENING"] },
          question: {
            type: "string",
            description: "For FILL_BLANK, mark each blank with ___ (three underscores).",
          },
          options: {
            type: "array",
            items: { type: "string" },
            description: "Answer choices for MULTIPLE_CHOICE/LISTENING (must include correct_answer). Empty for FILL_BLANK.",
          },
          correct_answer: {
            type: "string",
            description: "For FILL_BLANK with several blanks, join the answers with | in order, e.g. 'suis|allé'.",
          },
          audio_url: {
            type: ["string", "null"],
            description: "Path inside the lingo_audios bucket. Required for LISTENING; null otherwise. AI output should leave it null.",
          },
        },
      },
    },
  },
} as const;
