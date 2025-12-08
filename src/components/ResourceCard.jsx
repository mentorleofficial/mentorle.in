import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Card = ({ image, title, dates, description, badge, link }) => {
  return (
    <div className="w-full bg-white shadow-md rounded-xl overflow-hidden eventCard p-5 flex flex-col justify-between ">
      <div>
        <img className="w-full h-[120px] md:h-[200px] object-contain rounded-[10px] mb-3" src={image} alt="Card" />
        <div className="eventcard">
          <h2 className='text-xl md:text-2xl font-bold mb-1'>{title}</h2>
          <p className='font-thin text-sm md:text-base mb-2 opacity-85'>{description}</p>
        </div>
      </div>
      <Link href={link}>
        <button className='bg-yellow-100 w-full rounded-[20px] p-2 text-lg md:text-xl border-2 border-black border-solid flex items-center justify-center'>
          Learn More 
          <img 
            src='https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/arrow.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9hcnJvdy5zdmciLCJpYXQiOjE3NDM2MTYwNDQsImV4cCI6MjA1ODk3NjA0NH0.LOkL_cdDKsNgG4yWteyrIUcQ85HHtf7qRyEKxz26qZA' 
            width={15} 
            height={15} 
            alt='arrow-right' 
            className='inline-block ml-2' 
          />
        </button>
      </Link>
    </div>
  );
};

export default Card;
