#!/bin/bash

# Test script for static site conversion workflow
# This script validates that all components are working correctly

echo "============================================================"
echo "Static Site Conversion Workflow - Test Suite"
echo "============================================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test results
pass_test() {
    echo -e "${GREEN}✓${NC} $1"
    TESTS_PASSED=$((TESTS_PASSED + 1))
}

fail_test() {
    echo -e "${RED}✗${NC} $1"
    TESTS_FAILED=$((TESTS_FAILED + 1))
}

info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Test 1: Check if Node.js is installed
echo "Test 1: Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    pass_test "Node.js is installed ($NODE_VERSION)"
else
    fail_test "Node.js is not installed"
fi

# Test 2: Check if Python is installed
echo "Test 2: Checking Python installation..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    pass_test "Python is installed ($PYTHON_VERSION)"
else
    fail_test "Python is not installed"
fi

# Test 3: Check if dependencies are installed
echo "Test 3: Checking Node.js dependencies..."
if [ -d "node_modules" ]; then
    pass_test "Node.js dependencies are installed"
else
    fail_test "Node.js dependencies not found. Run: npm install"
fi

# Test 4: Check if all scripts exist
echo "Test 4: Checking script files..."
if [ -f "scripts/identify_and_scrape.js" ]; then
    pass_test "identify_and_scrape.js exists"
else
    fail_test "identify_and_scrape.js not found"
fi

if [ -f "scripts/repair_site.js" ]; then
    pass_test "repair_site.js exists"
else
    fail_test "repair_site.js not found"
fi

if [ -f "scripts/github_push.py" ]; then
    pass_test "github_push.py exists"
else
    fail_test "github_push.py not found"
fi

# Test 5: Check if scripts are executable
echo "Test 5: Checking script permissions..."
if [ -x "scripts/identify_and_scrape.js" ]; then
    pass_test "identify_and_scrape.js is executable"
else
    fail_test "identify_and_scrape.js is not executable"
fi

if [ -x "scripts/repair_site.js" ]; then
    pass_test "repair_site.js is executable"
else
    fail_test "repair_site.js is not executable"
fi

if [ -x "scripts/github_push.py" ]; then
    pass_test "github_push.py is executable"
else
    fail_test "github_push.py is not executable"
fi

# Test 6: Check Node.js syntax
echo "Test 6: Checking Node.js script syntax..."
if node -c scripts/identify_and_scrape.js 2>/dev/null; then
    pass_test "identify_and_scrape.js syntax is valid"
else
    fail_test "identify_and_scrape.js has syntax errors"
fi

if node -c scripts/repair_site.js 2>/dev/null; then
    pass_test "repair_site.js syntax is valid"
else
    fail_test "repair_site.js has syntax errors"
fi

# Test 7: Check Python syntax
echo "Test 7: Checking Python script syntax..."
if python3 -m py_compile scripts/github_push.py 2>/dev/null; then
    pass_test "github_push.py syntax is valid"
else
    fail_test "github_push.py has syntax errors"
fi

# Test 8: Test script help/usage messages
echo "Test 8: Testing script usage messages..."
if node scripts/identify_and_scrape.js 2>&1 | grep -q "Usage:"; then
    pass_test "identify_and_scrape.js shows usage message"
else
    fail_test "identify_and_scrape.js doesn't show usage message"
fi

if node scripts/repair_site.js 2>&1 | grep -q "Usage:"; then
    pass_test "repair_site.js shows usage message"
else
    fail_test "repair_site.js doesn't show usage message"
fi

if python3 scripts/github_push.py 2>&1 | grep -q "Usage:"; then
    pass_test "github_push.py shows usage message"
else
    fail_test "github_push.py doesn't show usage message"
fi

# Test 9: Check documentation files
echo "Test 9: Checking documentation files..."
DOCS=("README.md" "QUICKSTART.md" "CONTRIBUTING.md" "ISSUE_TEMPLATE.md")
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        pass_test "$doc exists"
    else
        fail_test "$doc not found"
    fi
done

# Test 10: Check GitHub workflow
echo "Test 10: Checking GitHub workflow..."
if [ -f ".github/workflows/convert-site.yml" ]; then
    pass_test "GitHub workflow exists"
else
    fail_test "GitHub workflow not found"
fi

# Test 11: Check package.json
echo "Test 11: Checking package.json..."
if [ -f "package.json" ]; then
    if node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" 2>/dev/null; then
        pass_test "package.json is valid JSON"
    else
        fail_test "package.json is invalid JSON"
    fi
else
    fail_test "package.json not found"
fi

# Test 12: Check .gitignore
echo "Test 12: Checking .gitignore..."
if [ -f ".gitignore" ]; then
    if grep -q "node_modules" .gitignore; then
        pass_test ".gitignore includes node_modules"
    else
        fail_test ".gitignore doesn't include node_modules"
    fi
else
    fail_test ".gitignore not found"
fi

# Print summary
echo ""
echo "============================================================"
echo "Test Summary"
echo "============================================================"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo "============================================================"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
