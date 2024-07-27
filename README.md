# Bitflags

Maintain feature flags in a single integer.

## Getting started

```bash
bun add @eckidevs/bitflags
```

## Usage

```typescript
import { defineMask } from '@eckidevs/bitflags';

const featureFlags = defineMask([
  "is_admin",
  "dark_mode",
  "experimental_mode",
  "pro_account",
]);

featureFlags.listActiveFlags(); // []

// Turn a flag on
featureFlags.setFlag("dark_mode"); // 2 (0b0010)
featureFlags.listActiveFlags(); // ["dark_mode"]

// Get individual flag status
featureFlags.isFlagActive("dark_mode"); // true
featureFlags.isFlagActive("is_admin"); // false

featureFlags.setFlag("pro_account"); // 10 (0b1010)
featureFlags.listActiveFlags(); // ["dark_mode", "pro_account"]

// List all flags as [string, boolean] tuples
featureFlags.listAllFlags(); // [["is_admin", false], ["dark_mode", true], ["experimental_mode", false], ["pro_account", true]]

// Unset a flag
featureFlags.clearFlag("dark_mode"); // 8 (0b1000)

// Completely remove a flag
featureFlags.removeFlag("pro_account"); // 0 (0b000)

// Add a new flag
featureFlags.addFlag("is_moderator"); // 0 (0b0000)
featureFlags.setFlag("is_moderator"); // 1 (0b1000)

// Turn all flags on
featureFlags.setState(15); // 15 (0b1111)

// Turn all flags off
featureFlags.setState(0); // 0 (0b0000)
```

## Contributing

Feel free to open issues, make PRs, and contribute in any way you think is helpful.
