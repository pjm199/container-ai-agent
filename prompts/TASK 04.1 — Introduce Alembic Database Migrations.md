# TASK 04.1 — Introduce Alembic Database Migrations

## Objective

Introduce Alembic into the existing FastAPI + SQLAlchemy + SQLite project.

The goal is to establish version-controlled, reproducible database schema migrations before adding new database features.

## 1. Analyze the existing project

Before making changes:
- Inspect SQLAlchemy models, database configuration and session management.
- Inspect existing database initialization.
- Identify the actual SQLite database location.
- Inspect the current containers table and its schema.
- Review existing tests and project dependencies.

Do not recreate or overwrite the existing database.

## 2. Install and configure Alembic

- Add Alembic to requirements.txt.
- Initialize Alembic in the project.
- Configure `alembic.ini` and `migrations/env.py`.
- Import SQLAlchemy metadata from the existing application models.
- Read DATABASE_URL from the existing application configuration.
- Support SQLite correctly, including batch migrations when necessary.

Avoid hardcoded database paths.

## 3. Baseline migration

Create an initial migration representing the existing database schema.

Important:
- Do not blindly run an initial migration against an existing database.
- Determine how to establish the baseline safely.
- Explain how an existing database is stamped to the baseline revision without executing the initial schema creation again.
- Preserve existing container records.
- Verify that a new empty database can be created from migrations.

## 4. Database initialization

Review the current `init_db` implementation.

Establish a clear migration-based initialization workflow.

Do not silently run destructive migrations or reset the database during application startup.

## 5. Tests

Add tests to verify:

- Alembic configuration is valid.
- Current database revision can be identified.
- A new empty database can be migrated to head.
- Existing database records survive baseline adoption.
- SQLAlchemy models and migration metadata are consistent.

Use temporary databases for tests.

Do not use the production or local development database for destructive tests.

## 6. Documentation

Update:
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `prompts/README.md`

Create:
- `prompts/04-01-alembic-migrations.md`

Document:
- How to create a migration.
- How to inspect migration history.
- How to apply migrations.
- How to roll back one revision.
- How to baseline an existing database safely.

## 7. Acceptance criteria

The task is complete only when:

1. Alembic is correctly configured.
2. Existing SQLite data is preserved.
3. A clean database can be created through migrations.
4. Existing database can adopt the baseline safely.
5. Tests pass.
6. Documentation is complete.
7. No existing frontend or API functionality is broken.

## 8. Final report

Provide:
- Architecture changes.
- Files created and modified.
- Migration revision identifiers.
- Commands for development and deployment.
- Test results.
- Any unresolved issues.

Do not commit or merge automatically.