.DEFAULT_GOAL := help

REACT_APP_CMD := npx react-scripts

# Porcelain
# ###############
.PHONY: env-up env-down env-recreate ci build lint test container

serve: ## run development server
	$(REACT_APP_CMD) start

ci: setup lint test build push-container-image ## run all tests and build all artifacts
	@echo "Not implemented"; false

build: setup ## create artifact
	$(REACT_APP_CMD) build

lint: ## run static analysis
	@echo "Not implemented"; false

test: setup ## run all tests
	$(REACT_APP_CMD) test

container: build ## create container
	@echo "Not implemented"; false

init: ## one time setup
	direnv allow


# Plumbing
# ###############
.PHONY: setup push-container-image

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
