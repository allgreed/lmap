.DEFAULT_GOAL := help

REACT_APP_CMD := EXTEND_ESLINT=true npx react-scripts
SRC_FILES := src/**/*.ts

# Porcelain
# ###############
.PHONY: run build ci lint test container

run: setup ## run development server
	$(REACT_APP_CMD) start

ci: setup test lint build ## run all tests and build all artifacts
	# except for the container heh ;d

build: setup src ## create artifact
	CI=false $(REACT_APP_CMD) build  # ad hoc fix for warnings

lint-fix:  ## automatically fix linter errors (if possible)
	npx eslint $(SRC_FILES) --fix

lint: ## run static analysis
	npx eslint $(SRC_FILES)

test: setup ## run all tests
	CI=false $(REACT_APP_CMD) test  # ad hoc fix for warnings

iterate: ## run tests for TDD iteration
	$(REACT_APP_CMD) test

container: build ## create container
	docker build -t lmap .

init: ## one time setup
	direnv allow


# Plumbing
# ###############
.PHONY: setup clean

setup: node_modules

node_modules: package.json yarn.lock
	yarn
	touch $@
	
clean:
	rm yarn-error.log

# Utilities
# ###############
.PHONY: help
help: ## print this message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
