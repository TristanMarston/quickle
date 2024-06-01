import { useGameContext, fredokaBold, fredokaLight } from '@/app/context';
import { X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

type Option = {
    text: string;
    checked: boolean;
    onCheckedChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const Settings = () => {
    const context = useGameContext();
    if (context === undefined) throw new Error('useContext(GameContext) must be used within a GameContext.Provider');

    const { setSettingsModalOpened, darkMode, setDarkMode, hardMode, setHardMode, isRunning, isOver, gamePaused } = context;

    const displayArray: Option[] = [
        { text: 'Dark Mode: ', checked: darkMode, onCheckedChange: setDarkMode },
        { text: 'Hard Mode: ', checked: hardMode, onCheckedChange: setHardMode },
    ];

    return (
        <div className='p-4'>
            <Switch className='absolute opacity-0' />
            <X className='absolute right-4 text-gray-400 w-4 h-4 hover:scale-105 transition-all cursor-pointer' onClick={() => setSettingsModalOpened(false)} />
            <h1 className={`${fredokaBold.className} text-4xl text-center mb-3`}>Settings</h1>
            <div className='flex flex-col gap-3'>
                {displayArray.map(({ text, checked, onCheckedChange }, index) => (
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
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Settings;
