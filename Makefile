.DEFAULT_GOAL := help

REACT_APP_CMD := EXTEND_ESLINT=true npx react-scripts
LINTED_FILES := ./src/**/*.ts{,x} ./src/*.ts{,x}

ifneq (,$(findstring w,$(MAKEFLAGS)))
	# interactive
	WATCHFLAG:=-w
	CI:=''
else
	# non-interactive
	WATCHFLAG:=
	CI:=true
endif

# Porcelain
# ###############
.PHONY: run build lint lint-fix test container deploy typecheck show-coverage

run: setup ## run development server
	$(REACT_APP_CMD) start

build: setup src ## create artifact
	CI=false $(REACT_APP_CMD) build  # ad hoc fix for warnings

lint-fix: setup ## automatically fix linter errors (if possible)
	npx eslint $(LINTED_FILES) --fix

lint: setup ## run static analysis
	npx eslint $(LINTED_FILES)

test: setup ## run all tests, use -w for watchmode
	CI=$(CI) $(REACT_APP_CMD) test --coverage

container: build ## create container
	docker build -t lmap .

init: ## one time setup
	direnv allow

deploy: ## deploy a container to Nomad
	VERSION=$(VERSION) ./deploy.nomad.tpl > deploy.nomad
	nomad job run -address=$(NOMAD_URL) deploy.nomad

show-coverage:
	xdg-open coverage/lcov-report/index.html

typecheck: ## run typecheck, use -w for watchmode
	npx tsc -p ./tsconfig.json $(WATCHFLAG)

# Plumbing
# ###############
.PHONY: setup clean

setup: node_modules

node_modules: package.json yarn.lock
	yarn
	touch $@
	
clean:
	rm -f yarn-error.log deploy.nomad
	rm -rf coverage

# Utilities
# ###############
.PHONY: help
help: ## print this message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
