#!/bin/bash
# Hook: on-task-complete.sh
# Runs quality checks when AI marks a task as completed via TodoWrite.
#
# Phases:
# 1. Detect which file types changed (TypeScript, Vue, JS)
# 2. Auto-fix lint issues (eslint --fix)
# 3. Validate code (eslint, nuxt typecheck)
# 4. Output errors if any, signaling AI to create fix tasks

# Only trigger on TodoWrite tool
if [[ "$CLAUDE_TOOL_NAME" != "TodoWrite" ]]; then
  exit 0
fi

# Only trigger when a task is marked completed
if ! echo "$CLAUDE_TOOL_PARAMS" | grep -q '"status"[[:space:]]*:[[:space:]]*"completed"'; then
  exit 0
fi

echo ""
echo "Task completed. Running quality checks..."
echo ""

# Detect changed files since HEAD
CHANGED_FILES=$(git diff --name-only HEAD 2>/dev/null || echo "")

if [ -z "$CHANGED_FILES" ]; then
  echo "No files changed. Skipping checks."
  exit 0
fi

# Detect if any TypeScript/Vue/JS files changed
HAS_TS_CHANGES=$(echo "$CHANGED_FILES" | grep -qE '\.(ts|vue|js|mjs)$' && echo "yes" || echo "no")

ERRORS=""

# ============================================
# TYPESCRIPT/VUE: Lint + Type Check
# ============================================
if [[ "$HAS_TS_CHANGES" == "yes" ]]; then
  echo "Auto-fixing lint issues..."
  npm run lint:fix --silent 2>&1 || true
  echo "   Done"
  echo ""

  echo "Validating code (eslint + typecheck)..."

  # ESLint check
  if ! ESLINT_OUTPUT=$(npm run lint --silent 2>&1); then
    ERRORS="${ERRORS}

ESLint errors:
${ESLINT_OUTPUT}"
    echo "   eslint failed"
  else
    echo "   eslint passed"
  fi

  # TypeScript check
  if ! TSC_OUTPUT=$(npm run typecheck 2>&1); then
    ERRORS="${ERRORS}

TypeScript errors:
${TSC_OUTPUT}"
    echo "   typecheck failed"
  else
    echo "   typecheck passed"
  fi
  echo ""
fi

# ============================================
# RESPOND TO RESULTS
# ============================================
if [ -n "$ERRORS" ]; then
  echo "----------------------------------------"
  echo "QUALITY ISSUES DETECTED"
  echo "----------------------------------------"
  echo "$ERRORS"
  echo ""
  echo "Please create a task to fix the errors above."
  exit 1
else
  echo "----------------------------------------"
  echo "All quality checks passed!"
  echo "----------------------------------------"
  exit 0
fi
