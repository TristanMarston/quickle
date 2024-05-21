'use client';

import { useEffect, useState, useCallback } from 'react';
import { keyboardData, words } from '../../public/pagedata';
import { Delete } from 'lucide-react';
import { Fredoka } from 'next/font/google';
import toast from 'react-hot-toast';

const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });
const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });

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

const finalWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
console.log(finalWord);

const Game = () => {
    const [inputs, setInputs] = useState<InputBox[]>(() => {
        const newInputs: InputBox[] = [];
        for (let i = 0; i < 30; i++) newInputs[i] = { id: i, text: '', locked: false, color: 'none' };
        return newInputs;
    });
    const [guess, setGuess] = useState(1);
    const [keyboard, setKeyboard] = useState<Key[][]>(keyboardData);

    const handleKeyPress = useCallback(
        (e: KeyboardEvent | string) => {
            let index = 0;
            let key: string = typeof e === 'object' ? e.key.toLowerCase() : typeof e === 'string' ? e.toLowerCase() : e;
            while (index < inputs.length && inputs[index].text !== '') index++;

            if (key.toLowerCase() === 'enter') {
                const newInputs: InputBox[] = handleReturn(inputs, index - 1);
                setInputs(newInputs);
                return;
            }

            if (key.match(/[a-zA-Z]/) && key.length === 1 && index < 5 * guess && index < inputs.length) {
                setInputs((prev) => {
                    let tempInputs: InputBox[] = [...prev];
                    tempInputs[index].text = key.toUpperCase();
                    tempInputs[index].color = 'selected';
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
            if ((index + 1) % 5 !== 0) {
                failToast('Needs to be 5 letters.');
                return boxes;
            } else if (guess > 6) return boxes;

            let word = '';
            for (let i = guess * 5 - 5; i < guess * 5; i++) word += boxes[i].text.toUpperCase();

            if (words.indexOf(word.toLowerCase()) == -1) {
                failToast('Unknown word.');
                return boxes;
            }

            for (let i = 0; i < 5; i++) {
                setKeyboard((prev: Key[][]) => {
                    let tempKeyboard: Key[][] = [...prev];
                    let indices: [number, number] | null = findKeyIndices(tempKeyboard, word[i]);

                    if (finalWord[i] === word[i]) {
                        boxes[guess * 5 - 5 + i].color = 'green';
                        if (indices) tempKeyboard[indices[0]][indices[1]].color = 'green';
                    } else if (finalWord.includes(word[i])) {
                        boxes[guess * 5 - 5 + i].color = boxes[guess * 5 - 5 + i].color !== 'green' ? 'yellow' : 'green';
                        if (indices) tempKeyboard[indices[0]][indices[1]].color = tempKeyboard[indices[0]][indices[1]].color != 'green' ? 'yellow' : 'green';
                    } else {
                        boxes[guess * 5 - 5 + i].color = 'gray';
                        if (indices)
                            tempKeyboard[indices[0]][indices[1]].color =
                                tempKeyboard[indices[0]][indices[1]].color != 'green' && tempKeyboard[indices[0]][indices[1]].color != 'yellow'
                                    ? 'gray'
                                    : tempKeyboard[indices[0]][indices[1]].color;
                    }

                    return tempKeyboard;
                });

                boxes[guess * 5 - 5 + i].locked = true;
            }

            setGuess((prev) => prev + 1);

            return boxes;
        },
        [guess]
    );

    function findKeyIndices(keyboardData: Key[][], targetKey: string): [number, number] | null {
        for (let rowIndex = 0; rowIndex < keyboardData.length; rowIndex++)
            for (let colIndex = 0; colIndex < keyboardData[rowIndex].length; colIndex++) if (keyboardData[rowIndex][colIndex].key === targetKey) return [rowIndex, colIndex];
        return null;
    }

    const failToast = (message: string) => {
        toast.error(message, {
            duration: 4000,
            position: 'top-center',
            className: `${fredokaBold.className} text-white text-lg`,
        });
    };

    const keyboardElement = (key: Key) => {
        const color = key.color === 'green' ? 'bg-[#6aaa64]' : key.color === 'yellow' ? 'bg-[#c9b458]' : key.color === 'gray' ? 'bg-[#787c7e]' : 'bg-[#d3d6da]';
        const textColor = key.color === 'none' ? 'text-black' : 'text-white';
        const size = key.key.toLowerCase() === 'enter' || key.key.toLowerCase() === 'backspace' ? 'w-16 text-base' : 'w-12 text-2xl';
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
        const className = `${fredokaBold.className} w-16 h-16 rounded grid place-items-center border-2 font-black text-4xl ${color}`;

        return (
            <div key={input.id} className={className}>
                {input.text}
            </div>
        );
    }, []);

    useEffect(() => {
        console.log('guess updated:', guess);
    }, [guess]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => handleKeyPress(e);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyPress]);

    return (
        <div className='mt-5 flex flex-col justify-center items-center'>
            <div className='grid grid-cols-5 grid-rows-6 gap-1.5 justify-center mb-5'>{inputs.map((input: InputBox) => inputElement(input))}</div>
            <div className='flex flex-col gap-1.5 justify-center items-center px-6 max-mobile:px-2 w-full'>
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
