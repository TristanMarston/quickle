'use client';

import { useEffect, useState, useCallback } from 'react';
import { keyboardData, words } from '../../public/pagedata';
import { Delete, RotateCcw, X } from 'lucide-react';
import { Fredoka, Nunito } from 'next/font/google';
import toast from 'react-hot-toast';

const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });
const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });
const nunitoLight = Nunito({ weight: '500', subsets: ['latin'] });

type InputBox = {
    id: number;
    text: string;
    locked: boolean;
    color: string;
};

type Key = {
    key: string;
    color: string;
    class?: string;
};

let finalWord = words[Math.floor(Math.random() * 2500)].toUpperCase();
// const finalWord = 'going';
console.log(finalWord);

const Game = () => {
    const [inputs, setInputs] = useState<InputBox[]>(() => {
        const newInputs: InputBox[] = [];
        for (let i = 0; i < 30; i++) newInputs[i] = { id: i, text: '', locked: false, color: 'none' };
        return newInputs;
    });
    const [guess, setGuess] = useState(1);
    const [keyboard, setKeyboard] = useState<Key[][]>(keyboardData);
    const [isRunning, setIsRunning] = useState(false);
    const [stopwatchTime, setStopwatchTime] = useState<string>('00:00:00.000');
    let elapsedTime = 0;

    const handleKeyPress = useCallback(
        (e: KeyboardEvent | string) => {
            let index = 0;
            let key: string = typeof e === 'object' ? e.key.toLowerCase() : typeof e === 'string' ? e.toLowerCase() : e;
            while (index < inputs.length && inputs[index].text !== '') index++;

            if (key.toLowerCase() === 'enter') {
                if (isRunning) {
                    const newInputs: InputBox[] = handleReturn(inputs, index - 1);
                    setInputs(newInputs);
                    return;
                } else restartGame();
            }

            if (key.match(/[a-zA-Z]/) && key.length === 1 && index < 5 * guess && index < inputs.length && !inputs[index].locked) {
                setInputs((prev) => {
                    let tempInputs: InputBox[] = [...prev];
                    tempInputs[index].text = key.toUpperCase();
                    tempInputs[index].color = 'selected';
                    if (index == 0) setIsRunning(true);
                    return tempInputs;
                });
            } else if (key.toLowerCase() === 'backspace' && !inputs[index > 0 ? index - 1 : 0].locked) {
                setInputs((prev) => {
                    let tempInputs: InputBox[] = [...prev];
                    tempInputs[index > 0 ? index - 1 : 0].text = '';
                    tempInputs[index > 0 ? index - 1 : 0].color = 'none';
                    return tempInputs;
                });
            }
        },
        [inputs, guess]
    );

    const handleReturn = useCallback(
        (boxes: InputBox[], index: number): InputBox[] => {
            if ((index + 1) % 5 !== 0 && isRunning) {
                failToast('Needs to be 5 letters.');
                return boxes;
            } else if (guess > 6) return boxes;

            let word = '';
            for (let i = guess * 5 - 5; i < guess * 5; i++) word += boxes[i].text.toUpperCase();

            if (words.indexOf(word.toLowerCase()) == -1) {
                failToast('Unknown word.');
                return boxes;
            }

            setKeyboard((prev: Key[][]) => {
                let tempKeyboard: Key[][] = [...prev];
                const result: string[] = Array(5).fill('gray');
                const matched: boolean[] = Array(5).fill(false);

                for (let i = 0; i < 5; i++) {
                    if (finalWord[i].toLowerCase() == word[i].toLowerCase()) {
                        const indices: [number, number] | null = findKeyIndices(tempKeyboard, word[i]);
                        if (indices) tempKeyboard[indices[0]][indices[1]].color = 'green';
                        result[i] = 'green';
                        matched[i] = true;
                    }
                }

                for (let i = 0; i < 5; i++) {
                    if (result[i].toLowerCase() != 'green') {
                        for (let j = 0; j < 5; j++) {
                            if (!matched[j] && word[i].toLowerCase() == finalWord[j].toLowerCase()) {
                                const indices: [number, number] | null = findKeyIndices(tempKeyboard, word[i]);
                                if (indices) tempKeyboard[indices[0]][indices[1]].color = tempKeyboard[indices[0]][indices[1]].color.toLowerCase() != 'green' ? 'yellow' : 'green';
                                result[i] = 'yellow';
                                matched[j] = true;
                                break;
                            }
                        }
                    }
                }

                let greenCount = 0;
                for (let i = 0; i < result.length; i++) {
                    if (result[i].toLowerCase() == 'green') greenCount++;

                    if (result[i].toLowerCase() == 'gray') {
                        const indices: [number, number] | null = findKeyIndices(tempKeyboard, word[i]);
                        if (indices) tempKeyboard[indices[0]][indices[1]].color = 'gray';
                    }

                    boxes[guess * 5 - 5 + i].color = result[i];
                    boxes[guess * 5 - 5 + i].locked = true;
                }

                if (greenCount == 5) stopGame(true);
                else if (guess == 6) stopGame(false);

                return tempKeyboard;
            });

            setGuess((prev) => prev + 1);

            return boxes;
        },
        [guess, isRunning]
    );

    useEffect(() => {
        const formatTime = (elapsedTime: number) => {
            let milliseconds = Math.floor((elapsedTime % 1000) / 10);
            let seconds = Math.floor((elapsedTime % 60000) / 1000);
            let minutes = Math.floor((elapsedTime % 3600000) / 60000);
            let hours = Math.floor(elapsedTime / 3600000);
            return (
                (hours ? (hours > 9 ? hours : '0' + hours) : '00') +
                ':' +
                (minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00') +
                ':' +
                (seconds ? (seconds > 9 ? seconds : '0' + seconds) : '00') +
                '.' +
                (milliseconds > 9 ? milliseconds + '0' : '0' + milliseconds + '0')
            );
        };

        let intervalId: any = null;

        if (isRunning) {
            intervalId = setInterval(() => {
                elapsedTime += 10;
                setStopwatchTime(formatTime(elapsedTime));
            }, 10);
        } else {
            clearInterval(intervalId);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isRunning]);

    const stopGame = (won: boolean) => {
        if (won) {
            setInputs((prev: InputBox[]) => {
                let temp: InputBox[] = [...prev];
                temp.forEach((input) => (input.locked = true));
                return temp;
            });
            successToast('Good job!');
            setIsRunning(false);
        } else {
            setInputs((prev: InputBox[]) => {
                let temp: InputBox[] = [...prev];
                temp.forEach((input) => (input.locked = true));
                return temp;
            });
            failToast(`The word was ${finalWord.toUpperCase()}`);
            setIsRunning(false);
        }
    };

    const restartGame = () => {
        setInputs((prev: InputBox[]) => {
            let tempInputs: InputBox[] = prev;
            tempInputs.forEach((input) => {
                input.color = 'none';
                input.locked = false;
                input.text = '';
            });
            return tempInputs;
        });
        setKeyboard((prev) => {
            let tempKeyboard = prev;
            for (let r = 0; r < tempKeyboard.length; r++) for (let c = 0; c < tempKeyboard[r].length; c++) tempKeyboard[r][c].color = 'none';

            return tempKeyboard;
        });
        setGuess(1);
        setStopwatchTime('00:00:00.000');
        finalWord = words[Math.floor(Math.random() * 2500)].toUpperCase();
    };

    function findKeyIndices(keyboardData: Key[][], targetKey: string): [number, number] | null {
        for (let r = 0; r < keyboardData.length; r++)
            for (let c = 0; c < keyboardData[r].length; c++) if (keyboardData[r][c].key.toLowerCase() == targetKey.toLowerCase()) return [r, c];

        return null;
    }

    const failToast = (message: string) => {
        toast.error(message, {
            duration: 2000,
            position: 'top-center',
            className: `${fredokaBold.className} text-white text-lg`,
        });
    };

    const successToast = (message: string) => {
        toast.success(message, {
            duration: 2000,
            position: 'top-center',
            className: `${fredokaBold.className} text-white text-lg`,
        });
    };

    const keyboardElement = (key: Key) => {
        const color = key.color === 'green' ? 'bg-[#6aaa64]' : key.color === 'yellow' ? 'bg-[#c9b458]' : key.color === 'gray' ? 'bg-[#787c7e]' : 'bg-[#d3d6da]';
        const textColor = key.color === 'none' ? 'text-black' : 'text-white';
        const size = key.key.toLowerCase() === 'enter' || key.key.toLowerCase() === 'backspace' ? 'w-16 text-base max-mablet:text-sm' : 'w-12 text-2xl max-mablet:text-xl';
        const className = `${fredokaBold.className} ${color} ${textColor} ${size} grid place-items-center font-extrabold cursor-pointer rounded-lg select-none h-12`;

        return (
            <div className={className} onClick={() => handleKeyPress(key.key.toUpperCase())} key={key.key}>
                {key.key.toLowerCase() !== 'backspace' ? key.key.toUpperCase() : <Delete className='w-8 h-8' />}
            </div>
        );
    };

    const inputElement = useCallback((input: InputBox) => {
        const color =
            input.color === 'green'
                ? 'border-[#6aaa64] bg-[#6aaa64] text-white transition-colors duration-[75ms]'
                : input.color === 'yellow'
                ? 'border-[#c9b458] bg-[#c9b458] text-white transition-colors duration-[75ms]'
                : input.color === 'gray'
                ? 'border-[#787c7e] bg-[#787c7e] text-white transition-colors duration-[75ms]'
                : input.color === 'none'
                ? 'border-[#d3d6da] bg-white text-black'
                : input.color === 'selected'
                ? 'border-[#878a8c] bg-white text-black animate-pop'
                : 'border-[#d3d6da] bg-white text-black';
        const className = `${fredokaBold.className} w-16 h-16 max-mablet:w-14 max-mablet:h-14 rounded grid place-items-center border-2 select-none font-black text-4xl max-mablet:text-[2rem] ${color}`;

        return (
            <div key={input.id} className={className}>
                {input.text}
            </div>
        );
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => handleKeyPress(e);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyPress]);

    return (
        <div className='mt-3 flex flex-col justify-center items-center'>
            <div className='flex justify-between items-center mb-3 w-[344px] max-mablet:w-[304px]'>
                <X
                    className='text-[#ed3a3a] w-8 h-8 hover:scale-105 transition-all cursor-pointer'
                    onClick={() => {
                        if (isRunning) stopGame(false);
                    }}
                    strokeWidth={3}
                />
                <div className={`${nunitoLight.className} text-2xl cursor-pointer`} onClick={() => navigator.clipboard.writeText(stopwatchTime)}>
                    {stopwatchTime}
                </div>
                <RotateCcw
                    className={`${guess == 1 ? 'text-[#10b710] cursor-pointer' : 'text-[#e2e0dd] cursor-not-allowed'} w-8 h-8 hover:scale-105 transition-all cursor-pointer`}
                    onClick={() => {
                        if (guess == 1) {
                            setIsRunning(false);
                            setInputs((prev) => {
                                let tempInputs = [...prev];
                                tempInputs.forEach((input) => {
                                    input.text = '';
                                    input.color = 'none';
                                });
                                return tempInputs;
                            });
                            elapsedTime = 0;
                            setStopwatchTime('00:00:00.000');
                        }
                    }}
                    strokeWidth={3}
                />
            </div>
            <div className='grid grid-cols-5 grid-rows-6 gap-1.5 justify-center mb-5'>{inputs.map((input: InputBox) => inputElement(input))}</div>
            <div className='flex flex-col gap-1.5 justify-center items-center px-6 max-mablet:px-4 max-mobile:px-2 w-full'>
                {keyboard.map((row: Key[]) => (
                    <div className='flex flex-row justify-center w-full gap-1.5' key={row[0].key}>
                        {row.map((key: Key) => keyboardElement(key))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Game;
