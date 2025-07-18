---
title: "Using AI in product design"
date: "2025-07-16"
tags:
- work
- process
- design
---

Since the rise of AI, I’ve experimented to understand its capabilities, test its boundaries, and assess what’s possible today and what still lies out of reach. Below are some notes on how I integrate AI into my daily work, across the entire design process.



**The process:**

1. Research

1. Ideation

1. Prototyping with AI tools

1. Validating and testing with users

1. Include findings into new prototype

1. Handover to engineering

1. Product marketing

1. Measuring impact



<figure class="full-bleed">
  <img src="/images/Using_AI_in_product_design.png.webp" alt="Tools that I’m using">
  <figcaption>Tools that I’m using</figcaption>
</figure>

## Research

### Understand the problem

At the start of any project, it’s essential to understand the problem we’re solving. I work closely with the product manager to define it clearly, often asking myself (or my "AI self") to rephrase the problem statement in simple, human language.

### Detective work

Then it’s time to roll up the sleeves and reach out. 

1. **Talk to actual users**. Also engage key stakeholders (such as Sales Reps and customer support).

1. **Check out data available**. Dive into product analytics and connect with data team folks. Extract pain points from existing logs.

1. **Create automated surveys** using Typeform or swift through past surveys results. 

1. **Watch recordings** on Clarity or Hotjar or Smartlook. See how users interact with the product. 

1. **Explore how others do it**. I like going to Mobbin for inspiration and create collections there. 



<figure class="full-bleed">
  <img src="/images/Screenshot_2025-07-16_at_13.21.04.png.webp" alt="Typeform results">
  <figcaption>Typeform results</figcaption>
</figure>



<figure class="full-bleed">
  <img src="/images/Screenshot_2025-07-16_at_13.16.57.png.webp" alt="Clarity recording">
  <figcaption>Clarity recording</figcaption>
</figure>



<figure class="full-bleed">
  <img src="/images/Screenshot_2025-07-16_at_10.48.18.png.webp" alt="Saved screens in Mobbin collection">
  <figcaption>Saved screens in Mobbin collection</figcaption>
</figure>



### Good practices

**Translation**

I believe good design begins with good translation. When speaking with users, we often operate in different "languages," so I make it a point to reframe the problem in their terms and check for mutual understanding. 

**Framing**

When reaching out, clearly state what you're looking for while remaining open-minded. Often, someone will share unexpected information that proves incredibly valuable. 

**Solid relationships**

Strong collaboration is key, especially with stakeholders from other teams. I invest time in building trust and open lines of communication. These relationships not only help surface edge cases and constraints early but also ensure smoother execution down the line.

### Gather insights and findings

To organize my research efficiently, I create dedicated **projects** in **ChatGPT** or in **NotebookLM** that store various resources including playbooks, documentation, result summaries, and datasets. 

<figure class="full-bleed">
  <img src="/images/Screenshot_2025-07-16_at_12.33.10.png.webp" alt="Dedicated project in ChatGPT">
  <figcaption>Dedicated project in ChatGPT</figcaption>
</figure>



I conduct all related conversations within these projects for better continuity. Throughout this process, I follow one simple rule: "Trust, but verify." 



One piece of advice from my manager Masha that I keep in personalized settings: 

```json
Don’t default to agreement — challenge my ideas to offer a contrarian view. 
```

It’s a reminder to stay critical, not just collaborative.

An output from the research could be a simplified set of user stories. 

<figure class="full-bleed">
  <img src="/images/Merchant_use_cases.png.webp" alt="User stories">
  <figcaption>User stories</figcaption>
</figure>



After gaining a solid understanding of the problem, I create a list of questions to discuss with the product manager and engineering team. This helps me get the project scope, which is essential since time and resources are always limited. 

## Ideation

In this phase, it's essential to generate solutions, brainstorm ideas, and explore various approaches. 

While brainstorming on my own, I also invite Claude into the process to generate alternative approaches. I ask it to outline the pros and cons of each direction, which helps me think more critically and uncover angles I might not have considered.

<figure class="full-bleed">
  <img src="/images/Screenshot_2025-07-18_at_13.44.01.png.webp" alt="Approaches suggested by Claude">
  <figcaption>Approaches suggested by Claude</figcaption>
</figure>

### Flowchart

Next, I typically create a new flowchart or update an existing one. This process gives me time to think through all edge cases in addition to the happy path. 

<figure class="full-bleed">
  <img src="/images/AI_part.png.webp" alt="A flow chart example">
  <figcaption>A flow chart example</figcaption>
</figure>

I strategically place sticky notes throughout with insider information or important points that require special attention. 

### Wireframes

After understanding the flows, I focus on individual screens and components. I use my iPad with Apple Pencil to sketch in the Notes app. These sketches automatically sync to my computer, where I take screenshots and import them into Figma as reference for my designs. 

<figure class="full-bleed">
  <img src="/images/IMG_7249.jpg.webp" alt="Wireframe">
  <figcaption>Wireframe</figcaption>
</figure>

## Prototyping

### Figma

Next, I convert the wireframe into a polished Figma design by leveraging existing components from our design system.

When creating Figma prototypes, add clear arrows between components to show interaction flows. Keep designs clean and uncluttered to improve readability for both myself and my teammates. 

<figure class="full-bleed">
  <img src="/images/figma-designs-2.png.webp" alt="Figma designs">
  <figcaption>Figma designs</figcaption>
</figure>

### Working prototype

Once the design is solidified in Figma, I move into a prototyping environment like v0, Replit, or **Lovable**. As for Figma Make, it’s a promising start, but not quite there yet. The output can be inconsistent, such as rendering fonts much smaller than intended.

I make sure the first AI prompt includes as much context as possible and keep it easily accessible for future iterations. 

I prefer using **v0** or **Replit**, where I can work directly with the code. With Lovable, I often continue editing in Cursor to fine-tune the output and have more control over micro-interactions etc. 

To keep things secure and avoid unintended exposure, I usually place early prototypes behind a **password**.

### Apply design system

To make sure the prototype uses our design system, I pour in a `design-system.json` file. Here’s a look how that file looks like, including design tokens and components. 



```json
{
  "colors": {
    "groupon": {
      ...
      "accent": {
        "blue": "#3b82f6",
        "purple": "#a855f7",
        "yellow": "#eab308"
      },
      "neutral": {
        "50": "#fafafa",
        "100": "#f5f5f5",
        ...
        "950": "#0a0a0a"
      }
    },
    "destructive": {
      "default": "#dc2626",
      "foreground": "#ffffff"
    },
    "success": {
      "default": "#22c55e",
      "foreground": "#ffffff"
    },
    ...
    "muted": {
      "default": "#f5f5f5",
      "foreground": "#525252"
    },
    "border": "#f5f5f5",
    ...
    }
  },
  "border": {
    "width": {
      "default": "1px",
      "thick": "2px"
    },
    "radius": {
      ...
    }
  },
  "font": {
    "family": {
      "sans": "Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
      "mono": "JetBrains Mono, Fira Code, Consolas, Liberation Mono, Menlo, Courier, monospace"
    }
...
  "card": {
    "default": {
      "variant": "default",
      "padding": "default"
    },
    "variants": {
      "default": {
        "background": "{colors.card.default}",
        "border": "{border.width.default} solid {colors.border}",
        "shadow": "default"
      },
      "elevated": {
        "background": "{colors.card.default}",
        "border": "none",
        "shadow": "lg"
      },
      "outlined": {
        "background": "{colors.card.default}",
        "border": "{border.width.thick} solid {colors.groupon.primary.200}",
        "shadow": "default"
      }
    },
    "padding": {
      "none": "0",
      "sm": "1rem",
      "default": "1.5rem",
      "lg": "2rem"
    }
  }
...
} 
```



## Test with users

Once the prototypes are ready, I create a test scenario to validate the experience. I usually break it down into clear steps and use a template that outlines the goals, which I refine with the help of Claude or ChatGPT.

My focus is on crafting simple, focused tasks using plain, accessible language. The goal is to make the test feel natural and not overwhelming, so users can engage comfortably and provide honest, useful feedback.



I prefer using **UserTesting** for structured, scalable sessions and **Lookback** for more in-depth, conversational insights. One feature I particularly appreciate in Lookback is **Eureka**, which automatically transcribes the sessions and organizes key takeaways into headlines. I often transfer these transcripts into **NotebookLM** or **Claude** for further synthesis and reflection.



<figure class="full-bleed">
  <img src="/images/Screenshot_2025-07-16_at_13.17.49.png.webp" alt="A test scenario on UserTesting">
  <figcaption>A test scenario on UserTesting</figcaption>
</figure>



<figure class="full-bleed">
  <img src="/images/Screenshot_2025-07-16_at_11.27.19.png.webp" alt="Lookback test where I obfuscated the real names">
  <figcaption>Lookback test where I obfuscated the real names</figcaption>
</figure>



## Include findings into the new prototype

Once the sessions are complete, I transfer the transcripts into **NotebookLM** or **ChatGPT** to help extract patterns and surface key insights. I still manually review and filter the findings to ensure only the most relevant and actionable ones are carried forward into the next iteration.

## Handover to engineering

The latest version of the prototype is prepared in a format that's ready for handoff to engineering. It serves not only as a design reference but also as a useful input for estimating development effort. I make sure the flow is clear, edge cases are considered, and the context is easy to grasp.

## Product marketing

I prepare for the release by creating relevant visuals for user-facing communication. I also refine the content to align with our company’s tone and brand guidelines.

## Measuring impact

While measuring impact is typically the responsibility of the Product Manager, I like to check in after a month, a quarter, or even six months post-release to see how things are going. It helps me understand what worked, what didn’t, and how the design is performing in the real world.

## Summary

I treat AI as another tool in my design toolkit, but one I’m not afraid to challenge. I plan to keep refining this approach over time. It’s important to work with AI responsibly and ethically, while also shaping the tools in a way that pushes my own thinking forward. 


