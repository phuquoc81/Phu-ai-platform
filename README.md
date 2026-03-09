# PHU AI Platform — Learning Module

[![CI](https://github.com/phuquoc81/Phu-ai-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/phuquoc81/Phu-ai-platform/actions/workflows/ci.yml)
[![Check dist/](https://github.com/phuquoc81/Phu-ai-platform/actions/workflows/check-dist.yml/badge.svg)](https://github.com/phuquoc81/Phu-ai-platform/actions/workflows/check-dist.yml)
[![Lint Codebase](https://github.com/phuquoc81/Phu-ai-platform/actions/workflows/linter.yml/badge.svg)](https://github.com/phuquoc81/Phu-ai-platform/actions/workflows/linter.yml)
![Coverage](./badges/coverage.svg)

A GitHub Action that generates AI-powered lessons and step-by-step guidance for
using AI tools to work smarter and build income. Powered by
[phubers.blog](https://phubers.blog).

## Architecture

```
User
  ↓
PHU AI Learning Module (GitHub Action)
  ↓
Lesson Generator  +  AI Teacher
  ↓
Structured lesson output  +  Step-by-step answer
```

## Usage

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v4

  - name: Run PHU AI Learning Module
    id: phu-ai
    uses: phuquoc81/Phu-ai-platform@main
    with:
      topic: 'Make Money With AI'
      question: 'How do I use AI to earn money online?'

  - name: Print Lesson
    run: |
      echo "Lesson: ${{ steps.phu-ai.outputs.lesson }}"
      echo "Answer: ${{ steps.phu-ai.outputs.answer }}"
      echo "Total lessons: ${{ steps.phu-ai.outputs.lesson_count }}"
```

## Inputs

| Input      | Description                                                             | Required | Default              |
| ---------- | ----------------------------------------------------------------------- | -------- | -------------------- |
| `topic`    | The topic to generate a lesson for (e.g. `"Make Money With AI"`).       | No       | `Make Money With AI` |
| `question` | A question to ask the PHU AI Teacher. Defaults to the topic when empty. | No       | `''`                 |

## Outputs

| Output         | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `lesson`       | A JSON string with the generated lesson (`title`, `steps`, `moneyExample`). |
| `answer`       | The PHU AI Teacher's step-by-step response to the question.                 |
| `lesson_count` | The total number of lessons available in the platform catalog.              |

## Lesson Catalog

The action ships with a built-in catalog of lessons:

1. **Start Using PHU AI** — how to open the dashboard, ask questions, and save
   results for work or business.
2. **Make Money With AI** — content creation → digital product → marketplace →
   automation → scale.
3. **Automate Tasks With AI** — identify repetitive work, pick the right tool,
   automate, productise, and sell.

A custom lesson is also generated on the fly for every unique `topic` value you
supply.

## Development

### Setup

```bash
npm install
```

### Test

```bash
npm test
```

### Bundle

After editing any file in `src/`, rebuild the distribution:

```bash
npm run bundle
```

### Local Action Testing

```bash
# npx @github/local-action <action-yaml-path> <entrypoint> <dotenv-file>
npx @github/local-action . src/main.ts .env
```

Copy `.env.example` to `.env` and fill in your inputs before running.
