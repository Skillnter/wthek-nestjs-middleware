import { INestApplication } from "@nestjs/common";
import {
    KitExpressMiddleware,
    IKitExpressMiddlewareOptions,
} from "@wthek/express-middleware";
import {
    KitFastifyMiddleware,
    IKitFastifyMiddlewareOptions,
} from "@wthek/fastify-middleware";

/**
 * Configuration options for KitNestJsMiddleware.
 */
export interface IKitNestJsMiddlewareOptions {
    /**
     * Optional logger callback or boolean flag.
     * When set to `true`, errors are logged via the underlying engine's
     * logging mechanism (`console.error` in Express, `request.log.error` in Fastify).
     * When set to a function, the function receives the error and request
     * for custom logging.
     *
     * @default false
     */
    // eslint-disable-next-line no-unused-vars
    log?: boolean | ((error: unknown, req: any) => void);

    /**
     * If true, catches non-Kit errors and returns a structured 500 response
     * instead of passing raw unformatted errors to the default handler.
     *
     * @default false
     */
    handleUnknownErrors?: boolean;
}

/**
 * KitNestJsMiddleware is an error-handling middleware for NestJS applications
 * powered by `http-error-kit`.
 *
 * The middleware automatically detects the underlying NestJS HTTP adapter type
 * (Express or Fastify) and registers the appropriate engine-specific middleware
 * with the provided options.
 *
 * @param {INestApplication} app The NestJS application instance.
 * @param {IKitNestJsMiddlewareOptions} [options] Optional configuration for the middleware.
 *
 * @example
 * ```typescript
 * import { NestFactory } from "@nestjs/core";
 * import { AppModule } from "./app.module";
 * import { KitNestJsMiddleware } from "@wthek/nestjs-middleware";
 *
 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);
 *   KitNestJsMiddleware(app, { log: true, handleUnknownErrors: true });
 *   await app.listen(process.env.PORT ?? 3000);
 * }
 * bootstrap();
 * ```
 */
export function KitNestJsMiddleware(
    app: INestApplication,
    options?: IKitNestJsMiddlewareOptions
) {
    const adapter = app.getHttpAdapter();
    const type = adapter.getType();

    if (type === "express") {
        app.use(KitExpressMiddleware(options as IKitExpressMiddlewareOptions));
    } else if (type === "fastify") {
        const fastifyInstance = adapter.getInstance();
        KitFastifyMiddleware(
            fastifyInstance,
            options as IKitFastifyMiddlewareOptions
        );
    } else {
        throw new Error(`[WTHek] Unsupported HTTP adapter: ${type}`);
    }
}
