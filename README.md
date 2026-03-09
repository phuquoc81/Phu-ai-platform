# Phu AI Platform — GitHub Action

![Linter](https://github.com/phuquoc81/Phu-ai-platform/actions/workflows/linter.yml/badge.svg)
![CI](https://github.com/phuquoc81/Phu-ai-platform/actions/workflows/ci.yml/badge.svg)
![Check dist/](https://github.com/phuquoc81/Phu-ai-platform/actions/workflows/check-dist.yml/badge.svg)
![CodeQL](https://github.com/phuquoc81/Phu-ai-platform/actions/workflows/codeql-analysis.yml/badge.svg)
![Coverage](./badges/coverage.svg)

A GitHub Action that helps **teachers and students** solve complex math,
physics, and puzzle problems using **Phu AI**. Unlock advanced step-by-step
solutions by upgrading to **Phu AI Pro** for **$1.99 / month** via Stripe.

## Features

| Feature                      | Free Tier | Phu AI Pro ($1.99/month) |
| ---------------------------- | :-------: | :----------------------: |
| Math problem solving         | ✅ Basic  |     ✅ Step-by-step      |
| Physics problem solving      | ✅ Basic  |    ✅ Full derivation    |
| Puzzle solving               | ✅ Hints  |   ✅ Optimal solution    |
| Classroom-ready explanations |    ❌     |            ✅            |

## Usage

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v4

  - name: Solve with Phu AI
    id: phu-ai
    uses: phuquoc81/Phu-ai-platform@v1
    with:
      problem: 'Find the derivative of f(x) = x^3 + 2x^2 - 5x + 1'
      problem_type: math
      # Leave subscription_token empty for the free tier
      subscription_token: ${{ secrets.PHUAI_PRO_TOKEN }}

  - name: Show Solution
    run: |
      echo "Plan: ${{ steps.phu-ai.outputs.plan }}"
      echo "Solution: ${{ steps.phu-ai.outputs.solution }}"
```

## Inputs

| Input                | Required | Default | Description                                                                                   |
| -------------------- | :------: | ------- | --------------------------------------------------------------------------------------------- |
| `problem`            |  ✅ Yes  | —       | Natural-language description of the problem to solve.                                         |
| `problem_type`       |    No    | `math`  | Category of the problem: `math`, `physics`, or `puzzle`.                                      |
| `subscription_token` |    No    | `""`    | Phu AI Pro token issued after a Stripe payment. Store this as a [repository secret][secrets]. |

[secrets]: https://docs.github.com/en/actions/security-guides/encrypted-secrets

## Outputs

| Output     | Description                                                               |
| ---------- | ------------------------------------------------------------------------- |
| `solution` | The solution produced by Phu AI for the given problem.                    |
| `plan`     | Active subscription plan (`Phu AI (Free)` or `Phu AI Pro ($1.99/month)`). |

## Upgrading to Phu AI Pro

1. Visit the Phu AI Platform and subscribe for **$1.99/month** via Stripe.
2. Copy the subscription token you receive.
3. Add it as an [encrypted secret][secrets] in your repository (e.g.
   `PHUAI_PRO_TOKEN`).
4. Pass the secret to the action via `subscription_token`:

   ```yaml
   subscription_token: ${{ secrets.PHUAI_PRO_TOKEN }}
   ```

Pro tokens have the prefix `phuai_pro_` and are verified by the action.

## Supported Problem Types

| Type      | Examples                                                              |
| --------- | --------------------------------------------------------------------- |
| `math`    | Algebra, calculus, linear algebra, statistics                         |
| `physics` | Mechanics, thermodynamics, electromagnetism, quantum basics           |
| `puzzle`  | Logic puzzles, combinatorics, Tower of Hanoi, Rubik's Cube strategies |

## Development

### Setup

```bash
npm install
```

### Test

```bash
npm test
```

### Bundle (required after every `src/` change)

```bash
npm run bundle
```
