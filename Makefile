.DEFAULT_GOAL := help

REACT_APP_CMD := npx react-scripts

# Porcelain
# ###############
.PHONY: env-up env-down env-recreate ci lint test container

serve: ## run development server
	$(REACT_APP_CMD) start

ci: node_modules lint test build push-container-image ## run all tests and build all artifacts
	@echo "Not implemented"; false

build: node_modules src ## create artifact
	$(REACT_APP_CMD) build

lint: ## run static analysis
	@echo "Not implemented"; false

test: node_modules ## run all tests
	$(REACT_APP_CMD) test

container: build ## create container
	docker build -t lmap .

init: ## one time setup
	direnv allow


# Plumbing
# ###############
.PHONY: push-container-image

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
