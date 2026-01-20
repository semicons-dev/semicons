---
title: JSON Schema
description: Validate registry.json with JSON Schema
---

The generated `schema.json` provides JSON Schema validation for `registry.json`. This page covers its usage and customization.

## Overview

This page covers:
- Schema structure and purpose
- Validation with AJV
- IDE integration
- Customization

## Schema Location

Generated at: `src/icons.generated/schema.json`

## Usage with AJV

```javascript
import Ajv from 'ajv'
import schema from './icons.generated/schema.json'
import registry from './icons.generated/registry.json'

const ajv = new Ajv()
const validate = ajv.compile(schema)
const valid = validate(registry)

if (!valid) {
  console.error('Validation errors:', validate.errors)
}
```

## Schema Structure

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://semicons.dev/schemas/registry.json",
  "title": "Semicons Registry",
  "description": "Icon registry for Semicons",
  "type": "object",
  "properties": {
    "version": {
      "type": "string",
      "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$"
    },
    "themes": {
      "type": "array",
      "items": { "type": "string" }
    },
    "tokens": {
      "type": "array",
      "items": { "$ref": "#/$defs/token" }
    }
  },
  "required": ["version", "themes", "tokens"],
  "$defs": {
    "token": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "pattern": "^[a-z][a-z0-9-]*:[a-zA-Z0-9][a-zA-Z0-9._/-]*$"
        },
        "themes": {
          "type": "object",
          "additionalProperties": { "type": "string" }
        }
      }
    }
  }
}
```

## IDE Integration

### VS Code

Create `jsconfig.json` or `tsconfig.json` with schema:

```json
{
  "json.schemas": [
    {
      "fileMatch": ["**/icons.generated/registry.json"],
      "url": "./src/icons.generated/schema.json"
    }
  ]
}
```

### WebStorm

Settings → JSON Schema Mappings → Add schema for registry.json pattern.

## Customization

### Extend Schema

Create custom schema that extends the generated one:

```json
{
  "allOf": [
    { "$ref": "src/icons.generated/schema.json" },
    {
      "properties": {
        "customField": { "type": "string" }
      }
    }
  ]
}
```

### Validate in CI

```javascript
// validate.js
import fs from 'fs'
import Ajv from 'ajv'

const schema = JSON.parse(fs.readFileSync('./src/icons.generated/schema.json'))
const registry = JSON.parse(fs.readFileSync('./src/icons.generated/registry.json'))

const ajv = new Ajv({ allErrors: true })
const validate = ajv.compile(schema)

if (!validate(registry)) {
  console.error('Invalid registry:', validate.errors)
  process.exit(1)
}

console.log('Registry is valid')
```

## When to Use

- CI/CD validation
- Custom tooling
- IDE autocomplete
- API validation

## When Not to Use

- Runtime validation (overhead)
- Simple projects (CLI handles validation)

## Common Issues

### Schema not found

```bash
Error: Cannot find schema.json
```

**Solution**: Run `generate` first.

### Validation fails

```bash
Error: registry.json doesn't match schema
```

**Solution**: Check validation errors and fix registry.

## Next Steps

- [Registry Reference](/reference/registry-json) - Registry structure
- [CLI Generate](/cli/generate) - Generate schema
- [AJV Documentation](https://ajv.js.org/)
