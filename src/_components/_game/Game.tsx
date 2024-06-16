'use client';

// importing packages & fonts & utility functions & functional components
import { useEffect, useState, useCallback } from 'react';
import { Fredoka } from 'next/font/google';
import toast from 'react-hot-toast';
import PausedModal from './Paused';
import Keyboard from './Keyboard';
import { getGuessWords, getWords, useGameContext } from '@/app/context';
import { InputBox, Key, Game, generateID, failToast, successToast, fredokaLight, removeDuplicates } from '@/app/context';
import UtilityButtons from './UtilityButtons';

const fredokaSemibold = Fredoka({ weight: '600', subsets: ['latin'] });

const QuickleGame = () => {
    // accessing gameContext to use global variables (state) and their setters
    const context = useGameContext();
    if (context === undefined) throw new Error('useContext(GameContext) must be used within a GameContext.Provider'); // if an error has occurred, will throw an error (context can't be undefined, ever)
    // taking only the state that I need, leaving out some stuff that's not necessary
    const {
        isRunning,
        setIsRunning,
        gamePaused,
        setGamePaused,
        inputs,
        setInputs,
        setKeyboard,
        gamesPlayed,
        setGamesPlayed,
        setPrevGames,
        setModalOpened,
        setSettingsModalOpened,
        hardMode,
        isOver,
        setIsOver,
        stopwatchTime,
        setStopwatchTime,
        guess,
        setGuess,
        guessLength,
        setGuessLength,
        words,
        setWords,
        guessWords,
        setGuessWords,
        finalWord,
        setFinalWord,
        gameRunning,
    } = context;

    const [currentGame, setCurrentGame] = useState<Game>({ guess: guess, guesses: [''], finalWord: finalWord, stopwatch: stopwatchTime, guessLength: guessLength }); // this is a local variable, and stores all the current information about the game

    /* 
        this useEffect() runs whenever the state variable gamesPlayed is altered, which stores
        all the previous games played and makes sure that the localStorage is up to date
    */
    useEffect(() => {
        const gamesPlayedString = localStorage.getItem('gamesPlayed');

        // since localStorage key value pairs can only technically be strings, we have to parse the string and set its type to Game[] if it's not null
        let gamesPlayedJSON: Game[] = gamesPlayedString === null ? [] : (JSON.parse(gamesPlayedString) as Game[]);

        if (gamesPlayed.length > 0) {
            gamesPlayedJSON.push(gamesPlayed[gamesPlayed.length - 1]);
            gamesPlayedJSON = [...removeDuplicates(gamesPlayedJSON)]; // uses the assigned ID's on each Game in the gamesPlayedJSON array to remove any duplicate games
            setPrevGames(gamesPlayedJSON);
            localStorage.setItem('gamesPlayed', JSON.stringify(gamesPlayedJSON));
        }
    }, [gamesPlayed]);

    /*
        this useEffect() runs whenever the guess number is changed (once a guess has been made),
        and saves it to the currentGame and localStorage so that if the user leaves the tab then
        it will be saved
    */
    useEffect(() => {
        if (guess > 1 && isRunning) {
            setCurrentGame((game) => {
                game.stopwatch = stopwatchTime;
                game.finalWord = finalWord;
                game.guess = guess;

                const guesses: string[] = Array(guess - 1).fill('');
                for (let i = 0; i < guess - 1; i++) for (let j = (i + 1) * guessLength - guessLength; j < (i + 1) * guessLength; j++) guesses[i] += inputs[j].text.toUpperCase();
                game.guesses = guesses;

                localStorage.setItem('currentGame', JSON.stringify(game));
                return game;
            });
        }
    }, [guess]);

    /*
        this useEffect() runs when the program is launched, and checks if there's a currentGame
        in local storage. If there is, then it will set all of the game data from localStorage
        to the global variables, like keyboard, inputs, stopwatchTime, etc.
    */
    useEffect(() => {
        const gameString: string | null = localStorage.getItem('currentGame');
        const gamePlaying = gameString !== null && gameString !== 'null' && gameString !== undefined && gameString.length > 0;

        getWords(guessLength).then((res: string[]) => {
            setWords(res);
            getGuessWords(guessLength).then((response: string[]) => {
                setGuessWords(response);
                if (!gamePlaying) newWord(res, response);
            });
        });

        if (gamePlaying) {
            try {
                const game: Game = JSON.parse(gameString) as Game;

                if (game !== null) {
                    gameRunning.current = true;
                    let length = guessLength;
                    if (game.guessLength) {
                        length = game.guessLength;
                        setGuessLength(length);
                    }
                    setGamePaused(true);
                    setIsOver(false);
                    setIsRunning(false);
                    setStopwatchTime(game.stopwatch);
                    setFinalWord(game.finalWord);

                    setInputs((prev: InputBox[]) => {
                        let tempInputs: InputBox[] = prev;

                        for (let i = 0; i < game.guesses.length; i++) {
                            for (let j = 0; j < game.guesses[i].length; j++) tempInputs[(i + 1) * length - length + j].text = game.guesses[i][j];

                            const result: string[] = gradeGuess(game.finalWord, game.guesses[i], tempInputs);
                            for (let j = 0; j < result.length; j++) {
                                let color: string = result[j];
                                tempInputs[(i + 1) * length - length + j].color = color;
                                tempInputs[(i + 1) * length - length + j].locked = true;
                                setKeyboard((prevKeyboard: Key[][]) => {
                                    let tempKeyboard: Key[][] = prevKeyboard;
                                    const indices: [number, number] | null = findKeyIndices(tempKeyboard, game.guesses[i][j]);
                                    let currentColor: string = indices ? tempKeyboard[indices[0]][indices[1]].color.toLowerCase() : 'gray';

                                    if (indices && color.toLowerCase() == 'green') tempKeyboard[indices[0]][indices[1]].color = color;
                                    if (indices && color.toLowerCase() == 'yellow') tempKeyboard[indices[0]][indices[1]].color = currentColor != 'green' ? color : 'green';
                                    else if (indices && color.toLowerCase() == 'gray')
                                        tempKeyboard[indices[0]][indices[1]].color = currentColor != 'green' && currentColor != 'yellow' ? color : currentColor;

                                    return tempKeyboard;
                                });
                            }
                        }
                        console.log('testing');

                        return tempInputs;
                    });
                    setGuess(game.guess);
                }
            } catch (err) {}
        }
    }, []);

    /*
        this useEffect() runs whenever the global variable isRunning is changed, and if the game
        has been won or lost, then it will set the currentGame to blank, and the currentGame in
        localStorage to null, because the game is over. It also checks if the game is running, then
        the game needs to be paused otherwise the timer will continue to run
    */
    useEffect(() => {
        if (!isRunning && isOver) {
            setCurrentGame(() => {
                localStorage.setItem('currentGame', 'null');
                return { guess: 1, guesses: [''], finalWord: finalWord, stopwatch: '00:00:00.000' };
            });
        }

        if (isRunning) {
            setGamePaused(false);
            gameRunning.current = false;
        }
    }, [isRunning]);

    const newWord = (words: string[], guessWords: string[]) => {
        setFinalWord(() => {
            let word;
            while (true) {
                word = guessWords[Math.floor(Math.random() * guessWords.length)];
                if (words.indexOf(word.toLowerCase()) !== -1) {
                    break;
                }
            }
            return word;
        });
    };

    /*
        this function runs whenever a key is pressed, or whenever one of the key elements in
        Keyboard.tsx is pressed. It will then determine if the key is a letter (add it to guess),
        'enter' (submit guess or restart game), or 'backspace' (delete letter from guess). Only one
        of these things can happen, since the key can't be changed
    */
    const handleKeyPress = useCallback(
        (e: KeyboardEvent | string) => {
            let key: string = typeof e === 'object' ? e.key.toLowerCase() : typeof e === 'string' ? e.toLowerCase() : e; // turns the key into a string (could be a key event or a string, depending on the input)
            let index = 0;
            while (index < inputs.length && inputs[index].text !== '') index++; // finds the smallest index with an empty .text property (next index to add letter)

            if (key.toLowerCase() === 'enter') {
                // had an issue where the modals would close when 'enter' was pressed, so this fixed the issue (setting state to itself before its able to change)
                setModalOpened((prev) => prev);
                setSettingsModalOpened((prev) => prev);
                // if the game is running, then it will submit the current guess to handleReturn

                if (isRunning && !gamePaused) {
                    const newInputs: InputBox[] = handleReturn(inputs, index - 1, guess);
                    setInputs(newInputs);
                    return;
                    // if the game has been won or lost, then pressing enter will reset the game
                } else if (isOver) restartGame();
            }

            // will check if the key is a letter, check that the key's length is one (letter), checks that the index is valid, checks that the index isn't locked, and checks that the game isn't paused
            if (key.match(/[a-zA-Z]/) && key.length === 1 && index < guessLength * guess && index < inputs.length && !inputs[index].locked && !gamePaused) {
                setInputs((prev) => {
                    let tempInputs: InputBox[] = [...prev];
                    tempInputs[index].text = key.toUpperCase(); // adds letter to boxes
                    tempInputs[index].color = 'selected'; // changes the color and animates the selected box
                    setIsRunning(true); // makes sure that the game is running
                    return tempInputs;
                });
                // checks if the key is 'backspace', then checks that the index is valid and the game isn't paused
            } else if (key.toLowerCase() === 'backspace' && !inputs[index > 0 ? index - 1 : 0].locked && !gamePaused) {
                setInputs((prev) => {
                    let tempInputs: InputBox[] = [...prev];
                    // use of ternaries to check the index is valid, and delete whatever letter was there
                    tempInputs[index > 0 ? index - 1 : 0].text = '';
                    tempInputs[index > 0 ? index - 1 : 0].color = 'none';
                    return tempInputs;
                });
            }
        },
        [inputs, guess, isRunning]
    );

    /* 
        this function will run only when it's called in the handleKeyPress function, when the 'enter'
        key has been pressed. this function will take in the current input boxes, the current index,
        and the current guess number, then return the updated input boxes which is set in the handleKeyPress
        function.
    */
    const handleReturn = useCallback(
        (boxes: InputBox[], index: number, guess: number): InputBox[] => {
            // sends a fail toast if the guess isn't 5 letters
            if ((index + 1) % guessLength !== 0 && isRunning) {
                failToast(`Needs to be ${guessLength} letters.`);
                return boxes;
            } else if (guess > 6) return boxes;

            let word = '';
            for (let i = guess * guessLength - guessLength; i < guess * guessLength; i++) word += boxes[i].text.toUpperCase(); // appends all guess letters to a string

            if (word.length < guessLength) return boxes;

            // if the word isn't found in the array of potential words, sends a fail toast
            if (words.indexOf(word.toLowerCase()) == -1) {
                failToast('Unknown word.');
                return boxes;
            }

            // checks if it's hard mode, and if it's not valid for hard mode, then it will stop the function and send a failtoast; otherwise, will continue and grade the guess
            if (hardMode && !hardModeGuessValid(boxes, word, guess)) return boxes;

            // uses the gradeGuess helper function to return an array of strings, either 'green', 'yellow', or 'gray' depending on its score in relation to the final word.
            const result: string[] = gradeGuess(finalWord, word, boxes);

            // changes the color of the keys in the keyboard
            setKeyboard((prev: Key[][]) => {
                let tempKeyboard: Key[][] = [...prev];
                for (let i = 0; i < result.length; i++) {
                    let color: string = result[i];
                    const indices: [number, number] | null = findKeyIndices(tempKeyboard, word[i]); // uses helper function to find indices of 2d keyboard array
                    let currentColor: string = indices ? tempKeyboard[indices[0]][indices[1]].color.toLowerCase() : 'gray';

                    if (indices && color.toLowerCase() == 'green') tempKeyboard[indices[0]][indices[1]].color = color;
                    if (indices && color.toLowerCase() == 'yellow') tempKeyboard[indices[0]][indices[1]].color = currentColor != 'green' ? color : 'green';
                    else if (indices && color.toLowerCase() == 'gray')
                        tempKeyboard[indices[0]][indices[1]].color = currentColor != 'green' && currentColor != 'yellow' ? color : currentColor;
                }

                return tempKeyboard;
            });

            // iterates through the result array again, checking how many green guesses there are and locking the guess so you can't write on it again
            let greenCount = 0;
            for (let i = 0; i < result.length; i++) {
                if (result[i].toLowerCase() == 'green') greenCount++;

                boxes[guess * guessLength - guessLength + i].color = result[i];
                boxes[guess * guessLength - guessLength + i].locked = true;
            }

            if (greenCount == guessLength) stopGame(true); // if all 5 letters are green, triggers stopGame() with true as a parameter (signifying game won)
            else if (guess == 6) stopGame(false); // if the last guess has been made, triggers stopGame() with false as a parameter (signifying game lost)

            setGuess((prev) => prev + 1); // increases guess by 1

            return boxes;
        },
        [guess, hardMode, words, finalWord]
    );

    /*
        this function will grade a guess based on the finalWord (solution) and word (guess)
        parameters, making two passes over the guess word to first see if the guess is in the
        right place, then checking a second time with just the letters that aren't green, returns
        an array of 5 strings either with 'gray, 'yellow', or 'green'
    */
    const gradeGuess = useCallback(
        (finalWord: string, word: string, boxes: InputBox[]): string[] => {
            const result: string[] = Array(guessLength).fill('gray');
            const matched: boolean[] = Array(guessLength).fill(false);

            for (let i = 0; i < guessLength; i++) {
                if (finalWord[i].toLowerCase() == word[i].toLowerCase()) {
                    result[i] = 'green';
                    matched[i] = true;
                }
            }

            for (let i = 0; i < guessLength; i++) {
                if (result[i].toLowerCase() != 'green') {
                    for (let j = 0; j < guessLength; j++) {
                        if (!matched[j] && word[i].toLowerCase() == finalWord[j].toLowerCase()) {
                            result[i] = 'yellow';
                            matched[j] = true;
                            break;
                        }
                    }
                }
            }

            return result;
        },
        [finalWord]
    );

    /*
        this function will stop the game after it's been won or lost (or quit), adding the most recent
        game to local storage, stopping the timer, and locking all input boxes, etc.
    */
    const stopGame = useCallback(
        (won: boolean) => {
            // generates a random ID which will be used in Statistics.tsx to check that the game added doesn't appear twice in the stats.
            const generatedID: string = generateID(Math.floor(Math.random() * 15) + 8);

            setInputs((prev: InputBox[]) => {
                let temp: InputBox[] = [...prev];

                setStopwatchTime((prevStopwatch) => {
                    // needs most recent stopwatchTime, won't work if it's accessed regularly
                    setGamesPlayed((prev: Game[]) => {
                        const gamesPlayed: Game[] = [...prev];
                        // finding the current guess using the most recent blank index
                        let index = 0;
                        for (index = 0; index < temp.length; index++) {
                            if (temp[index].text == '') {
                                index -= 1;
                                break;
                            }
                        }
                        const currentGuess = Math.floor(index / guessLength) + 1 < 7 ? Math.floor(index / guessLength) + 1 : 6; // finds the guess that the game ended on

                        const newGame: Game = {
                            // member to be added to gamesPlayed array (takes all information from the current game played)
                            guess: currentGuess, // calculated above
                            guesses: [], // to be added to in for loop below
                            finalWord: finalWord,
                            stopwatch: prevStopwatch,
                            won: won, // takes from parameter
                            id: generatedID, // uses generatedID above, is unique to every function call
                            hardMode: hardMode, // identifies if the game was completed in hardMode
                            sessionID: sessionStorage.getItem('sessionID'), // takes the current sessionID, is used later in Statistics.tsx
                            guessLength: guessLength,
                        };

                        for (let i = 1; i < currentGuess; i++) {
                            // appends the guesses in the input boxes to the 'guesses' array property above
                            let word = '';
                            for (let j = i * guessLength - guessLength; j < i * guessLength; j++) {
                                word += temp[j].text.toLowerCase();
                            }
                            newGame.guesses.push(word);
                        }
                        gamesPlayed.push(newGame);

                        return gamesPlayed;
                    });

                    return prevStopwatch;
                });

                temp.forEach((input) => (input.locked = true)); // locks every input box so that it can't be typed on

                return temp;
            });
            setIsRunning(false); // makes sure the game isn't running
            setIsOver(true); // sets the game to be over (either won or lost)

            if (won) {
                successToast('Good job!'); // displays toast at top of screen saying that you won
            } else {
                failToast(`The word was ${finalWord.toUpperCase()}`); // displays toast at top of screen saying you lost, and what the solution was
            }

            //for the first 3 games played, the game will display a toast describing how to start a new game
            if (gamesPlayed.length <= 3) toast('Press [ENTER] to start a new game.', { duration: 3000, position: 'bottom-right', className: `${fredokaLight.className}` });
        },
        [stopwatchTime, currentGame, hardMode, guessLength]
    );

    /* 
        this function is different from the stopGame() function, this resets all of the current game
        data, resetting all of the input boxes, the keyboard, the stopwatch time, the current guess,
        the status of the game, and resetting the solution for a new game to be played
        => this function is triggered by clicking 'enter' when the game has either been won or lost
    */
    const restartGame = () => {
        setInputs((prev: InputBox[]) => {
            let tempInputs: InputBox[] = prev;
            tempInputs.forEach((input) => {
                input.color = 'none';
                input.locked = false;
                input.text = '';
            });
            localStorage.setItem('currentGame', 'null');
            return tempInputs;
        });
        setKeyboard((prev) => {
            let tempKeyboard = prev;
            for (let r = 0; r < tempKeyboard.length; r++) for (let c = 0; c < tempKeyboard[r].length; c++) tempKeyboard[r][c].color = 'none';

            return tempKeyboard;
        });
        setGuess(1);
        setStopwatchTime('00:00:00.000');
        setGamePaused(false);
        gameRunning.current = false;
        newWord(words, guessWords);
    };

    /*
        this is a helper function, but appears in this file and not context.tsx because it is used locally
        to find the indices of a letter in the 2D keyboard state array, then returns either an array of two
        numbers (the indices), or null if the letter doesn't exist.  
    */
    function findKeyIndices(keyboardData: Key[][], targetKey: string): [number, number] | null {
        for (let r = 0; r < keyboardData.length; r++)
            for (let c = 0; c < keyboardData[r].length; c++) if (keyboardData[r][c].key.toLowerCase() == targetKey.toLowerCase()) return [r, c];

        return null;
    }

    // these types are declared inline because they have one sole purpose in the hardModeGuessValid() function
    type ColorResult = {
        index: number;
        letter: string;
    };

    type YellowResult = {
        index: number;
        letter: string;
        used: boolean;
    };

    /* 
        this function is exclusive to users playing with 'hard mode' on, and will check if the guess that was
        just made works with the hard mode requirements (uses all hints received in the guess). if the guess is
        valid, then it will return true, otherrwise it will return false and display a toast saying what letter you
        need to include in your guess
    */
    const hardModeGuessValid = useCallback(
        (boxes: InputBox[], word: string, guess: number): boolean => {
            if (guess === 1) return true; // checks that a guess has been made

            const knownGreen: ColorResult[] = []; // will hold all of the 'green' letters (all correct letters with known position)
            let knownYellow: YellowResult[] = []; // will hold all of the 'yellow' letters (all correct letters in the wrong position)

            for (let r = 1; r < guess; r++) {
                // will iterate through all the current guesses made
                let currentWord = ''; // current word we're looking at, added to in for loop below
                for (let c = r * guessLength - guessLength; c < r * guessLength; c++) currentWord += boxes[c].text.toLowerCase();
                let result: string[] = gradeGuess(finalWord, currentWord, boxes); // grades the current guess we're looking at for this instance of the for loop

                // this for loop will look at the graded guess for this for loop, adding it to either the knownGreen or knownYellow arrays if it doesn't already exist in tehre
                for (let i = 0; i < result.length; i++)
                    if (result[i].toLowerCase() == 'green' && !knownGreen.some((result) => result.letter === currentWord[i])) knownGreen.push({ index: i, letter: currentWord[i] });
                    else if (
                        result[i].toLowerCase() == 'yellow' &&
                        !knownGreen.some((result) => result.letter === currentWord[i]) &&
                        !knownYellow.some((result) => result.letter === currentWord[i])
                    )
                        knownYellow.push({ index: i, letter: currentWord[i], used: false });
            }

            let gradedGuess = gradeGuess(finalWord, word, boxes); // grades the actual current guess

            for (let i = 0; i < knownGreen.length; i++) {
                // iterates through all of the known green letters
                if (gradedGuess[knownGreen[i].index].toLowerCase() !== 'green') {
                    // if the green letter isn't used, fulfills this if statement
                    // handles the logic for the ordinal number that will be used in the toast (1st, 2nd, 3rd, etc.)
                    const suffixes = ['th', 'st', 'nd', 'rd'];
                    const value = (knownGreen[i].index + 1) % 100;

                    failToast(`${knownGreen[i].index + 1 + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])} letter must be ${knownGreen[i].letter.toUpperCase()}`);
                    return false;
                }
            }

            knownYellow = updateYellowResults(knownYellow, word); // uses utility function to update the knownYellow array 'used' property
            for (let i = 0; i < knownYellow.length; i++) {
                // iterates through all the known yellow letters
                if (!knownYellow[i].used) {
                    // if a yellow letter isn't used in the guess, displays a toast
                    failToast(`Guess must contain ${knownYellow[i].letter.toUpperCase()}`);
                    return false;
                }
            }

            return true; // if all requirements have been met, will return true signifying that the guess is valid and can be graded
        },
        [guess, isRunning]
    );

    /* 
        utility function used above to update the knownYellow array and change the used property to be 
        true if the letters in the knownYellow array are used in the current guess
    */
    const updateYellowResults = (yellowResults: YellowResult[], searchString: string): YellowResult[] => {
        return yellowResults.map((result) => ({
            ...result,
            used: searchString.toLowerCase().indexOf(result.letter) != -1,
        }));
    };

    /* 
        this is a functional component, which will return a div with correct classNames for each
        of the input boxes. this function is used in the array.map() in the return statement at the
        bottom of the file, and takes in the current input box to determine its color, animation status,
        whether it's blurred or not, etc.
    */
    const inputElement = useCallback(
        (input: InputBox) => {
            // determines the color based on the input property and handles the animation by changing every time the state is updated
            const color =
                input.color === 'green'
                    ? 'border-[#6aaa64] bg-[#6aaa64] text-white transition-colors duration-[75ms]'
                    : input.color === 'yellow'
                    ? 'border-[#c9b458] bg-[#c9b458] text-white transition-colors duration-[75ms]'
                    : input.color === 'gray'
                    ? 'border-[#787c7e] bg-[#787c7e] text-white transition-colors duration-[75ms]'
                    : input.color === 'none'
                    ? 'border-[#d3d6da] bg-white text-black dark:bg-gray-700 dark:border-gray-600'
                    : input.color === 'selected'
                    ? 'border-[#878a8c] bg-white text-black dark:bg-gray-700 dark:border-gray-500 dark:text-foreground animate-pop'
                    : 'border-[#d3d6da] bg-white text-black dark:bg-gray-700 dark:border-gray-600';
            const className = `${fredokaSemibold.className} ${
                gamePaused && !isRunning && !isOver ? `blur opacity-15` : '' // blurs the input box if the game is paused
            } ${
                guessLength > 5 ? 'max-tobile:w-14 max-tobile:h-14 max-mablet:h-12 max-mablet:w-12 max-mobile:w-11 max-mobile:h-11' : ''
            } w-16 h-16 max-mablet:w-14 max-mablet:h-14 rounded grid place-items-center border-2 select-none font-black text-4xl max-mablet:text-[2rem] ${color}`;

            return (
                <div key={input.id} className={className}>
                    {input.text}
                </div>
            );
        },
        [gamePaused, isRunning, isOver]
    );

    /* 
        this useEffect() handles the logic for the pressing of any key, and will trigger
        the handleKeyPress() function by passing in the current key pressed information. 
        the event listeners work a little weird in nextjs, you have to remove them and add
        them in the same useEffect
    */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => handleKeyPress(e);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyPress]);

    const colClasses = ['grid-cols-3', 'grid-cols-4', 'grid-cols-5', 'grid-cols-6', 'grid-cols-7'];
    // this is the actual functional component returned, and is very tiny because the various elements are split into different functional components in various files
    return (
        <div className='mt-3 flex flex-col justify-center items-center'>
            <UtilityButtons stopGame={stopGame} /> {/* calls the UtilityButtons functional component, passing in the stopGame array because it doesn't have access to it */}
            <div className={`grid ${colClasses[guessLength - 3]} grid-rows-6 gap-1.5 justify-center mb-5`}>
                {gamePaused && !isRunning && !isOver && <PausedModal stopGame={stopGame} />}{' '}
                {/* if the game has been paused, calls the PausedModal functional component from Paused.tsx */}
                {inputs.map((input: InputBox) => inputElement(input))} {/* uses the inputElement() functional component to render each input box */}
            </div>
            <Keyboard handleKeyPress={handleKeyPress} /> {/* calls the Keyboard functional component, passing in the handleKeyPress function to handle when a key is pressed */}
        </div>
    );
};

export default QuickleGame;
