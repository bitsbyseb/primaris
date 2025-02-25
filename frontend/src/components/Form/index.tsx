import { createPortal } from 'react-dom'

interface modalProps {
    children: React.ReactNode,
}

function modal({children}:modalProps) {
    return createPortal(<div className='w-2/3 max-h-[32rem] flex flex-col justify-center items-center fixed overflow-hidden top-[20%] left-[18%] bg-primary shadow-xl shadow-black rounded-xl py-4 space-y-2'>
        {children}
    </div>, document.querySelector("#modal") as HTMLDivElement);
}

export default modal;