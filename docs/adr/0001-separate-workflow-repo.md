# ADR 0001: Keep Extraction Standards Outside NixOS Configuration

## Status

Accepted

## Context

The PDF extraction workflow began while working from a `nixos-config` worktree because the tool environment lives there. The workflow itself is not host configuration: it defines study-material content formats, review states, OCR lane roles, answer authoring rules, and preview artifacts.

Keeping the canonical standard inside `nixos-config` would mix machine configuration with reusable content-processing methodology. It would also make future use outside one host or one operator workflow harder.

## Decision

Maintain canonical study-material extraction standards in this standalone repository, `study-material-extraction`.

`nixos-config` may install tools or link to this repository, but it should not own the extraction runbook, schemas, or answer-writing standards.

Large run artifacts stay outside the repository, normally under `/srv/xsy-agent-share/pdf-extraction/<run-slug>/`.

## Consequences

- The workflow can evolve independently from host configuration.
- The same standard can be reused for PDFs, scanned images, or future input formats.
- NixOS integration remains limited to tool availability and agent environment wiring.
- Existing `nixos-config` notes should become historical pointers after this repository is adopted.

