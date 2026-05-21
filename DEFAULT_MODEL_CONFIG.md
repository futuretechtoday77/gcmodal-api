# Default Model Configuration

**Last Updated:** 2026-05-21  
**Set By:** Joshua Parker (@knowingtruth)  
**Status:** ✅ Active

---

## Default Model

**Primary Default Model:** `moonshot/kimi-k2.5`

This model is now the permanent default for all sessions unless explicitly overridden.

---

## Configuration Location

**Config File:** `~/.openclaw/openclaw.json`

**Config Path:** `agents.defaults.model.primary`

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "moonshot/kimi-k2.5"
      }
    }
  }
}
```

---

## Available Models

The following models are configured and available:

| Provider | Model ID | Name | Context Window | Max Tokens |
|----------|----------|------|----------------|------------|
| moonshot | kimi-k2.5 | Kimi K2.5 | 256,000 | 8,192 |
| anthropic | claude-sonnet-4-5 | Claude Sonnet 4.5 | 200,000 | 8,192 |
| anthropic | claude-opus-4-5 | Claude Opus 4.5 | 200,000 | 8,192 |
| anthropic | claude-haiku-4-5 | Claude Haiku 4.5 | 200,000 | 8,192 |
| openai | gpt-4.1 | GPT-4.1 | 1,047,576 | 32,768 |
| openai | gpt-4.1-mini | GPT-4.1 Mini | 1,047,576 | 32,768 |
| openai | gpt-4.1-nano | GPT-4.1 Nano | 1,047,576 | 32,768 |
| openai | o3 | o3 (Reasoning) | 200,000 | 100,000 |
| openai | o4-mini | o4-mini (Reasoning) | 200,000 | 100,000 |

---

## Changing the Default

**To change the default model:**

```bash
openclaw config set agents.defaults.model.primary <provider>/<model-id>
```

**Example:**
```bash
openclaw config set agents.defaults.model.primary anthropic/claude-sonnet-4-5
```

**Then restart the gateway:**
```bash
openclaw gateway restart
```

Or wait for the next session to start.

---

## Session Override

To temporarily use a different model for a single session:

```
/model <provider>/<model-id>
```

**Example:**
```
/model anthropic/claude-opus-4-5
```

This override lasts only for the current session and does not change the default.

---

## Policy

**DO NOT** change the default model without explicit permission from Joshua Parker (@knowingtruth).

The default model should remain as `moonshot/kimi-k2.5` unless:
1. Joshua explicitly requests a different default
2. Kimi 2.5 becomes unavailable or deprecated
3. A critical bug requires temporary fallback to another model

---

## History

- **2026-05-21:** Default model changed from `anthropic/claude-sonnet-4-5` to `moonshot/kimi-k2.5` per Joshua's request

---

**Note:** This configuration is persistent across restarts and applies to all new sessions.
