# Contributing to BidPilot

Thank you for your interest in contributing to BidPilot!

## Development Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Abdlrrahman/bidpilot.git
   cd bidpilot
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Run tests:
   ```bash
   npm run test
   ```

## Guidelines
- Write pure, typed functions for all mathematical calculations in `src/engine/`.
- Ensure all new calculation logic is covered by Vitest tests in `tests/`.
- Maintain bilingual support for English and Arabic (RTL).
- Never commit private, proprietary, or non-synthetic client/tender data.
