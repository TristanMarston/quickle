import { useGameContext, fredokaBold } from '@/app/context'; // imports font and context from context.tsx
import { motion } from 'framer-motion'; // motion npm package used to do cool transition when it's clicked

const tabs = ['total', 'normal', 'hard', 'session']; // these are the tabs that are showed at the bottom

/* 
    this functional component is responsible for the sliding tabs at the bottom of the 
    statistics modal, and lets the user select which category of statistics they would like
    to view. 'total' displays the statistics from every game played, regardless of if it was
    normal or hard mode, 'normal' displays the statistics from all normal difficulty games
    played, and 'hard' displays the statistics from all the hard difficulty games. lastly, 
    'session' displays the statistics from all of the games played in that session (from when
    you open the website to when you close it, is kept track of using session id's)
*/
const ShownSliders = () => {
    const context = useGameContext();
    if (context === undefined) throw new Error('useContext(GameContext) must be used within a GameContext.Provider');
    const { shownStats, setShownStats } = context;

    return (
        <div className='flex items-center justify-between w-full flex-wrap rounded-full border-2 border-black dark:border-foreground'>
            {/* for each of the tabs in the tab array, it will create a new Chip functional component, passing in the text, whether it's selected, and the setter for the state */}
            {tabs.map((tab) => (
                <Chip text={tab} selected={shownStats === tab} setSelected={setShownStats} key={tab} />
            ))}
        </div>
    );
};

const Chip = ({ text, selected, setSelected }: { text: string; selected: boolean; setSelected: React.Dispatch<React.SetStateAction<string>> }) => {
    return (
        <button
            onClick={() => setSelected(text)} // sets the state that was passed into the functional component to whatever the current text of the Chip is
            className={`${selected ? 'text-white dark:text-background' : 'text-black hover:bg-gray-100 dark:text-foreground dark:hover:bg-gray-700'} ${
                fredokaBold.className
            } uppercase tracking-wider text-base transition-colors relative py-1.5 rounded-full w-1/4 max-mablet:text-sm`}
        >
            <span className='relative z-10'>{text}</span>
            {selected && (
                // this is the actual motion (animation) tab, which goes above the selected Chip and is the same size 
                <motion.span
                    layoutId='pill-tab'
                    transition={{ type: 'spring', duration: 0.5 }} // here are the actual animation properties, 0.5s works best for me
                    className='absolute inset-0 z-0 rounded-full bg-black w-full dark:bg-foreground'
                ></motion.span>
            )}
        </button>
    );
};

export default ShownSliders;
