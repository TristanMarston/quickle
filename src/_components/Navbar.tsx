import { BarChart2 } from 'lucide-react';
import { SlidersHorizontal } from 'lucide-react';
import { Fredoka } from 'next/font/google';

const fredoka = Fredoka({ weight: '600', subsets: ['latin'] });

const Navbar = () => {
    return (
        <div className='w-full flex justify-center'>
            <div className='flex flex-col items-center justify-center w-96'>
                <div className='flex items-center justify-between py-1 w-full'>
                    <BarChart2 className='hover:cursor-pointer w-12 h-12' />
                    <h1 className={`${fredoka.className} text-[3rem]`}>quickle</h1>
                    <SlidersHorizontal className='hover:cursor-pointer w-10 h-10' />
                </div>
                <div className='w-full bg-gray-200 h-0.5 rounded-lg' />
            </div>
        </div>
    );
};

export default Navbar;
