'use client';

// importing packages & fonts & utility functions & functional components
import { useEffect, useState, useCallback } from 'react';
import { words } from '../../../public/pagedata';
import { Fredoka } from 'next/font/google';
import toast from 'react-hot-toast';
import PausedModal from './Paused';
import Keyboard from './Keyboard';
import { useGameContext } from '@/app/context';
import { InputBox, Key, Game, generateID, failToast, successToast, fredokaLight } from '@/app/context';
import UtilityButtons from './UtilityButtons';

const fredokaSemibold = Fredoka({ weight: '600', subsets: ['latin'] });

// this is the solution word, the word you're trying to guess, taken from an array found in /public/pagedata.tsx (only takes the most common 2500 words)
let finalWord = words[Math.floor(Math.random() * 2500)].toUpperCase();

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
    } = context;

    const [currentGame, setCurrentGame] = useState<Game>({ guess: guess, guesses: [''], finalWord: finalWord, stopwatch: stopwatchTime }); // this is a local variable, and stores all the current information about the game

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
            gamesPlayedJSON = [...removeDuplicates(gamesPlayedJSON)];
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
                for (let i = 0; i < guess - 1; i++) for (let j = (i + 1) * 5 - 5; j < (i + 1) * 5; j++) guesses[i] += inputs[j].text.toUpperCase();
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

        if (gameString != null) {
            try {
                const game: Game = JSON.parse(gameString) as Game;

                if (game !== null) {
                    setGamePaused(true);
                    setStopwatchTime(game.stopwatch);
                    finalWord = game.finalWord;

                    setInputs((prev: InputBox[]) => {
                        let tempInputs: InputBox[] = prev;

                        for (let i = 0; i < game.guesses.length; i++) {
                            for (let j = 0; j < game.guesses[i].length; j++) tempInputs[(i + 1) * 5 - 5 + j].text = game.guesses[i][j];

                            const result: string[] = gradeGuess(finalWord, game.guesses[i], tempInputs);
                            for (let j = 0; j < result.length; j++) {
                                let color: string = result[j];
                                tempInputs[(i + 1) * 5 - 5 + j].color = color;
                                tempInputs[(i + 1) * 5 - 5 + j].locked = true;
                                setKeyboard((prevKeyboard) => {
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

        if (isRunning) setGamePaused(false);
    }, [isRunning]);

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
            if (key.match(/[a-zA-Z]/) && key.length === 1 && index < 5 * guess && index < inputs.length && !inputs[index].locked && !gamePaused) {
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
            if ((index + 1) % 5 !== 0 && isRunning) {
                failToast('Needs to be 5 letters.');
                return boxes;
            } else if (guess > 6) return boxes;

            let word = '';
            for (let i = guess * 5 - 5; i < guess * 5; i++) word += boxes[i].text.toUpperCase(); // appends all guess letters to a string

            if (word.length < 5) return boxes;

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

                boxes[guess * 5 - 5 + i].color = result[i];
                boxes[guess * 5 - 5 + i].locked = true;
            }

            if (greenCount == 5) stopGame(true); // if all 5 letters are green, triggers stopGame() with true as a parameter (signifying game won)
            else if (guess == 6) stopGame(false); // if the last guess has been made, triggers stopGame() with false as a parameter (signifying game lost)

            setGuess((prev) => prev + 1); // increases guess by 1

            return boxes;
        },
        [guess, hardMode]
    );

    /*
        this function will grade a guess based on the finalWord (solution) and word (guess)
        parameters, making two passes over the guess word to first see if the guess is in the
        right place, then checking a second time with just the letters that aren't green, returns
        an array of 5 strings either with 'gray, 'yellow', or 'green'
    */
    const gradeGuess = (finalWord: string, word: string, boxes: InputBox[]): string[] => {
        const result: string[] = Array(5).fill('gray');
        const matched: boolean[] = Array(5).fill(false);

        for (let i = 0; i < 5; i++) {
            if (finalWord[i].toLowerCase() == word[i].toLowerCase()) {
                result[i] = 'green';
                matched[i] = true;
            }
        }

        for (let i = 0; i < 5; i++) {
            if (result[i].toLowerCase() != 'green') {
                for (let j = 0; j < 5; j++) {
                    if (!matched[j] && word[i].toLowerCase() == finalWord[j].toLowerCase()) {
                        result[i] = 'yellow';
                        matched[j] = true;
                        break;
                    }
                }
            }
        }

        return result;
    };

    /*
        this function will stop the game after it's been won or lost (or quit), adding the most recent
        game to local storage, stopping the timer, and locking all input boxes
    */
    const stopGame = useCallback(
        (won: boolean) => {
            const generatedID: string = generateID(Math.floor(Math.random() * 15) + 8);

            setInputs((prev: InputBox[]) => {
                let temp: InputBox[] = [...prev];

                setStopwatchTime((prevStopwatch) => {
                    setGamesPlayed((prev: Game[]) => {
                        const gamesPlayed: Game[] = [...prev];
                        let index = 0;
                        for (index = 0; index < temp.length; index++) {
                            if (temp[index].text == '') {
                                index -= 1;
                                break;
                            }
                        }
                        const currentGuess = Math.floor(index / 5) + 1 < 7 ? Math.floor(index / 5) + 1 : 6;

                        const newGame: Game = {
                            guess: currentGuess,
                            guesses: [],
                            finalWord: finalWord,
                            stopwatch: prevStopwatch,
                            won: won,
                            id: generatedID,
                            hardMode: hardMode,
                            sessionID: sessionStorage.getItem('sessionID'),
                        };
                        for (let i = 1; i < currentGuess; i++) {
                            let word = '';
                            for (let j = i * 5 - 5; j < i * 5; j++) {
                                word += temp[j].text.toLowerCase();
                            }
                            newGame.guesses.push(word);
                        }
                        gamesPlayed.push(newGame);

                        return gamesPlayed;
                    });

                    return prevStopwatch;
                });

                temp.forEach((input) => (input.locked = true));

                return temp;
            });
            setIsRunning(false);
            setIsOver(true);

            if (won) {
                successToast('Good job!');
            } else {
                failToast(`The word was ${finalWord.toUpperCase()}`);
            }

            if (gamesPlayed.length <= 3) toast('Press [ENTER] to start a new game.', { duration: 3000, position: 'bottom-right', className: `${fredokaLight.className}` });
        },
        [stopwatchTime, currentGame, hardMode]
    );

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
        finalWord = words[Math.floor(Math.random() * 2500)].toUpperCase();
    };

    function findKeyIndices(keyboardData: Key[][], targetKey: string): [number, number] | null {
        for (let r = 0; r < keyboardData.length; r++)
            for (let c = 0; c < keyboardData[r].length; c++) if (keyboardData[r][c].key.toLowerCase() == targetKey.toLowerCase()) return [r, c];

        return null;
    }

    const removeDuplicates = (games: Game[]): Game[] => {
        const seenIds = new Map<string | undefined, Game>();

        games.forEach((game) => {
            if (game.id && !seenIds.has(game.id)) seenIds.set(game.id, game);
            else if (!game.id) seenIds.set(undefined, game);
        });

        return Array.from(seenIds.values());
    };

    type ColorResult = {
        index: number;
        letter: string;
    };

    type YellowResult = {
        index: number;
        letter: string;
        used: boolean;
    };

    const hardModeGuessValid = useCallback(
        (boxes: InputBox[], word: string, guess: number): boolean => {
            if (guess === 1) return true;

            const knownGreen: ColorResult[] = [];
            let knownYellow: YellowResult[] = [];

            for (let r = 1; r < guess; r++) {
                let currentWord = '';
                for (let c = r * 5 - 5; c < r * 5; c++) currentWord += boxes[c].text.toLowerCase();
                let result: string[] = gradeGuess(finalWord, currentWord, boxes);
                for (let i = 0; i < result.length; i++)
                    if (result[i].toLowerCase() == 'green' && !knownGreen.some((result) => result.letter === currentWord[i])) knownGreen.push({ index: i, letter: currentWord[i] });
                    else if (
                        result[i].toLowerCase() == 'yellow' &&
                        !knownGreen.some((result) => result.letter === currentWord[i]) &&
                        !knownYellow.some((result) => result.letter === currentWord[i])
                    )
                        knownYellow.push({ index: i, letter: currentWord[i], used: false });
            }

            let gradedGuess = gradeGuess(finalWord, word, boxes);

            for (let i = 0; i < knownGreen.length; i++) {
                if (gradedGuess[knownGreen[i].index].toLowerCase() !== 'green') {
                    const suffixes = ['th', 'st', 'nd', 'rd'];
                    const value = (knownGreen[i].index + 1) % 100;

                    failToast(`${knownGreen[i].index + 1 + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])} letter must be ${knownGreen[i].letter.toUpperCase()}`);
                    return false;
                }
            }

            knownYellow = updateYellowResults(knownYellow, word);
            for (let i = 0; i < knownYellow.length; i++) {
                if (!knownYellow[i].used) {
                    failToast(`Guess must contain ${knownYellow[i].letter.toUpperCase()}`);
                    return false;
                }
            }

            return true;
        },
        [guess, isRunning]
    );

    const updateYellowResults = (yellowResults: YellowResult[], searchString: string): YellowResult[] => {
        return yellowResults.map((result) => ({
            ...result,
            used: searchString.toLowerCase().indexOf(result.letter) != -1,
        }));
    };

    const inputElement = useCallback(
        (input: InputBox) => {
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
                gamePaused && !isRunning && !isOver ? `blur opacity-15` : ''
            } w-16 h-16 max-mablet:w-14 max-mablet:h-14 rounded grid place-items-center border-2 select-none font-black text-4xl max-mablet:text-[2rem] ${color}`;

            return (
                <div key={input.id} className={className}>
                    {input.text}
                </div>
            );
        },
        [gamePaused, isRunning, isOver]
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => handleKeyPress(e);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyPress]);

    return (
        <div className='mt-3 flex flex-col justify-center items-center'>
            <UtilityButtons stopGame={stopGame} />
            <div className={`grid grid-cols-5 grid-rows-6 gap-1.5 justify-center mb-5`}>
                {gamePaused && !isRunning && !isOver && <PausedModal stopGame={stopGame} />}
                {inputs.map((input: InputBox) => inputElement(input))}
            </div>
            <Keyboard handleKeyPress={handleKeyPress} />
        </div>
    );
};

export default QuickleGame;
