# StudySpark — Capstone Reflection

## What was hardest, and why?

The hardest part of this capstone was debugging the AI flashcard generation feature. When I pasted longer paragraphs into the Generate page, flashcards would sometimes fail to generate — but only sometimes, not every time. Because the failure was inconsistent, my first assumption was that my own code was broken: maybe my prompt was too long, maybe I was handling the API response incorrectly, or maybe there was a bug in how I parsed the AI's output. I went back and forth changing parts of the code, testing again, and still seeing the same intermittent failures.

It was genuinely confusing because nothing in my code had changed between a successful generation and a failed one — the same input would sometimes work and sometimes not. Eventually, after digging into the actual error responses instead of just assuming the problem was on my end, I discovered the real cause: Google's Gemini API itself was returning intermittent 503 "high demand" errors on their servers. This wasn't a bug in my app at all — it was an upstream issue outside of my control. That was a relieving discovery, but also a humbling one, because I had spent real time assuming the problem was mine before verifying it wasn't.

## What would I do differently next time?

Next time, I'd check the actual error response and status code from the API *before* assuming my own code was the problem. I learned that when something fails intermittently — not consistently — that's often a signal pointing away from your own logic (which would fail the same way every time) and toward something external, like a third-party service having issues. I'd want to build that instinct earlier in the debugging process instead of defaulting to "I must have written this wrong."

I'd also want to build in clearer error messaging from the start, rather than adding it after running into the confusing failures. Because I later added specific handling for network failures and empty input (which I tested directly on the live production app), the app now fails predictably and clearly instead of just seeming broken. I'd bake that kind of resilience in earlier next time, rather than as a fix afterward.

## One thing I learned that surprised me

I was surprised by how much of "shipping" a project is really about handling the ways it can fail, not just making the happy path work. Getting flashcards to generate successfully was the easy part. The harder, more valuable work was making sure the app behaved gracefully when the API was slow, when the user submitted nothing, when the network dropped, or when the AI returned something unexpected — and then actually writing tests to prove that behavior, rather than just hoping it worked. Testing every component (not just the ones I assumed needed it) also surprised me — writing tests for the API route itself, not just the UI, caught real logic I wouldn't have thought to double-check otherwise.
