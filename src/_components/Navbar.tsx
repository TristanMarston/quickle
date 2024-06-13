// importing all components & icons
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from '@/components/ui/dialog'; // premade component
import { BarChart2, SlidersHorizontal } from 'lucide-react';
import { Fredoka } from 'next/font/google';
import Statistics from './_statistics/Statistics'; // functional component
import { useGameContext, fredokaLight, fredokaBold } from '@/app/context'; // allows us to access global variables (state)
import Settings from './_settings/Settings'; // functional component
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const fredoka = Fredoka({ weight: '600', subsets: ['latin'] });

const Navbar = () => {
    // accessing global variables and their setters
    const context = useGameContext();
    if (context === undefined) throw new Error('useContext(GameContext) must be used within a GameContext.Provider');

    const {
        modalOpened,
        setModalOpened,
        settingsModalOpened,
        setSettingsModalOpened,
        alertDialogOpened,
        setAlertDialogOpened,
        setPrevGames,
        setGamesPlayed,
        setShownStats,
        setFormattedStats,
    } = context;

    /* 
        this functional component will return the navbar at the top of the screen, with a Statistics icon,
        title, and Settings icon. when the statistics icon is pressed, the Statistics.tsx functional component
        is called, and when the settings button is pressed, the Settings.tsx functional component is called
    */
    return (
        <>
            <div className='w-full flex justify-center'>
                <div className='flex flex-col items-center justify-center w-96 max-mablet:w-[22rem]'>
                    <div className='flex items-center justify-between py-1 w-full'>
                        {/* statistics icon and modal (pop-up) trigger */}
                        <Dialog open={modalOpened}>
                            <DialogTrigger className='outline-none'>
                                <BarChart2
                                    className='hover:cursor-pointer w-12 h-12 max-mablet:w-10 max-mablet:h-10 max-mobile:w-9 max-mobile:h-9'
                                    onClick={() => setModalOpened(true)}
                                />
                            </DialogTrigger>
                            <DialogOverlay onClick={() => setModalOpened(false)} className='opacity-0'>
                                <DialogContent
                                    className='outline-none rounded-md w-[60%] max-tablet:w-[70%] max-tobile:w-[80%] max-mobile:w-[90%] p-0 z-[99999]'
                                    onClick={(e) => e.stopPropagation()}
                                    id='hidex'
                                >
                                    <Statistics /> {/* functional component found at Statistics.tsx */}
                                </DialogContent>
                            </DialogOverlay>
                        </Dialog>
                        {/* title */}
                        <h1 className={`${fredoka.className} text-[3rem] max-mablet:text-[2.75rem] max-mobile:text-[2.3rem]`}>quickle</h1>
                        {/* settings icon and modal (pop-up) */}
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
                                    <Settings /> {/* functional component found at Settings.tsx */}
                                </DialogContent>
                            </DialogOverlay>
                        </Dialog>
                    </div>
                    <div className='w-full bg-gray-200 h-0.5 rounded-lg' />
                </div>
            </div>
            <AlertDialog open={alertDialogOpened} onOpenChange={setAlertDialogOpened}>
                <AlertDialogContent className={`${fredokaLight.className} rounded-md`}>
                    <div className='w-full flex flex-col gap-1'>
                        <h2 className={`${fredokaBold.className} text-3xl`}>Are you absolutely sure?</h2>
                        <p className={`${fredokaLight.className}`}>
                            This will <span className={fredoka.className}>permanently</span> remove your statistics from this browser&#39;s data. This action can not be undone.
                        </p>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel className={`${fredoka.className} tracking-wide`}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className={`${fredoka.className} tracking-wide`}
                            onClick={() => {
                                localStorage.setItem('gamesPlayed', '[]');
                                setFormattedStats({
                                    guessNumbers: [0, 0, 0, 0, 0, 0],
                                    currentStreak: 0,
                                    bestStreak: 0,
                                    timesPlayed: 0,
                                    timesWon: 0,
                                    timesLost: 0,
                                    averageTime: '00:00:00.000',
                                    fastestTime: '00:00:00.000',
                                    winPercentage: 0,
                                    statType: 'normal',
                                });
                                setGamesPlayed([]);
                                setPrevGames([]);
                                setShownStats('total');
                            }}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default Navbar;
