# Proposal: Enhance Learn View

## Summary
Improve the Learn page with proper entity relationship visualizations and concrete examples in glossary cards to make CPQ concepts more tangible for learners.

## Motivation
The current Learn page has:
1. A treemap chart that shows entity names but doesn't visualize **relationships** between entities
2. Glossary cards with definitions but no concrete **examples** to ground abstract concepts

Users learning CPQ need to understand how entities connect (Product → ProductFeature → ProductOption) and see real-world examples ("A laptop bundle with RAM and Storage features").

## Scope

### 1. Entity Relationship Visualizations
Replace the treemap with two complementary views:
- **ER Diagram**: Classic boxes-and-lines showing entities with labeled relationships (1:N, N:1)
- **Hierarchical Tree**: Top-down tree showing the Product → Feature → Option and Quote → LineItem hierarchies

Both visualizations will use ApexCharts (already in the stack).

### 2. Glossary Examples
Add an `example` field to each glossary term card showing a concrete CPQ scenario:
- **Product**: "Dell XPS 15 Laptop (SKU: DELL-XPS-15)"
- **Bundle**: "Custom Workstation with configurable CPU, RAM, and Storage"
- **Quote**: "Q-2024-0042 for Acme Corp - $12,450 total"

## Out of Scope
- Interactive diagram exploration (click-to-highlight) - defer to future enhancement
- Database-driven glossary terms - keep as static data for now
