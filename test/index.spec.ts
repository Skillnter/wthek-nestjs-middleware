import { KitNestJsMiddleware, IKitNestJsMiddlewareOptions } from "../src";
import { INestApplication } from "@nestjs/common";
import { FastifyInstance } from "fastify";
import * as expressMiddlewarePkg from "@wthek/express-middleware";
import * as fastifyMiddlewarePkg from "@wthek/fastify-middleware";

describe("KitNestJsMiddleware", () => {
    let app: INestApplication;
    const AdaptorTypes = {
        ERROR: "error",
        EXPRESS: "express",
        FASTIFY: "fastify",
    };

    it("should throw error when adapter type is neither 'express' nor 'fastify'", () => {
        app = {
            getHttpAdapter: () => ({
                getType: () => AdaptorTypes.ERROR,
                getInstance: () => ({}),
            }),
        } as unknown as INestApplication;

        expect(() => KitNestJsMiddleware(app)).toThrow(
            `[WTHek] Unsupported HTTP adapter: ${AdaptorTypes.ERROR}`
        );
    });

    describe("Express adapter", () => {
        it("should set express middleware when adapter type is 'express' without options", () => {
            const useMock = jest.fn();
            app = {
                getHttpAdapter: () => ({
                    getType: () => AdaptorTypes.EXPRESS,
                    getInstance: () => ({}),
                }),
                use: useMock,
            } as unknown as INestApplication;

            KitNestJsMiddleware(app);

            expect(useMock).toHaveBeenCalledTimes(1);
            expect(typeof useMock.mock.calls[0][0]).toBe("function");
        });

        it("should forward options to express middleware when options are provided", () => {
            const spy = jest.spyOn(expressMiddlewarePkg, "KitExpressMiddleware");
            const useMock = jest.fn();
            app = {
                getHttpAdapter: () => ({
                    getType: () => AdaptorTypes.EXPRESS,
                    getInstance: () => ({}),
                }),
                use: useMock,
            } as unknown as INestApplication;

            const options: IKitNestJsMiddlewareOptions = {
                log: true,
                handleUnknownErrors: true,
            };

            KitNestJsMiddleware(app, options);

            expect(spy).toHaveBeenCalledWith(options);
            expect(useMock).toHaveBeenCalledTimes(1);
            spy.mockRestore();
        });
    });

    describe("Fastify adapter", () => {
        it("should set fastify middleware when adapter type is 'fastify' without options", () => {
            const setErrorHandlerMock = jest.fn();
            const fastifyInstance = {
                setErrorHandler: setErrorHandlerMock,
            } as unknown as FastifyInstance;

            app = {
                getHttpAdapter: () => ({
                    getType: () => AdaptorTypes.FASTIFY,
                    getInstance: () => fastifyInstance,
                }),
                use: jest.fn(),
            } as unknown as INestApplication;

            KitNestJsMiddleware(app);

            expect(setErrorHandlerMock).toHaveBeenCalledTimes(1);
            expect(typeof setErrorHandlerMock.mock.calls[0][0]).toBe("function");
        });

        it("should forward options to fastify middleware when options are provided", () => {
            const spy = jest.spyOn(fastifyMiddlewarePkg, "KitFastifyMiddleware");
            const setErrorHandlerMock = jest.fn();
            const fastifyInstance = {
                setErrorHandler: setErrorHandlerMock,
            } as unknown as FastifyInstance;

            app = {
                getHttpAdapter: () => ({
                    getType: () => AdaptorTypes.FASTIFY,
                    getInstance: () => fastifyInstance,
                }),
                use: jest.fn(),
            } as unknown as INestApplication;

            const options: IKitNestJsMiddlewareOptions = {
                log: true,
                handleUnknownErrors: true,
            };

            KitNestJsMiddleware(app, options);

            expect(spy).toHaveBeenCalledWith(fastifyInstance, options);
            expect(setErrorHandlerMock).toHaveBeenCalledTimes(1);
            spy.mockRestore();
        });
    });
});
