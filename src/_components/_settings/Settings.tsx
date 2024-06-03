import { useGameContext, fredokaBold, fredokaLight } from '@/app/context'; // context, fonts from context.tsx
import { X } from 'lucide-react'; // X icon in top right of modal
import { Switch } from '@/components/ui/switch'; // premade switch component from shadcn/ui

// local type used to iterate through different switches
type Option = {
    text: string;
    checked: boolean;
    onCheckedChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const Settings = () => {
    const context = useGameContext();
    if (context === undefined) throw new Error('useContext(GameContext) must be used within a GameContext.Provider');

    const { setSettingsModalOpened, darkMode, setDarkMode, hardMode, setHardMode, isRunning, isOver, gamePaused } = context;

    // array to be iterated through using array.map(), creating a new switch element for each element in the array
    const displayArray: Option[] = [
        { text: 'Dark Mode: ', checked: darkMode, onCheckedChange: setDarkMode },
        { text: 'Hard Mode: ', checked: hardMode, onCheckedChange: setHardMode },
    ];

    /* 
        this functional component will return the modal for the settings, containing all of the
        different preferences by iterating through each option and its switch input
    */
    return (
        <div className='p-4'>
            <Switch className='absolute opacity-0' /> {/* doesn't have any real functionality, but stops the 'enter' key from altering the other switches */}
            {/* X icon in the top right of the modal, the premade one didn't work with code */}
            <X className='absolute right-4 text-gray-400 w-4 h-4 hover:scale-105 transition-all cursor-pointer' onClick={() => setSettingsModalOpened(false)} />
            <h1 className={`${fredokaBold.className} text-4xl text-center mb-3`}>Settings</h1>
            {/* iterating through each of the options */}
            <div className='flex flex-col gap-3'>
                {displayArray.map(({ text, checked, onCheckedChange }, index) => (
                    <div className='flex gap-4 items-center' key={text + index}>
                        <p className={`${fredokaLight.className} text-xl`}>{text}</p>
                        <Switch
                            checked={checked}
                            onCheckedChange={onCheckedChange}
                            // changes the switch to have no color (looks disabled) if the game is currently running
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
