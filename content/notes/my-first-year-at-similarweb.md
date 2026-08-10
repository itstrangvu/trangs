---
title: "My first year at Similarweb"
date: "2026-08-11"
description: "What I learned during my first year at Similarweb"
tags:
- work
- design
- process
---

Here are my notes on what I learned during **my first year** at **Similarweb** as a Senior Product Designer. 

**A quick note:** the data, information and insights used throughout are illustrative examples chosen to make the ideas concrete. They don't represent real customer figures or actual Similarweb output.

## How it all started

Making sense of data and turning it into data visualizations was something I was passionate about in my spare time long before I joined Similarweb.

What sealed it was the hiring process itself, especially the final rounds. I still remember visiting the office and having Lenka tell me they'd love to have me right away (nothing like generic "We'll let you know within a week"). That kind of directness told me something about the place. 

<figure class="full-bleed">
  <img src="/images/similarweb-hiring-process.png.webp" alt="A blob on the left saying “We would love to have you on board!” and the blob on the right replying “Oh wow, okay!” ">
  <figcaption>A blob on the left saying “We would love to have you on board!” and the blob on the right replying “Oh wow, okay!” </figcaption>
</figure>



I joined on the 11th of August 2025, on a relatively new team behind a tiny but powerful product called “Monitor & Protect”. Fast forward to today, I'm a product designer working on features across Ad Intelligence, Web Intelligence, Rank Tracker and Market Research.

Let me share what I learned along the way, starting with an introduction to the realm of data, information and insight.

## Turn raw numbers into insights

So, at Similarweb, everyone talks data, information and insights. What is the connection between these three terms though? 

**Data** are numbers, values, observations without context. On their own, they don't tell us much. They’re ingredients, not the meal. 

**Example:** `brand = Nike`, `keyword = "running shoes"`, `position = 1.2`, `ad_appearances = 4,210`, `date_range = last 28 days` 

Once they are organized, structured and given context in order to become meaningful, that’s when they turn into **information** that answers "What happened?” 

**Example:** `Over the last 28 days, Nike appeared in paid search for "running shoes" 4,210 times at an average position of 1.2.`

Information interpreted to reveal a pattern, cause or implication, becomes **insight** and answers "Why it matters?" or "So what?" Insight usually points toward a decision or action. 

**Example:** `Nike is defending the top of "running shoes" aggressively and consistently — the high appearance count plus near-#1 position means they're bidding to own it, so trying to outrank them here would be expensive. The cheaper play is the long-tail terms they're not covering.` 

> The goal is to turn data into information, and information into insight. – Carly Fiorina

## How to build real insights

### Understand and frame the problem

Before touching a dataset, figure out if it's even the right problem. Read the signals on LinkedIn, Reddit, support tickets, GTM teams (go-to-market) calls with customers and learn how your customers actually talk about the thing we're building (is it "AI ads" or "LLM ads" to them?). 

Get on calls with paying customers and ask what they'd pay to know. A simple question-and-answer template: "As a PPC manager, I want to know who's bidding on my branded keywords". 

The art of discovery relies on **formulating clear, targeted inquiries** that cut straight to the core of a problem.

> If you do not know how to ask the right question, you discover nothing. – W. Edwards Deming

### Validate the data

Coverage, frequency and methodology are the prerequisites, not the finishing touches. Does the data exist worldwide? How often is it refreshed? Is it cleansed and mapped consistently and do the numbers actually reconcile with each other? 

If the foundation isn't solid, everything you build on top of it becomes shaky. Luckily, the data teams at Similarweb are smart, kind and collaborative souls (shoutout to you all, you know who you are!).

### Design for the agentic era

Users increasingly ask for this inside a chat, not a dashboard. That makes an API-first mindset non-negotiable because if an insight can't be delivered through an endpoint, it can't reach where users now expect it.

The shift is from exploratory analytics to **guided analytics**. Curated, structured insight an agent or a person can act on immediately, without doing the interpretation themselves. So the question I keep putting to product managers and the team isn't "What does this look like on screen?" but "**How does a user consume this insight through a Similarweb API endpoint?**" If we can't answer that, we've designed merely a dashboard feature, not an insight ready for agentic experience.

### Real and relevant

The other discipline is **testing** on **real, relevant insights** as early as possible. The user experience with Similarweb products is the data, information and insight. That's the core value and it's what we should be validating. A prototype running on hypothetical numbers validates the interface, not the value.

And I cannot stress enough the "real". If we're testing with a PPC manager, the prototype should run on data that manager would actually see: their brands, their competitors, their keywords. Testing them on some unrelated company from another industry (not even a rival) tells us nothing, because there's no insight to react to (like, they can judge the layout but not whether the so what is right).

<figure class="full-bleed">
  <img src="/images/similarweb-testing-real-data.png.webp" alt="User testing with a blob asking “Huh, am I looking at real data?” and looking at a website dashboard">
  <figcaption>User testing with a blob asking “Huh, am I looking at real data?” and looking at a website dashboard</figcaption>
</figure>



### How to package and sell it 

Releasing Ad Intelligence module across every pricing tier (self-service and Enterprise) was one of the harder problems we solved. Understand how to build and wrap the entitlement logic was hard and needed to bring in clarity. 

Figuring out how access should map to package and implementing that mechanism cleanly, took real time to get right (kudos to the strong team members who did not burn out on this one!). I learned a thing or two about how claims and aggregated claims work, heh. Also, I sometimes join calls with customers who purchased the module to help them onboard smoothly. 

### Measure and connect to business impact

The relevant metrics and events are defined before feature development begins. So the moment the feature hits real, paying customers, we already have the numbers to watch and know how they connect to upsells, funnels, and the rest.

What makes this possible is a real, company-wide focus on data-informed decisions, plus the infrastructure to back it up. We can clearly measure how a feature improved and what it did for the business. I'm grateful for that. When anyone can pull the usage numbers, decisions get settled by evidence, not by who is loudest or most senior.

B2B Product Designers regularly hold a Data Storytelling session where we present findings and the design decisions that came out of them. 

### Edge cases and quirks

Every product accumulates its own unglamorous edge cases. And they matter more than they look.

**Must-fix examples:**

- Null and zero are never the same thing. Showing 0 where there's no data turns "we don't know" into a false fact.

- Where "NA" is propagating as a string instead of a real null.

- How incomplete periods (an unfinished quarter, say) are displayed: a half-quarter shown as if it's whole drives wrong decisions.

- How sensitive content is handled. This is duty-of-care, not polish and can't be an afterthought.

**Can-wait-for-later examples:**

- How subdomains, canonical URLs and redirects are treated and displayed

- What makes a creative or ad "unique" once you have to hash and dedupe

- Which filters persist across tabs and which don't 

- Newly migrated customers speaking a language the product doesn't support yet 

## Personal growth

The strongest lessons this year for me were: 

1. Use everything available 

1. Focus on delivering

Plus, it helps that I'm surrounded by like-minded people who are smart and kind. I've come to think in systems rather than isolated features more than ever here and I've learned that being a technical designer and a storyteller aren't two jobs. Doing both well, at the same time, is the job. That's what unlocks the most.

I also get to use Claude, plenty of MCPs and other LLM tools in my daily work covered by the company but that's a chapter on its own, so I'll cover it in another dedicated note.

> Own your destiny! – Baruch Toledano

Also, I feel lucky to have landed from the start on a team that genuinely cares and communicates well. And yes, we joined the company-wide hackathon twice, and won the second time (with one member from the data team), yay. 

Above all, I've learned a lot about digital marketing, ad tech and the world of website traffic. Looking forward to more learnings and fuelling my growth mindset. Here’s to my first year wrap-up.

<figure class="full-bleed">
  <img src="/images/firstyearatsw.gif.webp" alt="A GIF showing a “My first year at” being typed on a dark screen and then Similarweb logo appears">
  <figcaption>A GIF showing a “My first year at” being typed on a dark screen and then Similarweb logo appears</figcaption>
</figure>






