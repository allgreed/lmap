.DEFAULT_GOAL := help

REACT_APP_CMD := npx react-scripts

# Porcelain
# ###############
.PHONY: serve build ci lint test container

serve: setup ## run development server
	$(REACT_APP_CMD) start

ci: setup lint test build container ## run all tests and build all artifacts

build: setup src ## create artifact
	$(REACT_APP_CMD) build

lint: ## run static analysis
	@echo "Not implemented";

test: setup ## run all tests
	CI=true $(REACT_APP_CMD) test

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
