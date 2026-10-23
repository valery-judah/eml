.DEFAULT_GOAL := help
COMPOSE := docker compose --env-file .infra/versions.env

.PHONY: help up down build verify preview clean
help:
	@printf 'make up       Preview in the pinned container\nmake down     Stop the preview\nmake build    Build dist/ in the pinned container\nmake verify   Build, test, and check production routes\nmake preview  Serve the production build in the container\nmake clean    Remove generated dist/\n'
up:
	$(COMPOSE) up --build site
down:
	$(COMPOSE) down
build:
	$(COMPOSE) run --rm --build --no-deps site npm run build
verify:
	$(COMPOSE) run --rm --build --no-deps site npm run verify
preview:
	$(COMPOSE) run --rm --build --no-deps --service-ports site npm run preview -- --host 0.0.0.0
clean:
	$(COMPOSE) run --rm --no-deps site node --input-type=module -e 'import { rm } from "node:fs/promises"; await rm("dist", { recursive: true, force: true });'
