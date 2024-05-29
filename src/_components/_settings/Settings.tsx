import { Fredoka } from 'next/font/google';
import { useEffect } from 'react';
import { useGameContext } from '@/app/context';
import { X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import toast from 'react-hot-toast';

const fredokaBold = Fredoka({ weight: '700', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

type Option = {
    text: string;
    checked: boolean;
    onCheckedChange: React.Dispatch<React.SetStateAction<boolean>>;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const Settings = () => {
    const context = useGameContext();
    if (context === undefined) {
        throw new Error('useContext(GameContext) must be used within a GameContext.Provider');
    }

    const { settingsModalOpened, setSettingsModalOpened, darkMode, setDarkMode, hardMode, setHardMode, isRunning, isOver, gamePaused } = context;

    const hardModeOnClick = () => {
        if (isRunning && !isOver) {
            toast.error('Cannot change during a game.', {
                duration: 2000,
                position: 'top-center',
                className: `${fredokaBold.className} text-white text-lg`,
            });
        }
    };

    const displayArray: Option[] = [
        { text: 'Dark Mode: ', checked: darkMode, onCheckedChange: setDarkMode },
        { text: 'Hard Mode: ', checked: hardMode, onCheckedChange: setHardMode, onClick: hardModeOnClick },
    ];

    return (
        <div className='p-4'>
            <Switch className='absolute opacity-0' />
            <X className='absolute right-4 text-gray-400 w-4 h-4 hover:scale-105 transition-all cursor-pointer' onClick={() => setSettingsModalOpened(false)} />
            <h1 className={`${fredokaBold.className} text-4xl text-center mb-3`}>Settings</h1>
            <div className='flex flex-col gap-3'>
                {displayArray.map(({ text, checked, onCheckedChange, onClick }, index) => (
                    <div className='flex gap-4 items-center' key={text + index}>
                        <p className={`${fredokaLight.className} text-xl`}>{text}</p>
                        <Switch
                            checked={checked}
                            onCheckedChange={onCheckedChange}
                            className={`${
                                text == 'Hard Mode: ' && (!isOver || isRunning) && (isRunning || gamePaused)
                                    ? 'opacity-20 pointer-events-none cursor-not-allowed'
                                    : 'opacity-100 pointer-events-normal'
                            } outline-none select-none`}
                            onClick={onClick}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Settings;
