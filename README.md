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

