# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## What this is

VivuViet V2 backend: NestJS 12 + TypeORM + PostgreSQL 17. It is a rebuild of the V1 Express/MongoDB API (kept in a sibling folder outside this repo, reference only). Business rules live in `docs/domain.md`; the plan and roadmap live in `../lo-trinh-vivuviet-v2.html` (outside this repo). Change a rule in `docs/domain.md` first, then the code.

## How to work with the user

- Reply in Vietnamese.
- The user is learning backend by rebuilding this project. Act as a mentor: explain the reasoning behind decisions and state trade-offs.
- The Destination and Auth modules are typed by the user by hand. Explain and review; do not write the implementation unless the user explicitly asks ("viết giúp", "viết luôn"). When asked, show the complete code in the chat reply and do not edit the user's files unless told to.
- From the third module on, generate code following the patterns the user established.
- Do not add infrastructure (Redis, queues, CQRS, microservices) unless asked.

## Commands

The project is ESM (`"type": "module"`): relative imports need the `.js` suffix, e.g. `'./app.service.js'`. Tests use Vitest (not Jest), lint uses oxlint (not ESLint).

```bash
npx -y npm@11 install            # npm 10.9.3 crashes on this dependency tree ("reading 'edgesOut'"); use npm 11
npm run start:dev                # watch mode, port 3000; does NOT reload .env, restart after editing it
npm run build
npm run lint                     # oxlint src/ test/
npm test                         # vitest run (unit)
npx vitest run src/path/file.spec.ts -t "name"   # single file / single test
npm run test:e2e                 # vitest with vitest.config.e2e.ts
npm run migration:generate -- src/database/migrations/Name   # builds first, diffs entities vs DB
npm run migration:run            # builds first, applies pending migrations
npm run migration:revert
npm run seed                     # builds first; inserts the 34 provinces, idempotent (.orIgnore())
```

API is mounted at `http://localhost:3000/api/v1`; Swagger UI at `http://localhost:3000/api/docs` (JSON at `/api/docs-json`, outside the `api/v1` prefix).

## Environment

`.env` is git-ignored; `.env.example` is the template.

| Variable | Read by | Notes |
|---|---|---|
| `PORT` | `main.ts` | defaults to 3000 |
| `DATABASE_URL` | app and `src/database/data-source.ts` | must match the database you actually use |
| `POSTGRES_PASSWORD` | Docker Compose only | the app ignores it; it applies only when the volume is first created |

Two databases can exist on the user's machine: Postgres installed locally on **5432**, and the `compose.yaml` container on **5433**. If the app fails with `ECONNREFUSED`, check which port `DATABASE_URL` points to and whether that server is running. Changing `POSTGRES_PASSWORD` after the volume exists has no effect; `docker compose down -v` resets it.

## Layout

```
src/
├─ main.ts                    # prefix api/v1, ValidationPipe, global filter, Swagger
├─ app.module.ts              # ConfigModule, TypeOrmModule.forRootAsync, feature modules
├─ common/filters/            # ProblemDetailsFilter (RFC 9457)
├─ database/
│  ├─ data-source.ts          # TypeORM CLI DataSource, loads entities and migrations from dist/
│  ├─ migrations/             # generated, then read and committed
│  └─ seeds/                  # destinations.seed.ts
└─ destination/               # entity, service, public controller, dto/*.response.ts
docs/
├─ domain.md                  # business rules (source of truth)
├─ postman/                   # exported Postman collection (baseUrl variable)
└─ log.md                     # per-session notes, newest first
```

## Conventions

- Layering is Controller → Service → `Repository<Entity>` injected with `@InjectRepository`. No hand-written repository layer.
- Never return entities from a controller. Map to response DTOs with a static `from()`.
- `ValidationPipe` is global with `whitelist`, `forbidNonWhitelisted`, `transform`. Map DTO fields onto entities explicitly; never `Object.assign(entity, dto)` or spread a body into `save`.
- Status changes go through dedicated endpoints (`/approve`, `/reject`), never a generic status PATCH. State-machine rules go in pure `*.policy.ts` functions so they can be unit tested without a database.
- Each role gets its own controller: `public-*`, `partner-*`, `admin-*`.
- Errors come from `ProblemDetailsFilter`: `HttpException` keeps its status, `EntityNotFoundError` becomes 404, PostgreSQL `23505` becomes 409, anything else 500. Success responses return data directly, with no `{ success, data }` wrapper.
- Schema changes go only through migrations. `synchronize` is `false` in every environment.
- Columns: IDs are `int` (`@PrimaryGeneratedColumn()`); timestamps are `timestamptz` with precision 3; enums are PostgreSQL enum columns; entity properties are camelCase and columns snake_case via `name:`. Type relation properties as `Relation<Other>` to avoid circular-import errors in ESM.
- Swagger: add `@ApiTags`, `@ApiOkResponse` (with `isArray` for lists) on controllers, and `@ApiProperty` on every DTO field. A `string | null` field needs `@ApiProperty({ type: String, nullable: true })`, and an array field needs `type: [Dto]`, because TypeScript erases both.

## Gotchas

- Migrations are loaded from `dist/`, not `src/`. After deleting or renaming a migration, also delete `dist/` and `tsconfig.build.tsbuildinfo`, otherwise a stale compiled migration still runs.
- After `DROP SCHEMA public CASCADE`, recreate it with `CREATE SCHEMA public AUTHORIZATION vivuviet;`, otherwise `migration:run` fails with "no schema has been selected to create in".
- Never use `synchronize: true` to "fix" a missing table; generate a migration.
- `src/app.module.ts` wires `@nestjs/observe` with placeholder keys (`YOUR_APP_KEY`). It came from the Nest CLI prompt and is not part of the design.
- The scaffold `AppController` (`GET /api/v1`) and `app.controller.spec.ts` are leftovers. Remove them once a real test replaces the spec.
- `problem-details.filters.ts` is plural and `instance` in the filter uses `req.path`; both are known, optional clean-ups.

## Status

Done: Destination module (list and detail), init migration, seed of 34 provinces, Problem Details filter, Swagger UI, Postman collection.

Open: `compose.yaml` is written and syntax-checked but has never been run (Docker Desktop did not start on the user's machine). Verify with `docker compose up -d`, then `migration:run` and `seed` on the empty database before writing e2e tests. Next: connect the V2 API to the frontend, then Chặng 2 (Auth).