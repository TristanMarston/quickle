import { generateID, useGameContext } from '@/app/context';
import { Fredoka } from 'next/font/google';
import { motion } from 'framer-motion';

const fredokaSemibold = Fredoka({ weight: '600', subsets: ['latin'] });

const LengthSelection = () => {
    const context = useGameContext();
    if (context === undefined) throw new Error('useContext(GameContext) must be used within a GameContext.Provider');

    const { selectedLength, setSelectedLength } = context;
    const displayArray: {
        guess: number | null;
        selected: boolean;
    }[] = [
        { guess: null, selected: false },
        { guess: -1, selected: selectedLength === -1 },
        { guess: 3, selected: selectedLength === 3 },
        { guess: 4, selected: selectedLength === 4 },
        { guess: 5, selected: selectedLength === 5 },
        { guess: 6, selected: selectedLength === 6 },
        { guess: 7, selected: selectedLength === 7 },
    ];

    return (
        <div className='grid grid-cols-7 grid-rows-1 gap-1 w-full justify-items-center mt-4'>
            {displayArray.map(({ guess, selected }) => (
                <motion.div
                    className={`${fredokaSemibold.className} ${
                        guess === null || guess <= selectedLength ? 'border-black dark:border-white' : ' border-[#d3d6da] dark:border-[#898989]'
                    } ${
                        guess === -1 ? 'text-xl max-[700px]:text-lg' : 'text-3xl max-[700px]:text-2xl max-[500px]:text-xl'
                    } grid w-[3.25rem] h-[3.25rem] max-[700px]:w-12 max-[700px]:h-12 max-[500px]:h-10 max-[500px]:w-10 max-[350px]:w-9 max-[350px]:h-9  bg-white dark:bg-background place-items-center border-2 rounded cursor-pointer transition-colors`}
                    onClick={() => guess !== null && setSelectedLength(guess)}
                    variants={{
                        initial: {
                            scale: 0.5,
                            y: 50,
                            opacity: 0,
                        },
                        animate: {
                            scale: 1,
                            y: 0,
                            opacity: 1,
                        },
                    }}
                    transition={{
                        type: 'spring',
                        mass: 3,
                        stiffness: 400,
                        damping: 50,
                    }}
                    whileHover={{
                        rotate: '2.5deg',
                        scale: 1.05,
                    }}
                    key={generateID(5)}
                >
                    {selected ? (guess !== -1 ? guess : 'ALL') : ''}
                </motion.div>
            ))}
        </div>
    );
};

export default LengthSelection;
