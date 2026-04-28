# Rental Room Website - Step 1 Foundation

## 1. Project goal

Build a graduation project website for rental rooms that is:

- practical and easy to demo
- modern in UI, not like an old student template
- simple enough for one student to finish alone
- structured enough to defend in front of lecturers

The system serves three actors:

- guest / tenant user
- authenticated user
- admin

## 2. Recommended architecture

Use a separated frontend-backend architecture:

- Frontend: Next.js + React + TailwindCSS
- Backend: Spring Boot REST API
- Database: MySQL
- Auth: Spring Security + JWT
- Deployment:
  - frontend on Vercel
  - backend local first, deploy-ready later

This is the best fit for a student solo project because it keeps responsibilities clear:

- Next.js handles UI, routing, and user experience
- Spring Boot handles business logic, auth, and data access
- MySQL keeps the data model relational and easy to explain
- Vercel makes frontend deployment fast and reliable

## 3. Why this stack is the right choice

### Next.js + React

- strong component model for reusable UI
- app router supports clean page organization
- easy to separate server and client components
- good performance defaults for production demo
- easy deployment to Vercel

### TailwindCSS

- fast to build a consistent design system
- avoids old-looking CSS spaghetti
- good for building custom UI without relying on heavy templates
- easy to maintain with utility classes and design tokens

### Spring Boot

- industry-standard Java stack for graduation projects
- easy to explain in reports and defense
- mature ecosystem for REST API, security, validation, and JPA
- works well with layered architecture

### Spring Data JPA

- reduces boilerplate CRUD code
- easy entity-repository-service flow
- maps cleanly to MySQL tables for report writing

### Spring Security + JWT

- enough security for a student project
- simple role-based authorization for USER and ADMIN
- works well with separated frontend/backend apps

### MySQL

- common in university projects
- easy to host, inspect, seed, and export
- relational design fits rooms, users, amenities, and contact requests

### Vercel

- easiest option for Next.js deployment
- good preview and production workflow
- supports environment variables cleanly

## 4. System architecture

### Frontend modules

- public pages
  - home
  - room listing
  - room detail
- auth pages
  - login
  - register
- user pages
  - profile
  - contact request history
- admin pages
  - dashboard
  - room management
  - user management
  - contact request management

### Backend modules

- auth
- users
- rooms
- amenities
- contact requests
- districts / locations
- admin dashboard statistics

### Backend package structure

- controller
- service
- repository
- entity
- dto
- config
- security
- exception

### Security model

- public endpoints:
  - view rooms
  - search rooms
  - view room detail
  - register
  - login
- authenticated user endpoints:
  - update profile
  - create contact request
  - view own request history
- admin endpoints:
  - CRUD rooms
  - manage users
  - manage contact requests
  - dashboard stats

## 5. Why this scope is defendable

This topic is strong enough for a graduation project because it demonstrates:

- authentication and authorization
- CRUD management
- search and filtering
- relational database design
- modern responsive frontend
- API integration
- deployment readiness

It avoids risky complexity:

- no microservices
- no realtime chat
- no payment flow
- no map-heavy integrations
- no advanced search engine

That keeps the project stable, understandable, and realistic for a solo student.

## 6. Product direction for rental room UI

The website should feel:

- trustworthy
- clean
- practical
- calm and modern
- designed for quick decision making

This is not a luxury real estate website and not a generic e-commerce store. The main UX goal is:

- help users scan rooms quickly
- compare core information easily
- contact the owner with low friction

## 7. UI style direction

### Chosen design style

Use a modern "calm utility" style:

- light background
- blue-teal primary palette
- restrained accent color
- soft but clear shadows
- structured cards
- rounded corners, but not overly playful
- clean typography and strong spacing rhythm

This style fits rental housing because it communicates clarity and trust more than decoration.

### Anti-patterns to avoid

- giant empty hero section with no search value
- heavy gradients or neon accents
- too many badges or icons on room cards
- admin UI that looks like the public site
- overloaded filter panels
- using placeholder as the only label
- old bootstrap-like tables and panels
- inconsistent border radius and shadow across components

## 8. Proposed design system

### Color palette

- Primary: `#0F4C5C`
- Primary hover: `#0B3B47`
- Teal support: `#1F7A8C`
- Accent: `#E59F3A`
- Background: `#F6F8FB`
- Surface: `#FFFFFF`
- Border: `#D9E2EC`
- Text strong: `#102A43`
- Text muted: `#627D98`
- Success: `#137333`
- Warning: `#B7791F`
- Danger: `#C53030`

Reasoning:

- blue/teal signals reliability and calm
- warm accent helps CTA stand out without becoming noisy
- light neutral background keeps listing pages easy to scan

### Typography

- Headings: `Plus Jakarta Sans`
- Body: `Inter`

Reasoning:

- both are modern, readable, and professional
- headings feel more intentional than default system fonts
- body text remains highly legible on cards, forms, and tables

### Spacing system

- base unit: `4px`
- common spacing scale: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64`

Rules:

- cards use `16-24px` inner padding
- page sections use `48-64px` vertical spacing
- forms use `16-20px` gap between fields
- dense admin tables use tighter but still readable spacing

### Radius and shadow

- inputs and buttons: `10px`
- cards: `16px`
- large panels and drawers: `20px`
- shadow:
  - default card: soft shadow
  - hover card: slightly elevated shadow
  - focus ring: visible teal/blue outline

## 9. Component style rules

### Header

- sticky top header
- clean navigation
- auth actions on the right
- compact on mobile with slide-out menu

### Hero search section

- medium-height hero only
- strong search form inside hero
- quick trust copy, not marketing fluff
- show common districts or quick filters

### Search bar and filters

- search bar visible above results
- desktop: sidebar filters
- mobile: filter drawer with clear apply/reset actions
- filters grouped by meaning, not by data source

### Room card

Each card should show:

- thumbnail
- title
- district
- price
- area
- status
- 2-4 key amenities
- clear CTA

Rules:

- never overload with full description
- make price the strongest visual element after title
- hover effect should be subtle and professional

### Forms

- label always visible
- helper text where needed
- inline field errors
- clear submit states
- disabled state visibly different

### Admin UI

- darker and more structured than public UI
- clearer density and stronger information hierarchy
- sidebar navigation
- stat cards with restrained color usage
- tables with filters and status badges

## 10. Page-level UX direction

### Home page

Goal:

- introduce platform value quickly
- push user into search flow

Sections:

- hero with search
- featured rooms
- why choose this platform
- simple steps to rent
- trusted contact CTA

### Room listing page

Goal:

- support scanning, filtering, sorting, and comparing

Must include:

- keyword search
- district filter
- price range
- area range
- availability
- amenities
- sorting
- loading skeleton
- empty state
- pagination

### Room detail page

Goal:

- make the room understandable within seconds
- provide strong but calm contact action

Must include:

- image gallery
- summary panel with price, area, district, status
- readable description
- grouped amenities
- contact card
- request-to-view form

### Admin dashboard

Goal:

- support management first, not decoration

Must include:

- stats summary
- recent contact requests
- latest room updates
- quick actions

## 11. Frontend architecture direction

Suggested frontend folders:

- `app`
- `components`
- `services`
- `lib`
- `hooks`
- `types`
- `constants`

Guidelines:

- use server components by default
- use client components only for interactivity, forms, filters, and auth state
- centralize API base URL in env and service layer
- isolate reusable UI primitives and business components

## 12. Backend architecture direction

Suggested layers:

- controller: request/response boundary
- service: business rules
- repository: persistence
- dto: input/output models
- security: JWT, filters, auth config
- exception: global error handling

Guidelines:

- keep controllers thin
- validate input with DTOs
- return consistent response shapes
- keep auth logic centralized
- avoid overengineering patterns unnecessary for a student project

## 13. Demo-ready feature prioritization

Priority 1:

- auth
- room listing
- room detail
- search and filter
- contact request flow
- admin room CRUD

Priority 2:

- profile update
- request history
- dashboard stats
- user management

This ordering reduces project risk while keeping the demo strong.

## 14. Decision summary

Chosen solution:

- frontend and backend separated
- Next.js + TailwindCSS for a polished, reusable UI
- Spring Boot + JPA + Security for maintainable Java backend
- MySQL for relational data and reporting clarity
- JWT for simple auth across separate apps
- Vercel for frontend deployment

This combination is modern enough to impress, simple enough to finish, and structured enough for a graduation defense.

## 15. Next step

Step 2 will define:

- detailed database schema
- table relationships
- SQL create scripts
- seed data for demo
