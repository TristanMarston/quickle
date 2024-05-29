import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogTrigger } from '@/components/ui/dialog';
import { BarChart2, X } from 'lucide-react';
import { SlidersHorizontal } from 'lucide-react';
import { Fredoka } from 'next/font/google';
import Statistics from './_statistics/Statistics';
import { useGameContext } from '@/app/context';
import Settings from './_settings/Settings';
import { useEffect } from 'react';

const fredoka = Fredoka({ weight: '600', subsets: ['latin'] });

const Navbar = () => {
    const context = useGameContext();
    if (context === undefined) {
        throw new Error('useContext(GameContext) must be used within a GameContext.Provider');
    }

    const { modalOpened, setModalOpened, setGamePaused, settingsModalOpened, setSettingsModalOpened } = context;

    return (
        <div className='w-full flex justify-center'>
            <div className='flex flex-col items-center justify-center w-96 max-mablet:w-[22rem]'>
                <div className='flex items-center justify-between py-1 w-full'>
                    <Dialog open={modalOpened}>
                        <DialogTrigger className='outline-none'>
                            <BarChart2 className='hover:cursor-pointer w-12 h-12 max-mablet:w-10 max-mablet:h-10 max-mobile:w-9 max-mobile:h-9' onClick={() => setModalOpened(true)} />
                        </DialogTrigger>
                        <DialogOverlay onClick={() => setModalOpened(false)} className='opacity-0'>
                            <DialogContent
                                className='outline-none rounded-md w-[60%] max-tablet:w-[70%] max-tobile:w-[80%] max-mobile:w-[90%] p-0 z-[99999]'
                                onClick={(e) => e.stopPropagation()}
                                id='hidex'
                            >
                                <Statistics />
                            </DialogContent>
                        </DialogOverlay>
                    </Dialog>
                    <h1 className={`${fredoka.className} text-[3rem] max-mablet:text-[2.75rem] max-mobile:text-[2.3rem]`}>quickle</h1>
                    <Dialog open={settingsModalOpened}>
                        <DialogTrigger className='outline-none'>
                            <SlidersHorizontal
                                className='hover:cursor-pointer w-10 h-10 max-mablet:w-8 max-mablet:h-8 max-mobile:w-7 max-mobile:h-7'
                                onClick={() => setSettingsModalOpened(true)}
                            />
                        </DialogTrigger>
                        <DialogOverlay onClick={() => setSettingsModalOpened(false)} className='opacity-0'>
                            <DialogContent
                                className='outline-none rounded-md w-[60%] max-tablet:w-[70%] max-tobile:w-[80%] max-mobile:w-[90%] p-0 z-[99999]'
                                onClick={(e) => e.stopPropagation()}
                                id='hidex'
                            >
                                <Settings />
                            </DialogContent>
                        </DialogOverlay>
                    </Dialog>
                </div>
                <div className='w-full bg-gray-200 h-0.5 rounded-lg' />
            </div>
        </div>
    );
};

export default Navbar;
