---
title: "Designing with data, information and insights"
date: "2026-08-11"
description: "What I learned during my first year at Similarweb"
tags:
- work
- design
- process
---

Here are my notes on what I learned during my first year at Similarweb while designing product features. Let me introduce you first into the realm of data, information and insights. 

## What turns raw numbers into something worth acting on?

**Data** are numbers, values, observations without context. On their own, they don't tell us much. They’re ingredients, not the meal. 

Example: `brand = Nike`, `keyword = "running shoes"`, `position = 1.2`, `ad_appearances = 4,210`, `date_range = last 30d` . 

Once they are organized, structured and given context in order to become meaningful, that’s when they turn into **information** that answers "What happened?” 

Example: `Over the last 30 days, Nike appeared in paid search for "running shoes``"`` 4,210 times at an average position of 1.2.`

Information interpreted to reveal a pattern, cause or implication, becomes **insight** and answers "Why it matters?" or "So what?" Insight usually points toward a decision or action. 

Example: `Nike is defending the top of "running shoes" aggressively and consistently — the high appearance count plus near-#1 position means they're bidding to own it, so trying to outrank them here would be expensive. The cheaper play is the long-tail terms they're not covering.`

> The goal is to turn data into information, and information into insight. – Carly Fiorina

## What building real insight actually requires

### Frame the problem

Before touching a dataset, figure out if it's even the right problem. Read the signals on LinkedIn, Reddit, support tickets, GTM teams (go-to-market) calls with customers and learn how your customers actually talk about the thing you're building (is it "AI ads" or "LLM ads" to them?). 

Get on calls with paying customers and ask what they'd pay to know. A simple question-and-answer template: "As a PPC manager, I want to know who's bidding on my branded keywords". Yeah, this does more than a stack of dashboards. The art of discovery relies on **formulating clear, targeted inquiries** that cut straight to the core of a problem.

> If you do not know how to ask the right question, you discover nothing. – W. Edwards Deming

### Validate the data

Coverage, frequency, and methodology are the prerequisites, not the finishing touches. Does the data exist worldwide? How often is it refreshed? Is it cleansed and mapped consistently and do the numbers actually reconcile with themselves? None of the interpretation downstream matters if this layer is shaky. Luckily, the data teams at Similarweb consist of smart, kind and collaborative souls (shoutout to you all).

### Design for the agentic era

Users increasingly ask for this information inside a chat, not a dashboard. So an API-first mindset isn't optional anymore. The shift is from exploratory analytics toward guided analytics: curated, structured insight that an agent or a person can act on immediately, using real data as early as possible so prototypes reflect reality rather than a hypothetical user. 

Oh, yeah, if you're testing with a PPC manager, the prototype should run on data relevant to that PPC manager. Testing them on another company (who’s not even a rival and comes from another industry) numbers tells you nothing. 

### How to sell it 

Releasing Ad Intelligence module across every pricing tier (self-service and Enterprise) was one of the harder problems we solved. Understand how to build and wrap the entitlement logic was hard and needed to bring in clarity. Figuring out how access should map to package, and building that mechanism cleanly, took real time to get right (kudos to the strong team members who did not burn out on this one!). I learned a thing or two about how claims and aggregated claims work, eheh.

### Edge cases and quirks

Every product like this accumulates its own unglamorous edge cases. And they matter more than they look:

- How subdomains, canonical URLs, and redirects should actually be treated and displayed

- Where "NA" is quietly propagating instead of a real null

- How incomplete periods (an unfinished quarter, say) should be shown without misleading anyone

- That null and zero are never the same thing

- Which filters should persist across tabs, and which shouldn't

- What makes a creative or an ad "unique" once you have to hash and dedupe it

- Newly migrated customers speaking a language the product doesn't support yet

- Where sensitive content — adult creatives, links to private webcams — needs to be handled with real care, not an afterthought

## The growth

The strongest lesson from this year: use everything you have. Tell the story the data is trying to tell, measure it properly and think in systems rather than isolated features. Being a technical designer and being a storyteller aren't competing skills — the job is doing both, at the same time, well. 






