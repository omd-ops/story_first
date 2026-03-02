# StoryFirst - Architecture Decision Records (ADR)

**Document Version:** 1.0
**Date:** February 10, 2026 
**Author(s):** DevSavant Technical Team
**Client:** Sonny Caberwal
**Status:** Draft - Ready for Client Approval

---

## Document Overview

This document contains Architecture Decision Records (ADRs) for StoryFirst, documenting the rationale behind key technology selection decisions. Each ADR follows the standard template format and explains **WHY** technology choices were made.

---

# ADR-001: Frontend Framework - Next.js 15

---

## Context

StoryFirst requires a frontend framework that supports server-side rendering for magic link optimization, streaming support for real-time feedback, and video-heavy content delivery. Users access lessons via SMS links without login, requiring instant page loads for daily engagement.

**Architectural Challenge:**
- How do we ensure instant page loads for SMS magic links?
- How do we support streaming for AI feedback without complex setup?
- How do we minimize client bundle size for video-heavy pages?
- How do we support edge runtime for global users?

## Decision Drivers

- Magic link optimization (SMS links require instant SSR)
- Streaming support for AI feedback
- Video performance and bundle size optimization
- Edge runtime support for global distribution
- Single codebase for frontend and backend

## Considered Options

### Frontend Framework Comparison

| Criteria                 | Next.js 15   | React (Vite) | Remix        | SvelteKit         |
| ------------------------ | ------------ | ------------ | ------------ | ----------------- |
| **SSR/SSG**              | Native       | No           | Native       | Native            |
| **Streaming Support**    | Native       | Manual       | Manual       | Manual            |
| **Magic Link Support**   | Better       | Good         | Good         | Good              |
| **Video Performance**    | Better       | Good         | Good         | Good              |
| **Edge Runtime Support** | Native       | No           | Via adapters | Via adapters      |
| **Bundle Size**          | Better (RSC) | Good         | Good         | Better (compiled) |

### Option 1: Next.js 15 (App Router) (Chosen)

**Description:** Use Next.js 15 with App Router for SSR, Server Actions, and Edge Runtime

**Pros:**
- Native SSR ensures instant page loads for magic links
- Native streaming support for AI responses
- Server Actions eliminate need for separate API layer
- Edge Runtime supports SMS trigger logic at edge
- React Server Components reduce client bundle size
- Large ecosystem with extensive documentation and community support

**Cons:**
- Vercel-specific optimizations (acceptable trade-off)
- Learning curve for App Router (manageable)

**Risk Level:** Low

### Option 2: React (Vite)

**Description:** Use React with Vite for client-side rendering, separate backend API

**Pros:**
- Fast development server
- Large ecosystem with extensive documentation

**Cons:**
- Requires separate backend (more DevOps overhead)
- No SSR benefits for magic links
- Manual streaming implementation
- No edge runtime support
- Larger client bundle

**Risk Level:** Medium

### Option 3: Remix

**Description:** Use Remix framework with native SSR

**Pros:**
- Native SSR support
- Good form handling
- Progressive enhancement

**Cons:**

- Smaller ecosystem vs Next.js
- Less streaming tooling


**Risk Level:** Medium

### Option 4: SvelteKit

**Description:** Use SvelteKit for SSR and edge functions

**Pros:**
- Native SSR support
- Small bundle size
- Good performance

**Cons:**
- Learning curve (Svelte syntax)
- Smaller ecosystem for integrations
- Less documentation and examples

**Cost Impact:** Similar to Next.js

**Risk Level:** Medium-High

## Decision Outcome

**Chosen Option:** Option 1: Next.js 15 (App Router)

**Rationale:**

Next.js 15 best addresses our decision drivers:

1. **Magic Link Optimization:** StoryFirst users access lessons via SMS links without login. Next.js SSR ensures instant page loads - critical for daily engagement.

2. **Streaming Support:** Native streaming support for AI responses (grading feedback, coach interactions) without complex setup.

3. **Server Actions:** Eliminates need for separate API layer. XP calculations, streak updates, and challenge submissions all happen in type-safe server functions.

4. **Edge Runtime:** SMS trigger logic can run at the edge for minimal latency regardless of user location.

5. **App Router:** React Server Components reduce client bundle size. Video-heavy pages load faster.

**Consequences:**
- Instant page loads for magic links (critical for engagement)
- Native streaming support
- Single codebase (frontend + backend)
- Edge runtime support for global users
- Reduced client bundle size

---

# ADR-002: Styling - Tailwind CSS + Framer Motion

---

## Context

StoryFirst requires a high-energy, animated UI matching Devon's DJ persona. The platform needs Duolingo-style gamification with streak animations, XP popups, leaderboard transitions, and badge celebrations. Rapid UI development is critical.

**Architectural Challenge:**
- How do we create dynamic, animated UI matching Devon's brand?
- How do we implement smooth gamification animations?
- How do we balance development speed with customization?
- How do we optimize bundle size for animations?

## Decision Drivers

- High-energy brand requires dynamic, animated UI
- Duolingo-style gamification needs smooth animations
- Rapid UI development
- Bundle size optimization
- Full customization for DJ Devon brand
- Component library support

## Considered Options

### Styling Framework Comparison

| Criteria              | Tailwind + Framer | CSS Modules | Chakra UI   |
| --------------------- | ----------------- | ----------- | ----------- |
| **Dev Speed**         | Fastest           | Slower      | Medium      |
| **Animation Quality** | Better            | Manual      | Good        |
| **Bundle Size**       | Optimal           | Optimal     | Larger      |
| **Customization**     | Full              | Full        | Theme-based |
| **Component Library** | Shadcn/UI         | None        | Built-in    |

### Option 1: Tailwind CSS + Shadcn/UI + Framer Motion (Chosen)

**Description:** Use Tailwind CSS for styling, Shadcn/UI for components, Framer Motion for animations

**Pros:**
- Framer Motion is gold standard for React animations
- Tailwind's utility-first approach is 2-3x faster than CSS Modules
- Shadcn/UI provides pre-built accessible components
- Tailwind's JIT compiler only includes used styles
- Framer Motion tree-shakes unused features
- Full customization for brand identity

**Cons:**
- Learning curve for Tailwind utility classes (manageable)
- Requires discipline to maintain consistency

**Cost Impact:** None (open source)

**Risk Level:** Low

### Option 2: CSS Modules

**Description:** Use CSS Modules for scoped styling, manual animations

**Pros:**
- Familiar CSS syntax
- Optimal bundle size
- Full control

**Cons:**
- Manual animation implementation (slower)
- No component library
- More verbose for rapid development
- Requires custom animation library

**Cost Impact:** None

**Risk Level:** Medium

### Option 3: Chakra UI

**Description:** Use Chakra UI component library with built-in styling system

**Pros:**
- Built-in component library (buttons, forms, modals, etc.)
- Good accessibility out of the box
- Theme system for consistent styling
- Good developer experience
- Built-in animation support

**Cons:**
- Larger bundle size than Tailwind
- Less flexible than utility-first approach
- Theme customization can be complex for brand identity
- Slower development vs Tailwind for rapid iteration
- Less granular control over styling

**Cost Impact:** None (open source)

**Risk Level:** Medium

## Decision Outcome

**Chosen Option:** Option 1: Tailwind CSS + Shadcn/UI + Framer Motion

**Rationale:**

This combination best addresses our decision drivers:

1. **High-Energy Brand:** Devon's DJ persona requires dynamic, animated UI. Framer Motion is the gold standard for React animations.

2. **Duolingo-Style Gamification:** Streak animations, XP popups, leaderboard transitions all need smooth motion. Framer Motion provides declarative animation API.

3. **Rapid Iteration:** Fast UI development is essential. Tailwind's utility-first approach is 2-3x faster than CSS Modules.

4. **Shadcn/UI Components:** Pre-built accessible components (dialogs, tooltips, forms) that work perfectly with Tailwind.

5. **Bundle Optimization:** Tailwind's JIT compiler only includes used styles. Framer Motion tree-shakes unused features.

**Animation Requirements:**
- Streak counter increment animation
- XP gain popup with particle effects
- Leaderboard position changes
- Badge unlock celebrations
- Video player transitions
- Feed tile interactions

**Consequences:**
- Fastest UI development speed
- Best animation quality (Framer Motion)
- Optimal bundle size
- Full customization for brand
- Pre-built accessible components
- Requires discipline for consistency

---

# ADR-003: Backend/API - Next.js Server Actions

---

## Context

StoryFirst needs a backend API layer for XP calculations, streak updates, challenge submissions, and AI feedback. The platform requires type-safe end-to-end flow from database to UI, progressive enhancement for slow connections, and streaming AI responses.

**Architectural Challenge:**
- How do we maintain type safety from database to UI?
- How do we support progressive enhancement for SMS link users?
- How do we stream AI responses for real-time feedback?
- How do we minimize API layer complexity?

## Decision Drivers

- Type safety end-to-end (database → API → UI)
- Progressive enhancement for slow connections
- Streaming AI responses for real-time feedback
- Single codebase (no separate backend repo)
- Edge runtime support
- Minimal API layer complexity

## Considered Options

### Backend/API Framework Comparison

| Criteria         | Server Actions | Express       | NestJS        |
| ---------------- | -------------- | ------------- | ------------- |
| **Type Safety**  | Native         | Manual        | Good          |
| **Setup Time**   | Zero           | High          | High          |
| **Colocation**   | Same file      | Separate repo | Separate repo |
| **Streaming**    | Native         | Manual        | Manual        |
| **Edge Support** | Native         | No            | No            |

### Option 1: Next.js Server Actions + API Routes (Chosen)

**Description:** Use Next.js Server Actions for mutations, API Routes for webhooks

**Pros:**
- Single codebase (no separate backend repo)
- Progressive enhancement (forms work without JavaScript)
- Type safety flows from database → server action → component
- Streaming AI responses directly to client
- Zero setup time
- Edge runtime support
- Colocation with UI components

**Cons:**
- Next.js-specific (acceptable trade-off)
- Less mature than Express/NestJS (acceptable trade-off)

**Cost Impact:** None (included in Next.js)

**Risk Level:** Low

### Option 2: Express

**Description:** Use Express.js for REST API

**Pros:**
- Mature ecosystem
- Large community
- Flexible

**Cons:**
- High setup time
- Separate repo required
- Manual type safety
- Manual streaming implementation
- No edge support
- More DevOps overhead

**Cost Impact:** Additional hosting costs

**Risk Level:** Medium

### Option 3: NestJS

**Description:** Use NestJS framework for backend API

**Pros:**
- Good type safety
- Structured architecture
- Enterprise features

**Cons:**
- High setup time
- Separate repo required
- More complex than needed
- Manual streaming
- No edge support
- Overkill for current needs

**Cost Impact:** Additional hosting costs

**Risk Level:** Medium-High

## Decision Outcome

**Chosen Option:** Option 1: Next.js Server Actions + API Routes

**Rationale:**

Server Actions best address our decision drivers:

1. **Single Codebase:** No separate backend repo. XP calculations live next to the UI that displays them.

2. **Type Safety:** TypeScript types flow from database → server action → component without manual typing.

3. **Developer Velocity:** Fast iteration is essential. Server Actions eliminate API layer ceremony.

**API Routes Used For:**

- Webhooks (Twilio, Stripe)
- Background job triggers
- External integrations

**Consequences:**
- Single codebase (faster development)
- Type-safe end-to-end
- Progressive enhancement
- Native streaming support
- Zero setup time
- Edge runtime support
- Next.js-specific (acceptable trade-off)

---

# ADR-004: Database - PostgreSQL (Supabase)

---

## Context

StoryFirst requires a database that supports relational data (Users → XP Transactions, Users → Streak History), complex queries (leaderboards with rank calculation), and built-in authentication (phone/SMS login).

**Architectural Challenge:**

- How do we model complex relationships (XP, Status)?
- How do we support real-time leaderboard updates?
- How do we implement phone/SMS authentication?
- How do we ensure data security (Row-Level Security)?

## Decision Drivers

- Relational data model (Users, XP, Streaks)
- Complex SQL queries (leaderboards, rankings)
- Real-time subscriptions for live updates
- Built-in authentication (phone/SMS)
- Row-Level Security for data access
- File storage integration
- Cost efficiency

## Considered Options

### Database Platform Comparison

| Criteria          | Supabase (Postgres)                      | Firebase                             | PlanetScale              | MongoDB                       |
| ----------------- | ---------------------------------------- | ------------------------------------ | ------------------------ | ----------------------------- |
| **Data Model**    | Relational                               | NoSQL                                | Relational               | NoSQL                         |
| **Auth Built-in** | Yes                                      | Yes                                  | No                       | No                            |
| **Real-time**     | Yes                                      | Yes                                  | No                       | Limited                       |
| **Storage**       | Built-in                                 | Built-in                             | No                       | GridFS                        |
| **Pricing**       | Free tier + predictable Pro (~$25/month) | Pay-per-read, unpredictable at scale | Usage-based, predictable | Tiered + usage-based, complex |
| **SQL Support**   | Full                                     | None                                 | MySQL                    | None                          |

### Option 1: PostgreSQL (Supabase) (Chosen)

**Description:** Use PostgreSQL via Supabase with built-in auth, real-time, and storage

**Pros:**
- Relational data model fits XP/Status relationships perfectly
- Complex SQL queries (RANK(), JOINs) for leaderboards
- Supabase Auth built-in (phone/SMS authentication)
- Real-time subscriptions for live leaderboard updates
- Row-Level Security for data access control
- Storage included for challenge uploads
- Generous free tier

**Cons:**
- Vendor lock-in to Supabase (acceptable trade-off)

**Cost Impact:** Free tier (~$0/month), Pro tier for growth (~$25/month)

**Risk Level:** Low

### Option 2: Firebase (NoSQL)

**Description:** Use Firebase Firestore for NoSQL database

**Pros:**
- Built-in auth
- Real-time updates
- Built-in storage

**Cons:**
- NoSQL doesn't fit XP/Status relationships
- Pay-per-read pricing unpredictable for leaderboard queries
- No complex queries (RANK(), JOINs)
- Vendor lock-in concerns
- Requires denormalization

**Cost Impact:** Pay-per-read pricing (unpredictable)

**Risk Level:** Medium-High

### Option 3: PlanetScale (MySQL)

**Description:** Use PlanetScale MySQL database

**Pros:**
- Relational data model
- Good SQL support
- Serverless scaling

**Cons:**
- No built-in auth (requires separate solution)
- No real-time subscriptions
- No built-in storage
- MySQL vs PostgreSQL (PostgreSQL better fit for complex queries)

**Cost Impact:** Similar to Supabase

**Risk Level:** Medium

### Option 4: MongoDB

**Description:** Use MongoDB for NoSQL database

**Pros:**
- Flexible schema
- Good for document storage

**Cons:**
- NoSQL doesn't fit relational data
- No built-in auth
- Limited real-time support
- ACID transactions needed for XP changes
- SQL better suited for relational data model

**Cost Impact:** Complex pricing

**Risk Level:** High

## Decision Outcome

**Chosen Option:** Option 1: PostgreSQL (Supabase)

**Rationale:**

Supabase (PostgreSQL) best addresses our decision drivers:

1. **Relational Data:** Users → XP Transactions, Users → Streak History. NoSQL would require denormalization and complex consistency handling.

2. **Complex Queries:** Supports leaderboard rankings with RANK() and complex SQL.

3. **Supabase Auth:** Phone/SMS authentication built-in - perfect for magic link flow.

4. **Real-time + RLS:** Live leaderboard updates without polling. Row-Level Security for data access.

5. **Storage Included:** Challenge audio/video uploads in same platform.

**Consequences:**

- Perfect fit for relational data model
- Complex SQL queries supported
- Built-in phone/SMS authentication
- Real-time subscriptions for live updates
- Row-Level Security for data access
- Storage included
- Generous free tier
- Vendor lock-in to Supabase (acceptable trade-off)

# ADR-005: Authentication - Supabase Auth

---

## Context

StoryFirst requires passwordless authentication via SMS magic links. Users receive SMS with magic link, click link to access lessons without traditional login. The platform needs phone number verification, secure token management, and session handling.

**Architectural Challenge:**
- How do we implement passwordless SMS authentication?
- How do we verify phone numbers?
- How do we manage magic link tokens securely?
- How do we handle sessions after magic link click?

## Decision Drivers

- Passwordless authentication (no passwords)
- SMS magic link delivery
- Phone number verification
- Secure token management
- Session handling
- Integration with database (same platform)
- Cost efficiency

## Considered Options

### Option 1: Supabase Auth (Chosen)

**Description:** Use Supabase Auth with phone/SMS provider integration

**Pros:**
- Built-in phone/SMS authentication
- Magic link support
- Phone number verification
- Secure token management
- Session handling
- Row-Level Security integration
- Same platform as database
- Free tier available

**Cons:**
- Requires Twilio integration (acceptable)
- Less flexible than custom solution (acceptable)

**Cost Impact:** Included in Supabase (free tier)

**Risk Level:** Low

### Option 2: Custom Auth (NextAuth.js)

**Description:** Build custom authentication with NextAuth.js

**Pros:**
- Full control
- Flexible implementation
- Can customize flow

**Cons:**
- More development time
- Manual token management
- Manual session handling
- Security concerns
- More maintenance

**Cost Impact:** Development time

**Risk Level:** Medium-High

### Option 3: Clerk

**Description:** Use Clerk for authentication

**Pros:**
- Phone/SMS support
- Good developer experience
- Pre-built UI components

**Cons:**
- Additional cost
- Separate service
- Less integration with Supabase
- Overkill for current needs

**Cost Impact:** ~$25-100/month

**Risk Level:** Medium

### Option 4: Auth0

**Description:** Use Auth0 for authentication

**Pros:**
- Mature platform
- Phone/SMS support
- Enterprise features

**Cons:**
- High cost
- Overkill for current needs
- Complex setup
- Separate service

**Cost Impact:** ~$23-240/month

**Risk Level:** Medium-High

## Decision Outcome

**Chosen Option:** Option 1: Supabase Auth

**Rationale:**

Supabase Auth best addresses our decision drivers:

1. **Built-in Phone/SMS:** Native OTP via SMS and magic link flow - perfect for StoryFirst's passwordless model.

2. **Phone Verification:** Built-in verification via Twilio integration.

3. **Secure Sessions:** Automatic token generation, expiration, and session handling after magic link click.

4. **Same Platform:** Uses same Supabase as database; seamless RLS integration.

5. **Cost Efficiency:** Included in Supabase free tier.

**Consequences:**

- Built-in phone/SMS authentication
- Magic link support
- Secure token management
- Session handling
- Row-Level Security integration
- Cost efficient (free tier)

---

# ADR-006: AI Provider - OpenAI GPT-5 Mini

---

## Context

StoryFirst requires AI-powered grading and feedback for user challenge submissions. Users record audio responses that are transcribed, then graded against a rubric. The platform needs highest accuracy in reasoning and rubric matching, consistent scoring behavior, minimal variation across transcripts, and easy control over output shape (JSON, categories, scores).

**Architectural Challenge:**
- How do we ensure highest grading accuracy and rubric adherence?
- How do we maintain consistent scoring across all transcripts?
- How do we minimize variation in grading quality?
- How do we control output format for structured grading?

## Decision Drivers

- Highest accuracy in reasoning and rubric matching
- Most consistent scoring behavior
- Least variation across transcripts
- Easy control over output shape (JSON, categories, scores)
- Strong developer ecosystem and production stability
- Structured output for consistent rubric scores

## Considered Options

### AI Models Comparison — Grading Transcripts (OFFICIAL PRICING)

All prices are per 1 million tokens (MTok)

Pricing based on current OpenAI and Google Gemini API documentation. Actual costs may vary by contract and region.

| Model                     | Vendor    | Grading Quality | Rubric Adherence | Consistency | Ease of Control | Input ($/MTok) | Output ($/MTok) | Notes                                  |
| ------------------------- | --------- | --------------- | ---------------- | ----------- | --------------- | -------------- | --------------- | -------------------------------------- |
| **GPT-5 Mini** (Primary)  | OpenAI    | Excellent       | Excellent        | Very High   | Very High       | $0.25          | $0.025           | Best balance of quality, tone, and cost |
| **Gemini 2.5 Flash** (Fallback) | Google    | Good            | Medium-High      | Medium-High | High            | $0.30          | $2.50           | Fast, cost-efficient fallback model     |
| **Gemini 2.5 Pro**        | Google    | Very Good       | Good             | Medium-High | Medium          | $1.25          | $10.00          | Strong context, deep reasoning         |
| **Gemini 2.5 Flash-Lite** | Google    | OK              | Medium           | Medium      | High            | $0.10          | $0.40           | Lowest cost but weaker grading ability |
| **Claude Opus 4.5**       | Anthropic | Excellent       | Very Good        | High        | High            | $5.00          | $25.00          | High-end Claude, expensive             |
| **Claude Sonnet 4.5**     | Anthropic | Very Good       | Good             | High        | High            | $3.00          | $15.00          | Balanced Claude option                 |
| **Claude Haiku 4.5**      | Anthropic | Good            | Medium           | Medium      | High            | $1.00          | $5.00           | Cheap, weaker grading                  |

### Option 1: OpenAI GPT-5 Mini (Primary) + Gemini 2.5 Flash (Fallback) (Chosen)

**Description:** Use GPT-5 Mini as the primary model for AI grading and feedback, with Gemini 2.5 Flash as fallback.

**Pros:**

- Excellent rubric adherence and scoring accuracy
- Strong emotional reasoning and reflection detection
- Consistent structured JSON output
- Coach-like, non-robotic feedback tone
- Easy to control with low temperature + strict output format
- Strong OpenAI ecosystem and production stability
- Best balance of quality, tone, and cost
- Significantly cheaper than top-tier models while maintaining production-grade quality

**Cons:**

- Higher cost than flash-tier models (acceptable trade-off for grading accuracy)

**Cost Impact:**

- GPT-5 Mini: ~$4/month (15M tokens), ~$40/month at growth (150M tokens)
- Gemini 2.5 Flash (fallback): ~$16/month (15M tokens), ~$160/month at growth (150M tokens)

**Cost Example:**

- Typical scenario: 600 tokens input, 250 tokens output
- GPT-5 Mini: (600 × $0.25 / 1M) + (250 × $0.025 / 1M) = $0.00015 + $0.00000625 = **$0.00015625**
- Gemini 2.5 Flash: (600 × $0.30 / 1M) + (250 × $2.50 / 1M) = $0.00018 + $0.000625 = **$0.0008**

**Risk Level:** Low

### Option 2: Google Gemini 2.5 Flash (Fallback)

**Description:** Use Gemini 2.5 Flash as a fallback model for grading when cost or throughput optimization is required.

**Pros:**

- Very low cost
- Fast response times
- Large context window
- Acceptable grading quality for non-edge cases

**Cons:**

- Less consistent rubric adherence
- Moderate grading depth
- Not ideal for primary grading logic

**Cost Impact:**

- ~$16/month (15M tokens)
- ~$160/month at growth (150M tokens)

**Cost Example:**

- Gemini 2.5 Flash: (600 × $0.30 / 1M) + (250 × $2.50 / 1M) = $0.00018 + $0.000625 = **$0.0008**

**Risk Level:** Medium

### Option 3: Anthropic Claude Sonnet 4.5

**Description:** Use Claude Sonnet 4.5 for grading

**Pros:**
- More affordable Claude variant
- Slightly weaker reasoning than Opus but still strong
- Good for rubric-based evaluation
- Good compromise between cost and quality

**Cons:**

- Slightly softer grading than GPT-5 Mini
- Higher cost than GPT-5 Mini (2x input, 2.5x output)
- Structured output via tool use (more complex)

**Cost Impact:** ~$105/month (15M tokens), ~$1,050/month for growth (150M tokens)

**Risk Level:** Medium

### Option 4: Anthropic Claude Haiku 4.5

**Description:** Use Claude Haiku 4.5 for grading

**Pros:**

- Fast and cheap
- Lower cost than GPT-5 Mini
- Good for basic grading tasks

**Cons:**

- Weaker grading quality (not excellent)
- Medium rubric adherence
- Less consistent scoring
- Structured output via tool use (more complex)

**Cost Impact:** ~$35/month (15M tokens), ~$350/month for growth (150M tokens)

**Risk Level:** Medium-High (quality risk)

### Option 5: Google Gemini 2.5 Pro

**Description:** Use Gemini 2.5 Pro for grading

**Pros:**
- Strong reasoning and context understanding
- Excels where context is deep
- Large context window
- Good reasoning and scalable pricing
- Deep reasoning capabilities

**Cons:**

- Mid-tier rubric adherence (not excellent)
- Higher output cost (~$10/MTok)
- Slightly less predictable than GPT-5 Mini
- Less consistent for strict rubric scoring
- Structured output via JSON mode (less native)

**Cost Impact:**

- ~$65/month (15M tokens), ~$650/month for growth (150M tokens)

**Risk Level:** Medium

### Option 6: Google Gemini 2.5 Flash

**Description:** Use Gemini 2.5 Flash for grading

**Pros:**
- Lower cost than Pro
- Fast processing
- Large context window
- Cheaper flash model for high volume

**Cons:**
- Grading quality is moderate (not excellent)
- Medium rubric adherence
- Less consistent scoring
- Better suited for less strict use cases
- Less reliable instruction following
- Structured output via JSON mode (less native)
- Not ideal for full grading

**Cost Impact:**

- ~$16/month (15M tokens), ~$160/month for growth (150M tokens)

**Risk Level:** Medium-High (quality risk)

### Option 7: Google Gemini 2.5 Flash-Lite

**Description:** Use Gemini 2.5 Flash-Lite for grading

**Pros:**
- Lowest cost Google model
- Very low pricing
- Fast processing

**Cons:**
- Weaker reasoning/grading quality
- OK quality (not good or excellent)
- Medium rubric adherence
- Less consistent scoring
- Not suitable for production grading
- Structured output via JSON mode (less native)

**Cost Impact:**

- ~$5/month (15M tokens), ~$50/month for growth (150M tokens)

**Risk Level:** High (quality risk)

## Decision Outcome

**Chosen Option:** Primary: GPT-5 Mini | Fallback: Gemini 2.5 Flash

**Rationale:**

GPT-5 Mini best addresses our decision drivers:

1. **Grading Accuracy:** GPT-5 Mini provides the most reliable rubric scoring across negative, positive, and subtle emotional responses.

2. **Consistency:** Lowest variance in scores across similar transcripts.

3. **Tone Quality:** Produces coach-like, encouraging feedback aligned with StoryFirst's product voice.

4. **Cost Balance:** Significantly cheaper than top-tier models while maintaining production-grade quality.

5. **Fallback Safety:** Gemini 2.5 Flash offers a low-cost safety net for scale or throughput spikes.

**Consequences:**

- High-quality, consistent AI feedback
- Predictable grading behavior
- Controlled costs at scale
- Clear primary/fallback strategy
- Minimal admin review friction
- Coach-like feedback tone aligned with product voice

---

# ADR-007: Speech-to-Text (STT) & Text-to-Speech (TTS) - ElevenLabs

---

## Context

StoryFirst requires two audio processing capabilities:

1. **Speech-to-Text (STT):** Transcription for user audio responses (Q&A and Challenges) before AI grading. Users record audio responses that are transcribed to text, then graded by GPT-5 Mini. Transcription quality directly impacts grading accuracy.

2. **Text-to-Speech (TTS):** Generation of personalized audio for Pre-Lesson intros and Post-Lesson wrap-ups. AI-generated personalized text (with user name, day, streak) is converted to natural-sounding speech for enhanced user engagement.

**Architectural Challenge:**

**STT:**
- How do we ensure accurate transcription of user audio responses?
- How do we handle expressive speech, varied accents, and emotional delivery?
- How do we minimize transcription errors that could affect grading accuracy?
- How do we balance transcription quality with cost efficiency?

**TTS:**
- How do we generate natural-sounding personalized audio?
- How do we maintain voice consistency across all personalized content?
- How do we support emotional delivery and voice cloning for Coach Devon persona?
- How do we balance audio quality with cost efficiency at scale?

## Decision Drivers

**STT:**
- Transcription quality (fewer errors = better grading accuracy)
- Support for expressive speech, varied accents, emotional delivery
- Integration simplicity
- Cost efficiency at scale

**TTS:**
- High-quality voice synthesis (natural-sounding speech)
- Voice consistency for Coach Devon persona
- Support for emotional delivery and personalization
- Integration simplicity
- Cost efficiency at scale

## Considered Options

### STT Options Comparison

| STT Provider                | Pricing (per audio minute) | Quality   | Notes                                                                                    |
| --------------------------- | -------------------------- | --------- | ---------------------------------------------------------------------------------------- |
| **ElevenLabs STT** (Chosen) | $0.15 – $0.20 / min        | Excellent | High-quality transcription, optimized for clarity & speakers, best for expressive speech |
| OpenAI Whisper API          | $0.006 – $0.015 / min      | Good      | Very cheap, baseline quality, higher WER in noisy/varied audio                           |
| Google Cloud Speech-to-Text | $0.04 – $0.12 / min        | Very Good | Multiple models, enhanced quality options, enterprise SLAs                               |
| AWS Transcribe              | $0.024 – $0.10 / min       | Very Good | Includes enhanced options, AWS ecosystem                                                 |

**Cost Example (2-minute user audio):**

- Whisper: $0.012
- Google STT (mid): $0.16
- ElevenLabs STT: $0.36

### TTS Options Comparison

| TTS Provider                | Pricing Model                    | Quality   | Notes                                                                                    |
| --------------------------- | -------------------------------- | --------- | ---------------------------------------------------------------------------------------- |
| **ElevenLabs TTS** (Chosen) | Creator plan: $22/mo | Excellent | High-quality voice synthesis, voice cloning support, emotional delivery, best for personalized audio |
| OpenAI TTS                  | Pay-as-you-go: ~$0.015/1K chars  | Good      | Simple API, limited voice options, good for basic TTS needs                             |
| Google Cloud Text-to-Speech | Pay-as-you-go: ~$0.004-0.016/char | Very Good | Multiple voices, WaveNet voices, SSML support, enterprise SLAs                         |
| Amazon Polly                | Pay-as-you-go: ~$0.004/char      | Very Good | AWS ecosystem integration, multiple voices, neural TTS available                        |

**Cost Example (500 generations/day, ~100 chars each = 50K chars/day = 1.5M chars/month):**

- Amazon Polly: ~$6/month (1.5M chars × $0.004)
- Google Cloud TTS: ~$6-24/month (varies by voice type)
- OpenAI TTS: ~$22.50/month (1.5M chars × $0.015)
- ElevenLabs TTS: $22/month (Creator plan)

### Option 1: ElevenLabs STT (Chosen)

**Description:** Use ElevenLabs STT for speech-to-text transcription

**Pros:**
- Best transcription quality for expressive speech
- Optimized pronunciation models
- Better handling of expressive speech, varied accents, emotional delivery
- Lower word error rate (WER) = better grading accuracy
- Simple API integration
- High-quality transcription optimized for clarity & speakers

**Cons:**
- Higher cost than alternatives
- Less mature than AWS/Google (acceptable)

**Cost Impact:** ~$0.15-0.20 per audio minute

**Risk Level:** Low

### Option 2: OpenAI Whisper API

**Description:** Use OpenAI Whisper API for transcription

**Pros:**
- Very cheap ($0.006-0.015/min)
- Good baseline quality
- Simple API

**Cons:**
- Baseline quality (not excellent)
- Higher WER in noisy/varied audio
- Not specialized for varied accents and expressive speech
- Transcription errors can lead to incorrect grading

**Cost Impact:** ~$0.006-0.015 per audio minute

**Risk Level:** Medium-High (quality risk)

### Option 3: Google Cloud Speech-to-Text

**Description:** Use Google Cloud Speech-to-Text

**Pros:**
- Very good quality
- Multiple models available
- Enhanced quality options
- Enterprise SLAs

**Cons:**
- Good production quality but not optimized for expressive speech
- Additional SDK complexity
- Less specialized for narrative content
- Multi-vendor complexity

**Cost Impact:** ~$0.04-0.12 per audio minute

**Risk Level:** Medium

### Option 4: AWS Transcribe

**Description:** Use AWS Transcribe

**Pros:**
- Very good quality
- Includes enhanced options
- AWS ecosystem integration

**Cons:**
- Good production quality but not optimized for expressive speech
- Additional SDK complexity
- Less specialized for narrative content
- Multi-vendor complexity

**Cost Impact:** ~$0.024-0.10 per audio minute

**Risk Level:** Medium

### Option 5: ElevenLabs TTS (Chosen)

**Description:** Use ElevenLabs TTS for text-to-speech generation of personalized Pre/Post-Lesson audio

**Pros:**

- Best voice synthesis quality for personalized content
- Voice cloning support for Coach Devon persona
- Emotional delivery and natural intonation
- High-quality, natural-sounding speech
- Consistent voice across all personalized content
- Simple API integration
- Optimized for narrative and conversational content

**Cons:**

- Higher cost than some alternatives (Creator plan $22/mo)
- Less mature than AWS/Google (acceptable)

**Cost Impact:** $22/month (Creator plan)

**Risk Level:** Low

### Option 6: OpenAI TTS

**Description:** Use OpenAI TTS for audio generation

**Pros:**

- Simple API integration
- Good quality for basic TTS needs
- Pay-as-you-go pricing

**Cons:**

- Limited voice options
- Less natural-sounding than ElevenLabs
- No voice cloning support
- Not optimized for personalized, emotional content
- Less suitable for Coach Devon persona

**Cost Impact:** ~$22.50/month (1.5M chars/month at $0.015/1K chars)

**Risk Level:** Medium-High (quality risk for personalized content)

### Option 7: Google Cloud Text-to-Speech

**Description:** Use Google Cloud Text-to-Speech for audio generation

**Pros:**

- Very good quality
- WaveNet voices for enhanced quality
- SSML support for advanced control
- Multiple voices available
- Enterprise SLAs

**Cons:**

- Less natural-sounding than ElevenLabs for personalized content
- Limited voice cloning capabilities
- Less specialized for emotional delivery
- Additional SDK complexity
- Multi-vendor complexity

**Cost Impact:** ~$6-24/month (varies by voice type, WaveNet more expensive)

**Risk Level:** Medium

### Option 8: Amazon Polly

**Description:** Use Amazon Polly for text-to-speech generation

**Pros:**

- AWS ecosystem integration
- Multiple voices available
- Neural TTS option for better quality
- Pay-as-you-go pricing (more cost-effective at lower volumes)
- Enterprise SLAs

**Cons:**

- Less natural-sounding than ElevenLabs for personalized content
- Limited voice cloning capabilities
- Less specialized for emotional delivery
- Additional SDK complexity
- Multi-vendor complexity

**Cost Impact:** ~$6/month (1.5M chars/month at $0.004/char)

**Risk Level:** Medium

## Decision Outcome

**Chosen Option:** 
- **STT:** Option 1: ElevenLabs STT
- **TTS:** Option 5: ElevenLabs TTS

**Rationale:**

**STT - ElevenLabs STT:**

ElevenLabs STT best addresses our STT decision drivers:

1. **Transcription Quality:** Optimized for expressive speech, varied speed, accents. Lower WER = better grading accuracy.

2. **Grading Impact:** Fewer transcription errors mean more accurate grading, less manual cleanup, fewer user complaints.

3. **User Experience:** Response intent captured accurately; grading reflects actual content, not transcription errors.

4. **Pipeline Fit:** User audio → ElevenLabs STT → transcript → GPT-5 Mini grading. Quality here is critical for downstream accuracy.

5. **Cost-Benefit:** Higher cost than Whisper but reduces re-review and support costs; improves core value (grading).

**TTS - ElevenLabs TTS:**

ElevenLabs TTS best addresses our TTS decision drivers:

1. **Voice Quality:** Best voice synthesis quality for personalized content. Natural-sounding speech that matches Coach Devon's persona.

2. **Voice Consistency:** Voice cloning support ensures consistent Coach Devon voice across all Pre/Post-Lesson content.

3. **Emotional Delivery:** Optimized for emotional delivery and natural intonation, critical for personalized, encouraging feedback.

4. **Personalization:** High-quality generation of personalized audio with user name, day, and streak information.

5. **Pipeline Fit:** AI-generated personalized text → ElevenLabs TTS → personalized audio → user plays audio intro/wrap-up.

**Cost-Benefit Analysis:**

**STT:** While ElevenLabs STT costs more ($0.15-0.20/min vs $0.006-0.015/min for Whisper), the quality improvement:
- Reduces downstream errors and re-review costs
- Improves grading accuracy (core value proposition)
- Better user experience (fewer complaints)

**TTS:** While ElevenLabs TTS has moderate cost ($22/mo Creator plan vs ~$6-24/mo for some alternatives), the quality improvement:
- Enhances user engagement with natural-sounding personalized audio
- Maintains consistent Coach Devon persona across all content
- Better emotional delivery for encouraging, coach-like feedback
- Reduces user complaints about robotic or inconsistent audio

**Audio Processing Pipelines:**

**STT Pipeline (User Audio → Grading):**
```
User records audio → ElevenLabs STT → Transcript text
→ GPT-5 Mini grading (text only)
→ Structured grading + feedback
```

**TTS Pipeline (Personalization → Audio):**
```
 Prsonalized text→ ElevenLabs TTS → Personalized audio
→ User plays audio intro/wrap-up (with name, day, streak)
```

**Consequences:**

**STT:**
- Best transcription quality for expressive speech
- Fewer errors = better grading accuracy
- Reduces downstream errors and support costs
- Higher cost than alternatives (worth it for quality)
- Cost scales with audio volume

**TTS:**
- Best voice synthesis quality for personalized content
- Consistent Coach Devon persona across all content
- Natural-sounding, emotionally engaging audio
- Creator plan ($22/mo) fits MVP; cost scales with generation volume at higher tiers
- Cost scales with generation volume

---

# ADR-008: SMS - Twilio

---

## Context

StoryFirst requires SMS delivery for daily lesson triggers. The "Lesson Trigger" is the core engagement driver, requiring 99.95%+ delivery rate. The platform needs phone verification, webhook support for delivery tracking, and reliable global delivery.

**Architectural Challenge:**
- How do we ensure reliable SMS delivery?
- How do we track delivery and opens?
- How do we verify phone numbers?
- How do we handle webhooks for delivery status?

## Decision Drivers

- Reliable SMS delivery (99.95%+)
- Phone verification for signup
- Webhook support for delivery tracking
- Global delivery support
- Developer experience
- Cost efficiency at scale

## Considered Options

### SMS Provider Comparison

| Criteria                 | Twilio                                   | SimpleTexting                                    | AWS SNS                               | MessageBird                             |
| ------------------------ | ---------------------------------------- | ------------------------------------------------ | ------------------------------------- | --------------------------------------- |
| **Pricing Model**        | Pay-as-you-go (~$0.0083 per SMS)        | Subscription-based ($39/mo for 500 credits + ~$0.055/extra) | ~$0.00645 (US); verification separate | ~$0.005–0.01 (varies by country/volume) |
| **Incoming SMS**         | Charged per message (same as outbound)   | Free (no extra cost)                              | Charged per message                    | Charged per message                      |
| **Phone Number Cost**    | ~$1.15/mo (local), ~$2.15/mo (toll-free) | Included (local); extra numbers ~$10/mo          | Included                              | Included                                 |
| **MMS Cost**             | ~$0.022 outbound                         | 3 credits per MMS                                 | Higher than SMS                        | Higher than SMS                          |
| **SMS Reliability**      | Excellent (99.95%+)                      | Good (marketing-focused)                          | Good                                  | Excellent                               |
| **Phone Verification**   | Native (Verify API)                      | Limited (marketing-focused)                       | Separate                              | Yes                                     |
| **Webhook Support**      | Excellent                                | Good (campaign-focused)                           | SNS topics                            | Good                                    |
| **Documentation**        | Excellent                                | Good (marketing platform)                         | AWS style                             | Good                                    |
| **Developer Experience** | Excellent (API-first)                    | Limited (marketing platform, less API-focused)   | Complex                               | Good                                    |
| **Best For**            | Developers, transactional SMS, high-volume | SMS marketing, campaigns, two-way business texting | AWS-integrated apps                   | High-volume flexible usage               |

### Option 1: Twilio (Chosen)

**Description:** Use Twilio for SMS communications

**Pros:**
- 99.95% delivery rate (critical for engagement)
- Verify API for phone number verification
- Excellent webhook support
- Best documentation and developer experience
- Industry standard (most examples, Stack Overflow answers)
- Reliable global delivery

**Cons:**
- Cost at scale (acceptable for reliability)
- Less integrated with AWS (acceptable)

**Cost Impact:** ~$118/month (15K SMS), ~$1,185/month for growth (150K SMS)

**Risk Level:** Low

### Option 2: AWS SNS

**Description:** Use AWS SNS for SMS delivery

**Pros:**
- AWS integration
- Scalable
- Good reliability

**Cons:**
- Less reliable than Twilio
- Separate phone verification service
- AWS-style documentation (less developer-friendly)
- More complex setup

**Cost Impact:** Similar to Twilio

**Risk Level:** Medium

### Option 3: MessageBird

**Description:** Use MessageBird for SMS delivery

**Pros:**
- Excellent reliability
- Phone verification

**Cons:**
- Less documentation
- Smaller community
- Less developer-friendly

**Cost Impact:** Similar to Twilio

**Risk Level:** Medium

### Option 4: SimpleTexting

**Description:** Use SimpleTexting for SMS communications

**Pros:**

- Subscription-based pricing with included credits
- Free incoming SMS (no extra cost)
- Phone number included in base plan
- Good for marketing campaigns and two-way business texting
- User-friendly interface for non-technical users

**Cons:**

- Less developer-focused (marketing platform, not API-first)
- Limited phone verification capabilities
- Less flexible for high-volume transactional SMS
- Credit-based system may be less cost-effective at scale
- Less documentation and community support for developers
- MMS uses 3 credits per message (more expensive)

**Cost Impact:** ~$39/month base + ~$0.055 per extra credit (500 credits included). May be more expensive at scale compared to pay-as-you-go providers.

**Risk Level:** Medium-High (not ideal for developer-focused transactional SMS needs)

## Decision Outcome

**Chosen Option:** Option 1: Twilio

**Rationale:**

Twilio best addresses our decision drivers:

1. **Programmable SMS:** The "Lesson Trigger" is the core engagement driver. Twilio's 99.95% delivery rate is critical.

2. **Verify API:** Phone number verification for signup.

3. **Webhooks:** Track delivery, opens (via links), and responses.

4. **Industry Standard:** Most documentation, examples, and Stack Overflow answers.

**SMS Cost at Scale:**
```
Initial launch (1000 users × 2 SMS/day × 30 days): 60,000 SMS
Cost: $0.0079 × 60,000 = $474/month

Growth (10000 users × 2 SMS/day × 30 days): 600,000 SMS
Cost: $0.0079 × 600,000 = $4,740/month (volume discounts apply)
```

**Consequences:**
- 99.95% delivery rate (critical for engagement)
- Phone verification built-in
- Excellent webhook support
- Best developer experience
- Industry standard
- Cost at scale (acceptable for reliability)

---

# ADR-009: Link Shortening - Short.io

---

## Context

StoryFirst requires link shortening for SMS magic links to daily lessons. Users receive SMS messages with links that must be:
- Branded with custom domain (e.g., `storyfirst.com/lesson/...`)
- Trackable (click analytics, delivery tracking)
- Expirable (24-hour expiration for security)
- Revocable (ability to disable specific links)
- Works across multiple channels (SMS, email, web)

**Architectural Challenge:**

- How do we create branded, trackable links for SMS magic links?
- How do we handle link expiration and revocation?
- How do we track link clicks and analytics?
- How do we ensure links work across SMS, email, and web channels?
- How do we avoid vendor lock-in with SMS provider?

## Decision Drivers

- Custom branded domain support
- Link expiration (TTL) for security
- Link revocation capability
- Click analytics and webhooks
- Multi-channel support (SMS, email, web)
- SMS provider agnostic (not locked to Twilio)
- API-first approach for programmatic link creation
- Independent link lifecycle management

## Considered Options

### Link Shortening Options Comparison

| Feature                          | Short.io  | Twilio Link Shortening  |
| -------------------------------- | ------------------- | -------------------------------------- |
| **Pricing**                       | $18/month (Pro plan) | Included with Twilio |
| **Custom branded domain**         | Yes                 | Yes                                    |
| **Link creation model**           | API-first, standalone | Auto-generated during SMS send         |
| **Works outside SMS**             | Yes (SMS, email, web, WhatsApp) | Limited (SMS-only)                     |
| **Per-link expiration (TTL)**    | Yes                 | No                                     |
| **Disable / revoke specific links** | Yes                 | No                                   |
| **Click analytics**               | Advanced            | Basic                                  |
| **Click webhooks**                | Yes                 | Limited                                |
| **Link lifecycle control**        | Fully independent   | SMS-coupled                            |
| **Vendor lock-in**                | Low (SMS provider agnostic) | High (Twilio-only)                     |
| **Implementation effort**         | Medium              | Low                                    |
| **Best suited for**               | Magic links, lesson links | Branded SMS-only links                 |

### Option 1: Short.io (Chosen)

**Description:** Use Short.io for link shortening with custom branded domain

**Pros:**

- Custom branded domain support (e.g., `storyfirst.com/lesson/...`)
- API-first approach - create links programmatically before SMS send
- Per-link expiration (TTL) - set 24-hour expiration for magic links
- Link revocation - disable specific links if needed
- Advanced click analytics - track clicks, locations, devices
- Click webhooks - receive real-time click notifications
- Fully independent link lifecycle - not coupled to SMS provider
- Multi-channel support - works for SMS, email, web, WhatsApp
- SMS provider agnostic - not locked to Twilio
- Better control over link management and security

**Cons:**

- Additional vendor (acceptable trade-off for flexibility)
- Medium implementation effort (API integration required)
- Additional cost (but provides more value)

**Cost Impact:** $18/month (Pro plan)

**Short.io Pro Plan Features:**
- Link expiration (required for 24-hour magic link security)
- Password protection
- Link cloaking
- Click limit expiration
- Unlimited branded links
- 10,000 link automation/year via API
- Unlimited tracked clicks
- 10 custom domains

**Risk Level:** Low

### Option 2: Twilio Link Shortening (Custom Domain)

**Description:** Use Twilio's built-in link shortening with custom domain

**Pros:**

- Integrated with Twilio SMS (no separate service)
- Low implementation effort (automatic during SMS send)
- Custom branded domain support
- Basic click tracking

**Cons:**

- SMS-only - links don't work well outside SMS context
- No per-link expiration (TTL) - cannot set individual link expiration
- No link revocation - cannot disable specific links
- Limited click analytics - basic tracking only
- Limited webhooks - restricted click webhook support
- SMS-coupled - link lifecycle tied to SMS delivery
- High vendor lock-in - Twilio-only, cannot switch SMS providers easily
- Less flexible for multi-channel use cases

**Cost Impact:** Included with Twilio (no additional cost)

**Risk Level:** Medium (vendor lock-in and limited flexibility)

## Decision Outcome

**Chosen Option:** Option 1: Short.io

**Rationale:**

Short.io best addresses our decision drivers:

1. **Custom Branded Domain:** Supports custom domain (e.g., `storyfirst.com/lesson/...`) for professional, branded links in SMS.

2. **Link Expiration:** Per-link TTL support enables 24-hour expiration for magic links, critical for security.

3. **Link Revocation:** Ability to disable/revoke specific links provides security control if links are compromised.

4. **Multi-Channel Support:** Links work across SMS, email, and web channels - not limited to SMS-only use cases.

5. **SMS Provider Agnostic:** Not locked to Twilio - can switch SMS providers without losing link functionality.

6. **Advanced Analytics:** Click tracking, location data, and device analytics provide insights into user engagement.

7. **API-First:** Programmatic link creation allows pre-generating links, setting expiration, and managing lifecycle independently.

8. **Independent Lifecycle:** Link management decoupled from SMS delivery - more flexible and maintainable.

**Link Creation Flow:**

```
1. Generate magic link token (Supabase Auth)
2. Create shortened link via Short.io API
   - Set custom domain: storyfirst.com/lesson/...
   - Set expiration: 24 hours
   - Set metadata: user_id, lesson_day, link_type
3. Store link mapping in database
4. Send SMS with shortened link
5. Track clicks via Short.io webhooks
6. Link expires automatically after 24 hours
```

**Consequences:**

- Custom branded links (professional appearance)
- Per-link expiration for security
- Link revocation capability
- Advanced click analytics
- Multi-channel link support
- SMS provider agnostic (flexible architecture)
- Additional vendor (Short.io)
- Medium implementation effort (API integration)
- Additional cost ($18/month for Pro plan)

---

# ADR-010: Deployment - Vercel

---

## Context

StoryFirst requires deployment platform optimized for Next.js, edge functions for global distribution, AI SDK integration, and preview deployments for content team. The platform needs zero-config deployment, built-in analytics, and seamless integration with development workflow.

**Architectural Challenge:**
- How do we deploy Next.js with optimal performance?
- How do we support edge functions for global users?
- How do we enable preview deployments?

## Decision Drivers

- Next.js optimization
- Edge functions support
- AI SDK integration
- Preview deployments
- Zero-config deployment
- Built-in analytics
- Developer experience

## Deployment Options Comparison

| Criteria                 | Vercel    | Railway  | Netlify   | Render   |
| ------------------------ | --------- | -------- | --------- | -------- |
| **Next.js Support**      | Native    | Good     | Limited   | Good     |
| **Edge Functions**       | Better    | No       | Good      | No       |
| **AI SDK Integration**   | Native    | Manual   | Manual    | Manual   |
| **Preview Deploys**      | Automatic | Yes      | Automatic | Yes      |
| **Analytics**            | Built-in  | External | External  | External |
| **Zero-Config**          | Yes       | Yes      | Yes       | Yes      |
| **Server Actions**       | Native    | Good     | Limited   | Good     |
| **ISR Support**          | Native    | Manual   | Limited   | Manual   |
| **Global CDN**           | Yes       | Limited  | Yes       | Limited  |
| **Developer Experience** | Better    | Good     | Good      | Good     |
| **Cost**                 | $20/mo    | $5-20/mo | $19/mo    | $7/mo    |
| **Setup Complexity**     | Zero      | Low      | Low       | Low      |

## Considered Options

### Option 1: Vercel (Chosen)

**Description:** Use Vercel for Next.js deployment

**Pros:**
- Next.js optimization (Vercel builds Next.js)
- Edge Runtime support (SMS triggers at edge)
- Vercel AI SDK native integration
- Preview deployments (content team can preview changes)
- Zero-config (push to GitHub → deployed)
- Built-in analytics
- Excellent developer experience
- Native Server Actions and ISR support
- Global CDN with edge functions

**Cons:**
- Vercel-specific (acceptable trade-off)
- Cost at scale (usage-based pricing)
- Less flexible than self-hosted

**Cost Impact:** Pro tier (~$20/month), usage-based for bandwidth/functions

**Risk Level:** Low

### Option 2: Railway

**Description:** Use Railway for deployment

**Pros:**
- Good Next.js support
- Simple deployment
- Good developer experience
- Low cost
- Docker-based (flexible)

**Cons:**
- Limited edge runtime support
- Manual AI SDK integration
- Less optimized for Next.js
- No native edge functions
- Limited global CDN

**Cost Impact:** ~$5-20/month

**Risk Level:** Medium

### Option 3: Netlify

**Description:** Use Netlify for deployment

**Pros:**
- Good Next.js support
- Edge functions
- Preview deployments
- Global CDN
- Good developer experience

**Cons:**
- Limited Next.js App Router support
- Manual AI SDK integration
- Less optimized than Vercel
- Server Actions support limited

**Cost Impact:** ~$19/month

**Risk Level:** Medium

### Option 4: Render

**Description:** Use Render for deployment

**Pros:**
- Good Next.js support
- Simple deployment
- Low cost
- Good developer experience
- Preview deployments

**Cons:**
- No edge functions
- Manual AI SDK integration
- Limited global CDN
- Less optimized for Next.js

**Cost Impact:** ~$7/month

**Risk Level:** Medium

## Decision Outcome

**Chosen Option:** Option 1: Vercel

**Rationale:**

Vercel best addresses our decision drivers:

1. **Next.js Optimization:** Vercel builds Next.js. Features like ISR, Edge Runtime, and Server Actions work best here.

2. **AI SDK Integration:** Vercel AI SDK is designed for Vercel deployment with built-in observability.

3. **Edge Functions:** Daily triggers run at the edge, reducing latency for global users.

4. **Preview Deployments:** Content team (Holly, Jessie) can preview changes before production.

5. **Zero-Config:** Push to GitHub → deployed. No CI/CD setup required.

**Consequences:**
- Native Next.js optimization
- Edge Runtime support
- Vercel AI SDK integration
- Preview deployments
- Zero-config deployment
- Built-in analytics
- Excellent developer experience
- Vercel-specific (acceptable trade-off)

---

# ADR-011: Background Jobs - Vercel Cron + QStash

---

## Context

StoryFirst requires background jobs for:
1. Daily SMS triggers (send lesson links at user's preferred time)
2. Weekly AI feedback batch processing
3. Daily cleanup tasks (reset flags, analytics)

Users have different timezones and preferred lesson times (9am their time).
Must handle 1,000+ users initially, scaling to 10,000+.

**Architectural Challenge:**
- How do we send SMS at each user's preferred time without 1,000 separate cron jobs?
- How do we handle Twilio rate limits (30 concurrent requests)?
- How do we batch process AI feedback efficiently?
- How do we keep architecture simple?

## Decision Drivers

- Simple SMS scheduling (database-driven, not per-user jobs)
- Twilio rate limiting (30 concurrent max)
- Cost efficiency
- Native cron support (no separate scheduler needed)
- Scalability to 10,000 users
- Easy debugging and monitoring

## Considered Options

### Background Jobs Platform Comparison

| Criteria              | Vercel Cron + QStash                                                  | trigger.dev                                                                | Inngest                                   | Vercel Cron Only         | BullMQ + Redis        |
| --------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------- | ------------------------ | --------------------- |
| **Type**              | Serverless HTTP queue                                                 | Workflow orchestration                                                     | Event-driven platform                     | Scheduler only           | Traditional queue     |
| **Serverless-friendly** | Yes                                                                   | Yes                                                                        | Yes                                       | Yes                      | No                    |
| **Setup Complexity**  | Very low                                                              | Medium                                                                     | Medium                                    | Very low                 | High                  |
| **SMS Scheduling**    | Database-driven                                                       | Workflow-based                                                             | Per-user / event-based                    | Database-driven          | Manual                |
| **Delay / Schedule Jobs** | Native                                                                | Native                                                                     | Yes                                       | Limited                  | Yes                   |
| **Rate Limiting**     | Native (QStash)                                                       | Manual / workflow config                                                   | Manual config                             | No                       | Manual                |
| **Concurrency Control** | Built-in                                                              | Workflow-level                                                             | Manual                                    | No                       | Manual                |
| **Retries**           | Built-in                                                              | Built-in                                                                   | Built-in                                  | Manual                   | Built-in              |
| **Requires Worker Infra** | No                                                                    | No                                                                         | No                                        | No                       | Yes                   |
| **Fits Next.js / Vercel** | Excellent                                                             | Good                                                                       | Good                                      | Excellent                | Poor                  |
| **Operational Overhead** | Low                                                                   | Medium                                                                     | Medium                                    | Low                      | High                  |
| **Scalability**       | Excellent                                                             | Excellent                                                                  | Good                                      | Limited                  | Excellent             |
| **Mental Model**      | Push HTTP → endpoint                                                  | Steps & workflows                                                          | Events → functions                        | Time → function          | Jobs → workers        |
| **Pricing (Entry Level)** | Free tier (QStash: **1,000 messages/day**), then $1 per 100K messages | Free tier available, paid plans scale by workflow execution & compute time | Free tier available, usage-based at scale | Included with Vercel Pro | Infra + Redis cost    |
| **Best Use Case**     | Simple background jobs, SMS, webhooks                                 | Complex multi-step workflows                                               | Event-heavy systems                       | Lightweight cron tasks   | Backend-heavy systems |

### Option 1: Vercel Cron + QStash (Chosen)

**Description:** Use Vercel Cron (every 15min) to query users needing SMS, push batch to QStash queue, QStash workers send via Twilio

**What is QStash:**
QStash is a serverless HTTP queue from Upstash. It's designed for delayed jobs, retries, rate-limited fan-out, and background processing without managing workers or Redis. Jobs are delivered as HTTP requests to your endpoints, making it ideal for serverless architectures like Next.js/Vercel.

**Pros:**
- **Serverless HTTP Queue:** QStash delivers jobs as HTTP requests to your endpoints - perfect for Next.js API routes. No workers, no Redis, no infrastructure to manage.
- **Native Retries:** Automatic retries with exponential backoff if endpoint fails. No custom retry logic needed.
- **Built-in Rate Limiting:** Native concurrency control (30 parallel workers) perfectly matches Twilio's rate limit. No manual throttling code.
- **Delayed Execution:** Native support for delayed jobs and scheduling without additional setup.
- **Single Cron Job:** Database-driven scheduling (not per-user jobs). Query Supabase every 15min, push batch to QStash.
- **Natural Batching:** QStash handles distribution to 30 parallel workers automatically. One API call publishes entire batch.
- **Simple Mental Model:** Push HTTP → endpoint. Cleaner than event-driven or message-first queues.
- **Next.js/Vercel Optimized:** Designed for serverless architectures. Excellent fit with Next.js API routes.
- **No Infrastructure:** Fully serverless - no Redis, no workers, no infrastructure management.
- **Easy Debugging:** Vercel logs + QStash dashboard provide full observability.
- **Scales Linearly:** At 10,000 users, still just one cron job. Database query scales horizontally.

**Cons:**
- Requires QStash (additional vendor, but minimal risk)
- 15min granularity (not exact-time delivery - acceptable trade-off)
- QStash cost at very high scale (but remains cost-effective)
- HTTP-first semantics (not message-first like traditional queues - acceptable for our use case)

**Cost Impact:**

- Vercel Pro: $20/month (includes native cron support)
- QStash: Free tier (1,000 messages/day), then $1 per 100K messages
- Total: ~$20/month (Vercel Pro) + QStash usage (free tier covers initial needs)

**Risk Level:** Low

### Option 2: Inngest (All Background Jobs)

**Description:** Use Inngest for event-driven background jobs and workflows

**What is Inngest:**
An event-driven background job and workflow engine with built-in retries, observability, and step functions for complex multi-step workflows.

**Pros:**
- Unified job system
- Event-driven architecture
- Built-in retries and observability
- Step functions for complex workflows
- Good developer experience for event-based systems

**Cons:**
- **Overkill for Simple SMS:** SMS triggers are simple (query + send), not complex workflows requiring step functions
- **Per-user Scheduling Complexity:** Managing 1,000+ separate cron jobs (one per user) doesn't scale well
- **Workflow Mental Model:** Heavier mental model than "push job → send SMS" for our use case
- **Cost Growth:** Free tier sufficient initially, but costs grow faster at scale (exceeds free tier at 10k users)
- **Additional Vendor:** Adds third vendor when native cron support is available in deployment platform
- **Learning Curve:** Requires learning event-driven patterns and Inngest-specific concepts

**Cost Impact:** $0 (free tier), $100+/month at 10k users

**Risk Level:** Medium

**ADR Positioning:** Good alternative if workflows become complex later (multi-step AI processing, complex event chains). Not ideal for simple time-based SMS batching.

### Option 3: Vercel Cron Only (No Queue)

**Description:** Use Vercel Cron to send SMS directly, no queue layer

**What it is:**
Pure scheduler that runs a function at intervals. No queue, no retries, no rate limiting - just time-based execution.

**Pros:**
- Simplest architecture (zero additional vendors)
- No additional vendors
- Lowest cost (Vercel Pro only)
- Zero setup complexity

**Cons:**
- **No Rate Limiting:** Manual implementation required for Twilio's 30 concurrent limit (complex throttling code)
- **No Retries:** Failed SMS are lost if Twilio fails (no automatic retry mechanism)
- **60-Second Execution Limit:** Can't process large batches (hits timeout with 500+ users)
- **Poor Scaling:** Hard to scale beyond 500 users per cron run
- **No Concurrency Control:** Must manually implement worker pool or sequential processing

**Cost Impact:** $20/month (Vercel Pro only)

**Risk Level:** Medium-High (scalability and reliability concerns)

**ADR Positioning:** Only acceptable for very small deployments (< 200 users) or non-critical jobs. Not suitable for production SMS delivery requiring reliability.

### Option 4: BullMQ + Redis

**Description:** Traditional job queue using Redis as backend storage

**What it is:**
Industry-proven job queue system using Redis for job storage and worker processes for job execution. Requires infrastructure management.

**Pros:**
- Mature, battle-tested queue system
- Powerful job management (priorities, delays, recurring jobs)
- Fine-grained job control
- Good local development experience
- Industry-proven at scale

**Cons:**
- **Not Serverless:** Requires Redis instance (Upstash Redis, AWS ElastiCache, or self-hosted)
- **Worker Infrastructure:** Must manage worker processes (containers, servers, or serverless functions)
- **Infrastructure Overhead:** Additional infrastructure to manage, monitor, and scale
- **Higher Cost:** Redis hosting + worker infrastructure ($40+/month minimum)
- **Complex Setup:** More moving parts (Redis, workers, monitoring)
- **Overkill:** Too much infrastructure for simple SMS batching
- **Poor Fit for Vercel:** Not optimized for serverless-first architecture

**Cost Impact:** $40+/month (Vercel + Redis hosting + worker infrastructure)

**Risk Level:** Medium-High

**ADR Positioning:** Best for backend-heavy systems with dedicated infrastructure. Not optimal for serverless-first architecture on Vercel/Next.js stack.

### Option 5: Trigger.dev

**Description:** Use Trigger.dev for workflow orchestration and background job processing

**What is Trigger.dev:**
Trigger.dev is a workflow orchestration platform designed for complex, multi-step background jobs. It provides a TypeScript SDK for defining workflows as code, with built-in retries, observability, and step-by-step execution. Workflows run as serverless functions, making it compatible with Next.js/Vercel architectures.

**Pros:**
- **Workflow Orchestration:** Designed for complex multi-step workflows with dependencies between steps
- **TypeScript-First:** Workflows defined as code with full type safety
- **Built-in Retries:** Automatic retries with configurable policies
- **Step-by-Step Execution:** Each step runs independently, allowing for long-running workflows
- **Serverless-Friendly:** Runs as serverless functions, no worker infrastructure needed
- **Good Observability:** Built-in dashboard for workflow monitoring and debugging
- **Native Scheduling:** Support for scheduled workflows and delayed execution
- **Next.js Integration:** Good integration with Next.js and Vercel

**Cons:**
- **Overkill for Simple SMS:** SMS triggers are simple (query + send), not complex workflows requiring orchestration
- **Workflow Mental Model:** Heavier mental model than "push job → send SMS" for our use case
- **Medium Setup Complexity:** Requires learning Trigger.dev concepts and workflow patterns
- **Operational Overhead:** Medium complexity for monitoring and debugging workflows
- **Cost Growth:** Free tier available, but costs scale with workflow execution and compute time
- **Additional Vendor:** Adds third vendor when simpler solutions exist

**Cost Impact:** Free tier available, paid plans scale by workflow execution & compute time

**Risk Level:** Medium

**ADR Positioning:** Excellent for complex multi-step workflows (e.g., multi-step AI processing pipelines, complex event chains with dependencies). Not ideal for simple time-based SMS batching where database-driven scheduling is sufficient. Better suited for workflows that require step dependencies, conditional logic, and long-running processes.

## Decision Outcome

**Chosen Option:** Option 1 - Vercel Cron + QStash

**Rationale:**

Vercel Cron + QStash best addresses our decision drivers:

1. **Serverless HTTP Queue:** QStash delivers jobs as HTTP requests to Next.js API routes. No workers, no Redis, no infrastructure to manage.

2. **Database-Driven Scheduling:** Single cron queries Supabase every 15 min: "Which users need SMS now?" Users change preferred time via database, not job config. One cron scales to 10k+ users.

3. **Native Rate Limiting:** Built-in concurrency (30 workers) matches Twilio's limit. No manual throttling. Natural batching in one API call.

4. **Built-in Retries:** Failed SMS trigger automatic retries with exponential backoff. Reliable delivery without custom logic.

5. **Vercel Fit:** HTTP-first semantics align with API routes. Simple mental model: push HTTP → endpoint.

**Architecture Flow:**

**Daily SMS Trigger:**
1. Vercel Cron (runs every 15 minutes)
2. Query Supabase: SELECT users WHERE next_lesson_time <= NOW() AND sms_sent_today = false
3. Returns 50-100 users who need SMS right now
4. Batch publish to QStash queue
5. QStash spawns 30 parallel workers
6. Each worker: Generate JWT magic link → Send Twilio SMS → Mark user as sent
7. QStash retries failures automatically

**Weekly AI Batch:**
1. Vercel Cron (Monday 9am)
2. Query pending challenge submissions
3. Process in batches (20 at a time)
4. Call OpenAI API for grading
5. Store results in admin review queue

**Daily Cleanup:**
1. Vercel Cron (midnight)
2. Reset sms_sent_today flags
3. Calculate daily analytics
4. Archive old data

**Consequences:**
- Serverless architecture (no workers, no Redis, no infrastructure)
- Simple mental model (push HTTP → endpoint)
- Database-driven scheduling (flexible, easy user time changes)
- Native rate limiting and concurrency control (30 workers)
- Automatic retries with exponential backoff
- Scales linearly to 100k+ users (single cron job)
- Low cost (Vercel Pro $20/month + QStash free tier covers initial needs, scales with usage)
- Native cron support (no separate scheduler needed)
- Excellent fit with Next.js/Vercel (HTTP-first semantics)
- Easy debugging (Vercel logs + QStash dashboard)
- No infrastructure management (fully serverless)
- 15min granularity (not exact-time delivery - acceptable trade-off)
- QStash dependency (minimal risk, well-maintained service)
- HTTP-first semantics (not message-first like traditional queues - acceptable for our use case)

---

# ADR-012: Webhook Integration - Zapier + Slack

---

## Context

StoryFirst requires Slack integration for milestone notifications (status changes, streak milestones, program completion) to enable team notifications and automation. The platform needs to send notifications to Slack channels when users achieve milestones. Zapier provides the no-code solution to connect StoryFirst webhooks to Slack without custom development. This integration enables admin team (Holly, Jessie) to receive milestone notifications in Slack channels automatically.

**Architectural Challenge:**
- How do we send milestone notifications to Slack channels?
- How do we enable no-code Slack integration without custom development?
- How do we allow admin team to configure Slack workflows without developer support?
- How do we ensure reliable notification delivery to Slack?

## Decision Drivers

- Slack integration for milestone notifications (primary use case)
- No-code automation support (Zapier connects webhooks to Slack)
- Admin-configurable webhook URLs (no developer needed)
- Reliable notification delivery
- Standard webhook format for compatibility
- Cost efficiency

## Considered Options

### Webhook Integration Comparison

| Criteria                | Zapier Webhooks                                                                                                              | Custom Webhook Service | Inngest Webhooks                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------- |
| **No-Code Support**     | Better                                                                                                                       | No                     | Limited                                                                                           |
| **Ease of Setup**       | Better                                                                                                                       | Manual                 | Manual                                                                                            |
| **Admin Configuration** | Better                                                                                                                       | Complex                | Complex                                                                                           |
| **Reliability**         | Better                                                                                                                       | Manual                 | Good                                                                                              |
| **Cost**                | Free tier                                                                                                                    | Free                   | Included                                                                                          |
| **Ecosystem**           | Large                                                                                                                        | None                   | Limited                                                                                           |
| **Pricing**             | Free: 100 tasks/month<br/>Starter: $19.99/month (750 tasks)<br/>Professional: $49/month (2,000 tasks)<br/>Enterprise: Custom | —                      | Hobby: $0/month (50K executions/month)<br/>Pro: $75/month (1M+ executions)<br/>Enterprise: Custom |

### Option 1: Zapier Webhooks (Chosen)

**Description:** Use standard webhook format with Zapier integration support

**Pros:**
- Native Slack integration (primary use case)
- No-code automation support (admin team can set up Slack workflows without developer)
- Large ecosystem of integrations (Slack, email, CRM, etc.)
- Standard webhook format (compatible with any webhook receiver)
- Reliable delivery with retries
- Free tier available
- Admin-friendly configuration
- No additional infrastructure needed

**Cons:**
- Zapier-specific (but standard webhooks work with any receiver)
- Cost at scale (usage-based pricing)

**Cost Impact:** Free tier (~$0/month), Starter tier for growth (~$20/month)

**Risk Level:** Low

### Option 2: Custom Webhook Service

**Description:** Build custom webhook delivery service

**Pros:**
- Full control
- No external dependencies
- Custom retry logic

**Cons:**
- More development time
- Manual retry implementation
- No no-code support
- More maintenance
- Admin configuration complexity

**Cost Impact:** Development time

**Risk Level:** Medium-High

### Option 3: Inngest Webhooks

**Description:** Use Inngest for webhook delivery

**Pros:**
- Built-in retry logic
- Event-driven architecture
- Reliable delivery

**Cons:**
- Limited no-code support
- Less admin-friendly
- More complex setup
- Smaller ecosystem than Zapier

**Cost Impact:** Hobby: $0/month (50K executions/month), Pro: $75/month (1M+ executions), Enterprise: Custom

**Risk Level:** Medium

## Decision Outcome

**Chosen Option:** Option 1: Zapier Webhooks

**Rationale:**

Zapier webhooks best address our decision drivers:

1. **Slack Integration:** Native no-code Slack. Admin team connects milestone webhooks to Slack channels without developer support.

2. **No-Code Automation:** Admin sets up workflows via Zapier's visual builder (Slack, email, CRM). Webhook URL configurable in Admin Panel.

3. **Standard Webhooks:** HTTP POST works with Zapier, Make.com, or any receiver. Easiest path to Slack.

4. **Reliable Delivery:** Zapier handles retries; Slack notifications delivered even if initial attempt fails.

5. **Cost:** Free tier sufficient for milestone notifications.

**Webhook Use Cases:**

- Status level changes (0→1, 1→2, 2→3)
- Streak milestones (7, 14, 30, 50, 70 days)
- Program completion (Day 70)
- First lesson completion
- First challenge completion

**Consequences:**
- Native Slack integration via Zapier (primary use case)
- No-code automation support (admin team can configure Slack)
- Standard webhook format (compatible with any receiver)
- Admin-configurable webhook URLs
- Reliable delivery with retries
- Large integration ecosystem
- Free tier available
- Cost at scale (usage-based pricing)

---

# ADR-013: Video Infrastructure - Mux

---

## Context

StoryFirst delivers short-form, instructional lesson videos as part of the daily learning flow. Video playback must be reliable across mobile networks, support adaptive quality, and scale as user engagement grows. The platform also requires a clean developer integration model that fits a Next.js and serverless architecture.

**Architectural Challenge:**

- How do we reliably stream lesson videos across varying network conditions?
- How do we avoid building and maintaining our own video encoding and streaming pipeline?
- How do we ensure future observability into video playback quality?
- How do we balance cost predictability with scalability?

## Decision Drivers

- Adaptive bitrate streaming for mobile-first users
- Developer-first APIs suitable for product-embedded video
- Global video delivery performance
- Minimal operational overhead (no custom encoding pipelines)
- Transparent and usage-based pricing
- Future support for analytics, DRM, and signed playback URLs

## Considered Options

### Video Infrastructure Platform Comparison

| Criteria                | Mux                                    | Cloudflare Stream                      | Vimeo                                  |
| ----------------------- | -------------------------------------- | -------------------------------------- | -------------------------------------- |
| **Primary focus**        | Developer-first video infrastructure   | CDN-native video streaming             | Hosted / enterprise video              |
| **Video ingestion**      | API-based                              | API + dashboard                        | Dashboard-first                       |
| **Encoding**             | Automatic (adaptive)                   | Automatic                              | Automatic                             |
| **Adaptive streaming**   | HLS + DASH                             | HLS                                    | HLS                                   |
| **Playback integration** | Product-embedded                       | Product-embedded                      | Mostly hosted                         |
| **Video analytics**      | Advanced QoE metrics                   | Basic metrics                          | Engagement metrics                    |
| **DRM / signed URLs**    | Supported                              | Supported                              | Limited                               |
| **Pricing – base plan**  | $0 platform fee (usage-based only)    | No base fee (usage-based)              | Starter: $9/mo<br/>Standard: $20/mo   |
| **Pricing – storage**     | ~$0.0024 per minute stored / month (720p) | $5 per 1,000 minutes stored         | Starter: ~2 TB<br/>Standard: ~4 TB   |
| **Pricing – delivery**    | $0.80 per 1,000 minutes delivered (after free tier) | $1.00 per 1,000 minutes delivered | Included up to plan limits          |
| **Pricing model**        | Pure usage-based (minutes stored + delivered) | Usage-based (prepaid minute blocks) | Subscription-based (tier limits)      |
| **Best fit**             | Product video at scale                 | Edge-heavy delivery                    | Marketing / internal video            |

### Option 1: Mux (Chosen)

**Description:** Use Mux for video ingestion, encoding, storage, and adaptive streaming of lesson videos.

**Pros:**

- Purpose-built for product-embedded video
- Automatic adaptive bitrate streaming (HLS/DASH)
- Excellent developer experience with clean APIs
- Advanced video quality analytics available when needed
- Usage-based pricing aligns cost with actual engagement
- No need to manage encoding, CDN configuration, or playback formats
- Proven at scale for consumer-facing products

**Cons:**

- Higher per-minute cost than CDN-only solutions
- Additional vendor dependency
- Usage-based billing can scale with engagement

**Cost Impact:**

- Usage-based pricing (minutes stored + delivered)
- For 1,000 minutes stored and delivered per month: Storage ~$2.40, Delivery ~$0.80

**Cost Example:**

For 1,000 minutes stored and delivered per month:
- Storage: ~$2.40
- Delivery: ~$0.80
- **Total: ~$3.20 / month**

**Risk Level:** Low

### Option 2: Cloudflare Stream

**Description:** Use Cloudflare Stream for video storage and delivery at the CDN edge.

**Pros:**

- Simple and predictable pricing
- Excellent global edge delivery
- Encoding and bandwidth included
- Tight integration with Cloudflare ecosystem

**Cons:**

- Limited video analytics compared to Mux
- Less developer-focused for product logic
- Fewer advanced playback controls

**Cost Impact:**

- Usage-based pricing (prepaid minute blocks)
- For 1,000 minutes stored and delivered: Storage $5.00, Delivery $1.00

**Cost Example:**

For 1,000 minutes stored and delivered:
- Storage: $5.00
- Delivery: $1.00
- **Total: $6.00 / month**

**Risk Level:** Medium

### Option 3: Vimeo

**Description:** Use Vimeo subscription plans for hosting and delivering videos.

**Pros:**

- Simple subscription-based pricing
- Admin-friendly UI
- Suitable for hosted or marketing videos

**Cons:**

- Not usage-based; capped by plan limits
- Not designed for deeply embedded product experiences
- Limited control over playback behavior
- Less suitable for programmatic video workflows

**Cost Impact:**

Starter / Standard / Advanced plans (~$20 – $100+ per month). Hard limits on storage and bandwidth depending on tier.

**Risk Level:** Medium-High

## Decision Outcome

**Chosen Option:** Option 1: Mux

**Rationale:**

Mux best addresses our decision drivers:

1. **Product-Embedded Video:** StoryFirst videos are part of a guided lesson flow, not standalone hosted content. Mux is designed for this exact use case.

2. **Adaptive Streaming:** Automatic quality adjustment is critical for mobile users entering via SMS links on variable networks.

3. **Developer Experience:** Clean APIs integrate seamlessly with Next.js and serverless architectures.

4. **Operational Simplicity:** Eliminates the need to build and maintain encoding pipelines, multi-resolution assets, and CDN logic.

5. **Scalable Pricing Model:** Usage-based pricing ensures costs scale with real engagement, while free delivery minutes reduce early-stage cost.

6. **Future-Proofing:** Enables future use of video analytics, DRM, and signed playback URLs without architectural changes.

**Consequences:**

- Reliable, adaptive video playback across devices and networks
- No custom video infrastructure to maintain
- Clear separation between video infrastructure and core application logic
- Usage-based cost that scales with engagement
- Additional vendor dependency (Mux)
- Video analytics available when needed without refactor

---

### Document Revision History

| Version | Date                 | Author                              | Description of Changes                                                                                                                                                                                                                                          |
| ------- | -------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| **1.0** | **February 10, 2026** | **DevSavant - Product Engineering** | **Initial ADR: Architecture decisions for StoryFirst (frontend, styling, backend, database, auth, AI provider, STT, SMS, deployment, background jobs, webhooks, video infrastructure).**                                                                           |
