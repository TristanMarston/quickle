'use client';

import { useEffect, useState } from 'react';
import { keyboardData, words } from '../../public/pagedata';
import { Delete } from 'lucide-react';
import { Fredoka } from 'next/font/google';

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

let finalWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
console.log(finalWord);

const Game = () => {
    const [inputs, setInputs] = useState<InputBox[]>(() => {
        const newInputs: InputBox[] = [];
        for (let i = 0; i < 30; i++) newInputs[i] = { id: i, text: '', locked: true, color: 'none' };
        return newInputs;
    });
    const [guess, setGuess] = useState(1);
    const [keyboard, setKeyboard] = useState<Key[][]>(keyboardData);

    const handleKeyPress = (e: KeyboardEvent | string) => {
        let index = 0;
        let key: string = typeof e == 'object' ? e.key.toLowerCase() : typeof e == 'string' ? e.toLowerCase() : e;
        while (true) {
            if (index >= inputs.length || inputs[index].text == '') break;
            index++;
        }
        console.log(key, index, guess);

        if (key.toLowerCase() == 'enter') {
            setInputs((prev: InputBox[]) => handleReturn(prev, index - 1));
            return;
        }

        if (key.match(/[a-zA-Z]/) && key.length === 1 && index < 5 * guess && index < inputs.length) {
            setInputs((prev) => {
                let tempInputs: InputBox[] = [...prev];
                tempInputs[index].text = key.toUpperCase();
                tempInputs[index].color = 'selected';

                return tempInputs;
            });
        } else if (key.toLowerCase() == 'backspace') {
            setInputs((prev) => {
                let tempInputs: InputBox[] = [...prev];
                tempInputs[index > 0 ? index - 1 : 0].text = '';
                tempInputs[index > 0 ? index - 1 : 0].color = 'none';

                return tempInputs;
            });
        }
    };

    const handleReturn = (boxes: InputBox[], index: number): InputBox[] => {
        if ((index + 1) % 5 != 0) return boxes;

        let word = '';
        for (let i = guess * 5 - 5; i < guess * 5; i++) word += boxes[i].text.toUpperCase();

        for (let i = 0; i < 5; i++) {
            if (finalWord[i] == word[i]) boxes[guess * 5 - 5 + i].color = 'green';
            else if (finalWord.indexOf(word[i]) != -1) boxes[guess * 5 - 5 + i].color = boxes[guess * 5 - 5 + i].color != 'green' ? 'yellow' : 'green';
            else boxes[guess * 5 - 5 + i].color = 'gray';
        }

        setGuess((prev) => prev + 1);

        return boxes;
    };

    const keyboardElement = (key: Key) => {
        const color = key.color == 'green' ? 'bg-[#6aaa64]' : key.color == 'yellow' ? 'bg-[#c9b458]' : key.color == 'gray' ? 'bg-[#787c7e]' : 'bg-[#d3d6da]';
        const textColor = key.color == 'none' ? 'text-black' : 'text-white';
        const size = key.key.toLowerCase() == 'enter' || key.key.toUpperCase() == 'backspace' ? 'w-16 text-base' : 'w-12 text-2xl';
        const className = `${fredokaBold.className} ${color} ${textColor} ${size} grid place-items-center font-extrabold cursor-pointer rounded-lg select-none h-12`;

        return (
            <div className={className} onClick={() => handleKeyPress(key.key.toUpperCase())} key={key.key}>
                {key.key.toLowerCase() != 'backspace' ? key.key.toUpperCase() : <Delete className='w-8 h-8' />}
            </div>
        );
    };

    const inputElement = (input: InputBox) => {
        const color =
            input.color == 'green'
                ? 'border-[#6aaa64] bg-[#6aaa64] text-white transition-colors duration-[75ms]'
                : input.color == 'yellow'
                ? 'border-[#c9b458] bg-[#c9b458] text-white transition-colors duration-[75ms]'
                : input.color == 'gray'
                ? 'border-[#787c7e] bg-[#787c7e] text-white transition-colors duration-[75ms]'
                : input.color == 'none'
                ? 'border-[#d3d6da] bg-white text-black'
                : input.color == 'selected'
                ? 'border-[#878a8c] bg-white text-black animate-pop'
                : 'border-[#d3d6da] bg-white text-black';
        const className = `${fredokaBold.className} w-16 h-16 rounded grid place-items-center border-2 font-black text-4xl ${color}`;

        return (
            <div key={input.id} className={className}>
                {input.text}
            </div>
        );
    };

    useEffect(() => console.log(guess), [guess]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

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
