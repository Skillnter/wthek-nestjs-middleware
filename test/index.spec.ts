import { KitNestJsMiddleware } from "../src";
import { INestApplication } from "@nestjs/common";
import { FastifyInstance } from "fastify";
import { KitFastifyMiddleware } from "@wthek/fastify-middleware";

describe("KitFastifyMiddleware", () => {
    let app: INestApplication;
    const AdaptorTypes = {
        ERROR: "error",
        EXPRESS: "express",
        FASTIFY: "fastify",
    };

    it("should return error when type is neither 'express' or 'fastify'", async () => {
        try {
            app = {
                getHttpAdapter: () => {
                    return {
                        getType: () => AdaptorTypes.ERROR,
                        getInstance: () => {
                            return {
                                setErrorHandler: jest.fn(),
                            } as unknown as FastifyInstance;
                        },
                    };
                },
            } as unknown as INestApplication;
            await KitNestJsMiddleware(app);
        } catch (error: any) {
            expect(error.message).toBe(
                `[WTHek] Unsupported HTTP adapter: ${AdaptorTypes.ERROR}`
            );
        }
    });

    it("should set the express middleware when adaptor type is 'express'", async () => {
        try {
            app = {
                getHttpAdapter: () => {
                    return {
                        getType: () => AdaptorTypes.EXPRESS,
                        getInstance: () => {
                            return {
                                setErrorHandler: jest.fn(),
                            } as unknown as FastifyInstance;
                        },
                    };
                },
                use: jest.fn(),
            } as unknown as INestApplication;
            await KitNestJsMiddleware(app);
            expect(app.use).toHaveBeenCalled();
        } catch (error: any) {
            expect(error).toBe(undefined);
        }
    });

    it("should set the fastify middleware when adaptor type is 'fastify'", async () => {
        try {
            const fastifyInstance = {
                setErrorHandler: jest.fn(),
            } as unknown as FastifyInstance;
            app = {
                getHttpAdapter: () => {
                    return {
                        getType: () => AdaptorTypes.FASTIFY,
                        getInstance: () => {
                            return fastifyInstance;
                        },
                    };
                },
                use: jest.fn(),
            } as unknown as INestApplication;
            await KitNestJsMiddleware(app);
            expect(fastifyInstance.setErrorHandler).toHaveBeenCalled();
        } catch (error: any) {
            console.log(error);
            expect(error).toBe(undefined);
        }
    });
});
