import {useState, useEffect} from 'react';
function Viewport(){
    const [zoom, setZoom] = useState(1);
    const [pos, setPos] = useState({x: 0, y: 0})

    function handleWheel(e){

    }

    function handlePointerDown(e){

    }
    return (
        <div className='viewport'>
            <div className="canvas" style={{transform: `translate(${pos.x}px, ${pos.y})px scale(${zoom})`}}>
                
            </div>
        </div>
    )
}

export default Viewport