'use client';

import { useEffect, useState, useCallback } from 'react';
import { words } from '../../../public/pagedata';
import { Fredoka, Nunito } from 'next/font/google';
import toast from 'react-hot-toast';
import PausedModal from './Paused';
import Keyboard from './Keyboard';
import { useGameContext } from '@/app/context';
import { InputBox, Key, Game, generateID, failToast, successToast, fredokaLight } from '@/app/context';
import UtilityButtons from './UtilityButtons';

const fredokaSemibold = Fredoka({ weight: '600', subsets: ['latin'] });

let finalWord = words[Math.floor(Math.random() * 2500)].toUpperCase();

const QuickleGame = () => {
    const context = useGameContext();
    if (context === undefined) throw new Error('useContext(GameContext) must be used within a GameContext.Provider');
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
        stopwatchVisible,
        setStopwatchVisible,
        setSettingsModalOpened,
        hardMode,
        isOver,
        setIsOver,
        stopwatchTime,
        setStopwatchTime,
        guess,
        setGuess,
    } = context;

    const [currentGame, setCurrentGame] = useState<Game>({ guess: guess, guesses: [''], finalWord: finalWord, stopwatch: stopwatchTime });

    useEffect(() => {
        const gamesPlayedString = localStorage.getItem('gamesPlayed');

        let gamesPlayedJSON: Game[] = gamesPlayedString === null ? [] : (JSON.parse(gamesPlayedString) as Game[]);

        if (gamesPlayed.length > 0) {
            gamesPlayedJSON.push(gamesPlayed[gamesPlayed.length - 1]);
            gamesPlayedJSON = [...removeDuplicates(gamesPlayedJSON)];
            setPrevGames(gamesPlayedJSON);
            localStorage.setItem('gamesPlayed', JSON.stringify(gamesPlayedJSON));
        }
    }, [gamesPlayed]);

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

    useEffect(() => {
        if (!isRunning && isOver) {
            setCurrentGame(() => {
                localStorage.setItem('currentGame', 'null');
                return { guess: 1, guesses: [''], finalWord: finalWord, stopwatch: '00:00:00.000' };
            });
        }

        if (isRunning) setGamePaused(false);
    }, [isRunning]);

    const handleKeyPress = useCallback(
        (e: KeyboardEvent | string) => {
            let index = 0;
            let key: string = typeof e === 'object' ? e.key.toLowerCase() : typeof e === 'string' ? e.toLowerCase() : e;
            while (index < inputs.length && inputs[index].text !== '') index++;

            if (key.toLowerCase() === 'enter') {
                setModalOpened((prev) => prev);
                setSettingsModalOpened((prev) => prev);
                if (isRunning && !gamePaused) {
                    const newInputs: InputBox[] = handleReturn(inputs, index - 1, guess);
                    setInputs(newInputs);
                    return;
                } else if (isOver) restartGame();
            }

            if (key.match(/[a-zA-Z]/) && key.length === 1 && index < 5 * guess && index < inputs.length && !inputs[index].locked && !gamePaused) {
                setInputs((prev) => {
                    let tempInputs: InputBox[] = [...prev];
                    tempInputs[index].text = key.toUpperCase();
                    tempInputs[index].color = 'selected';
                    setIsRunning(true);
                    return tempInputs;
                });
            } else if (key.toLowerCase() === 'backspace' && !inputs[index > 0 ? index - 1 : 0].locked && !gamePaused) {
                setInputs((prev) => {
                    let tempInputs: InputBox[] = [...prev];
                    tempInputs[index > 0 ? index - 1 : 0].text = '';
                    tempInputs[index > 0 ? index - 1 : 0].color = 'none';
                    return tempInputs;
                });
            }
        },
        [inputs, guess, isRunning]
    );

    const handleReturn = useCallback(
        (boxes: InputBox[], index: number, guess: number): InputBox[] => {
            if ((index + 1) % 5 !== 0 && isRunning) {
                failToast('Needs to be 5 letters.');
                return boxes;
            } else if (guess > 6) return boxes;

            let word = '';
            for (let i = guess * 5 - 5; i < guess * 5; i++) word += boxes[i].text.toUpperCase();

            if (word.length < 5) return boxes;

            if (words.indexOf(word.toLowerCase()) == -1) {
                failToast('Unknown word.');
                return boxes;
            }

            if (hardMode && !hardModeGuessValid(boxes, word, guess)) return boxes;

            const result: string[] = gradeGuess(finalWord, word, boxes);

            setKeyboard((prev: Key[][]) => {
                let tempKeyboard: Key[][] = [...prev];
                for (let i = 0; i < result.length; i++) {
                    let color: string = result[i];
                    const indices: [number, number] | null = findKeyIndices(tempKeyboard, word[i]);
                    let currentColor: string = indices ? tempKeyboard[indices[0]][indices[1]].color.toLowerCase() : 'gray';

                    if (indices && color.toLowerCase() == 'green') tempKeyboard[indices[0]][indices[1]].color = color;
                    if (indices && color.toLowerCase() == 'yellow') tempKeyboard[indices[0]][indices[1]].color = currentColor != 'green' ? color : 'green';
                    else if (indices && color.toLowerCase() == 'gray')
                        tempKeyboard[indices[0]][indices[1]].color = currentColor != 'green' && currentColor != 'yellow' ? color : currentColor;
                }

                return tempKeyboard;
            });

            let greenCount = 0;
            for (let i = 0; i < result.length; i++) {
                if (result[i].toLowerCase() == 'green') greenCount++;

                boxes[guess * 5 - 5 + i].color = result[i];
                boxes[guess * 5 - 5 + i].locked = true;
            }

            if (greenCount == 5) stopGame(true);
            else if (guess == 6) stopGame(false);

            setGuess((prev) => prev + 1);

            return boxes;
        },
        [guess, hardMode]
    );

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
