import React from 'react'

const PageNotFound = () => {
  return (
    <div className='container mx-auto'>
    <div className='block lg:flex lg:justify-center pt-10 '>
        <div>
<img src="https://anvogue.presslayouts.com/wp-content/uploads/2024/05/404-img.png" alt="404" className='h-[80%]'/>
        </div>
        <div className='px-5'>
            <div className='font-bold lg:text-9xl text-6xl'>404</div>
            <div className='lg:text-5xl text-2xl pt-5'>
            Something is Missing.
            </div>
            <p className='pt-3'>The page you are looking for cannot be found. take a break before trying again</p>
        </div>
    </div>
    </div>
  )
}

export default PageNotFound