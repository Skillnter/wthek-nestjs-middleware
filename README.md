# Official @wthek Extension – NestJS Middleware for `http-error-kit`

**Seamless NestJS Error Handling with @wthek**

_Built for applications powered by [http-error-kit][http-error-kit], this middleware ensures that all `http-error-kit` errors are properly formatted and returned with the correct HTTP status codes._

> 💡 What the HEK?! Need a hassle-free way to manage error responses for `http-error-kit` errors in NestJS? `@wthek/nestjs-middleware` has got you covered!

✅ **Supports both Express and Fastify** underlying NestJS apps out of the box.

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/skillnter/wthek-nestjs-middleware/main.yml)
[![npm version](https://img.shields.io/npm/v/%40wthek%2Fnestjs-middleware?color=brightgreen)](https://www.npmjs.com/package/@wthek/nestjs-middleware)
[![GitHub license](https://img.shields.io/github/license/skillnter/wthek-nestjs-middleware?color=brightgreen)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/Skillnter/wthek-nestjs-middleware)](https://github.com/Skillnter/wthek-nestjs-middleware/issues)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/06de705481ac4f9db62a08328b4af81b)](https://app.codacy.com/gh/Skillnter/wthek-nestjs-middleware/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/06de705481ac4f9db62a08328b4af81b)](https://app.codacy.com/gh/Skillnter/wthek-nestjs-middleware/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
![npms.io (final)](https://img.shields.io/npms-io/maintenance-score/%40wthek/nestjs-middleware?color=brightgreen)
![npm](https://img.shields.io/npm/dy/%40wthek%2Fnestjs-middleware)
![npm bundle size (version)](https://img.shields.io/bundlephobia/minzip/%40wthek%2Fnestjs-middleware/1.1.0)
![NPM Type Definitions](https://img.shields.io/npm/types/%40wthek%2Fnestjs-middleware)
[![Socket Badge](https://socket.dev/api/badge/npm/package/@wthek/nestjs-middleware/1.1.0)](https://socket.dev/npm/package/@wthek/nestjs-middleware/overview/1.1.0)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-121013?logo=github&logoColor=white)](https://skillnter.github.io/wthek-nestjs-middleware/)
[![Github Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-30363D?&logo=GitHub-Sponsors&logoColor=EA4AAA)](https://github.com/sponsors/Skillnter)
[![Open Collective](https://img.shields.io/badge/Open%20Collective-3385FF?logo=open-collective&logoColor=white)](https://opencollective.com/skillnter)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/skillnter)
[![Patreon](https://img.shields.io/badge/Patreon-F96854?logo=patreon&logoColor=white)](https://www.patreon.com/skillnter)
[![PayPal](https://img.shields.io/badge/PayPal-003087?logo=paypal&logoColor=fff)](https://www.paypal.me/skillnte)

## Features

-   **Official `http-error-kit` Extension** – The recommended middleware for NestJS apps.
-   **Dual Engine Support** – Seamlessly detects and works with both Express and Fastify-based NestJS applications.
-   **Auto-sets HTTP status codes** – Ensures the response status matches the error type.
-   **Plug-and-Play Middleware** – Just drop it in `main.ts` before starting your server!
-   **Response Guards** – Built-in protection against header/stream conflicts (`headersSent` on Express, `reply.sent` on Fastify).
-   **Configurable Logging** – Enable engine logging or provide your own custom logger callback.
-   **`handleUnknownErrors` Option** – Optionally catch non-Kit errors and return a structured 500 response.

## Table of Content

-   [Installation](#installation)
-   [Usage](#usage)
-   [Options](#options)
-   [How It Works](#how-it-works)
-   [Why Use @wthek/nestjs-middleware?](#why-use-wtheknestjs-middleware)
-   [Explore More WTHek Extensions](#explore-more-wthek-extensions)
-   [People](#people)
-   [Donations](#donations)
-   [License](#license)

## Installation

```console
npm install @wthek/nestjs-middleware
```

## Usage

**Add Middleware Just Before Starting the Server**

To catch all errors correctly, place `KitNestJsMiddleware(app)` in `main.ts` before starting the NestJS server.

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KitNestJsMiddleware } from '@wthek/nestjs-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Automatically detects whether Express or Fastify adapter is used
  KitNestJsMiddleware(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

**With Options**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KitNestJsMiddleware } from '@wthek/nestjs-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  KitNestJsMiddleware(app, {
    log: true,                // Enables underlying engine logging
    handleUnknownErrors: true // Returns structured 500 for non-Kit errors
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

**Custom Logger**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KitNestJsMiddleware } from '@wthek/nestjs-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  KitNestJsMiddleware(app, {
    log: (error, req) => {
      console.error(`[${req.method}] ${req.url}`, error);
    }
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## Options

| Option                | Type                                  | Default | Description                                                                                                                             |
| --------------------- | ------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `log`                 | `boolean \| ((error, req) => void)`   | `false` | When `true`, logs via the underlying engine logger (`console.error` on Express, `request.log.error` on Fastify). When a function, uses your custom callback. |
| `handleUnknownErrors` | `boolean`                             | `false` | When `true`, returns a structured `{ statusCode: 500, message: "Internal Server Error" }` for non-Kit errors instead of passing raw errors to the default handler. |

## How It Works

-   Inspects the NestJS HTTP adapter type at startup (`app.getHttpAdapter().getType()`).
-   If `express`, configures and mounts `@wthek/express-middleware` with the provided options.
-   If `fastify`, retrieves the underlying Fastify instance and attaches `@wthek/fastify-middleware` with the provided options.
-   Catches errors thrown across routes and middleware, matching `KitHttpError` or `KitGeneralError` instances.
-   Formats the error response with the correct HTTP status code and structured JSON payload.
-   Guards against headers-sent/reply-sent race conditions.

## Why Use `@wthek/nestjs-middleware`?

-   **Zero Configuration Adapter Detection** – Works seamlessly regardless of whether you switch between Express and Fastify.
-   **No manual error mapping** – Status codes and payloads are automatically formatted.
-   **Consistent API responses** – Standardized JSON error objects for cleaner client error handling.
-   **Production-safe** – Response-sent guards and structured fallbacks prevent unexpected process crashes.

## Explore More WTHek Extensions

The WTHek ecosystem continues to grow with new extensions to simplify error handling across various frameworks and libraries. Stay updated with the latest tools that integrate seamlessly with `http-error-kit`.

**Check out the official list of extensions**: [Official Extensions List](https://github.com/Skillnter/http-error-kit/wiki/Official-Extensions-List)

## People

The original author of the project is [Himanshu Bansal][skillnter]

## Donations

**This is all voluntary work**, so if you want to support my efforts you can

-   [Buy Me A Coffee](https://www.buymeacoffee.com/skillnter)
-   [Paypal](https://www.paypal.me/skillnte)
-   [GitHub Sponsor](https://github.com/sponsors/Skillnter)
-   [Patreon](https://www.patreon.com/skillnter)
-   [Open Collective](https://opencollective.com/skillnter)

You can also use the following:

![BTC: bc1p22h4nsad5d8ketyhuvf0vyva6unttxwzzqvkty5r839as0mlclgs72d3mf](https://img.shields.io/badge/BTC-bc1p22h4nsad5d8ketyhuvf0vyva6unttxwzzqvkty5r839as0mlclgs72d3mf-brightgreen)

![ETH: 0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889](https://img.shields.io/badge/ETH-0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889-brightgreen)

![BNB: 0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889](https://img.shields.io/badge/BNB-0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889-brightgreen)

## License

`@wthek/nestjs-middleware` project is open-sourced software licensed under the [MIT license](LICENSE) by [Himanshu Bansal][skillnter].

[skillnter]: https://github.com/Skillnter/
[http-error-kit]: https://www.npmjs.com/package/http-error-kit
