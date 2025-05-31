import { INestApplication } from "@nestjs/common";
import { KitExpressMiddleware } from "@wthek/express-middleware";
import { KitFastifyMiddleware } from "@wthek/fastify-middleware";

/**
 * KitNestJsMiddleware is a middleware for NestJS applications that provides
 * integration with @wthek/express-middleware and @wthek/fastify-middleware.
 *
 * The middleware is automatically configured based on the NestJS HTTP adapter type.
 *
 * @param app - The NestJS application instance.
 */
export function KitNestJsMiddleware(app: INestApplication) {
    try {
        const adapter = app.getHttpAdapter();
        const type = adapter.getType();
        if (type === "express") {
            app.use(KitExpressMiddleware());
        } else if (type === "fastify") {
            const fastifyInstance = adapter.getInstance();
            KitFastifyMiddleware(fastifyInstance);
        } else {
            throw new Error(`[WTHek] Unsupported HTTP adapter: ${type}`);
        }
    } catch (error) {
        throw error;
    }
}
