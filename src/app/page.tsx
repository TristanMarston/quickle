'use client';

// importing functional components & toaster & GameProvider
import Navbar from '@/_components/Navbar';
import QuickleGame from '@/_components/_game/Game';
import { Toaster } from 'react-hot-toast';
import { GameProvider } from './context';

const page = () => {
    return (
        <div className='min-h-full flex flex-col w-full'>
            <GameProvider> {/* imported from /src/app/context.tsx, provides all "global variables", or state, 
                            to all the functional components below and their children  */}
                <Toaster /> {/* toaster is an installed npm package, displays little info at the top of the screen ("you win!" or "you lose!") */}
                <Navbar /> {/* imported from /src/_components/Navbar.tsx, displays the statistics icon, "quickle" title, and settings icon */}
                <QuickleGame /> {/*imported from /src/_components/_game/Game.tsx, accounts for all the game logic */}
            </GameProvider>
        </div>
    );
};

export default page;
