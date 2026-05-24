-- ============================================================
-- Thesis Digital Archive — Initial Schema Migration
-- Version: 001 (2024-05-24)
-- 
-- This migration creates all 5 tables, enums, indexes, and
-- foreign key constraints for the archive system.
-- 
-- Run against PostgreSQL:
--   psql -U root -d project-nexus-db -f 001-initial-schema.sql
-- ============================================================

-- ── Cleanup: Drop existing tables (if re-running) ──────────
DROP TABLE IF EXISTS archive_logs CASCADE;
DROP TABLE IF EXISTS manuscripts CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- ── 1. ENUM type ────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('admin', 'adviser', 'student');

-- ── 2. USERS table ──────────────────────────────────────────
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            user_role NOT NULL DEFAULT 'student',
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);

-- ── 3. PROJECTS table ───────────────────────────────────────
CREATE TABLE projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255) NOT NULL,
    abstract        TEXT,
    year            INTEGER,
    adviser_id      UUID,
    tech_stack      TEXT[],
    created_by      UUID NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_project_adviser
        FOREIGN KEY (adviser_id)
        REFERENCES users (id)
        ON DELETE SET NULL,

    CONSTRAINT fk_project_creator
        FOREIGN KEY (created_by)
        REFERENCES users (id)
        ON DELETE NO ACTION
);

CREATE INDEX idx_projects_title ON projects USING GIN (to_tsvector('english', title));
CREATE INDEX idx_projects_year ON projects (year);
CREATE INDEX idx_projects_adviser ON projects (adviser_id);
CREATE INDEX idx_projects_creator ON projects (created_by);

-- ── 4. PROJECT_MEMBERS table ────────────────────────────────
CREATE TABLE project_members (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id        UUID NOT NULL,
    user_id           UUID NOT NULL,
    role_in_project   VARCHAR(100),
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_member_project
        FOREIGN KEY (project_id)
        REFERENCES projects (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_member_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,

    CONSTRAINT uq_project_user UNIQUE (project_id, user_id)
);

CREATE INDEX idx_members_project ON project_members (project_id);
CREATE INDEX idx_members_user ON project_members (user_id);

-- ── 5. MANUSCRIPTS table ────────────────────────────────────
CREATE TABLE manuscripts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL,
    file_name       VARCHAR(255) NOT NULL,
    original_name   VARCHAR(255) NOT NULL,
    file_path       VARCHAR(500) NOT NULL,
    file_size       BIGINT NOT NULL,
    mime_type       VARCHAR(100) NOT NULL,
    uploaded_by     UUID NOT NULL,
    version         INTEGER NOT NULL DEFAULT 1,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_manuscript_project
        FOREIGN KEY (project_id)
        REFERENCES projects (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_manuscript_uploader
        FOREIGN KEY (uploaded_by)
        REFERENCES users (id)
        ON DELETE NO ACTION
);

CREATE INDEX idx_manuscripts_project ON manuscripts (project_id);
CREATE INDEX idx_manuscripts_uploader ON manuscripts (uploaded_by);

-- ── 6. ARCHIVE_LOGS table ───────────────────────────────────
CREATE TABLE archive_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID,
    action          VARCHAR(50) NOT NULL,
    target_type     VARCHAR(50) NOT NULL,
    target_id       UUID,
    description     TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_log_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE SET NULL
);

CREATE INDEX idx_logs_user ON archive_logs (user_id);
CREATE INDEX idx_logs_target_type ON archive_logs (target_type);
CREATE INDEX idx_logs_created ON archive_logs (created_at);

-- ── 7. Trigger: auto-update updated_at ──────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ── Done ────────────────────────────────────────────────────
