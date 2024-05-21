import Navbar from '@/_components/Navbar';
import Game from '@/_components/Game';
import { Toaster } from 'react-hot-toast';

const page = () => {
    return (
        <div className='min-h-full flex flex-col w-full'>
            <Toaster />
            <Navbar />
            <Game />
        </div>
    );
};

export default page;
