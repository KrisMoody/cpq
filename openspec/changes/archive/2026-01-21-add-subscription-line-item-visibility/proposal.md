# Proposal: Add Subscription Visibility to Quote Line Items

## Summary

Implement the existing subscription display requirements from `subscriptions` spec (lines 58-70) that are not yet built. Quote line items currently show only Product, Qty, Unit Price, and Net Price. Users cannot see billing frequency, term, or per-line recurring metrics without checking each product individually.

## Problem

1. **No billing frequency visible** - Users can't tell if a line item is one-time vs recurring
2. **No term information** - Contract terms are hidden, making TCV calculations opaque
3. **Price lacks context** - "$100" could mean $100/month, $100/year, or $100 one-time
4. **Missing per-line MRR** - Only aggregate MRR is shown in quote summary

## Solution

Add subscription metadata to the quote line items table:

1. **Billing frequency badge** - Show "Monthly", "Annual", etc. per line
2. **Price suffix** - Display "$100/mo" or "$1,200/yr" instead of just "$100"
3. **Term column** - Show contract term when applicable (e.g., "12 mo")
4. **Per-line MRR** - Optional column showing normalized monthly value

## Scope

- **In scope:** QuoteLinesTable.vue display changes, API response enhancement, TypeScript interface updates
- **Out of scope:** Editing term/frequency on line items, pro-ration UI, renewal workflows

## Related Specs

- `subscriptions` - Requirement: Quote Line Item Recurring Display (lines 58-70)
- `quotes-ui` - General quote line item display patterns

## Implementation Notes

The data already exists in the database:
- `Product.billingFrequency`, `Product.customBillingMonths`, `Product.defaultTermMonths`
- `QuoteLineItem.termMonths` (override for product default)

The API just needs to include these fields in the response, and the UI needs to display them.
