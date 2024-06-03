# Welcome to Quickle!

This is a [Next.js](https://nextjs.org/) project which simulates the real Wordle game, only you can play it infinitely and get in-depth insights to your statistics!

## Packages & Technologies
Packages:
- [tailwindcss](https://tailwindcss.com/) - a CSS framework packed with utility classes that make designing highly efficient without the need for a separate CSS file
- [lucide-react](https://lucide.dev/) - a package with 1400+ beautiful, customizable, and lightweight icons perfect for development
- [shadcn-ui](https://ui.shadcn.com/) - a Next.js component library with boilerplate components that can be tailored to fit exactly my needs
- [framer-motion](https://www.framer.com/motion/) - an animation library that makes beautiful animations easy

Stack Technologies:
- [Next.js](https://nextjs.org/) - the best & most efficient [React](https://react.dev/) framework used for high-quality web applications and trivial development
- [typescript](https://www.typescriptlang.org/) - a strongly typed programming language built upon JavaScript, making it easy to catch errors and debug

## How to Play
First, visit the [live quickle game](https://quickle.vercel.app/) at [https://quickle.vercel.app/](https://quickle.vercel.app/)
Upon visiting the site, you will see a game that is similar to the real Wordle website, though there are some changes.
So, lets start from the top down.

### Navbar
The navbar, source code found at `src/_components/Navbar.tsx`, contains the **statistics** icon, "quickle" header, and **settings** icon, keeping track of all of the modal (pop up) logic involved.

**Statistics**

The statistics, source code found at `src/_components/_statistics/Statistics.tsx`, retrieve all of the games ever played on that browser from [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), then formats the data into a presentable manner, displaying insights about all the games that you've played. You can filter these statistics (selection at bottom of popup, found at `src/_components/_statistics/ShownSliders.tsx`) from either the entire list of games played (total), the regular mode games played (regular), the hard mode games played (hard), or the games played in that current session (session).

**Settings**

The settings, the source code found at `src/_components/_settings/Settings.tsx`, display some variations on the appearance of the game, or how it's played by clicking on the statistics icon in the navbar. The first option is **Dark Mode**, which is pretty self-explanatory, flip the switch to toggle dark mode. Your theme preference will too be saved in localStorage, meaning even if you leave the site, it will maintain your preferences. The other option is **Hard Mode**, which makes the Wordle game more difficult by forcing you to use all hints received in prior guesses.

### The Game
In case you're not familiar, Wordle is a word puzzle that has one 5-letter solution, and you are permitted 6 attempts to guess that solution. After each guess, you receive a grade on each letter of your guess as follows:

- **gray** - the letter is not in the final solution
- **yellow** - the letter is in the final solution, but not in the correct location
- **green** - the letter is in the final solution in the correct location

If you get green on all 5 letters, then you win, but if you aren't able to do so within 6 guesses, you lose.
Here's a breakdown of all the components below the Navbar. 

**Timer & Utility Buttons**

Right below the navbar, you will initially see 5 elements, found in `src/_components/_game/Game.tsx`:
- **X Icon** - when clicked, will quit the current game (if there is one running), resulting in a loss and damage to your statistics.
- **Eye Icon** - when clicked, will hide the timer if it's too distracting or stressful, shifting the other icons to adjust the layout.
- **The Timer** - this timer will begin when the first key is pressed, and will end either when the game is won or lost, saving it to your statistics. Click the timer to copy your current time.
- **Pause Icon** - when clicked, will pause the current game (if there is one running), blurring the current game and removing hints from the keyboard. From this menu, you may either restart the game (ending in a loss), or continue the game. While paused, the timer stops running and your current progress is saved if you exit the tab (code found in `src/_components/_game/Paused.tsx`)
- **Restart Icon** - if there have been no guesses made but the timer has started, when clicked, will reset the timer, effectively restarting the game without resulting in loss or affecting stats.

**Guess Grid**

Underneath the timer & utility buttons is the game grid, found in `src/_components/_game/Game.tsx` will take input either from a real keyboard or the digital keyboard below

**Keyboard**

Underneath the game grid is the keyboard, found in `src/_components/_game/Keyboard.tsx` which can be used in place of an actual keyboard, each key changing colors depending on how close it is to the solution. Once a game has been won or lost, press either the *ENTER* button on the digital keyboard or *ENTER* on your actual keyboard to reset the guess grid and timer.

## APCSA Project Rubric
Here are some clarifications on what I implemented in my project to fulfill the project requirements. Please keep these notes in mind when grading.

### Control Structures
**Description** - I can use control structures to direct program flow, creating branching paths and repeating code segments.

**My Control Structures** 

In my project, I have over a hundred if statements, for loops, array.map()'s, ternaries, and other control structures embedded in my project. In `src/_components/_game/Game.tsx` alone, I have 25+ for loops, forEach() loops, and while loops. The most efficient control structure that I use throughout my project is the array.map(), which lets me create an HTML element for each item in an array, so I can map, say, an array of objects with different properties to create new elements for different pieces of data.

One example of this can be found in `src/_components/_game/Keyboard.tsx`, where I have a nested array.map(), which displays all of the keys in the keyboard without me having to write code for every single key. Instead, I use a functional component called `keyboardElement`, which takes in a string and returns a `<div>` which has all of the necessary classes, onClicks, etc.

### Classes and Objects
**Description** - I can write classes and instantiate objects for reusability and scalability of code for large programs, and to encapsulate information for collaborative development.

**My Classes & Objects**

Although there are no "classes" in typescript, I used objects a lot for more readable & reusable code, in addition to less chance of errors. Examples of this can be found in `src/app/context.tsx`, where I declare various `type`s, which essentially say exactly what properties an object of that `type` can have. You can see my declared types in that file (look for `export type`), which can be imported in *any* other file, making these objects reusable.

### Inheritance
**Description** - I can utilize inheritance in program code in order to simplify program structure, reuse code, and add flexibility to instantiated objects.

**My Inheritance** 

Beginning in the root file, `src/app/context.tsx`, I declare all of my state, or global variables, which are then exported using what's called context, using `GameContext.Provider`, for any file in this project to call and use. For example, in `src/_components/Navbar.tsx`, I have these lines of code:

```
const context = useGameContext();
if (context === undefined) throw new Error('useContext(GameContext) must be used within a GameContext.Provider');
const { modalOpened, setModalOpened, setGamePaused, settingsModalOpened, setSettingsModalOpened } = context;
```

Here, I am using the exported function `useGameContext()` to access all the global variables coming from `src/app/context.tsx`, then checking that the context actually exists, and finally I exported only the state variables that I want to use in that file from the context.

Another instance of my inheritance in this project is in `src/_components/_game/Game.tsx`, which is a massive file boasting 500+ lines of code. To condense this, I created 3 branching files of the `Game.tsx` file, namely `Keyboard.tsx`, `UtilityButtons.tsx`, and `Paused.tsx`, which lighten the burden on the one `Game.tsx` file by breaking up each part into different files.

Further, I have a couple helper functions in context.tsx, like `generateID`, `failToast`, `successToast`, `parseTime`, `formatTime`, `removeDuplicates`. All of these functions are exported from context.tsx, and all the children of the `GameContext` provider can import these functions and use them without having to rewrite code.

### Documentation with Comments
**Description** - I can document changes to program structure and list descriptors for other developers to analyze and adjust my written code.

**My Documentation**

A lot of my documentation is in this README.md file, which explains how the project works. To see the documentation for my actual code, follow this order of files for easiest grading (from parent to children, these are the files which hold 99% of the logic):

1. `src/app/context.tsx`
2. `src/app/page.tsx`
3. `src/_components/_game/Game.tsx`
4. `src/_components/_game/UtilityButtons.tsx`
5. `src/_components/_game/Keyboard.tsx`
6. `src/_components/_game/Paused.tsx`
7. `src/_components/Navbar.tsx`
8. `src/_components/_settings/Settings.tsx`
9. `src/_components/_statistics/ShownSliders.tsx`
10. `src/_components/_statistics/Statistics.tsx`

### User Interactability
**Description** - I can create programs that are designed with the user in mind. My programs add to the human experience by providing entertainment or education, account for human error, and perform tasks on behalf of humans.

**My User Interactability**

My program has been designed and programmed with a simple aesthetic with not too many colors, mostly just black and white to suit the "blank canvas" feel, where users can choose to play this game in their own way. I've used a rounded font, which is more modern and has been proved to be much more inviting and easy-to-read than many other serif fonts. There are many different ways to play this game, and each of the ways are very accessible. For example, if you're a person that wants to get the quickest times, then you can put the game on easy mode and have the timer visible. But, if you're someone that likes to take their time and get the least number of guesses, you can switch the game to hard mode to ensure you get it in the least number of guesses, and you can also toggle the timer if it stresses you out. 

Further, Quickle calculates your average times, win percentage, streak, etc., so the user doesn't have to do it themselves.

Even if the user accidentally closes the tab during a game, the current progress on that game is saved, which accounts for some human error. 


