'use client';

import Navbar from '@/_components/Navbar';
import Game from '@/_components/Game';
import { Toaster } from 'react-hot-toast';
import { GameProvider } from './context';

const page = () => {
    return (
        <div className='min-h-full flex flex-col w-full'>
            <GameProvider>
                <Toaster />
                <Navbar />
                <Game />
            </GameProvider>
        </div>
    );
};

export default page;
