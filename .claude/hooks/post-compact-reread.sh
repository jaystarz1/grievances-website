#!/bin/bash
# Post-Compact Hook: Orient new instance for Grievance Website
# Grievances book companion website

echo "<post-compact-context>"
echo "CONTEXT WAS JUST COMPRESSED"
echo ""

# Find session_log.yaml
SESSION_LOG=$(find "$CLAUDE_PROJECT_DIR" -name "session_log.yaml" -not -path "*/node_modules/*" -type f 2>/dev/null | head -1)

if [ -n "$SESSION_LOG" ]; then
  echo "=== CURRENT STATE (from session_log.yaml) ==="
  sed -n '/^current_state:/,/^[a-z_]*:/p' "$SESSION_LOG" | head -20
  echo ""
fi

# Project orchestrator
if [ -f "$CLAUDE_PROJECT_DIR/CLAUDE.md" ]; then
  echo "=== PROJECT ORCHESTRATOR (CLAUDE.md) ==="
  head -100 "$CLAUDE_PROJECT_DIR/CLAUDE.md"
  echo ""
  echo "--- END (first 100 lines) ---"
  echo ""
fi

# Style guide (important for web projects)
if [ -f "$CLAUDE_PROJECT_DIR/STYLE-GUIDE.yaml" ]; then
  echo "=== STYLE GUIDE ==="
  head -50 "$CLAUDE_PROJECT_DIR/STYLE-GUIDE.yaml"
  echo ""
  echo "--- END (first 50 lines) ---"
  echo ""
fi

echo "INSTRUCTION: Review the docs above. Resume work from current_state."
echo "</post-compact-context>"

exit 0
