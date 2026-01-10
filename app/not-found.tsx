"use client"

import FuzzyText from "@/components/FuzzyText"
import Link from "next/link"
import { useState } from "react"

const jokes = [
  // Classic bar jokes
  "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
  "A TCP packet walks into a bar and says, 'I'd like a beer.' The bartender replies, 'You want a beer?' The TCP packet says, 'Yes, I want a beer.'",
  "A UDP packet walks into a bar. No one acknowledges him.",
  "An SEO expert walks into a bar, bars, pub, tavern, public house, Irish pub, drinks, beer.",
  "A programmer walks into a bar and orders 1.0000000000000000001 beers. The bartender says: 'I'll have to round that up.'",
  "A QA engineer walks into a bar. Orders 1 beer. Orders 0 beers. Orders 99999999 beers. Orders -1 beers. Orders a lizard. Orders NULL beers. First real customer walks in and asks where the bathroom is. The bar bursts into flames.",
  "A web developer walks into a bar. Leaves immediately because it's not accessible.",
  "A CSS developer walks into a bar. The bar isn't centered.",
  "A frontend developer walks into a bar, cries, and leaves. The bar wasn't responsive.",
  "Two bytes walk into a bar. The bartender asks, 'You look terrible, what's wrong?' One byte replies: 'I think I have a parity error.' The bartender nods and says, 'Yeah, I thought you looked a bit off.'",
  "A programmer walks into a bar. He looks at the menu and says, 'I'll have a burger.' The bartender asks, 'Want fries with that?' The programmer says, 'Did I ask for fries?'",
  "A Perl programmer walks into a bar. $bar =~ s/walk/stumble/g;",
  "A DNS cache walks into a bar. The bartender says 'you were just here' and the DNS cache says 'no that was 86400 seconds ago.'",
  "An HTML tag walks into a bar. The bartender says, 'We don't serve your type here.' </burn>",

  // Boolean/Binary jokes
  "There are only 10 types of people in the world: those who understand binary and those who don't.",
  "There are only 10 types of people: those who understand binary, those who don't, and those who didn't expect this joke to be in base 3.",
  "!false — it's funny because it's true.",
  "The best thing about a boolean is that even if you're wrong, you're only off by a bit.",
  "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25.",
  "There are 2 hard problems in computer science: cache invalidation, naming things, and off-by-one errors.",

  // Language-specific
  "Why do Java developers wear glasses? Because they can't C#.",
  "Why did the JavaScript developer go blind? Because he didn't get any callbacks.",
  "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
  "I'd tell you a joke about JavaScript but null",
  "Why do Python programmers wear glasses? Because they can't C.",
  "A Python programmer walks up to a bar and orders a drink. import bar; bar.order('drink')",
  "How do you comfort a JavaScript bug? You console it.",
  "Why did the developer quit? Because he didn't get arrays.",
  "Why do C programmers never get lost? Because they always follow the pointer.",
  "Why did the C++ developer leave? Because he had too many issues with his ex (exceptions).",
  "Java: write once, debug everywhere.",
  "PHP: Professional Hypertext Preprocessor or Please Help (PHP).",
  "There are only two kinds of languages: the ones people complain about and the ones nobody uses.",
  "JavaScript is not a language. It's a cry for help.",
  "TypeScript: because JavaScript wasn't painful enough.",
  "Go: because sometimes you want to feel like you're writing C but with garbage collection.",
  "Rust: the language where the compiler is your helicopter parent.",
  "Haskell: the language where 'Hello World' requires a monad tutorial.",

  // Wife/Store jokes
  "A programmer's wife tells him: 'Go to the store and get a loaf of bread. If they have eggs, get a dozen.' He comes home with 12 loaves of bread.",
  "A programmer's wife asks: 'Can you go to the store and get milk, and if they have eggs, get a dozen?' He never comes back. The store had eggs.",
  "My wife told me to stop impersonating a flamingo. I had to put my foot down.",
  "My wife said she'd leave me if I didn't stop making programming puns. I think she's just throwing exceptions.",

  // Recursion
  "To understand recursion, you must first understand recursion.",
  "In order to understand recursion you must first understand recursion.",
  "Recursion (n.): See recursion.",
  "Why do programmers hate nature? It has too many bugs and no documentation.",

  // Place jokes
  "There's no place like 127.0.0.1",
  "Home is where the WiFi connects automatically.",
  "East or West, localhost is best.",
  "There's no place like ::1",

  // Bug jokes
  "99 little bugs in the code, 99 little bugs. Take one down, patch it around, 127 little bugs in the code.",
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "My code doesn't have bugs, it just develops random features.",
  "It's not a bug, it's an undocumented feature.",
  "The first 90% of the code takes 90% of the time. The remaining 10% takes the other 90%.",
  "I don't always test my code, but when I do, I do it in production.",
  "Debugging: being the detective in a crime movie where you're also the murderer.",
  "A bug in production is worth two in development.",
  "Software bugs are born when the code was young and stupid.",

  // Git jokes
  "I have a joke about git but I keep pushing it.",
  "git commit -m 'fixed it' — narrator: he did not fix it.",
  "git push --force: because who needs history anyway?",
  "I git commit every day but I never git push myself.",
  "git blame: for when you need to know who to yell at.",
  "My code review? git gud.",
  "Why did the developer break up with git? Too many commitment issues.",
  "git stash: where code goes to die.",

  // Stack Overflow
  "Copied from Stack Overflow, please don't ask how it works.",
  "The three stages of debugging: 1) That can't happen. 2) That shouldn't happen. 3) Oh, I see.",
  "Stack Overflow: where your stupid question was asked by someone stupider 8 years ago.",
  "Duplicate question closed. The answer is 'use jQuery.'",
  "The best code is no code at all.",
  "I don't write bugs. I write future job security.",

  // Meeting jokes
  "This meeting could have been an email.",
  "Sorry, I was on mute.",
  "Can everyone see my screen?",
  "Let's take this offline.",
  "Can you hear me? I think you're frozen.",
  "I'll follow up with an email.",
  "Let's circle back on this.",
  "We're having some technical difficulties.",

  // Work/Career
  "Algorithm: a word used by programmers when they don't want to explain what they did.",
  "It works on my machine.",
  "The cloud is just someone else's computer.",
  "Weeks of coding can save you hours of planning.",
  "If at first you don't succeed, call it version 1.0.",
  "Real programmers count from 0.",
  "SELECT * FROM users WHERE clue > 0; — 0 rows returned.",
  "// TODO: write better jokes",
  "How many programmers does it take to change a lightbulb? None, that's a hardware problem.",
  "The S in IoT stands for Security.",
  "Knock knock. Race condition. Who's there?",
  "Software is like sex: it's better when it's free.",
  "Documentation is like sex: when it's good, it's really good. When it's bad, it's better than nothing.",
  "Why do programmers hate camping? Too many bugs.",
  "A son asked his father (a programmer) why the sun rises in the east. His response? It works, don't touch it.",
  "I would love to change the world, but they won't give me the source code.",
  "Programming is 10% coding and 90% figuring out why it's not working.",
  "The code works, I have no idea why. The code doesn't work, I have no idea why.",
  "I have a programming joke, but it only works on my machine.",

  // Comments
  "// This code is self-documenting. Good luck.",
  "// Magic. Do not touch.",
  "// I am not responsible for this code. I was told to write it.",
  "// If this comment is removed, the program will blow up.",
  "// I'm sorry.",
  "// Dear future me: I'm sorry.",
  "// I don't know why this works, but it does.",
  "// Abandon all hope, ye who enter here.",
  "// Here be dragons.",
  "// This function was written at 3am. Proceed with caution.",
  "// TODO: fix this mess (added 3 years ago)",
  "// Temporary fix: has been here since 2008",
  "// This is not the code you are looking for.",
  "/* Don't delete this line or everything breaks */",

  // Framework jokes
  "How do you know if someone uses Vim? Don't worry, they'll tell you.",
  "How do you know if someone uses Arch Linux? Don't worry, they'll tell you.",
  "There are no stupid questions, just stupid frameworks.",
  "The best framework is the one you're not using.",
  "Why did the framework cross the road? It was deprecated.",
  "NPM: Never Production Material.",
  "node_modules: the heaviest object in the universe.",
  "My node_modules folder is bigger than my future.",

  // AI/ML jokes
  "Machine learning is just statistics in a fancy jacket.",
  "AI is just if statements all the way down.",
  "If it's written in Python, it's AI. If it's written in Excel, it's machine learning. If it's written in PowerPoint, it's digital transformation.",
  "My neural network has more layers than my personality.",
  "Deep learning: because one layer of confusion wasn't enough.",

  // Crypto/Blockchain
  "Blockchain: a very expensive way to store data nobody needs.",
  "NFT: New Financial Tragedy.",
  "I bought Bitcoin at $60k. Anyway, here's your coffee.",
  "Web3: where web2 goes to lose money.",

  // Database
  "A DBA walks into a NoSQL bar. Leaves because he couldn't find a table.",
  "MongoDB: where your data goes to live its best unstructured life.",
  "I don't always use databases, but when I do, I make sure to use MongoDB in production without backups.",
  "SQL: making your data relatable since 1974.",
  "Little Bobby Tables, we call him.",
  "Always sanitize your inputs. - Little Bobby Tables' teacher",
  "Why did the database administrator leave his wife? She had one-to-many relationships.",

  // Security
  "My password is 'incorrect' so when I forget it, the computer tells me.",
  "The best encryption is when you forget the password.",
  "Two factor authentication: because one level of inconvenience wasn't enough.",
  "Security through obscurity: the developer's last resort.",
  "The password is password. Or admin. Or 123456. Check all three.",
  "I don't have trust issues. I use HTTPS.",

  // Agile/Scrum
  "Agile: because waterfall was making too much sense.",
  "Sprint: two weeks of pretending everything is fine.",
  "Stand-up: a meeting that could have been a Slack message.",
  "Scrum Master: a professional meeting scheduler.",
  "User story: once upon a time, someone wanted software that worked.",
  "Velocity: a number we make up to make managers happy.",
  "Technical debt: the gift that keeps on taking.",
  "MVP: Most Vague Product.",
  "Ship it: the battle cry of developers who stopped caring.",

  // Career/Life
  "Full stack developer: someone who gets blamed for everything.",
  "Frontend developer: makes it pretty. Backend developer: makes it work. DevOps: makes it available. PM: makes it late.",
  "Junior dev: writes code. Senior dev: deletes code.",
  "10x developer: one who creates 10x the problems.",
  "Senior developer: junior developer who hasn't been fired yet.",
  "Staff engineer: someone who has given up on actually writing code.",
  "Tech lead: the person who explains why nothing works.",
  "Architect: someone who draws boxes and arrows and calls it design.",
  "My boss told me to have a good day, so I went home.",
  "I'm not lazy, I'm on energy-saving mode.",
  "I'd explain it to you, but I don't have any crayons.",
  "I'm not arguing. I'm just explaining why I'm right.",
  "I followed my heart and it led me to the computer.",

  // Server/Infra
  "Serverless: just means it's someone else's servers.",
  "Kubernetes: Greek for 'I can't run docker-compose.'",
  "Docker: it works on my container too!",
  "AWS: Amazon's Way of Separating you from your money.",
  "My servers don't crash. They just take unexpected naps.",
  "CORS: Cross-Origin Rage Syndrome.",
  "localhost: the only relationship I can maintain.",

  // Code quality
  "Clean code: an oxymoron.",
  "Legacy code: any code written before lunch.",
  "Spaghetti code: my specialty.",
  "Code review: where friendships go to die.",
  "Merge conflict: when two wrongs make a wronger.",
  "Refactoring: the art of breaking working code.",
  "Unit tests: proof that at least one thing works.",
  "100% code coverage: 0% bug coverage.",
  "The only valid measurement of code quality: WTFs per minute.",

  // Time
  "The hardest problem in computer science is dealing with dates and timezones.",
  "There are only two hard problems in distributed systems: 2. Exactly-once delivery 1. Guaranteed order of messages 2. Exactly-once delivery.",
  "A programmer's favorite hangout place? Foo bar.",
  "Why do programmers always get Christmas and Halloween confused? Because DEC 25 = OCT 31.",
  "Time flies like an arrow. Fruit flies like a banana.",

  // Classic memes
  "Hello World!",
  "sudo make me a sandwich.",
  "There is no Ctrl+Z in life.",
  "Have you tried turning it off and on again?",
  "The cake is a lie, and so is this URL.",
  "I see you have chosen death. (404)",
  "You shall not pass! (403)",
  "Error 418: I'm a teapot.",
  "Works on my machine! Ship it!",
  "The answer is always 'it depends.'",

  // Motivational/Existential
  "Behind every successful program is a pile of failed attempts.",
  "Code never lies. Comments sometimes do.",
  "In a world full of variables, be a constant.",
  "Keep calm and clear your cache.",
  "Life is short. Write clean code.",
  "May your code compile on the first try.",
  "Programming is thinking, not typing.",
  "Talk is cheap. Show me the code.",
  "The best error message is the one that never shows up.",
  "There is no place like production.",
  "What doesn't kill you makes you a better debugger.",
  "You don't have to be crazy to be a programmer. We train you.",

  // More specific tech
  "CSS: Can't Style Sh*t.",
  "HTML: How To Meet Ladies.",
  "JSON: JavaScript Object Notation (but nobody calls it that).",
  "REST: Really Enormous Structured Text.",
  "API: Conditions Apply.",
  "XML: eXtremely Messy Language.",
  "YAML: YAML Ain't Markup Language (but also, YAML Ain't Making Life easier).",
  "regex: now you have two problems.",
  "Trying to fix a regex is like trying to herd cats. Blindfolded. In a thunderstorm.",
  "Some people, when confronted with a problem, think 'I know, I'll use regex.' Now they have two problems.",

  // Office humor
  "My code is compiling.",
  "I'm not slacking, I'm waiting for CI/CD.",
  "Sorry I'm late, my Docker was building.",
  "In the middle of some very important code. (Staring at StackOverflow)",
  "Working from home means I can debug in my underwear.",
  "The best thing about WFH is not having to wear pants to prod incidents.",

  // Relationship jokes
  "Roses are red, violets are blue. Unexpected '{' on line 32.",
  "I would date you but you're not my type. TypeError.",
  "Are you a keyboard? Because you're my type.",
  "Are you HTTP? Because without you I'm just ://",
  "You had me at 'Hello World'.",
  "Our relationship is like a broken switch statement. There's no break.",

  // Philosophy
  "If a server crashes in the cloud and no one is around to hear it, does it make a sound?",
  "Is a hotdog a sandwich? Is an array a linked list?",
  "What came first, the chicken or the egg? Neither, the dependency.",
  "If you're not part of the solution, you're part of the legacy codebase.",
  "The only thing worse than not knowing is knowing you don't know.",

  // Random good ones
  "There are two ways to write error-free programs; only the third one works.",
  "Before software can be reusable it first has to be usable.",
  "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.",
  "The cheapest, fastest, and most reliable components are those that aren't there.",
  "A good programmer is someone who looks both ways before crossing a one-way street.",
  "One person's 'hard to debug' is another person's 'impossible to maintain'.",
  "When in doubt, use brute force.",
  "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.",
  "The most dangerous phrase in programming: 'Let me just make a small change.'",
  "Any sufficiently advanced bug is indistinguishable from a feature.",
  "The best performance improvement is the transition from non-working to working.",
  "If debugging is the process of removing software bugs, then programming must be the process of putting them in.",
  "Walking on water and developing software from a specification are easy if both are frozen.",
  "It compiles; ship it.",
  "First, solve the problem. Then, write the code.",
  "Make it work, make it right, make it fast. Most just do step 1.",
  "Code is like humor. When you have to explain it, it's bad.",
  "Simplicity is prerequisite for reliability.",
  "Programs must be written for people to read, and only incidentally for machines to execute.",
  "The most important skill for a programmer is knowing when to stop coding.",
  "Good code is its own best documentation.",
  "Every great developer you know got there by solving problems they were unqualified to solve.",
  "Software undergoes beta testing shortly before it's released. Beta is Latin for 'still doesn't work'.",

  // More memes and references
  "I use Arch, btw.",
  "It's always DNS.",
  "Have you tried rm -rf /?",
  "chmod 777: because security is for people who have something to hide.",
  "rm -rf /: the fastest way to free up disk space.",
  "ssh: secure shell, or 'sh*t, something's happening'",
  "sudo: because sometimes you need to feel powerful.",
  "vim: easy to enter, impossible to exit.",
  ":wq!",
  "How to exit vim? Throw away the computer.",
  "Emacs is a great operating system. It just needs a good text editor.",
  "The W in WordPress stands for 'Why?'",
  "PHP: Provoking Huge Problems.",
  "COBOL: ancient language spoken by mainframe shamans.",
  "Assembly: for when you want to count clock cycles.",
  "Brainfuck: when regular programming languages make too much sense.",
  "HTML is not a programming language. (angry mob approaches)",
  "CSS is awesome.",
  "CSS is awsome.",
  "CSS is     awesom e.",
  "I know HTML (How To Meet Ladies).",
  "JSON: JavaScript Object Notation, but we use it everywhere anyway.",
  "YAML: Yet Another Markup Language (that will ruin your day with indentation).",
  "undefined is not a function",
  "NaN === NaN // false (because JavaScript)",
  "[] + {} // '[object Object]' (because JavaScript)",
  "{} + [] // 0 (because JavaScript)",
  "typeof NaN === 'number' // true (because JavaScript)",
  "0.1 + 0.2 === 0.3 // false (because IEEE 754)",
  "'b' + 'a' + + 'a' + 'a' // 'baNaNa'",

  // Startup/Industry
  "We're not a tech company, we're a company that happens to use tech. (every company now)",
  "We're disrupting the [industry] space.",
  "We're like Uber, but for [literally anything].",
  "Our app is revolutionary. It's like [existing thing] but with blockchain.",
  "Move fast and break things. (things are broken)",
  "We're building the future. (the future is a CRUD app)",
  "Our culture is like a family. (red flag)",
  "Unlimited PTO. (no one actually takes it)",
  "We work hard and play hard. (we just work hard)",
  "Startup equity: Monopoly money with better graphics.",
  "Series A: We have an idea. Series B: We have users. Series C: We have no idea how to make money.",
  "Pivot: what you do when your startup fails upward.",
  "Growth hacking: marketing for people who hate the word marketing.",
  "Product-market fit: we have customers who pay us (allegedly).",

  // Interviews
  "Reverse a linked list on the whiteboard: the ultimate test of real-world skills.",
  "Interview question: Design Twitter in 45 minutes. Reality: Twitter took years and still breaks.",
  "FizzBuzz: the bar is low and people still trip.",
  "LeetCode: where you learn to code problems you'll never face.",
  "Behavioral interview: lie professionally.",
  "Take-home assignment: unpaid labor, but make it technical.",
  "Culture fit: we want someone exactly like us, but different.",
  "We're looking for a rockstar developer. (red flag)",
  "We're looking for a ninja developer. (run)",
  "We're looking for a unicorn. (they don't exist)",
  "Years of experience required: 5 years of React (React was released 4 years ago).",

  // Dependencies
  "left-pad: the package that broke the internet.",
  "One does not simply update npm packages.",
  "Dependency hell: where your Tuesday afternoon goes.",
  "is-odd: 500,000 weekly downloads. Why?",
  "is-even: depends on is-odd. Obviously.",
  "The node_modules folder contains the entire internet.",
  "Package.json: 10 lines. Package-lock.json: 50,000 lines.",

  // Real talk
  "Legacy code: code without tests.",
  "Refactoring: changing code that works until it doesn't.",
  "Over-engineering: when you need a microservice for your to-do list.",
  "Premature optimization: the root of all evil.",
  "The best code review is: 'LGTM' without looking.",
  "Ship it and hope.",
  "Revert and pray.",
  "Test in prod, fix in prod, live in prod.",
  "Friday deploy: never again. (does it again)",

  // More classics
  "There's an off-by-one error in this joke.",
  "I have CDO. It's like OCD, but the letters are in alphabetical order. Like they should be.",
  "Why do programmers hate nature? It has too many bugs and no documentation.",
  "What's a programmer's favorite eyewear? C glasses.",
  "Why do programmers prefer iOS? Because on Android, there are too many Java beans.",
  "What's a programmer's favorite type of music? Algorithm and blues.",
  "Why was the developer unhappy at their job? They wanted arrays.",
  "How does a computer get drunk? It takes screenshots.",
  "Why did the functions stop calling each other? They had bad arguments.",
  "What's a programmer's favorite place to go? Arrays of Mountains.",

  // Hardware
  "Have you tried turning it off and on again?",
  "The problem is between the keyboard and the chair.",
  "ID-10-T error detected.",
  "PEBCAK: Problem Exists Between Chair And Keyboard.",
  "Layer 8 issue.",
  "The network is down. (it's always the network)",
  "It's not a bug in my code. It's a feature of your hardware.",
  "My RAM is full of Chrome tabs.",
  "Why did the computer go to the doctor? It had a virus.",

  // Final additions
  "I'm not great at advice, but can I interest you in a sarcastic comment?",
  "404: Motivation not found.",
  "500: Internal coffee error.",
  "418: I'm a teapot. (this is a real HTTP status code)",
  "The internet is just a bunch of computers gossiping.",
  "WiFi: Wirelessly Failing Intermittently.",
  "Ethernet: because sometimes you need a wired relationship.",
  "The internet: where everyone is an expert and no one is right.",
  "Google: because Stack Overflow was down.",
  "ChatGPT: because Stack Overflow was too judgmental.",
  "Copilot: autocomplete that went to college.",
  "AI will replace programmers. (AI was trained on programmer code)",
  "My code was written by AI. I just review and deploy.",
  "Prompt engineering: the new programming.",
  "The robots are coming for our jobs. We're training them.",
  "In the future, AI will debug AI code. We can retire.",
  "Machine learning: teaching computers to make mistakes at scale.",
  "Big data: more data, more problems.",
  "The algorithm knows you better than you know yourself.",
  "Privacy: a thing we used to have.",
  "Terms and conditions: the longest book never read.",
  "Cookies: tracking you since 1994.",
  "Incognito mode: your ISP can still see you.",
  "VPN: Virtual Private Nothing.",
  "Encryption: math that makes governments nervous.",

  // End with some meta
  "You scrolled this far? The page still doesn't exist.",
  "404: Page not found. 200: Joke found.",
  "The real 404 was the friends we made along the way.",
  "This page has mass but no class.",
  "This page failed its unit tests.",
  "This page is deprecated.",
  "This page has been moved to /dev/null.",
  "This page is experiencing technical difficulties. The developers have been sacked.",
  "The page you are looking for is in another castle.",
  "Congratulations! You found the 404 page. There is no prize.",
]

export default function NotFound() {
  const [joke] = useState(() => jokes[Math.floor(Math.random() * jokes.length)])

  return (
    <main className="min-h-screen w-full bg-black flex flex-col items-center justify-center gap-8 px-4">
      <FuzzyText
        fontSize={120}
        fontWeight={900}
        color="#FE6515"
      >
        404
      </FuzzyText>

      <p className="text-white/70 text-center text-lg md:text-xl max-w-md font-mono" suppressHydrationWarning>
        {joke}
      </p>

      <Link
        href="/"
        className="mt-4 rounded-full border-2 border-white/20 bg-transparent px-8 py-3 text-white transition-all duration-[120ms] ease-out hover:border-[#FE6515] hover:text-[#FE6515] active:scale-95"
      >
        return home;
      </Link>
    </main>
  )
}
