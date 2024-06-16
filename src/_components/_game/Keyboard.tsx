import { useGameContext, fredokaBold, Key, generateID } from '@/app/context'; // Key type, context, and font imported from context.tsx
import { Delete } from 'lucide-react'; // delete icon

const Keyboard = ({ handleKeyPress }: { handleKeyPress: (e: KeyboardEvent | string) => void }) => {
    const context = useGameContext();
    if (context === undefined) throw new Error('useContext(GameContext) must be used within a GameContext.Provider');

    const { keyboard, gamePaused } = context; // state variables needed for keyboard

    /* 
        this is a functional component which is called in the return statement at the bottom of the file,
        returning a div element with the right className, onClick, key, etc. if the game is paused, then
        all keys will have no visible color, as you could cheat by pausing the timer but still figuring
        out what the word is using the hints.
    */
    const keyboardElement = (key: Key) => {
        // determines the color based on the key parameter and its color property (no animations)
        const color =
            key.color === 'green'
                ? 'bg-[#6aaa64]'
                : key.color === 'yellow'
                ? 'bg-[#c9b458]'
                : key.color === 'gray'
                ? 'bg-[#787c7e] dark:bg-gray-700 dark:text-foreground'
                : 'bg-[#d3d6da] dark:bg-gray-500 dark:text-foreground';
        const textColor = key.color === 'none' ? 'text-black' : 'text-white'; // if the key doesn't have a color, the text-color will be black, otherwise it will be white
        // the enter and backspace keys need more space, so the size is specified with this size variable
        const size = key.key.toLowerCase() === 'enter' || key.key.toLowerCase() === 'backspace' ? 'w-16 text-base max-mablet:text-sm' : 'w-12 text-2xl max-mablet:text-xl';
        const className = `${fredokaBold.className} ${color} ${textColor} ${size} grid place-items-center font-extrabold cursor-pointer rounded-lg select-none h-12`;

        return !gamePaused ? ( // if the game is running, then the key will be displayed as normal
            <div className={className} onClick={() => handleKeyPress(key.key.toUpperCase())} key={key.key}>
                {key.key.toLowerCase() !== 'backspace' ? key.key.toUpperCase() : <Delete className='w-8 h-8' />}
            </div>
        ) : (
            // if the game has been paused, then no color is displayed, rather everything is blank to prevent cheating
            <div
                className={`${fredokaBold.className} ${size} bg-[#d3d6da] dark:bg-gray-500 grid place-items-center font-extrabold cursor-pointer rounded-lg select-none h-12`}
                onClick={() => {
                    if (key.key.toLowerCase() == 'enter') handleKeyPress(key.key.toUpperCase());
                }}
                key={key.key}
            >
                {key.key.toLowerCase() !== 'backspace' ? key.key.toUpperCase() : <Delete className='w-8 h-8' />}
            </div>
        );
    };

    // this is what is returned from this functional component, and to display all of the keys, I use a nested array.map() to keep track of the rows and the keys in the rows
    return (
        <div className={`flex flex-col gap-1.5 justify-center items-center px-6 max-mablet:px-4 max-mobile:px-2 w-full`}>
            {keyboard.map((row: Key[]) => (
                <div className='flex flex-row justify-center w-full gap-1.5' key={row[0].key}>
                    {row.map((key: Key) => keyboardElement(key))} {/* uses functional component above by passing in the current key being iterated */}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;
