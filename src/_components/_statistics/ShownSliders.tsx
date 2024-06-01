import { useGameContext, fredokaBold } from '@/app/context';
import { motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';

const tabs = ['total', 'normal', 'hard', 'session'];

const ShownSliders = () => {
    const context = useGameContext();
    if (context === undefined) throw new Error('useContext(GameContext) must be used within a GameContext.Provider');
    const { shownStats, setShownStats } = context;

    return (
        <div className='flex items-center justify-between w-full flex-wrap rounded-full border-2 border-black dark:border-foreground'>
            {tabs.map((tab) => (
                <Chip text={tab} selected={shownStats === tab} setSelected={setShownStats} key={tab} />
            ))}
        </div>
    );
};

const Chip = ({ text, selected, setSelected }: { text: string; selected: boolean; setSelected: Dispatch<SetStateAction<string>> }) => {
    return (
        <button
            onClick={() => setSelected(text)}
            className={`${selected ? 'text-white dark:text-background' : 'text-black hover:bg-gray-100 dark:text-foreground dark:hover:bg-gray-700'} ${
                fredokaBold.className
            } uppercase tracking-wider text-base transition-colors relative py-1.5 rounded-full w-1/4 max-mablet:text-sm`}
        >
            <span className='relative z-10'>{text}</span>
            {selected && (
                <motion.span
                    layoutId='pill-tab'
                    transition={{ type: 'spring', duration: 0.5 }}
                    className='absolute inset-0 z-0 rounded-full bg-black w-full dark:bg-foreground'
                ></motion.span>
            )}
        </button>
    );
};

export default ShownSliders;
