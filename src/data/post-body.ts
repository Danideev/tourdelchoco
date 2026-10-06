/**
 * Cuerpo de los artículos del blog (mock editorial).
 * Fuente editable: `content/articulos.json` → clave `bodies`.
 * Estructura tipada en lugar de HTML crudo para poder estilizar cada bloque
 * desde el renderer y mantener el contenido separado de la presentación.
 */
import { z } from "zod";
import articulosJson from "../../content/articulos.json";

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "note"; title?: string; text: string };

const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: z.string() }),
  z.object({ type: z.literal("h2"), text: z.string() }),
  z.object({ type: z.literal("list"), items: z.array(z.string()) }),
  z.object({
    type: z.literal("quote"),
    text: z.string(),
    cite: z.string().optional(),
  }),
  z.object({
    type: z.literal("note"),
    title: z.string().optional(),
    text: z.string(),
  }),
]);

export const POST_BODIES: Record<string, PostBlock[]> = z
  .record(z.string(), z.array(blockSchema))
  .parse(articulosJson.bodies);
