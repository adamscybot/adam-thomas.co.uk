---
title: 'Enterprise E2E Suites: Biggest Mistakes & Best Approaches'
description: 'Learnings from my experience building E2E suites'
pubDate: 'Jun 09 2024'
# sectionLinks:
#     - link: 'death-by-selenium'
#       name: 'Selenium'
#     - link: 'general-principles'
#       name: 'Principles'
---

Over the years, I have built, refactored, encountered, and suffered quite a few End-to-End Test Suites, as well as the associated internal company libraries and underlying E2E tool frameworks. As anyone who has dealt with enterprise-level browser-driven E2E suites will understand, it goes without saying that I am cursed.

This is going to be a blunt, pointed list of ramblings about what you should and shouldn't do to maintain your life expectancy when working on browser-driven E2E suites at enterprise scale.

## Death by Selenium

I do not usually get so tribal about tools & frameworks in many contexts, but please allow me to scream into the void on this one. Yes, I'm sure there's some beautifully crafted, flake-free-on-every-PR, low-maintenance Selenium god-tier suite out there. I've never witnessed one, yet I go on believing to stay sane. But if you've got large teams and a product of high complexity, the last thing you need is a bit of Selenium in your life to inject some chaos and give you an epic stone-dead cold start. If you thought you would be just getting going on your first test, strap in because you will be teaching this bad boy how to use the web first.

It was the first major browser-driven E2E framework, and therefore, it has a legacy. However, I currently live in 2024 at the time of writing. I hate to do this, and probably someone is shaking their fist at their monitor, but I'm going to start by using Selenium as a toy example of where it can all go so wrong. You can also apply some of this to other frameworks (more on that later). Still, Selenium has many of these "things", and of course, I harbour barely hidden and irrationally deep-seated emotions about what I have seen, like any engineer.

### Baked in non-determinism

*Disclaimer: Much of this section is based on my experience with the base driver impl. Read on for more on that.*

If you want to use Selenium, where the application under test is a highly asynchronous web application with a high level of interactive features (e.g. apps using React, Angular or other popular UI frameworks) -- think carefully.

Selenium provides the ability to "wait" on predicates (elements appearing, being visible, etc.), which looks like just the ticket. But under the hood, it's polling. If you are a Software Engineer, you do not need me to explain why time-interval based tasks that interact with other tasks on an arbitrary non-deterministic schedule is a recipe for race conditions. Race conditions mean flakes and constant maintenance, and that is a waste of time that delivers poor returns in terms of value.

You usually bring order to that chaos by chaining predicates such that the test execution is in step with particular discrete DOM states representing UI transitions you are interested in. However, since events from the DOM do not trigger the underlying predicates, you get a world of pain when at scale, as the tick rate of your polling inevitably misaligns such that it's no longer beating the same drum as the UI itself. You can customise the polling logic, but I would rather spend my days on something other than continuously convincing it to work like an old fiddly ham radio. The whole suite should be based on engineering principles that ensure it is built to last.

You often go on to see `sleep(<duration>)` or `wait(<duration>)` calls. That's where the developer has given up and kicked this cursed can down the road on Friday at 5 pm. There shouldn't be any need whatsoever to do that. And if you have it everywhere, god help you.

If you ever perform a performance upgrade of your application's UI, back end, or even browser, buckle up because you just unearthed that can from earlier and potentially hundreds of others (suite size depending).

And then there's the most eye-scratching case of all: trying to get all that working consistently with zero-flakes both on your local and on the random CI agent with arbitrary compute you get assigned when it kicks off in CI several times a day. You will toil about why the goddamn thing won't work consistently on machine X. And that's when you find out about the lack of modern built-in debugging/reporting tools.

To bring order, you need to either (a) wrangle in things like [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) over the primitive JS bridge API and probably some stuff around history events, too, or (b) have some kind of custom event layer in the app.

Since the event bus is slow anyway I can't *imagine* (a) scales particularly well with apps with *many* DOM events going on. But is at least a generally applicable solution and it looks like someone has actually tried [layering this on in a lib](https://selenide.org/). That looks like a usable API.

I have successfully implemented (b), but the unreal pain of doing that on a legacy suite with hundreds of far-too-long tests was only a problem in the first place (in part) because there's no first-class way of doing it (yet?).

Out of the box, it fundamentally encourages patterns that set you up for pain. Indeed, shouldn't the ambition of deterministic, totally stable, and low-maintenance tests be a day zero concern? Otherwise, you set yourself up to nuke your velocity and forfeit the [true benefits](#general-principles). This will worsen as you add more test cases and features to the app.

Notice I have yet to speak about the thing we're trying to do -- assert business functionality.

### Speed

I'm unsure about all the factors leading to this, but it's painfully slow. The polling thing certainly doesn't help, but as I understand it, it is likely caused by an archaic strict request/response pattern between it and the browser. The DOM is evented, but none of that matters when your comms medium is teleprinter-era technology. Needless to say, when you run it next to other frameworks, it gets smoked.

And speed is not a focus because of developer navel-gazing. It's a focus because all engineers should be iterating the tests rapidly and using them in their day to day both locally and in CI.

Other frameworks have powered ahead and essentially long since made peace with internal per-browser impls that use browser-specific protocols. They have done the heavy lifting by layering on abstractions that provide universal ergonomic APIs for the browsers they support, unhindered by any decades-old legacy.

Selenium is holding out for [WebDriver BiDi](https://w3c.github.io/webdriver-bidi/) over a core principled belief in cross-browser testing, which promises a standard WebSocket-based comms mechanism that will work across all browsers. That's commendable. But if your situation is like the ones I have encountered over the years, you needed these tests yesterday. I also have opposing thoughts about obsessing over cross-browser as a priority. You are testing the whole system, not just the UI.

There are some [Selenium Chrome-specific WebDrivers](https://www.selenium.dev/documentation/webdriver/bidirectional/chrome_devtools/cdp_api/), too, but the constraints of those go against Selenium's principled stand of preferring a one-size-fits-all API that aligns down to the driver protocol. 

Indeed, there is now a [driver](https://www.selenium.dev/documentation/webdriver/bidirectional/chrome_devtools/bidi_api/) that effectively acts as a bridge between the proposed BiDi spec and Chrome's CDP protocol, which looks like a step towards the project's goal.

That sounds promising, and maybe it's fast now. It could well solve the async problem too. But I won't be rushing back since Selenium remains lacking in many other areas. And I likely need all of it now.

### Debugging Tooling

There's not much to say here. There's no built-in screenshot/video support and no capability to time travel across UI states of previous runs via some command log. All of this is crucial if you're going to debug issues methodically and not take punts in the dark, which further fuels pointless, resource-intensive toiling.

Of course, you can bolt this type of thing in, but you probably get the vibe that the batteries are not included by now.

### Selenium IDE etc.

I reserve my ire for the section on universal counter-productive patterns, which is not necessarily Selenium-specific.


### Epitaph 

I admit I have yet to work on the latest iterations of Selenium. But I also don't see myself being compelled to give it another try, and industry trends speak for themselves.

Of course, you may already be using it, and you may have so many tests that migrating them will either never get on the agenda or be a slow process. There is a high chance they have succumbed to the problems above. They may also have ambiguous or counter-productive design [principles](#general-principles). In this case, it can be very difficult to pull apart the web of inter-dependencies that has built up organically over time into a structure that is scalable moving forward. Consequently the task is often closer to "rebuild" than the simple one-to-one mapping between different test framework APIs you hoped for. So, you may opt to continually battle with what you have. But that comes at a significant cost, and that cost is persistent and growing until the core issues are addressed.

Try to stop the rot as soon as possible. From this point onwards, consider the merits of creating new tests on top of the new driver or using a new tool entirely. Rethink what this thing value should be to the business, and refocus on what matters. Then rethink the core problems and abstractions, and consider how much time is being invested in something which has returns that are much lower than the potential.

## General Principles

So, what should you be using ideally? Well, there is more than the tool in play here. You need to focus on the principles that will lead to success and then pick the tool that fits best around those principles.

These principles focus on developer velocity. If a developer is working on a test suite, that should be because they are adding to its value: enhancing business confidence about behaviour. There should be little to no time spent manually managing changes or performing repetitive tasks that code abstractions can resolve. And the velocity focus also means maximising the value of the tests by democratising them as far as possible in order to positively impact *product quality* and the effectiveness of the Software Development lifecycle. Optimizing for an arbitrary "coverage" metric *does not* adequately capture this, and can indeed cause you to double down on a lesser problem that yields diminishing returns.

Success looks like:

* Your suite runs seamlessly locally and CI with maximum automation.
* Any developer can run the suite locally in CI and use the results continuously in their daily operations to identify bugs as soon as possible.
* The developers are writing the tests for their day-to-day feature work.
* Ideally, it runs on PRs, but at least several times a day off main.
* It is highly debuggable, allowing faults to be pinpointed and dealt with as efficiently as possible. There are logs, screenshots, videos and, ideally, time travel snapshot capabilities.
* Flakes are resolved with priority, and generally, the suite is constantly green and consistent across runs with the most minimal possible regular human intervention.
* There is no ongoing steep relationship between the test suite size and the amount of resources/time spent on it.
* Decoupling between the test suite and the UI implementation detail is paramount so the suite does not "pour concrete" around the app.
* Changes to tests caused by changed/new features are relative to the size of those changes and concentrated on a specific area relevant to that feature. 
  * I.e., changing how a dropdown control behaves is usually done in a single file.
  * In other words, necessary changes to the test suite caused by a change to Feature A generally would not affect pre-existing tests concerning Feature B. The tests for feature B would only be impacted if there was a meaningful *business logic* change in that area. 
* Ideally, all tests can be run in isolation (standalone), and there are minimal implicit dependencies on other tests or jobs inherently required for a test to run.
* Tests are kept focused on a single "unit" of functionality that makes sense, but erring on the side of smaller tests. Long tests implies you have many explicit or implicit assertions and an early failure occludes the latter ones which reduces visibility and granularity.
* Where necessary, dependencies should be clearly defined and managed via code abstractions collocated with the relevant test. For example, a test will orchestrate the fixtures that it requires.
* Test runs should be deterministic. This means they do not explicitly conditionally branch on the existing state. For determinism to be achieved, it also means that test runs start from the same starting position and no meaningfully mutated stores persist between runs, which could eventuate non-determinism.
* The testing pyramid (of which E2E is the smallest component part) should remain the right side up and be complemented by other types of testing such as unit/integration. It must not supplant them. Test cases that are adequately resolved at a lower level usually should have only some limited permutation also tested in the E2E suite.
* The E2E tests test the entire system, not just the UI software component. The UI is a surface on which to assert this business functionality, but the UI is also part of the system.

If this contradicts your previous thinking about E2E tests, you've been doing it wrong. The above is how it is done at scale in many organisations with complex products, including very significant organisations. Of course, there will be some deviation in practice. But generally speaking, the above is true in a well-functioning E2E test suite.


...to be continued

<!-- ### Predictable Execution




### Never Sleep

## Intense DOM Coupling and Pointless Busy Work

## Cursed Clandestine Mega Test

## Tests Are Software BTW

## E2E Tests are not necessarily UI Tests

### Cross Browser? Meh, Depends -->