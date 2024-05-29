import { useGameContext } from '@/app/context';
import { Delete } from 'lucide-react';
import { Fredoka } from 'next/font/google';

const fredokaBold = Fredoka({ weight: '700', subsets: ['latin'] });

type Props = {
    handleKeyPress: (e: KeyboardEvent | string) => void;
};

type Key = {
    key: string;
    color: string;
    class?: string;
};

const Keyboard = ({ handleKeyPress }: Props) => {
    const context = useGameContext();
    if (context === undefined) {
        throw new Error('useContext(GameContext) must be used within a GameContext.Provider');
    }
    const { keyboard, setKeyboard, gamePaused } = context;

    const keyboardElement = (key: Key) => {
        const color =
            key.color === 'green'
                ? 'bg-[#6aaa64]'
                : key.color === 'yellow'
                ? 'bg-[#c9b458]'
                : key.color === 'gray'
                ? 'bg-[#787c7e] dark:bg-gray-700 dark:text-foreground'
                : 'bg-[#d3d6da] dark:bg-gray-500 dark:text-foreground';
        const textColor = key.color === 'none' ? 'text-black' : 'text-white';
        const size = key.key.toLowerCase() === 'enter' || key.key.toLowerCase() === 'backspace' ? 'w-16 text-base max-mablet:text-sm' : 'w-12 text-2xl max-mablet:text-xl';
        const className = `${fredokaBold.className} ${color} ${textColor} ${size} grid place-items-center font-extrabold cursor-pointer rounded-lg select-none h-12`;

        return !gamePaused ? (
            <div className={className} onClick={() => handleKeyPress(key.key.toUpperCase())} key={key.key}>
                {key.key.toLowerCase() !== 'backspace' ? key.key.toUpperCase() : <Delete className='w-8 h-8' />}
            </div>
        ) : (
            <div
                className={`${fredokaBold.className} ${size} bg-[#d3d6da] dark:bg-gray-500 grid place-items-center font-extrabold cursor-pointer rounded-lg select-none h-12`}
                onClick={() => {
                    if (key.key.toLowerCase() == 'enter') handleKeyPress(key.key.toUpperCase());
                }}
            >
                {key.key.toLowerCase() !== 'backspace' ? key.key.toUpperCase() : <Delete className='w-8 h-8' />}
            </div>
        );
    };

    return (
        <div className={`flex flex-col gap-1.5 justify-center items-center px-6 max-mablet:px-4 max-mobile:px-2 w-full`}>
            {keyboard.map((row: Key[]) => (
                <div className='flex flex-row justify-center w-full gap-1.5' key={row[0].key}>
                    {row.map((key: Key) => keyboardElement(key))}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;
