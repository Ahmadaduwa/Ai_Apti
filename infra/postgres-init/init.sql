-- infra/postgres-init/init.sql
-- This script will run only on first container initialization and creates
-- an additional database named `ai_apti` in case any client tries to connect
-- to that name (some logs showed attempts to connect to "ai_apti").

CREATE DATABASE ai_apti WITH OWNER = ai_apti;
