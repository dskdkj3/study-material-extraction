#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("usage: node scripts/validate-manifests.mjs <manifest.json|batch-manifest.json|run-dir> [...]");
  process.exit(2);
}

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const runSchema = readJson(path.join(root, "docs/schemas/manifest.schema.json"));
const batchSchema = readJson(path.join(root, "docs/schemas/batch-manifest.schema.json"));

let hadError = false;
for (const arg of args) {
  for (const target of expandTarget(arg)) {
    const schema = path.basename(target) === "batch-manifest.json" ? batchSchema : runSchema;
    const data = readJson(target);
    const errors = validate(data, schema, "$");
    if (errors.length > 0) {
      hadError = true;
      console.error(`invalid: ${target}`);
      for (const error of errors) console.error(`  - ${error}`);
    } else {
      console.log(`ok: ${target}`);
    }
  }
}

process.exit(hadError ? 1 : 0);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function expandTarget(target) {
  const stat = fs.statSync(target);
  if (!stat.isDirectory()) return [target];
  const files = [];
  for (const name of ["manifest.json", "batch-manifest.json"]) {
    const file = path.join(target, name);
    if (fs.existsSync(file)) files.push(file);
  }
  if (files.length === 0) {
    throw new Error(`no manifest.json or batch-manifest.json in ${target}`);
  }
  return files;
}

function validate(value, schema, at) {
  const errors = [];

  if (schema.type !== undefined && !matchesType(value, schema.type)) {
    errors.push(`${at}: expected type ${formatType(schema.type)}, got ${actualType(value)}`);
    return errors;
  }

  if (schema.enum && !schema.enum.some((item) => deepEqual(item, value))) {
    errors.push(`${at}: expected one of ${schema.enum.map(String).join(", ")}, got ${String(value)}`);
  }

  if (schema.minLength !== undefined && typeof value === "string" && value.length < schema.minLength) {
    errors.push(`${at}: expected string length >= ${schema.minLength}`);
  }

  if (schema.minimum !== undefined && typeof value === "number" && value < schema.minimum) {
    errors.push(`${at}: expected number >= ${schema.minimum}`);
  }

  if (schema.required && isObject(value)) {
    for (const key of schema.required) {
      if (!(key in value)) errors.push(`${at}.${key}: missing required property`);
    }
  }

  if (schema.properties && isObject(value)) {
    for (const [key, childSchema] of Object.entries(schema.properties)) {
      if (key in value) {
        errors.push(...validate(value[key], childSchema, `${at}.${key}`));
      }
    }
  }

  if (schema.items && Array.isArray(value)) {
    value.forEach((item, index) => {
      errors.push(...validate(item, schema.items, `${at}[${index}]`));
    });
  }

  return errors;
}

function matchesType(value, expected) {
  if (Array.isArray(expected)) return expected.some((type) => matchesType(value, type));
  if (expected === "array") return Array.isArray(value);
  if (expected === "integer") return Number.isInteger(value);
  if (expected === "number") return typeof value === "number" && Number.isFinite(value);
  if (expected === "object") return isObject(value);
  if (expected === "null") return value === null;
  return typeof value === expected;
}

function actualType(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  if (Number.isInteger(value)) return "integer";
  return typeof value;
}

function formatType(type) {
  return Array.isArray(type) ? type.join("|") : type;
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
