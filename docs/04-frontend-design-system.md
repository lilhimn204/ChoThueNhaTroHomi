# Rental Room Website - Step 4 Frontend Design System

## Frontend stack

- Next.js 16
- React 19
- TailwindCSS 4
- TypeScript

## Design direction applied

Style chosen:

- calm utility
- light surfaces
- blue-teal primary palette
- warm accent used sparingly
- clear typography hierarchy
- rounded cards with soft elevation

Why this works for a rental room website:

- users need trust and clarity more than decorative visuals
- room cards must be easy to scan quickly
- filters must feel structured, not crowded
- admin pages need density and control, not marketing visuals

## Typography

- Heading font: `Plus Jakarta Sans`
- Body font: `Inter`

## Color system

- Brand deep: `#0F4C5C`
- Brand support: `#1F7A8C`
- Accent warm: `#E59F3A`
- Background: `#F6F8FB`
- Surface: `#FFFFFF`
- Text strong: `#102A43`
- Text muted: `#627D98`

## Core UI components completed

- Header
- Footer
- Hero search section
- Search bar
- Room card
- Filter sidebar
- Mobile filter drawer
- Pagination
- Empty state
- Loading skeleton
- Alert feedback
- Login form
- Register form
- Profile form
- Admin sidebar
- Admin stat card
- Admin table

## Main pages completed

- Home
- Room listing
- Room detail
- Login
- Register
- Profile
- Contact history
- Admin dashboard
- Admin room management
- Admin contact request management

## UX rules applied

- labels are always visible on forms
- CTA buttons are clear and consistent
- card information is prioritized instead of overloaded
- mobile filter uses a drawer with apply/reset actions
- empty states explain what to do next
- hover and focus states are visible but restrained
- admin area is visually distinct from the public site

## Anti-patterns avoided

- no oversized meaningless hero
- no rainbow gradients or flashy neon color usage
- no overloaded room cards
- no bootstrap-like admin panel styling
- no placeholder-only forms
- no filter layout that collapses into chaos on mobile
- no public/admin visual duplication

## Build verification

Frontend verification completed with:

- `npm run lint`
- `npm test`
- `npm run build`

All commands passed successfully after the frontend build/lint/test fixes.

## Current integration note

Current frontend pages are wired to real backend APIs through:

- public API calls for room/district/amenity data
- Next.js API proxy for authenticated user, host and admin calls
- authentication state
- protected routes
- backend-driven loading, error, and empty states
