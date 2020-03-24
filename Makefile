.DEFAULT_GOAL := help

REACT_APP_CMD := EXTEND_ESLINT=true npx react-scripts
SRC_FILES := ./src/**/*.ts[x] ./src/*.ts[x]

# Porcelain
# ###############
.PHONY: run build lint test container deploy

run: setup ## run development server
	$(REACT_APP_CMD) start

build: setup src ## create artifact
	CI=false $(REACT_APP_CMD) build  # ad hoc fix for warnings

lint-fix: setup ## automatically fix linter errors (if possible)
	npx eslint $(SRC_FILES) --fix

lint: setup ## run static analysis
	npx eslint $(SRC_FILES)

test: setup ## run all tests
	CI=false $(REACT_APP_CMD) test  # ad hoc fix for warnings

iterate: ## run tests for TDD iteration
	$(REACT_APP_CMD) test

container: build ## create container
	docker build -t lmap .

init: ## one time setup
	direnv allow

deploy: ## deploy a container to Nomad
	VERSION=$(VERSION) ./deploy.nomad.tpl > deploy.nomad
	nomad job run -address=$(NOMAD_URL) deploy.nomad


# Plumbing
# ###############
.PHONY: setup clean

setup: node_modules

node_modules: package.json yarn.lock
	yarn
	touch $@
	
clean:
	rm yarn-error.log
	rm deploy.nomad

# Utilities
# ###############
.PHONY: help
help: ## print this message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
