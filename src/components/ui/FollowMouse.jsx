import {useEffect, useState} from 'react'
import '../../css/FollowMouse.css'

function FollowMouse({children, initialPos}){
    const [mousePos, setMousePos] = useState(initialPos)
    useEffect(() => {
            const handleMouseMove = (e) => {
                const pos = {x: e.clientX, y: e.clientY}
                setMousePos(pos)
            }
            
            // console.log(initialPos)
            // setMousePos(initialPos)

            document.addEventListener("mousemove", handleMouseMove)
    
            return () => {
                document.removeEventListener("mousemove", handleMouseMove)
            }
        }, [])

    return (
        <div className="follow-mouse-container" style={{left: mousePos.x, top: mousePos.y}}>
            {children}
        </div>
    )
}

export default FollowMouse