.PHONY: install dev client-dev server-dev server-start build lint lint-fix format fmt typecheck test test-e2e test-e2e-debug test-e2e-ui compile watch clean docker-build docker-start

install:
	npm ci

dev:
	npm run dev

client-dev:
	npm run client:dev

server-dev:
	cd backend && npm run dev

server-start:
	npm run server:start

build:
	npm run client:build

lint:
	npm run client:lint
	npm run server:lint

lint-fix:
	npm run client:lint:fix
	npm run server:lint:fix

format fmt:
	npm run client:format
	npm run server:format

typecheck:
	npm run client:build

test test-e2e:
	npm run test:e2e

test-e2e-debug:
	npm run test:e2e:debug

test-e2e-ui:
	npm run test:e2e:ui

compile:
	npm run compile

watch:
	npm run watch

clean:
	rm -rf client/dist node_modules client/node_modules backend/node_modules

docker-build:
	npm run docker:build

docker-start:
	npm run docker:start
