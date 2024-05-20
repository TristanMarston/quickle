import Navbar from '@/_components/Navbar';
import Game from '@/_components/Game';

const page = () => {
    return (
        <div className='min-h-full flex flex-col w-full'>
            <Navbar />
            <Game />
        </div>
    );
};

export default page;
